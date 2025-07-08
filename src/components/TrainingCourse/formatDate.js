
export  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';

    try {
      if (typeof dateValue === 'object' && dateValue._seconds !== undefined) {
        const millis = dateValue._seconds * 1000 + Math.floor((dateValue._nanoseconds || 0) / 1e6);
        return new Date(millis).toLocaleDateString();
      }

      if (typeof dateValue === 'object' && typeof dateValue.toDate === 'function') {
        return dateValue.toDate().toLocaleDateString();
      }

      if (dateValue instanceof Date) {
        return dateValue.toLocaleDateString();
      }

      if (typeof dateValue === 'string') {
        const date = new Date(dateValue);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
      }

      if (typeof dateValue === 'number') {
        return new Date(dateValue).toLocaleDateString();
      }

      return 'N/A';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };