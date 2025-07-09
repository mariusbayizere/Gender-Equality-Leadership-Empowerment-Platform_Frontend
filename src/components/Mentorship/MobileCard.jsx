import React, { useState, useEffect } from 'react';
import { Edit, List, Trash2, User, Clock, Target, MoreVertical, AlertCircle, X, Plus, Search, RefreshCw, Grid3X3, Menu, Calendar, TrendingUp, CheckCircle, Activity, BarChart, Users, Heart } from 'lucide-react';
import MentorshipRelationshipForm from './MentorshipRelationshipForm';
import { apiService } from './api_route';
import { DeleteConfirmation} from './DeleteConfirmation';
import { columns } from './columns';
import { getStatusBadge, getStatusIcon } from './getStatusBadge'



export const MobileCard = ({ relationship, index, onEdit, onDelete, onExpand, isExpanded, startIndex }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const [showModal, setShowModal] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editingRelationship, setEditingRelationship] = useState(null);

  const handleCreateNew = () => {
    setFormMode('create');
    setEditingRelationship(null);
    setShowModal(true);
  };

  const handleEdit = (relationship) => {
    setFormMode('update');
    setEditingRelationship(relationship);
    setShowModal(true);
  };

  const handleRelationshipCreated = (newRelationship) => {
    console.log('Created:', newRelationship);
    // Handle success
  };

  const handleRelationshipUpdated = (updatedRelationship) => {
    console.log('Updated:', updatedRelationship);
    // Handle success
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {relationship?.mentor_info?.name || 'N/A'} → {relationship?.mentee_info?.name || 'N/A'}
            </h3>
            <p className="text-xs text-gray-500">ID: {startIndex + index + 1}</p>
          </div>
        </div>
        <button 
          onClick={() => onExpand?.(isExpanded ? null : relationship.id)}
          className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-600 truncate">
            {relationship?.matching_criteria || 'N/A'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {getStatusIcon(relationship?.status)}
          <span className={getStatusBadge(relationship?.status)}>
            {relationship?.status?.toUpperCase() || 'N/A'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {getStatusIcon(relationship?.program_status)}
          <span className={getStatusBadge(relationship?.program_status)}>
            {relationship?.program_status?.toUpperCase() || 'N/A'}
          </span>
        </div>

        {isExpanded && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600">Mentor Details:</span>
              </div>
              <div className="ml-6 space-y-1">
                <div className="text-xs text-gray-500">
                  {relationship?.mentor_info?.email || 'N/A'}
                </div>
                <div className="text-xs text-gray-500">
                  {relationship?.mentor_info?.expertise || 'N/A'}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600">Mentee Details:</span>
              </div>
              <div className="ml-6 space-y-1">
                <div className="text-xs text-gray-500">
                  {relationship?.mentee_info?.email || 'N/A'}
                </div>
                <div className="text-xs text-gray-500">
                  {relationship?.mentee_info?.level || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
        <MentorshipRelationshipForm
        showModal={showModal}
        setShowModal={setShowModal}
        onRelationshipCreated={handleRelationshipCreated}
        onRelationshipUpdated={handleRelationshipUpdated}
        editingRelationship={editingRelationship}
        mode={formMode}/>

      {isExpanded && (
        <div className="flex space-x-2 pt-3 border-t border-gray-100">
          <button
            // onClick={() => onEdit?.(relationship)}
            onClick={() => handleEdit(relationship)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete?.(relationship)}
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