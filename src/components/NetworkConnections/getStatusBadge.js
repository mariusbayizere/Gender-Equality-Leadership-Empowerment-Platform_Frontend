// import React, { useState, useEffect } from 'react';
// import { Clock, CheckCircle, XCircle, Shield } from 'lucide-react';



// // Status icon helper
//  const getStatusIcon = (status) => {
//   switch (status) {
//     case CONNECTION_STATUS.PENDING:
//       return <Clock className="w-4 h-4 text-yellow-600" />;
//     case CONNECTION_STATUS.ACCEPTED:
//       return <CheckCircle className="w-4 h-4 text-green-600" />;
//     case CONNECTION_STATUS.REJECTED:
//       return <XCircle className="w-4 h-4 text-red-600" />;
//     case CONNECTION_STATUS.BLOCKED:
//       return <Shield className="w-4 h-4 text-gray-600" />;
//     default:
//       return <Clock className="w-4 h-4 text-gray-600" />;
//   }
// };

// // Status badge helper
//  const getStatusBadge = (status) => {
//   const baseClasses = "inline-flex px-3 py-1.5 text-xs font-semibold rounded-full";
//   switch (status) {
//     case CONNECTION_STATUS.PENDING:
//       return `${baseClasses} bg-yellow-100 text-yellow-700`;
//     case CONNECTION_STATUS.ACCEPTED:
//       return `${baseClasses} bg-green-100 text-green-700`;
//     case CONNECTION_STATUS.REJECTED:
//       return `${baseClasses} bg-red-100 text-red-700`;
//     case CONNECTION_STATUS.BLOCKED:
//       return `${baseClasses} bg-gray-100 text-gray-700`;
//     default:
//       return `${baseClasses} bg-gray-100 text-gray-700`;
//   }
// };