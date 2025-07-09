import React, { useState, useEffect } from 'react';
import { Edit, List, Trash2, User, Clock, Target, MoreVertical, AlertCircle, X, Plus, Search, RefreshCw, Grid3X3, Menu, Calendar, TrendingUp, CheckCircle, Activity, BarChart, Key, Shield } from 'lucide-react';
import { getStatusBadge, getStatusIcon } from './getStatusBadge'
import { columns } from './columns';
import { DeleteConfirmation } from './DeleteConfirmation'; // Import the DeleteConfirmation component
import { formatDate } from './formatDate';
import { apiService } from './api_file'; // Import the API service
import ProgressTrackingForm from './ProgressTrackingForm'; 


// Progress bar component
const ProgressBar = ({ percentage }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div 
      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
);


export const MobileCard = ({ entry, index, onEdit, onDelete, onExpand, isExpanded, startIndex }) => {

  const [showProgressForm, setShowProgressForm] = useState(false);
  const [editingProgress, setEditingProgress] = useState(null);
  const [formMode, setFormMode] = useState('create');

  // Handler to open progress form for creating new progress
  const handleCreateProgress = () => {
    setEditingProgress(null);
    setFormMode('create');
    setShowProgressForm(true);
  };

  // Handler to open progress form for editing existing progress
  const handleEditProgress = (progressData) => {
    console.log('Mobile card edit progress data:', progressData); // Debug log
    setEditingProgress(progressData);
    setFormMode('update');
    setShowProgressForm(true);
  };

  // Add handlers for mobile card
  const handleProgressUpdated = (updatedProgress) => {
    console.log('Mobile card progress updated:', updatedProgress);
    setShowProgressForm(false);
    setEditingProgress(null);
    // You might want to call a parent function here to update the main list
  };

  const handleProgressCreated = (newProgress) => {
    console.log('Mobile card progress created:', newProgress);
    setShowProgressForm(false);
    setEditingProgress(null);
    // You might want to call a parent function here to update the main list
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {entry?.user_info?.name || 'N/A'}
            </h3>
            <p className="text-xs text-gray-500">ID: {startIndex + index + 1}</p>
          </div>
        </div>
        <button 
          onClick={() => onExpand?.(isExpanded ? null : entry.id)}
          className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-600 truncate">
            {entry?.course_info?.title || 'N/A'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {getStatusIcon(entry?.status)}
          <span className={getStatusBadge(entry?.status)}>
            {entry?.status?.replace('_', ' ').toUpperCase() || 'N/A'}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-900">
              {entry?.progress_percentage || 0}%
            </span>
          </div>
          <ProgressBar percentage={entry?.progress_percentage || 0} />
        </div>

        {isExpanded && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <BarChart className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600">
                {entry?.session_count || 1} sessions
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600">
                {/* Due: {formatDate(entry?.completion_date)} */}
                Due {formatDate(entry?.completion_date)}
              </span>
            </div>

            {entry?.goals && entry.goals.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Goals:</span>
                </div>
                <div className="ml-6 space-y-1">
                  {entry.goals.slice(0, 2).map((goal, idx) => (
                    <div key={idx} className="text-xs text-gray-500">
                      • {goal}
                    </div>
                  ))}
                  {entry.goals.length > 2 && (
                    <div className="text-xs text-gray-400">
                      +{entry.goals.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {entry?.feedback && (
              <div className="space-y-1">
                <span className="text-sm text-gray-600">Feedback:</span>
                <p className="text-xs text-gray-500 italic">
                  "{entry.feedback}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <ProgressTrackingForm
        showModal={showProgressForm}
        setShowModal={setShowProgressForm}
        onProgressCreated={handleProgressCreated}
        onProgressUpdated={handleProgressUpdated}
        editingProgress={editingProgress}
        mode={formMode}
      />

      {isExpanded && (
        <div className="flex space-x-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => handleEditProgress(entry)} 
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete?.(entry)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>

      )}
    </div>
  );
};
