import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Activity} from 'lucide-react';


// Status badge helper
export const getStatusBadge = (status) => {
  const baseClasses = "inline-flex px-3 py-1.5 text-xs font-semibold rounded-full";
  switch (status) {
    case 'active':
      return `${baseClasses} bg-green-100 text-green-700`;
    case 'completed':
      return `${baseClasses} bg-blue-100 text-blue-700`;
    case 'paused':
      return `${baseClasses} bg-yellow-100 text-yellow-700`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-700`;
  }
};

// Status icon helper
export const getStatusIcon = (status) => {
  switch (status) {
    case 'active':
      return <Activity className="w-4 h-4 text-green-600" />;
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-blue-600" />;
    case 'paused':
      return <Clock className="w-4 h-4 text-yellow-600" />;
    default:
      return <Activity className="w-4 h-4 text-gray-600" />;
  }
};
