import React from 'react';
import {
  Clock, Users, Award, Video, Star, Download, ChevronRight
} from 'lucide-react';

const CourseCard = ({
  course,
  enrollment,
  certification,
//   courseModules,
  courseModules = [],
  onEnroll,
  onShowModules,
  generateMeetLink,
  getYouTubeVideoId
}) => {
  const videoId = courseModules.length > 0
    ? getYouTubeVideoId(courseModules[0]?.media_url)
    : null;

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
      <div className={`h-32 bg-gradient-to-br ${
        course.course_type === 'webinar' ? 'from-green-500 to-green-600' : 'from-purple-500 to-purple-600'
      } relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute top-4 left-4">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm ${
            course.course_type === 'webinar' ? 'bg-green-500 bg-opacity-30' : 'bg-purple-500 bg-opacity-30'
          }`}>
            <div className="flex items-center">
              {course.course_type === 'webinar' ? <Video className="w-3 h-3 mr-1" /> : <Award className="w-3 h-3 mr-1" />}
              {course.course_type === 'webinar' ? 'Live Webinar' : 'Certification Program'}
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="w-3 h-3 text-yellow-300 fill-current" />
            <span className="text-xs font-medium text-white">{course.rating || '4.5'}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-gray-600 text-sm">{course.description}</p>

        <div className="flex items-center justify-between my-4 text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-blue-500" />
              {course.duration}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-green-500" />
              {course.enrolled || 0}
            </div>
          </div>
          <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
            by {course.instructor_name}
          </div>
        </div>

        {enrollment && (
          <div className="mb-4">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="text-blue-600 font-semibold">{enrollment.progress || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: `${enrollment.progress || 0}%` }}></div>
            </div>
          </div>
        )}

        {certification && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex justify-between">
              <div className="flex items-center text-green-800 font-semibold">
                <Award className="w-5 h-5 text-green-600 mr-2" />
                Certified
              </div>
              <button className="text-green-600 hover:text-green-800 flex items-center text-sm">
                <Download className="w-4 h-4 mr-1" />
                Download
              </button>
            </div>
          </div>
        )}

        {course.course_type === 'webinar' && (
          <button
            onClick={() => window.open(generateMeetLink(course.id), '_blank')}
            className="w-full mb-4 flex items-center justify-center py-2 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg"
          >
            <Video className="w-4 h-4 mr-2 text-green-600" />
            <span className="text-green-700 font-medium">Join Webinar</span>
          </button>
        )}

        <div className="flex space-x-2">
          {!enrollment ? (
            <button onClick={() => onEnroll(course.id)} className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700">
              Enroll Now
            </button>
          ) : (
            <button className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700">
              Continue Learning
            </button>
          )}
          <button
            onClick={() => onShowModules(course)}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
