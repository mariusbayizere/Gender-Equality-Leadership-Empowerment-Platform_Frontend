import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { 
  BarChart3, TrendingUp, TrendingDown, Users, UserPlus, Calendar, Filter, Download, RefreshCw
} from 'lucide-react';

const UserGrowthAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('monthly');
  const [chartType, setChartType] = useState('line');
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });

  const fetchUserGrowth = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        period,
        ...(dateFilter.startDate && { startDate: dateFilter.startDate }),
        ...(dateFilter.endDate && { endDate: dateFilter.endDate }),
        includeInactiveDetails: 'false'
      });

      const response = await fetch(`http://localhost:3000/api/user-growth?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user growth data');
      }
      
      const result = await response.json();
      
      // Transform data for Recharts
      const chartData = result.labels.map((label, index) => ({
        period: label,
        newUsers: result.data[index] || 0,
        totalUsers: result.cumulativeData[index] || 0,
        growthRate: result.growthRates[index] || 0
      }));
      
      setData({
        ...result,
        chartData
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching user growth:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserGrowth();
  }, [period, dateFilter.startDate, dateFilter.endDate]);

  const handleRefresh = () => {
    fetchUserGrowth();
  };

  const handleDateFilterChange = (field, value) => {
    setDateFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearDateFilter = () => {
    setDateFilter({ startDate: '', endDate: '' });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatGrowthRate = (rate) => {
    return `${rate >= 0 ? '+' : ''}${rate}%`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> {formatNumber(entry.value)}
              {entry.dataKey === 'growthRate' && '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (!data?.chartData || data.chartData.length === 0) {
      return (
        <div className="h-80 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <BarChart3 size={48} className="mx-auto mb-2 text-gray-400" />
            <p>No data available for the selected period</p>
          </div>
        </div>
      );
    }

    const chartProps = {
      data: data.chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="totalUsers" 
                stroke="#3b82f6" 
                fill="url(#colorTotal)" 
                strokeWidth={2}
                name="Total Users"
              />
              <Area 
                type="monotone" 
                dataKey="newUsers" 
                stroke="#10b981" 
                fill="url(#colorNew)" 
                strokeWidth={2}
                name="New Users"
              />
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="newUsers" fill="#10b981" name="New Users" radius={[2, 2, 0, 0]} />
              <Bar dataKey="growthRate" fill="#f59e0b" name="Growth Rate (%)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      default: // line
        return (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="totalUsers" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3b82f6' }}
                name="Total Users"
              />
              <Line 
                type="monotone" 
                dataKey="newUsers" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#10b981' }}
                name="New Users"
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  if (loading) {
    return (
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">User Growth Analytics</h3>
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">User Growth Analytics</h3>
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 font-medium mb-2">Failed to load analytics</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">User Growth Analytics</h3>
          <p className="text-sm text-gray-600">Track user acquisition and growth patterns over time</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw size={16} />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors" title="Download report">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      {data?.metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Active Users</p>
                <p className="text-2xl font-bold text-blue-800">{formatNumber(data.metrics.totalActiveUsers)}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Avg New Users</p>
                <p className="text-2xl font-bold text-green-800">{formatNumber(data.metrics.averageNewActiveUsersPerPeriod)}</p>
                <p className="text-xs text-green-600">per {period.slice(0, -2)}</p>
              </div>
              <UserPlus className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Activation Rate</p>
                <p className="text-2xl font-bold text-purple-800">{data.metrics.activationRate}%</p>
                <p className="text-xs text-purple-600">of registrations</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Data Points</p>
                <p className="text-2xl font-bold text-orange-800">{data.metrics.periodsWithData}</p>
                <p className="text-xs text-orange-600">{period} periods</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Period:</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Chart:</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="line">Line Chart</option>
              <option value="area">Area Chart</option>
              <option value="bar">Bar Chart</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-500" />
          <input
            type="date"
            value={dateFilter.startDate}
            onChange={(e) => handleDateFilterChange('startDate', e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Start date"
          />
          <span className="text-sm text-gray-500">to</span>
          <input
            type="date"
            value={dateFilter.endDate}
            onChange={(e) => handleDateFilterChange('endDate', e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="End date"
          />
          {(dateFilter.startDate || dateFilter.endDate) && (
            <button
              onClick={clearDateFilter}
              className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-50 p-4 rounded-lg">
        {renderChart()}
      </div>

      {/* Summary Stats */}
      {data?.metrics?.conversionFunnel && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Conversion Funnel</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-gray-800">{formatNumber(data.metrics.conversionFunnel.registered)}</p>
              <p className="text-xs text-gray-600">Total Registered</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-600">{formatNumber(data.metrics.conversionFunnel.activated)}</p>
              <p className="text-xs text-gray-600">Became Active</p>
            </div>
            <div>
              <p className="text-lg font-bold text-orange-600">{formatNumber(data.metrics.conversionFunnel.neverLoggedIn)}</p>
              <p className="text-xs text-gray-600">Never Logged In</p>
            </div>
            <div>
              <p className="text-lg font-bold text-blue-600">{data.metrics.conversionFunnel.activationRate}</p>
              <p className="text-xs text-gray-600">Activation Rate</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserGrowthAnalytics;


// import React, { useState, useEffect } from 'react';
// import { 
//   LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
// } from 'recharts';
// import { 
//   BarChart3, TrendingUp, TrendingDown, Users, UserPlus, Calendar, Filter, Download, RefreshCw
// } from 'lucide-react';

// const UserGrowthAnalytics = () => {
//   const [data, setData] = useState(null);
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [period, setPeriod] = useState('30'); // Days for chart
//   const [chartType, setChartType] = useState('line');
//   const [stats, setStats] = useState(null);

//   const fetchUserGrowthStats = async () => {
//     try {
//       const URL = 'http://localhost:3000'
//       const response = await fetch(`${URL}/admin/users/growth/stats`);
//       if (!response.ok) throw new Error('Failed to fetch growth stats');
//       const result = await response.json();
//       setStats(result);
//     } catch (err) {
//       console.error('Error fetching stats:', err);
//     }
//   };

//   const fetchChartData = async () => {
//     try {
//       const URL = 'http://localhost:3000'
//       const response = await fetch(`${URL}/admin/users/growth/chart?days=${period}`);
//       if (!response.ok) throw new Error('Failed to fetch chart data');
//       const result = await response.json();
      
//       // Transform data for recharts
//       const transformedData = result.chartData.map(item => ({
//         period: item.date,
//         newUsers: item.newUsers,
//         totalUsers: item.cumulativeUsers,
//         growthRate: item.newUsers > 0 ? ((item.newUsers / (item.cumulativeUsers - item.newUsers || 1)) * 100).toFixed(1) : 0
//       }));
      
//       setChartData(transformedData);
//       setData(result);
//     } catch (err) {
//       console.error('Error fetching chart data:', err);
//     }
//   };

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       await Promise.all([fetchUserGrowthStats(), fetchChartData()]);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching user growth:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, [period]);

//   const handleRefresh = () => {
//     fetchAllData();
//   };

//   const formatNumber = (num) => {
//     if (num >= 1000000) {
//       return (num / 1000000).toFixed(1) + 'M';
//     } else if (num >= 1000) {
//       return (num / 1000).toFixed(1) + 'K';
//     }
//     return num?.toString() || '0';
//   };

//   const formatGrowthRate = (rate) => {
//     return `${rate >= 0 ? '+' : ''}${rate}%`;
//   };

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
//           <p className="font-medium text-gray-800 mb-2">{new Date(label).toLocaleDateString()}</p>
//           {payload.map((entry, index) => (
//             <p key={index} className="text-sm" style={{ color: entry.color }}>
//               <span className="font-medium">{entry.name}:</span> {formatNumber(entry.value)}
//               {entry.dataKey === 'growthRate' && '%'}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   const renderChart = () => {
//     if (!chartData || chartData.length === 0) {
//       return (
//         <div className="h-80 flex items-center justify-center text-gray-500">
//           <div className="text-center">
//             <BarChart3 size={48} className="mx-auto mb-2 text-gray-400" />
//             <p>No data available for the selected period</p>
//           </div>
//         </div>
//       );
//     }

//     const chartProps = {
//       data: chartData,
//       margin: { top: 20, right: 30, left: 20, bottom: 5 }
//     };

//     switch (chartType) {
//       case 'area':
//         return (
//           <ResponsiveContainer width="100%" height={320}>
//             <AreaChart {...chartProps}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//               <XAxis 
//                 dataKey="period" 
//                 stroke="#6b7280" 
//                 fontSize={12}
//                 tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//               />
//               <YAxis stroke="#6b7280" fontSize={12} tickFormatter={formatNumber} />
//               <Tooltip content={<CustomTooltip />} />
//               <Legend />
//               <Area 
//                 type="monotone" 
//                 dataKey="totalUsers" 
//                 stroke="#3b82f6" 
//                 fill="url(#colorTotal)" 
//                 strokeWidth={2}
//                 name="Total Users"
//               />
//               <Area 
//                 type="monotone" 
//                 dataKey="newUsers" 
//                 stroke="#10b981" 
//                 fill="url(#colorNew)" 
//                 strokeWidth={2}
//                 name="New Users"
//               />
//               <defs>
//                 <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
//                   <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
//                 </linearGradient>
//                 <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
//                   <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
//                 </linearGradient>
//               </defs>
//             </AreaChart>
//           </ResponsiveContainer>
//         );
      
//       case 'bar':
//         return (
//           <ResponsiveContainer width="100%" height={320}>
//             <BarChart {...chartProps}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//               <XAxis 
//                 dataKey="period" 
//                 stroke="#6b7280" 
//                 fontSize={12}
//                 tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//               />
//               <YAxis stroke="#6b7280" fontSize={12} tickFormatter={formatNumber} />
//               <Tooltip content={<CustomTooltip />} />
//               <Legend />
//               <Bar dataKey="newUsers" fill="#10b981" name="New Users" radius={[2, 2, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         );
      
//       default: // line
//         return (
//           <ResponsiveContainer width="100%" height={320}>
//             <LineChart {...chartProps}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//               <XAxis 
//                 dataKey="period" 
//                 stroke="#6b7280" 
//                 fontSize={12}
//                 tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//               />
//               <YAxis stroke="#6b7280" fontSize={12} tickFormatter={formatNumber} />
//               <Tooltip content={<CustomTooltip />} />
//               <Legend />
//               <Line 
//                 type="monotone" 
//                 dataKey="totalUsers" 
//                 stroke="#3b82f6" 
//                 strokeWidth={3}
//                 dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
//                 activeDot={{ r: 6, fill: '#3b82f6' }}
//                 name="Total Users"
//               />
//               <Line 
//                 type="monotone" 
//                 dataKey="newUsers" 
//                 stroke="#10b981" 
//                 strokeWidth={3}
//                 dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
//                 activeDot={{ r: 6, fill: '#10b981' }}
//                 name="New Users"
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         );
//     }
//   };

//   if (loading) {
//     return (
//       <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">User Growth Analytics</h3>
//         <div className="h-80 flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading analytics...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">User Growth Analytics</h3>
//         <div className="h-80 flex items-center justify-center">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <TrendingDown className="w-8 h-8 text-red-600" />
//             </div>
//             <p className="text-red-600 font-medium mb-2">Failed to load analytics</p>
//             <p className="text-sm text-gray-500 mb-4">{error}</p>
//             <button
//               onClick={handleRefresh}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-800">User Growth Analytics</h3>
//           <p className="text-sm text-gray-600">Track user registration and growth patterns over time</p>
//         </div>
//         <div className="flex items-center space-x-2 mt-4 sm:mt-0">
//           <button
//             onClick={handleRefresh}
//             className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
//             title="Refresh data"
//           >
//             <RefreshCw size={16} />
//           </button>
//           <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors" title="Download report">
//             <Download size={16} />
//           </button>
//         </div>
//       </div>

//       {/* Key Metrics Cards */}
//       {stats?.overview && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-blue-600 font-medium">Total Users</p>
//                 <p className="text-2xl font-bold text-blue-800">{formatNumber(stats.overview.totalUsers)}</p>
//               </div>
//               <Users className="w-8 h-8 text-blue-600" />
//             </div>
//           </div>
          
//           <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-green-600 font-medium">New Today</p>
//                 <p className="text-2xl font-bold text-green-800">{formatNumber(stats.overview.newUsersToday)}</p>
//                 <p className="text-xs text-green-600">registrations</p>
//               </div>
//               <UserPlus className="w-8 h-8 text-green-600" />
//             </div>
//           </div>
          
//           <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-purple-600 font-medium">Daily Growth</p>
//                 <p className="text-2xl font-bold text-purple-800">{stats.overview.dailyGrowthRate}</p>
//                 <p className="text-xs text-purple-600">vs yesterday</p>
//               </div>
//               {stats.overview.dailyGrowthRate.includes('+') ? 
//                 <TrendingUp className="w-8 h-8 text-purple-600" /> : 
//                 <TrendingDown className="w-8 h-8 text-purple-600" />
//               }
//             </div>
//           </div>
          
//           <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-orange-600 font-medium">Monthly Growth</p>
//                 <p className="text-2xl font-bold text-orange-800">{stats.overview.monthlyGrowthRate}</p>
//                 <p className="text-xs text-orange-600">vs last month</p>
//               </div>
//               <Calendar className="w-8 h-8 text-orange-600" />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Period Stats */}
//       {stats?.periods && (
//         <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
//           <div className="bg-gray-50 p-3 rounded-lg text-center">
//             <p className="text-sm text-gray-600">Today</p>
//             <p className="text-lg font-bold text-gray-800">{stats.periods.today.newUsers}</p>
//           </div>
//           <div className="bg-gray-50 p-3 rounded-lg text-center">
//             <p className="text-sm text-gray-600">Yesterday</p>
//             <p className="text-lg font-bold text-gray-800">{stats.periods.yesterday.newUsers}</p>
//           </div>
//           <div className="bg-gray-50 p-3 rounded-lg text-center">
//             <p className="text-sm text-gray-600">This Week</p>
//             <p className="text-lg font-bold text-gray-800">{stats.periods.thisWeek.newUsers}</p>
//           </div>
//           <div className="bg-gray-50 p-3 rounded-lg text-center">
//             <p className="text-sm text-gray-600">This Month</p>
//             <p className="text-lg font-bold text-gray-800">{stats.periods.thisMonth.newUsers}</p>
//           </div>
//           <div className="bg-gray-50 p-3 rounded-lg text-center">
//             <p className="text-sm text-gray-600">Last Month</p>
//             <p className="text-lg font-bold text-gray-800">{stats.periods.lastMonth.newUsers}</p>
//           </div>
//         </div>
//       )}

//       {/* Controls */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
//         <div className="flex items-center space-x-4">
//           <div className="flex items-center space-x-2">
//             <label className="text-sm font-medium text-gray-700">Period:</label>
//             <select
//               value={period}
//               onChange={(e) => setPeriod(e.target.value)}
//               className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="7">Last 7 days</option>
//               <option value="14">Last 14 days</option>
//               <option value="30">Last 30 days</option>
//               <option value="60">Last 60 days</option>
//               <option value="90">Last 90 days</option>
//             </select>
//           </div>
          
//           <div className="flex items-center space-x-2">
//             <label className="text-sm font-medium text-gray-700">Chart:</label>
//             <select
//               value={chartType}
//               onChange={(e) => setChartType(e.target.value)}
//               className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="line">Line Chart</option>
//               <option value="area">Area Chart</option>
//               <option value="bar">Bar Chart</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Chart */}
//       <div className="bg-gray-50 p-4 rounded-lg">
//         {renderChart()}
//       </div>

//       {/* Growth Metrics Summary */}
//       {stats?.metrics && (
//         <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//           <h4 className="text-sm font-semibold text-gray-800 mb-3">Growth Insights</h4>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
//             <div>
//               <p className="text-lg font-bold text-gray-800">{stats.metrics.averageDailySignups}</p>
//               <p className="text-xs text-gray-600">Avg Daily Signups</p>
//             </div>
//             <div>
//               <p className="text-lg font-bold text-green-600">{stats.metrics.averageMonthlySignups}</p>
//               <p className="text-xs text-gray-600">Avg Monthly Signups</p>
//             </div>
//             <div>
//               <p className={`text-lg font-bold ${
//                 stats.metrics.growthTrend === 'growing' ? 'text-green-600' : 
//                 stats.metrics.growthTrend === 'declining' ? 'text-red-600' : 'text-gray-600'
//               }`}>
//                 {stats.metrics.growthTrend}
//               </p>
//               <p className="text-xs text-gray-600">Growth Trend</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Chart Summary */}
//       {data?.summary && (
//         <div className="mt-4 p-4 bg-blue-50 rounded-lg">
//           <h4 className="text-sm font-semibold text-blue-800 mb-2">Chart Period Summary</h4>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
//             <div>
//               <p className="text-lg font-bold text-blue-800">{formatNumber(data.summary.totalNewUsers)}</p>
//               <p className="text-xs text-blue-600">Total New Users</p>
//             </div>
//             <div>
//               <p className="text-lg font-bold text-blue-800">{data.summary.averagePerDay}</p>
//               <p className="text-xs text-blue-600">Average Per Day</p>
//             </div>
//             <div>
//               <p className="text-lg font-bold text-blue-800">{data.summary.peakDay?.newUsers || 0}</p>
//               <p className="text-xs text-blue-600">Peak Day Signups</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserGrowthAnalytics;