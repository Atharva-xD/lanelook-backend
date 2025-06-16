import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProductsChart = ({ dateRange }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChartData();
  }, [dateRange]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/orders');
      const orders = response.data;

      // Get date range
      const now = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setMonth(now.getMonth() - 1);
      }

      // Filter orders within date range
      const filteredOrders = orders.filter(order => 
        new Date(order.createdAt) >= startDate && 
        new Date(order.createdAt) <= now
      );

      // Group orders by date
      const groupedData = filteredOrders.reduce((acc, order) => {
        const date = new Date(order.createdAt).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = {
            date,
            sales: 0,
            orders: 0
          };
        }
        acc[date].sales += order.totalPrice;
        acc[date].orders += 1;
        return acc;
      }, {});

      // Convert to array and sort by date
      const chartData = Object.values(groupedData)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setChartData(chartData);
    } catch (err) {
      setError('Error fetching chart data');
      console.error('Chart data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="chart-loading">Loading chart data...</div>;
  }

  if (error) {
    return <div className="chart-error">{error}</div>;
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return dateRange === 'year' ? 
                date.toLocaleDateString('default', { month: 'short' }) :
                date.toLocaleDateString('default', { day: 'numeric', month: 'short' });
            }}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value, name) => [
              name === 'sales' ? `$${value.toFixed(2)}` : value,
              name === 'sales' ? 'Sales' : 'Orders'
            ]}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="sales" 
            stroke="#00b894" 
            name="Sales"
            strokeWidth={2}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="orders" 
            stroke="#0984e3" 
            name="Orders"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductsChart;
