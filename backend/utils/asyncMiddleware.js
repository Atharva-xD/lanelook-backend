// backend/utils/asyncMiddleware.js
const asyncMiddleware = (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next))
        .catch((error) => next(error));
    };
  };
  
  module.exports = asyncMiddleware;