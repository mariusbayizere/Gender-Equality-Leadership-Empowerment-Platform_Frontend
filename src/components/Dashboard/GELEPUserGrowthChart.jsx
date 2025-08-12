import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const GELEPUserGrowthChart = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Hard-coded data for Gender Equality Leadership Platform progression
    const userGrowthData = [
        { period: 'Platform Launch', womenLeaders: 40, menAllies: 45, totalEngagement: 25 },
        { period: 'Awareness Building', womenLeaders: 45, menAllies: 50, totalEngagement: 60 },
        { period: 'Skill Development', womenLeaders: 85, menAllies: 40, totalEngagement: 75 },
        { period: 'Leadership Training', womenLeaders: 95, menAllies: 90, totalEngagement: 95 },
        { period: 'Mentorship Phase', womenLeaders: 65, menAllies: 80, totalEngagement: 50 },
        { period: 'Impact Scaling', womenLeaders: 75, menAllies: 55, totalEngagement: 70 }
    ];

    // Gender equality metrics for pie chart
    const genderMetrics = [
        { name: 'Women Leaders', value: 74, color: '#10b981' },
        { name: 'Men Allies', value: 86, color: '#3b82f6' },
        { name: 'Engagement Rate', value: 80, color: '#8b5cf6' }
    ];

    if (!isClient) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                {/* Loading placeholder for main chart */}
                <div className="col-span-1 lg:col-span-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 sm:p-6">
                    <div className="mb-3 sm:mb-4">
                        <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1">
                            Gender Equality User Growth Trends
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            GELEP user engagement progression across empowerment phases
                        </p>
                    </div>
                    <div className="h-64 sm:h-80 bg-slate-100 dark:bg-slate-700 animate-pulse rounded"></div>
                </div>
                
                {/* Loading placeholder for pie chart */}
                <div className="col-span-1 lg:col-span-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 sm:p-6">
                    <div className="mb-3 sm:mb-4">
                        <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50">
                            Gender Equality Metrics
                        </h2>
                    </div>
                    <div className="h-64 sm:h-80 bg-slate-100 dark:bg-slate-700 animate-pulse rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 mt-3">
            {/* Main Growth Chart - Left Side */}
            <div className="col-span-1 lg:col-span-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 sm:p-6">
                <div className="mb-3 sm:mb-4">
                    <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1">
                        Gender Equality User Growth Trends
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                        GELEP user engagement progression across empowerment phases
                    </p>
                </div>
                
                <div className="h-64 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={userGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                            <XAxis 
                                dataKey="period" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ 
                                    fontSize: 10, 
                                    fill: '#64748b' 
                                }}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                                interval={0}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ 
                                    fontSize: 10, 
                                    fill: '#64748b' 
                                }}
                                domain={[0, 100]}
                                width={30}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                            />
                            
                            {/* Women Leaders Line */}
                            <Line 
                                type="monotone" 
                                dataKey="womenLeaders" 
                                stroke="#10b981" 
                                strokeWidth={2}
                                dot={{ fill: '#10b981', strokeWidth: 1, r: 3 }}
                                activeDot={{ r: 4, stroke: '#10b981', strokeWidth: 2 }}
                            />
                            
                            {/* Men Allies Line */}
                            <Line 
                                type="monotone" 
                                dataKey="menAllies" 
                                stroke="#3b82f6" 
                                strokeWidth={2}
                                dot={{ fill: '#3b82f6', strokeWidth: 1, r: 3 }}
                                activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2 }}
                            />
                            
                            {/* Total Engagement Line */}
                            <Line 
                                type="monotone" 
                                dataKey="totalEngagement" 
                                stroke="#10b981" 
                                strokeWidth={2}
                                dot={{ fill: '#10b981', strokeWidth: 1, r: 3 }}
                                activeDot={{ r: 4, stroke: '#10b981', strokeWidth: 2 }}
                                strokeDasharray="0"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend Section */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-6 mt-3 sm:mt-4 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span><strong>Leadership Training:</strong> Highest women participation (95%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span><strong>Men Allies:</strong> Peak support during training (90%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-600"></div>
                        <span><strong>Engagement:</strong> Maximum impact in training phase</span>
                    </div>
                </div>
            </div>

            {/* Gender Metrics Pie Chart - Right Side */}
            <div className="col-span-1 lg:col-span-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 sm:p-6">
                <div className="mb-3 sm:mb-4">
                    <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50">
                        Gender Equality Metrics
                    </h2>
                </div>
                
                <div className="h-64 sm:h-80 flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={genderMetrics}
                                cx="50%"
                                cy="50%"
                                innerRadius={0}
                                outerRadius={window.innerWidth < 640 ? 80 : 120}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {genderMetrics.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value) => [`${value}%`, 'Percentage']}
                                contentStyle={{
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Custom Labels on the chart - Mobile Responsive */}
                    <div className="absolute top-8 sm:top-16 right-4 sm:right-8">
                        <div className="text-xs text-green-500 font-medium">
                            Women Leaders: 74%
                        </div>
                    </div>
                    <div className="absolute bottom-12 sm:bottom-20 left-2 sm:left-4">
                        <div className="text-xs text-blue-500 font-medium">
                            Men Allies: 86%
                        </div>
                    </div>
                    <div className="absolute bottom-8 sm:bottom-16 right-4 sm:right-8">
                        <div className="text-xs text-purple-500 font-medium">
                            Engagement: 80%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GELEPUserGrowthChart;