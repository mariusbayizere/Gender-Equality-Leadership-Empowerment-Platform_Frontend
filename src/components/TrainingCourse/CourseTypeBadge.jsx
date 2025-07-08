
import { BookOpen,Award, Globe, Video } from 'lucide-react';



// Course type icon helper
export const getCourseTypeIcon = (type) => {
  switch (type) {
    case 'online':
      return <Globe className="w-4 h-4 text-blue-600" />;
    case 'webinar':
      return <Video className="w-4 h-4 text-purple-600" />;
    case 'certification':
      return <Award className="w-4 h-4 text-green-600" />;
    default:
      return <BookOpen className="w-4 h-4 text-gray-600" />;
  }
};

// Course type badge helper
export const getCourseTypeBadge = (type) => {
  const baseClasses = "inline-flex px-3 py-1.5 text-xs font-semibold rounded-full";
  switch (type) {
    case 'online':
      return `${baseClasses} bg-blue-100 text-blue-700`;
    case 'webinar':
      return `${baseClasses} bg-purple-100 text-purple-700`;
    case 'certification':
      return `${baseClasses} bg-green-100 text-green-700`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-700`;
  }
};