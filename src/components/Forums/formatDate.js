export const formatDate = (dateValue) => {
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
