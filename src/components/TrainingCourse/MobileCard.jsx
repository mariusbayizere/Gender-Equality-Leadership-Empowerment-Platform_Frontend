// import React, {useState} from 'react';
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, BookOpen, User, Clock, MoreVertical, Calendar } from 'lucide-react';
import { formatDate } from './formatDate';
import { getCourseTypeIcon, getCourseTypeBadge } from './CourseTypeBadge';

export const MobileCard = ({ course, index, startIndex, onEdit, onDelete, onExpand, isExpanded }) => {
  // Fix: Ensure startIndex is a number and provide a default value
  const safeStartIndex = Number(startIndex) || 0;
  const displayId = safeStartIndex + index + 1;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {course?.title || 'N/A'}
            </h3>
            {/* Fixed ID calculation */}
            <p className="text-xs text-gray-500">ID: {displayId}</p>
          </div>
        </div>
        <button 
            onClick={() => onExpand?.(isExpanded ? null : course.id)}
            className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
            <MoreVertical className="w-5 h-5" />
            </button>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-600 truncate">
            {course?.instructor_name || 'N/A'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {getCourseTypeIcon(course?.course_type)}
          <span className={getCourseTypeBadge(course?.course_type)}>
            {course?.course_type?.charAt(0).toUpperCase() + course?.course_type?.slice(1) || 'N/A'}
          </span>
        </div>

        {isExpanded && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600">
                {course?.duration || 'N/A'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${course?.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${course?.is_active ? 'text-green-700' : 'text-red-700'}`}>
                {course?.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            {course?.created_date && (
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                     {formatDate(course?.created_date)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="flex space-x-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onEdit?.(course)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete?.(course)}
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
