import React from 'react';

const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="stats-card container">
      <div className="icon">
        <i className={`fas fa-${icon}`} />
      </div>
      <div className="info">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
