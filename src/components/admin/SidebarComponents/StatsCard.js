import React from 'react';
import { FaUser, FaDollarSign, FaShoppingCart, FaBox } from 'react-icons/fa';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StatsCard = ({ title, value, icon, trend, trendUp }) => {
  const getIcon = () => {
    switch (icon) {
      case 'user':
        return <FaUser className="stats-icon" />;
      case 'dollar':
        return <FaDollarSign className="stats-icon" />;
      case 'cart':
        return <FaShoppingCart className="stats-icon" />;
      case 'box':
        return <FaBox className="stats-icon" />;
      default:
        return null;
    }
  };

  return (
    <div className="stats-card">
      <div className="stats-header">
        <div className="stats-icon-wrapper">
          {getIcon()}
        </div>
        <div className="trend">
          {trendUp ? (
            <FaArrowUp className="trend-icon up" />
          ) : (
            <FaArrowDown className="trend-icon down" />
          )}
          <span className={trendUp ? 'up' : 'down'}>{trend}</span>
        </div>
      </div>
      <div className="stats-content">
        <div className="title">{title}</div>
        <div className="value">{value}</div>
      </div>
    </div>
  );
};

export default StatsCard;
