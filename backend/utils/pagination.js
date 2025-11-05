const mongoose = require('mongoose');

function parsePaginationParams(query) {
  const mode = (query.mode || 'page').toLowerCase();
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const after = query.after || null;
  const before = query.before || null;
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = (query.sortOrder || 'desc').toLowerCase() === 'asc' ? 1 : -1;

  return { mode, limit, page, after, before, sortBy, sortOrder };
}

function buildCursorFilter({ after, before, sortBy, sortOrder }) {
  const filter = {};
  if (after) {
    const afterValue = mongoose.isValidObjectId(after) ? new mongoose.Types.ObjectId(after) : after;
    filter.$or = [
      { [sortBy]: { [sortOrder === 1 ? '$gt' : '$lt']: afterValue } },
      { [sortBy]: { $eq: afterValue } },
    ];
  }
  if (before) {
    const beforeValue = mongoose.isValidObjectId(before) ? new mongoose.Types.ObjectId(before) : before;
    filter.$or = [
      { [sortBy]: { [sortOrder === 1 ? '$lt' : '$gt']: beforeValue } },
      { [sortBy]: { $eq: beforeValue } },
    ];
  }
  return filter;
}

function buildSort(sortBy, sortOrder) {
  // Always add _id as tiebreaker for stable sort
  const sort = {};
  sort[sortBy] = sortOrder;
  sort._id = sortOrder;
  return sort;
}

async function paginateHybrid({
  model,
  baseFilter = {},
  select = null,
  populate = null,
  query,
}) {
  const { mode, limit, page, after, before, sortBy, sortOrder } = parsePaginationParams(query);

  if (mode === 'cursor') {
    const cursorFilter = { ...baseFilter, ...buildCursorFilter({ after, before, sortBy, sortOrder }) };
    const sort = buildSort(sortBy, sortOrder);
    const itemsQuery = model.find(cursorFilter).sort(sort).limit(limit + 1);
    if (select) itemsQuery.select(select);
    if (populate) itemsQuery.populate(populate);
    const docs = await itemsQuery.exec();

    const hasMore = docs.length > limit;
    const items = hasMore ? docs.slice(0, limit) : docs;
    const first = items[0];
    const last = items[items.length - 1];

    const nextCursor = hasMore && last ? String(last[sortBy] || last._id) : null;
    const prevCursor = first ? String(first[sortBy] || first._id) : null;

    return {
      mode: 'cursor',
      items,
      pageInfo: {
        limit,
        hasNextPage: hasMore,
        hasPrevPage: Boolean(after || before),
        nextCursor,
        prevCursor,
        sortBy,
        sortOrder: sortOrder === 1 ? 'asc' : 'desc',
      },
    };
  }

  // Default to traditional page/limit mode
  const total = await model.countDocuments(baseFilter);
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const safePage = Math.min(page, totalPages);
  const skip = (safePage - 1) * limit;
  const sort = buildSort(sortBy, sortOrder);

  const itemsQuery = model.find(baseFilter).sort(sort).skip(skip).limit(limit);
  if (select) itemsQuery.select(select);
  if (populate) itemsQuery.populate(populate);
  const items = await itemsQuery.exec();

  return {
    mode: 'page',
    items,
    pageInfo: {
      page: safePage,
      limit,
      total,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPrevPage: safePage > 1,
      sortBy,
      sortOrder: sortOrder === 1 ? 'asc' : 'desc',
    },
  };
}

module.exports = {
  paginateHybrid,
  parsePaginationParams,
};


