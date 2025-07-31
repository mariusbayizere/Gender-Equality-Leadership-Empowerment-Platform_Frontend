import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Filter, Eye, Clock, Users, RefreshCw, AlertCircle,CheckCircle,User,UserCheck,TrendingUp} from 'lucide-react';

const UserReportDownloader = ({ authToken = null }) => {
  const [reportTypes, setReportTypes] = useState([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState('today');
  const [format, setFormat] = useState('json');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get authentication token
  const getAuthToken = () => {
    if (authToken) return authToken;
    
    if (typeof window !== 'undefined') {
      const tokenKeys = ['authToken', 'token', 'accessToken', 'jwt', 'bearerToken'];
      for (const key of tokenKeys) {
        const storedToken = localStorage.getItem(key);
        if (storedToken) return storedToken;
      }
    }
    return null;
  };

  const currentToken = getAuthToken();

  // Create headers with authentication
  const getHeaders = () => {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }

    return headers;
  };

  // Fetch available report types
  useEffect(() => {
    const fetchReportTypes = async () => {
      try {
        // const response = await fetch('http://localhost:3000/api/v1/users/reports/types', {
        const response = await fetch('http://localhost:3000/api/v1/report/reports/types', {
          method: 'GET',
          headers: getHeaders()
        });

        if (response.ok) {
          const data = await response.json();
          setReportTypes(data.reportTypes || []);
        }
      } catch (error) {
        console.error('Error fetching report types:', error);
        // Set default report type if API fails
        setReportTypes([
          {
            type: 'user-registrations',
            name: 'User Registration Report',
            description: 'Overview of users registered within a specific time period',
            formats: ['json', 'csv', 'pdf'],
            filters: ['today', 'week', 'month']
          }
        ]);
      }
    };

    fetchReportTypes();
  }, [currentToken]);

  // Download file function
  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Convert users data to CSV (matching your backend function)
  const convertUsersToCSV = (users) => {
    if (!users || !users.length) {
      return 'No users found for the selected date range';
    }

    const headers = [
      'User ID', 'First Name', 'Last Name', 'Email', 'Role', 
      'Gender', 'Telephone', 'Registration Date'
    ];
    const csvHeaders = headers.join(',');

    const csvRows = users.map(user => [
      `"${user.id || ''}"`,
      `"${user.firstName || ''}"`,
      `"${user.lastName || ''}"`,
      `"${user.email || ''}"`,
      `"${user.userRole || ''}"`,
      `"${user.gender || ''}"`,
      `"${user.telephone || ''}"`,
      `"${user.formattedCreatedAt || user.createdAt || ''}"`
    ].join(','));

    return [csvHeaders, ...csvRows].join('\n');
  };

  // Handle report generation and download
  const handleGenerateReport = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('date', selectedDateFilter);
      queryParams.append('format', format);

      const apiUrl = `http://localhost:3000/api/v1/report/reports/registrations?${queryParams.toString()}`;

      if (format === 'pdf') {
        // Fetch as blob for PDF
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            ...getHeaders(),
            Accept: 'application/pdf'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const filename = `user-registrations-${selectedDateFilter}-${new Date().toISOString().split('T')[0]}.pdf`;
        downloadFile(blob, filename, 'application/pdf');
        setSuccess('PDF report downloaded successfully!');
        setGeneratedReport(null); // No preview for PDF
      } else if (format === 'csv') {
        // For CSV, your backend returns it directly
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            ...getHeaders(),
            Accept: 'text/csv'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const csvContent = await response.text();
        const filename = `user-registrations-${selectedDateFilter}-${new Date().toISOString().split('T')[0]}.csv`;
        downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
        setSuccess('CSV report downloaded successfully!');
        setGeneratedReport(null);
      } else {
        // Fetch as JSON
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: getHeaders()
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        setGeneratedReport(responseData);

        // Also download JSON file
        const jsonContent = JSON.stringify(responseData, null, 2);
        const filename = `user-registrations-${selectedDateFilter}-${new Date().toISOString().split('T')[0]}.json`;
        downloadFile(jsonContent, filename, 'application/json;charset=utf-8;');
        setSuccess('JSON report downloaded and preview generated!');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      setError(`Failed to generate report: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
const formatDate = (dateValue) => {
  if (!dateValue) return 'N/A';

  try {
    // Handle Firestore timestamp objects
    if (typeof dateValue === 'object' && dateValue._seconds !== undefined) {
      const millis = dateValue._seconds * 1000 + Math.floor((dateValue._nanoseconds || 0) / 1e6);
      return new Date(millis).toLocaleDateString();
    }

    // Handle Firestore timestamp objects with toDate method
    if (typeof dateValue === 'object' && typeof dateValue.toDate === 'function') {
      return dateValue.toDate().toLocaleDateString();
    }

    // Handle Date objects
    if (dateValue instanceof Date) {
      return dateValue.toLocaleDateString();
    }

    // Handle ISO string dates (your case)
    if (typeof dateValue === 'string') {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
    }

    // Handle timestamp numbers
    if (typeof dateValue === 'number') {
      return new Date(dateValue).toLocaleDateString();
    }

    return 'N/A';
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};


  const getDateFilterDescription = () => {
    switch (selectedDateFilter) {
      case 'today': return 'Users registered today';
      case 'week': return 'Users registered this week';
      case 'month': return 'Users registered this month';
      default: return 'Users registered today';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
             GELEP Reports
          </h1>
          <p className="text-gray-600">Generate and download GELEP reports in various formats</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Success:</span>
              <span className="text-green-700">{success}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">Error:</span>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Generation Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Generate GELEP Report
                </h2>
              </div>

              <div className="p-6">
                {/* Date Filter Selection */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <label className="text-sm font-medium text-gray-700">Date Range Filter</label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['today', 'week', 'month'].map((filter) => (
                      <div
                        key={filter}
                        onClick={() => setSelectedDateFilter(filter)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedDateFilter === filter
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            selectedDateFilter === filter ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            <Clock className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 capitalize">{filter}</h3>
                            <p className="text-sm text-gray-600">
                              {filter === 'today' && 'Users registered today'}
                              {filter === 'week' && 'Users registered this week'}
                              {filter === 'month' && 'Users registered this month'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Format Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
                  <div className="flex flex-wrap gap-3">
                    {['json', 'csv', 'pdf'].map((formatOption) => (
                      <button
                        key={formatOption}
                        onClick={() => setFormat(formatOption)}
                        className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                          format === formatOption
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {formatOption.toUpperCase()}
                        <div className="text-xs mt-1">
                          {formatOption === 'json' && 'Raw data structure'}
                          {formatOption === 'csv' && 'Spreadsheet format'}
                          {formatOption === 'pdf' && 'Formatted document'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Report Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Report Summary</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• {getDateFilterDescription()}</div>
                    <div>• Export format: {format.toUpperCase()}</div>
                    <div>• Includes: User details, roles, registration dates, and statistics</div>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateReport}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Generate & Download Report
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Report Preview (JSON only) */}
            {generatedReport && (
              <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Report Preview
                  </h2>
                </div>
                <div className="p-6">
                  {/* Report Metadata */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Generated At:</span>
                        <div className="font-medium">{formatDate(generatedReport.metadata.generatedAt)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Users:</span>
                        <div className="font-medium text-blue-600">{generatedReport.report.totalUsers}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Date Range:</span>
                        <div className="font-medium">{generatedReport.report.statistics.dateRange.filter}</div>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        Role Distribution
                      </h4>
                      <div className="space-y-1">
                        {Object.entries(generatedReport.report.statistics.roles).map(([role, count]) => (
                          <div key={role} className="flex justify-between text-sm">
                            <span className="text-blue-700 capitalize">{role}:</span>
                            <span className="font-medium text-blue-900">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Gender Distribution
                      </h4>
                      <div className="space-y-1">
                        {Object.entries(generatedReport.report.statistics.genders).map(([gender, count]) => (
                          <div key={gender} className="flex justify-between text-sm">
                            <span className="text-green-700 capitalize">{gender}:</span>
                            <span className="font-medium text-green-900">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Users Table */}
                  {generatedReport.report.users && generatedReport.report.users.length > 0 && (
                    <div className="overflow-x-auto">
                      <h4 className="font-medium text-gray-900 mb-3">Registered Users</h4>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {generatedReport.report.users.slice(0, 10).map((user, index) => (
                            <tr key={user.id || index} className="hover:bg-gray-50">
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A'}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.email || 'N/A'}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {user.userRole || 'N/A'}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.gender || 'N/A'}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.formattedCreatedAt || 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {generatedReport.report.users.length > 10 && (
                        <div className="text-center py-3 text-sm text-gray-500">
                          ... and {generatedReport.report.users.length - 10} more users
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Report Info */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Report Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Report Type:</span>
                  <div className="text-gray-600">User Registration Report</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Data Includes:</span>
                  <ul className="text-gray-600 mt-1 space-y-1">
                    <li>• User personal information</li>
                    <li>• Registration dates</li>
                    <li>• Role assignments</li>
                    <li>• Statistical summaries</li>
                  </ul>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Available Formats:</span>
                  <div className="text-gray-600 mt-1">JSON, CSV, PDF</div>
                </div>
              </div>
            </div>

            {/* Help & Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Usage Tips</h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• <strong>JSON:</strong> Best for developers and API integration</li>
                    <li>• <strong>CSV:</strong> Perfect for Excel and data analysis</li>
                    <li>• <strong>PDF:</strong> Ideal for reports and presentations</li>
                    <li>• Use specific date ranges for better performance</li>
                    <li>• Large datasets may take longer to generate</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Authentication Status */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Authentication Status</h3>
              <div className="flex items-center gap-2">
                {currentToken ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-medium">Authenticated</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-700 font-medium">Not Authenticated</span>
                  </>
                )}
              </div>
              {!currentToken && (
                <p className="text-sm text-gray-600 mt-2">
                  Please ensure you're logged in to access reports.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReportDownloader;