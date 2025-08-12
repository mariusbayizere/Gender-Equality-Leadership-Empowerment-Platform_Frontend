// import React, { useState, useEffect } from 'react';
// import { Calendar, Clock, Video, MessageCircle, FileText, Star, TrendingUp, Users, Award, Bell, User } from 'lucide-react';
// import { mentors, mentees, sessionData, progressData } from './mentors' 



// const GELEPMentorshipPlatform = () => {
//   const [activeTab, setActiveTab] = useState('matching');
//   const [selectedMentee, setSelectedMentee] = useState(null);
//   const [selectedMentor, setSelectedMentor] = useState(null);
//   const [matches, setMatches] = useState([]);
//   const [sessions, setSessions] = useState([]);
//   const [notifications, setNotifications] = useState([]);



//   // Matching algorithm
//   const findMatches = (mentee) => {
//     return mentors.map(mentor => {
//       let score = 0;
      
//       // Match expertise with goals
//       const expertiseMatch = mentor.expertise.filter(skill => 
//         mentee.goals.some(goal => goal.toLowerCase().includes(skill.toLowerCase()) || 
//                                    skill.toLowerCase().includes(goal.toLowerCase()))
//       ).length;
//       score += expertiseMatch * 30;
      
//       // Match interests
//       const interestMatch = mentor.expertise.filter(skill =>
//         mentee.interests.some(interest => interest.toLowerCase().includes(skill.toLowerCase()) ||
//                                         skill.toLowerCase().includes(interest.toLowerCase()))
//       ).length;
//       score += interestMatch * 20;
      
//       // Experience factor
//       const experienceGap = mentor.experience - mentee.experience;
//       if (experienceGap >= 5 && experienceGap <= 15) score += 25;
      
//       // Rating bonus
//       score += mentor.rating * 5;
      
//       // Location bonus (same location gets slight preference)
//       if (mentor.location === mentee.location) score += 10;
      
//       return {
//         mentor,
//         score: Math.min(score, 100),
//         matchReasons: [
//           ...(expertiseMatch > 0 ? [`${expertiseMatch} matching expertise areas`] : []),
//           ...(interestMatch > 0 ? [`${interestMatch} shared professional interests`] : []),
//           `${mentor.experience} years of leadership experience`,
//           `${mentor.rating}/5.0 mentor rating`,
//           ...(mentor.location === mentee.location ? ['Same location - easier scheduling'] : [])
//         ]
//       };
//     }).sort((a, b) => b.score - a.score);
//   };

//   useEffect(() => {
//     if (selectedMentee) {
//       const newMatches = findMatches(selectedMentee);
//       setMatches(newMatches);
//     }
//   }, [selectedMentee]);

//   useEffect(() => {
//     setSessions(sessionData);
//     setNotifications([
//       { id: 1, type: 'session', message: 'Upcoming session with Jeanne d\'Arc Mujawamariya in 2 hours', time: '12:00 PM' },
//       { id: 2, type: 'match', message: 'New mentor match available - 95% compatibility', time: '10:30 AM' },
//       { id: 3, type: 'progress', message: 'Weekly progress report ready for review', time: 'Yesterday' },
//       { id: 4, type: 'achievement', message: 'Milestone achieved: Policy presentation completed', time: '2 days ago' }
//     ]);
//   }, []);

//   const scheduleSession = (mentorId, menteeId) => {
//     const newSession = {
//       id: sessions.length + 1,
//       mentorId,
//       menteeId,
//       title: "Leadership Development Session",
//       date: "2025-08-08",
//       time: "15:00",
//       duration: 60,
//       status: "scheduled",
//       type: "video",
//       agenda: "To be defined in collaboration"
//     };
//     setSessions([...sessions, newSession]);
//   };

//   const renderMatching = () => (
//     <div className="space-y-8">
//       <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-600 text-white p-8 rounded-2xl overflow-hidden">
//         <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
//         <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>
//         <div className="relative z-10">
//           <h2 className="text-3xl font-bold mb-3">Smart Mentor-Mentee Matching</h2>
//           <p className="text-blue-100 text-lg">Our intelligent algorithm connects Rwandan women leaders with experienced mentors based on expertise, career goals, and compatibility for maximum impact.</p>
//         </div>
//       </div>

//       <div className="grid lg:grid-cols-2 gap-8">
//         <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-50 to-blue-50 p-6 border-b border-gray-100">
//             <h3 className="text-xl font-bold text-gray-800 mb-2">Select Mentee</h3>
//             <p className="text-gray-600">Choose an aspiring leader to find perfect mentor matches</p>
//           </div>
//           <div className="p-6 space-y-4">
//             {mentees.map(mentee => (
//               <div 
//                 key={mentee.id}
//                 className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
//                   selectedMentee?.id === mentee.id 
//                     ? 'border-blue-400 bg-blue-50 shadow-lg transform scale-[1.02]' 
//                     : 'border-gray-200 hover:border-blue-300 bg-white'
//                 }`}
//                 onClick={() => setSelectedMentee(mentee)}
//               >
//                 <div className="flex items-start space-x-4">
//                   <div className="flex-shrink-0">
//                     <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg">
//                       <User className="w-6 h-6 text-white" />
//                     </div>
//                   </div>
//                   <div className="flex-grow">
//                     <h4 className="font-bold text-gray-800 text-lg">{mentee.name}</h4>
//                     <p className="text-gray-600 font-medium">{mentee.currentRole}</p>
//                     <p className="text-sm text-gray-500 mb-3">{mentee.company} • {mentee.location}</p>
//                     <div className="flex flex-wrap gap-2">
//                       {mentee.goals.slice(0, 2).map(goal => (
//                         <span key={goal} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-100 text-blue-800 text-xs font-medium rounded-full">
//                           {goal}
//                         </span>
//                       ))}
//                       {mentee.goals.length > 2 && (
//                         <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
//                           +{mentee.goals.length - 2} more
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-50 to-blue-50 p-6 border-b border-gray-100">
//             <h3 className="text-xl font-bold text-gray-800 mb-2">Recommended Matches</h3>
//             <p className="text-gray-600">AI-powered mentor recommendations based on compatibility</p>
//           </div>
//           <div className="p-6">
//             {selectedMentee ? (
//               <div className="space-y-4">
//                 {matches.slice(0, 3).map(({ mentor, score, matchReasons }) => (
//                   <div key={mentor.id} className="p-5 border border-gray-200 rounded-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300">
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="flex items-center space-x-4">
//                         <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg">
//                           <User className="w-6 h-6 text-white" />
//                         </div>
//                         <div>
//                           <h4 className="font-bold text-gray-800 text-lg">{mentor.name}</h4>
//                           <p className="text-gray-600 font-medium">{mentor.title}</p>
//                           <p className="text-sm text-gray-500">{mentor.company} • {mentor.location}</p>
//                         </div>
//                       </div>
//                       <div className="text-center">
//                         <div className={`text-2xl font-bold ${score >= 80 ? 'text-blue-600' : score >= 60 ? 'text-yellow-600' : 'text-orange-600'}`}>
//                           {score}%
//                         </div>
//                         <div className="text-xs text-gray-500 font-medium">Match Score</div>
//                       </div>
//                     </div>
                    
//                     <div className="space-y-2 mb-4">
//                       {matchReasons.slice(0, 3).map(reason => (
//                         <div key={reason} className="text-sm text-gray-600 flex items-center">
//                           <Star className="w-3 h-3 text-yellow-500 mr-2 flex-shrink-0" />
//                           {reason}
//                         </div>
//                       ))}
//                     </div>
                    
//                     <button 
//                       onClick={() => scheduleSession(mentor.id, selectedMentee.id)}
//                       className="w-full bg-gradient-to-r from-blue-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
//                     >
//                       Connect & Schedule Session
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Users className="w-10 h-10 text-gray-400" />
//                 </div>
//                 <h4 className="text-lg font-medium text-gray-600 mb-2">Select a Mentee</h4>
//                 <p className="text-gray-500">Choose a mentee from the left panel to see personalized mentor recommendations</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderSessions = () => (
//     <div className="space-y-8">
//       <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-600 text-white p-8 rounded-2xl overflow-hidden">
//         <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
//         <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>
//         <div className="relative z-10">
//           <h2 className="text-3xl font-bold mb-3">Virtual Mentorship Sessions</h2>
//           <p className="text-blue-100 text-lg">Schedule, manage, and conduct virtual mentorship sessions with integrated collaboration tools for seamless leadership development.</p>
//         </div>
//       </div>

//       <div className="grid lg:grid-cols-2 gap-8">
//         <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-50 to-blue-50 p-6 border-b border-gray-100">
//             <h3 className="text-xl font-bold text-gray-800 mb-2">Upcoming Sessions</h3>
//             <p className="text-gray-600">Your scheduled mentorship meetings</p>
//           </div>
//           <div className="p-6 space-y-4">
//             {sessions.filter(s => s.status === 'scheduled').map(session => {
//               const mentor = mentors.find(m => m.id === session.mentorId);
//               const mentee = mentees.find(m => m.id === session.menteeId);
              
//               return (
//                 <div key={session.id} className="p-5 border border-gray-200 rounded-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300">
//                   <div className="flex items-center justify-between mb-3">
//                     <h4 className="font-bold text-gray-800 text-lg">{session.title}</h4>
//                     <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-100 text-blue-800 text-xs font-bold rounded-full">
//                       {session.status.toUpperCase()}
//                     </span>
//                   </div>
                  
//                   <div className="space-y-3 text-sm text-gray-600 mb-4">
//                     <div className="flex items-center">
//                       <Users className="w-4 h-4 mr-3 text-blue-500" />
//                       <span className="font-medium">{mentor?.name}</span>
//                       <span className="mx-2">↔</span>
//                       <span className="font-medium">{mentee?.name}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <Calendar className="w-4 h-4 mr-3 text-blue-500" />
//                       <span className="font-medium">{session.date} at {session.time}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <Clock className="w-4 h-4 mr-3 text-orange-500" />
//                       <span className="font-medium">{session.duration} minutes</span>
//                     </div>
//                   </div>
                  
//                   <div className="flex space-x-2">
//                     <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:from-blue-200 hover:to-blue-200 transition-all duration-300">
//                       <Video className="w-4 h-4 mr-2" />
//                       Join Call
//                     </button>
//                     <button className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-300">
//                       <MessageCircle className="w-4 h-4 mr-2" />
//                       Chat
//                     </button>
//                     <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:from-blue-200 hover:to-blue-200 transition-all duration-300">
//                       <FileText className="w-4 h-4 mr-2" />
//                       Docs
//                     </button>
//                   </div>
//                 </div>
//           );
//             })}
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-50 to-blue-50 p-6 border-b border-gray-100">
//             <h3 className="text-xl font-bold text-gray-800 mb-2">Session History</h3>
//             <p className="text-gray-600">Completed mentorship sessions</p>
//           </div>
//           <div className="p-6 space-y-4">
//             {sessions.filter(s => s.status === 'completed').map(session => {
//               const mentor = mentors.find(m => m.id === session.mentorId);
//               const mentee = mentees.find(m => m.id === session.menteeId);
              
//               return (
//                 <div key={session.id} className="p-5 border border-gray-200 rounded-xl bg-gradient-to-br from-white to-gray-50">
//                   <div className="flex items-center justify-between mb-3">
//                     <h4 className="font-bold text-gray-800">{session.title}</h4>
//                     <span className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 text-xs font-bold rounded-full">
//                       COMPLETED
//                     </span>
//                   </div>
                  
//                   <div className="space-y-2 text-sm text-gray-600 mb-3">
//                     <div className="flex items-center">
//                       <Users className="w-4 h-4 mr-3 text-blue-500" />
//                       <span className="font-medium">{mentor?.name} ↔ {mentee?.name}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <Calendar className="w-4 h-4 mr-3 text-blue-500" />
//                       <span className="font-medium">{session.date}</span>
//                     </div>
//                   </div>
                  
//                   <button className="text-blue-600 text-sm font-medium hover:text-blue-800 hover:underline transition-colors">
//                     View Session Notes & Feedback
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 shadow-lg">
//         <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h3>
//         <div className="grid md:grid-cols-3 gap-6">
//           <button className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border border-gray-100">
//             <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-400 rounded-xl flex items-center justify-center mb-4 shadow-lg">
//               <Calendar className="w-6 h-6 text-white" />
//             </div>
//             <div className="font-bold text-gray-800 text-lg mb-2">Schedule Session</div>
//             <div className="text-sm text-gray-600">Book a new mentorship session with available mentors</div>
//           </button>
//           <button className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border border-gray-100">
//             <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-400 rounded-xl flex items-center justify-center mb-4 shadow-lg">
//               <Video className="w-6 h-6 text-white" />
//             </div>
//             <div className="font-bold text-gray-800 text-lg mb-2">Start Instant Meeting</div>
//             <div className="text-sm text-gray-600">Begin impromptu mentorship session</div>
//           </button>
//           <button className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border border-gray-100">
//             <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-400 rounded-xl flex items-center justify-center mb-4 shadow-lg">
//               <FileText className="w-6 h-6 text-white" />
//             </div>
//             <div className="font-bold text-gray-800 text-lg mb-2">Session Templates</div>
//             <div className="text-sm text-gray-600">Use structured agenda templates for focused sessions</div>
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   const renderProgress = () => (
//     <div className="space-y-8">
//       <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-600 text-white p-8 rounded-2xl overflow-hidden">
//         <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
//         <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>
//         <div className="relative z-10">
//           <h2 className="text-3xl font-bold mb-3">Progress Tracking & Analytics</h2>
//           <p className="text-blue-100 text-lg">Monitor mentee development with comprehensive analytics and provide data-driven feedback for continuous leadership growth.</p>
//         </div>
//       </div>

//       <div className="grid lg:grid-cols-2 gap-8">
//         {progressData.map(progress => {
//           const mentee = mentees.find(m => m.id === progress.menteeId);
//           const mentor = mentors.find(m => m.id === progress.mentorId);
          
//           return (
//             <div key={progress.menteeId} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//               <div className="bg-gradient-to-r from-blue-50 to-blue-50 p-6 border-b border-gray-100">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg">
//                     <User className="w-6 h-6 text-white" />
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-800">{mentee?.name}</h3>
//                     <p className="text-gray-600 font-medium">Mentored by {mentor?.name}</p>
//                     <p className="text-sm text-gray-500">{mentee?.location}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-6 space-y-6">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium text-gray-600">Session Progress</span>
//                   <span className="text-sm font-bold text-blue-600">
//                     {progress.sessionsCompleted}/{progress.totalSessions} Sessions
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-gradient-to-r from-blue-500 to-blue-500 h-2 rounded-full transition-all duration-500"
//                     style={{ width: `${(progress.sessionsCompleted / progress.totalSessions) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <h4 className="font-bold text-gray-800 text-lg">Skills Development</h4>
//                 {Object.entries(progress.skillsProgress).map(([skill, percentage]) => (
//                   <div key={skill} className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-medium text-gray-700">{skill}</span>
//                       <span className="text-sm font-bold text-blue-600">{percentage}%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div 
//                         className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-500"
//                         style={{ width: `${percentage}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="bg-gradient-to-br from-blue-50 to-blue-50 p-4 rounded-xl border border-blue-100">
//                 <h5 className="font-bold text-blue-800 mb-2">Mentor Feedback</h5>
//                 <p className="text-sm text-blue-700 mb-3">"{progress.feedback}"</p>
//                 <div className="flex items-center text-xs text-blue-600">
//                   <Award className="w-4 h-4 mr-2" />
//                   <span className="font-medium">Next Milestone: {progress.nextMilestone}</span>
//                 </div>
//               </div>

//               <div className="flex space-x-3">
//                 <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg">
//                   <TrendingUp className="w-4 h-4 inline mr-2" />
//                   View Detailed Report
//                 </button>
//                 <button className="px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300">
//                   <FileText className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//       </div>

//       <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 shadow-lg">
//         <h3 className="text-2xl font-bold text-gray-800 mb-6">Analytics Overview</h3>
//         <div className="grid md:grid-cols-4 gap-6">
//           <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
//             <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
//               <Users className="w-6 h-6 text-white" />
//             </div>
//             <div className="text-2xl font-bold text-gray-800 mb-1">127</div>
//             <div className="text-sm text-gray-600 font-medium">Active Mentorships</div>
//           </div>
//           <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
//             <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
//               <TrendingUp className="w-6 h-6 text-white" />
//             </div>
//             <div className="text-2xl font-bold text-gray-800 mb-1">89%</div>
//             <div className="text-sm text-gray-600 font-medium">Success Rate</div>
//           </div>
//           <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
//             <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
//               <Award className="w-6 h-6 text-white" />
//             </div>
//             <div className="text-2xl font-bold text-gray-800 mb-1">342</div>
//             <div className="text-sm text-gray-600 font-medium">Milestones Achieved</div>
//           </div>
//           <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
//             <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
//               <Clock className="w-6 h-6 text-white" />
//             </div>
//             <div className="text-2xl font-bold text-gray-800 mb-1">1,247</div>
//             <div className="text-sm text-gray-600 font-medium">Session Hours</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderNotifications = () => (
//     <div className="space-y-8">
//       {/* <div className="relative bg-gradient-to-br from-orange-700 via-orange-600 to-red-600 text-white p-8 rounded-2xl overflow-hidden"> */}
//       <div className='relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-600 text-white p-8 rounded-2xl overflow-hidden'>
//         <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
//         <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>
//         <div className="relative z-10">
//           <h2 className="text-3xl font-bold mb-3">Notifications & Updates</h2>
//           <p className="text-orange-100 text-lg">Stay informed with real-time updates on sessions, matches, achievements, and important platform announcements.</p>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-50 to-red-50 p-6 border-b border-gray-100">
//           <h3 className="text-xl font-bold text-gray-800 mb-2">Recent Notifications</h3>
//           <p className="text-gray-600">Important updates and reminders</p>
//         </div>
//         <div className="p-6 space-y-4">
//           {notifications.map(notification => {
//             const getIcon = (type) => {
//               switch(type) {
//                 case 'session': return <Video className="w-5 h-5 text-blue-500" />;
//                 case 'match': return <Users className="w-5 h-5 text-blue-500" />;
//                 case 'progress': return <TrendingUp className="w-5 h-5 text-blue-500" />;
//                 case 'achievement': return <Award className="w-5 h-5 text-orange-500" />;
//                 default: return <Bell className="w-5 h-5 text-gray-500" />;
//               }
//             };

//             const getBgColor = (type) => {
//               switch(type) {
//                 case 'session': return 'from-blue-50 to-blue-50 border-blue-100';
//                 case 'match': return 'from-blue-50 to-blue-50 border-blue-100';
//                 case 'progress': return 'from-blue-50 to-blue-50 border-blue-100';
//                 case 'achievement': return 'from-orange-50 to-red-50 border-orange-100';
//                 default: return 'from-gray-50 to-gray-100 border-gray-100';
//               }
//             };

//             return (
//               <div key={notification.id} className={`p-5 rounded-xl border bg-gradient-to-br ${getBgColor(notification.type)} hover:shadow-md transition-all duration-300`}>
//                 <div className="flex items-start space-x-4">
//                   <div className="flex-shrink-0 mt-1">
//                     {getIcon(notification.type)}
//                   </div>
//                   <div className="flex-grow">
//                     <p className="text-gray-800 font-medium mb-1">{notification.message}</p>
//                     <p className="text-sm text-gray-500">{notification.time}</p>
//                   </div>
//                   <button className="text-gray-400 hover:text-gray-600 transition-colors">
//                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <div className="grid md:grid-cols-2 gap-8">
//         <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-50 to-blue-50 p-6 border-b border-gray-100">
//             <h3 className="text-xl font-bold text-gray-800 mb-2">Notification Settings</h3>
//             <p className="text-gray-600">Customize your notification preferences</p>
//           </div>
//           <div className="p-6 space-y-4">
//             {[
//               { label: 'Session Reminders', description: 'Get notified before scheduled sessions', enabled: true },
//               { label: 'New Matches', description: 'Alert when new mentor matches are found', enabled: true },
//               { label: 'Progress Updates', description: 'Weekly progress and achievement notifications', enabled: false },
//               { label: 'Platform Updates', description: 'Important platform announcements', enabled: true }
//             ].map((setting, index) => (
//               <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                 <div>
//                   <div className="font-medium text-gray-800">{setting.label}</div>
//                   <div className="text-sm text-gray-600">{setting.description}</div>
//                 </div>
//                 <div className={`w-12 h-6 rounded-full transition-colors ${setting.enabled ? 'bg-blue-500' : 'bg-gray-300'}`}>
//                   <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${setting.enabled ? 'translate-x-6' : 'translate-x-1'} mt-0.5`}></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-50 to-blue-50 p-6 border-b border-gray-100">
//             <h3 className="text-xl font-bold text-gray-800 mb-2">Quick Actions</h3>
//             <p className="text-gray-600">Manage your notifications efficiently</p>
//           </div>
//           <div className="p-6 space-y-4">
//             <button className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
//               <div className="flex items-center space-x-3">
//                 <Bell className="w-5 h-5 text-blue-500" />
//                 <div>
//                   <div className="font-medium text-gray-800">Mark All as Read</div>
//                   <div className="text-sm text-gray-600">Clear all unread notifications</div>
//                 </div>
//               </div>
//             </button>
//             <button className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
//               <div className="flex items-center space-x-3">
//                 <MessageCircle className="w-5 h-5 text-blue-500" />
//                 <div>
//                   <div className="font-medium text-gray-800">Enable Push Notifications</div>
//                   <div className="text-sm text-gray-600">Get browser notifications</div>
//                 </div>
//               </div>
//             </button>
//             <button className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
//               <div className="flex items-center space-x-3">
//                 <FileText className="w-5 h-5 text-blue-500" />
//                 <div>
//                   <div className="font-medium text-gray-800">Export Notifications</div>
//                   <div className="text-sm text-gray-600">Download notification history</div>
//                 </div>
//               </div>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
//       <header className="bg-white shadow-lg border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <span className="text-white font-bold text-lg">G</span>
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
//                   GELEP Platform
//                 </h1>
//                 <p className="text-sm text-gray-600 font-medium">Global Excellence Leadership Empowerment Program</p>
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-4">
//               <div className="relative">
//                 {/* <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
//                   <Bell className="w-6 h-6" />
//                   <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
//                 </button> */}
//               </div>
//               {/* <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg"> */}
//               {/* <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
//                 <User className="w-4 h-4 text-white" />
//               </div> */}
//             </div>
//           </div>
//         </div>
//       </header>

//       <nav className="bg-white shadow-sm border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="flex space-x-8">
//             {[
//               { id: 'matching', label: 'Smart Matching', icon: Users },
//               { id: 'sessions', label: 'Virtual Sessions', icon: Video },
//               { id: 'progress', label: 'Progress Tracking', icon: TrendingUp },
//               { id: 'notifications', label: 'Notifications', icon: Bell }
//             ].map(tab => {
//               const Icon = tab.icon;
//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-all duration-300 ${
//                     activeTab === tab.id
//                       ? 'border-blue-500 text-blue-600 bg-blue-50'
//                       : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300'
//                   }`}
//                 >
//                   <Icon className="w-4 h-4" />
//                   <span>{tab.label}</span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-6 py-8">
//         {activeTab === 'matching' && renderMatching()}
//         {activeTab === 'sessions' && renderSessions()}
//         {activeTab === 'progress' && renderProgress()}
//         {activeTab === 'notifications' && renderNotifications()}
//       </main>
//     </div>
//   );
// };

// export default GELEPMentorshipPlatform;



import React, { useState, useEffect } from 'react';
import { Calendar, Trophy , Clock, Video, MessageCircle, FileText, Star, TrendingUp, Users, Award, Bell, User } from 'lucide-react';
import { mentors, mentees, sessionData, progressData } from './mentors'; 


const GELEPMentorshipPlatform = () => {
  const [activeTab, setActiveTab] = useState('matching');
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [matches, setMatches] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [pendingRequests, setPendingRequests] = useState(new Set());

  // Matching algorithm
  const findMatches = (mentee) => {
    return mentors.map(mentor => {
      let score = 0;
      
      // Match expertise with goals
      const expertiseMatch = mentor.expertise.filter(skill => 
        mentee.goals.some(goal => goal.toLowerCase().includes(skill.toLowerCase()) || 
                                   skill.toLowerCase().includes(goal.toLowerCase()))
      ).length;
      score += expertiseMatch * 30;
      
      // Match interests
      const interestMatch = mentor.expertise.filter(skill =>
        mentee.interests.some(interest => interest.toLowerCase().includes(skill.toLowerCase()) ||
                                        skill.toLowerCase().includes(interest.toLowerCase()))
      ).length;
      score += interestMatch * 20;
      
      // Experience factor
      const experienceGap = mentor.experience - mentee.experience;
      if (experienceGap >= 5 && experienceGap <= 15) score += 25;
      
      // Rating bonus
      score += mentor.rating * 5;
      
      // Location bonus (same location gets slight preference)
      if (mentor.location === mentee.location) score += 10;
      
      return {
        mentor,
        score: Math.min(score, 100),
        matchReasons: [
          ...(expertiseMatch > 0 ? [`${expertiseMatch} matching expertise areas`] : []),
          ...(interestMatch > 0 ? [`${interestMatch} shared professional interests`] : []),
          `${mentor.experience} years of leadership experience`,
          `${mentor.rating}/5.0 mentor rating`,
          ...(mentor.location === mentee.location ? ['Same location - easier scheduling'] : [])
        ]
      };
    }).sort((a, b) => b.score - a.score);
  };

  useEffect(() => {
    if (selectedMentee) {
      const newMatches = findMatches(selectedMentee);
      setMatches(newMatches);
    }
  }, [selectedMentee]);

  useEffect(() => {
    setSessions(sessionData);
    setNotifications([
      { id: 1, type: 'session', message: 'Upcoming session with Jeanne d\'Arc Mujawamariya in 2 hours', time: '12:00 PM' },
      { id: 2, type: 'match', message: 'New mentor match available - 95% compatibility', time: '10:30 AM' },
      { id: 3, type: 'progress', message: 'Weekly progress report ready for review', time: 'Yesterday' },
      { id: 4, type: 'achievement', message: 'Milestone achieved: Policy presentation completed', time: '2 days ago' }
    ]);
  }, []);

  const handleConnectRequest = (mentorId, menteeId) => {
    const requestKey = `${mentorId}-${menteeId}`;
    setPendingRequests(prev => new Set([...prev, requestKey]));
    
    // Add notification about the pending request
    const mentor = mentors.find(m => m.id === mentorId);
    const mentee = mentees.find(m => m.id === menteeId);
    const newNotification = {
      id: notifications.length + 1,
      type: 'match',
      message: `Connection request sent to ${mentor?.name} for ${mentee?.name}`,
      time: 'Just now'
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const scheduleSession = (mentorId, menteeId) => {
    const newSession = {
      id: sessions.length + 1,
      mentorId,
      menteeId,
      title: "Leadership Development Session",
      date: "2025-08-08",
      time: "15:00",
      duration: 60,
      status: "scheduled",
      type: "video",
      agenda: "To be defined in collaboration"
    };
    setSessions([...sessions, newSession]);
  };

  const isRequestPending = (mentorId, menteeId) => {
    const requestKey = `${mentorId}-${menteeId}`;
    return pendingRequests.has(requestKey);
  };

  const renderMatching = () => (
    <div className="space-y-6 sm:space-y-8">
      <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-600 text-white p-6 sm:p-8 rounded-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white bg-opacity-10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white bg-opacity-10 rounded-full -ml-10 sm:-ml-12 -mb-10 sm:-mb-12"></div>
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Smart Mentor-Mentee Matching</h2>
          <p className="text-blue-100 text-base sm:text-lg">Our intelligent algorithm connects Rwandan women leaders with experienced mentors based on expertise, career goals, and compatibility for maximum impact.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-blue-50 p-4 sm:p-6 border-b border-gray-100">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Select Mentee</h3>
            <p className="text-sm sm:text-base text-gray-600">Choose an aspiring leader to find perfect mentor matches</p>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {mentees.map(mentee => (
              <div 
                key={mentee.id}
                className={`p-4 sm:p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                  selectedMentee?.id === mentee.id 
                    ? 'border-blue-400 bg-blue-50 shadow-lg transform scale-[1.02]' 
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                }`}
                onClick={() => setSelectedMentee(mentee)}
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-gray-800 text-base sm:text-lg truncate">{mentee.name}</h4>
                    <p className="text-sm sm:text-base text-gray-600 font-medium truncate">{mentee.currentRole}</p>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3 truncate">{mentee.company} • {mentee.location}</p>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {mentee.goals.slice(0, 2).map(goal => (
                        <span key={goal} className="px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {goal}
                        </span>
                      ))}
                      {mentee.goals.length > 2 && (
                        <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          +{mentee.goals.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-blue-50 p-4 sm:p-6 border-b border-gray-100">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Recommended Matches</h3>
            <p className="text-sm sm:text-base text-gray-600">AI-powered mentor recommendations based on compatibility</p>
          </div>
          <div className="p-4 sm:p-6">
            {selectedMentee ? (
              <div className="space-y-4">
                {matches.slice(0, 3).map(({ mentor, score, matchReasons }) => {
                  const isPending = isRequestPending(mentor.id, selectedMentee.id);
                  
                  return (
                    <div key={mentor.id} className="p-4 sm:p-5 border border-gray-200 rounded-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between mb-4 flex-col sm:flex-row gap-3 sm:gap-0">
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-gray-800 text-base sm:text-lg truncate">{mentor.name}</h4>
                            <p className="text-sm sm:text-base text-gray-600 font-medium truncate">{mentor.title}</p>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">{mentor.company} • {mentor.location}</p>
                          </div>
                        </div>
                        <div className="text-center flex-shrink-0 sm:ml-4">
                          <div className={`text-xl sm:text-2xl font-bold ${score >= 80 ? 'text-blue-600' : score >= 60 ? 'text-yellow-600' : 'text-orange-600'}`}>
                            {score}%
                          </div>
                          <div className="text-xs text-gray-500 font-medium">Match Score</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {matchReasons.slice(0, 3).map(reason => (
                          <div key={reason} className="text-xs sm:text-sm text-gray-600 flex items-start">
                            <Star className="w-3 h-3 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="break-words">{reason}</span>
                          </div>
                        ))}
                      </div>
                      
                      <button 
                        onClick={() => handleConnectRequest(mentor.id, selectedMentee.id)}
                        disabled={isPending}
                        className={`w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold transition-all duration-300 transform shadow-lg text-sm sm:text-base ${
                          isPending 
                            ? 'bg-gray-400 text-white cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-600 to-blue-600 text-white hover:from-blue-700 hover:to-blue-700 hover:scale-[1.02]'
                        }`}
                      >
                        {isPending ? 'Pending Request...' : 'Connect & Schedule Session'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h4 className="text-base sm:text-lg font-medium text-gray-600 mb-2">Select a Mentee</h4>
                <p className="text-sm sm:text-base text-gray-500 px-4">Choose a mentee from the left panel to see personalized mentor recommendations</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-6 sm:space-y-8">
      <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-600 text-white p-6 sm:p-8 rounded-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white bg-opacity-10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white bg-opacity-10 rounded-full -ml-10 sm:-ml-12 -mb-10 sm:-mb-12"></div>
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Virtual Mentorship Sessions</h2>
          <p className="text-blue-100 text-base sm:text-lg">Schedule, manage, and conduct virtual mentorship sessions with integrated collaboration tools for seamless leadership development.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-blue-50 p-4 sm:p-6 border-b border-gray-100">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Upcoming Sessions</h3>
            <p className="text-sm sm:text-base text-gray-600">Your scheduled mentorship meetings</p>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {sessions.filter(s => s.status === 'scheduled').map(session => {
              const mentor = mentors.find(m => m.id === session.mentorId);
              const mentee = mentees.find(m => m.id === session.menteeId);
              
              return (
                <div key={session.id} className="p-4 sm:p-5 border border-gray-200 rounded-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-3 flex-col sm:flex-row gap-2 sm:gap-0">
                    <h4 className="font-bold text-gray-800 text-base sm:text-lg text-center sm:text-left">{session.title}</h4>
                    <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-100 text-blue-800 text-xs font-bold rounded-full">
                      {session.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600 mb-4">
                    <div className="flex items-center justify-center sm:justify-start">
                      <Users className="w-4 h-4 mr-2 sm:mr-3 text-blue-500 flex-shrink-0" />
                      <span className="font-medium truncate">{mentor?.name}</span>
                      <span className="mx-1 sm:mx-2">↔</span>
                      <span className="font-medium truncate">{mentee?.name}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start">
                      <Calendar className="w-4 h-4 mr-2 sm:mr-3 text-blue-500 flex-shrink-0" />
                      <span className="font-medium">{session.date} at {session.time}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start">
                      <Clock className="w-4 h-4 mr-2 sm:mr-3 text-orange-500 flex-shrink-0" />
                      <span className="font-medium">{session.duration} minutes</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-100 text-blue-800 rounded-lg text-xs sm:text-sm font-medium hover:from-blue-200 hover:to-blue-200 transition-all duration-300">
                      <Video className="w-4 h-4 mr-2" />
                      Join Call
                    </button>
                    <button className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-lg text-xs sm:text-sm font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-300">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </button>
                    <button className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-100 text-blue-800 rounded-lg text-xs sm:text-sm font-medium hover:from-blue-200 hover:to-blue-200 transition-all duration-300">
                      <FileText className="w-4 h-4 mr-2" />
                      Docs
                    </button>
                  </div>
                </div>
          );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-blue-50 p-4 sm:p-6 border-b border-gray-100">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Session History</h3>
            <p className="text-sm sm:text-base text-gray-600">Completed mentorship sessions</p>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {sessions.filter(s => s.status === 'completed').map(session => {
              const mentor = mentors.find(m => m.id === session.mentorId);
              const mentee = mentees.find(m => m.id === session.menteeId);
              
              return (
                <div key={session.id} className="p-4 sm:p-5 border border-gray-200 rounded-xl bg-gradient-to-br from-white to-gray-50">
                  <div className="flex items-center justify-between mb-3 flex-col sm:flex-row gap-2 sm:gap-0">
                    <h4 className="font-bold text-gray-800 text-sm sm:text-base text-center sm:text-left">{session.title}</h4>
                    <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 text-xs font-bold rounded-full">
                      COMPLETED
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-xs sm:text-sm text-gray-600 mb-3">
                    <div className="flex items-center justify-center sm:justify-start">
                      <Users className="w-4 h-4 mr-2 sm:mr-3 text-blue-500 flex-shrink-0" />
                      <span className="font-medium truncate">{mentor?.name} ↔ {mentee?.name}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start">
                      <Calendar className="w-4 h-4 mr-2 sm:mr-3 text-blue-500 flex-shrink-0" />
                      <span className="font-medium">{session.date}</span>
                    </div>
                  </div>
                  
                  <button className="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-800 hover:underline transition-colors block w-full text-center sm:text-left">
                    View Session Notes & Feedback
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-lg">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center sm:text-left">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <button className="p-4 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border border-gray-100">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-400 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg mx-auto sm:mx-0">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="font-bold text-gray-800 text-base sm:text-lg mb-2 text-center sm:text-left">Schedule Session</div>
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">Book a new mentorship session with available mentors</div>
          </button>
          <button className="p-4 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border border-gray-100">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-400 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg mx-auto sm:mx-0">
              <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="font-bold text-gray-800 text-base sm:text-lg mb-2 text-center sm:text-left">Start Instant Meeting</div>
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">Begin impromptu mentorship session</div>
          </button>
          <button className="p-4 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border border-gray-100 sm:col-span-2 md:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-400 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg mx-auto sm:mx-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="font-bold text-gray-800 text-base sm:text-lg mb-2 text-center sm:text-left">
              Resource Library</div>
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">Access mentorship resources and templates</div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6 sm:space-y-8">
      <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-600 text-white p-6 sm:p-8 rounded-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white bg-opacity-10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white bg-opacity-10 rounded-full -ml-10 sm:-ml-12 -mb-10 sm:-mb-12"></div>
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Progress Tracking & Analytics</h2>
          <p className="text-blue-100 text-base sm:text-lg">Monitor leadership development journey with comprehensive analytics, skill assessments, and milestone tracking for continuous growth.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        {progressData.map(progress => {
          const mentee = mentees.find(m => m.id === progress.menteeId);
          const mentor = mentors.find(m => m.id === progress.mentorId);
          
          return (
            <div key={progress.menteeId} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-50 p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">{mentee?.name}</h3>
                    <p className="text-sm sm:text-base text-gray-600">Mentored by {mentor?.name}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">{progress.sessionsCompleted}/{progress.totalSessions}</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Sessions</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">{progress.overallScore}</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Overall Score</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 text-base sm:text-lg mb-3">Skill Progress</h4>
                  <div className="space-y-3">
                    {progress.skillsProgress.map(skill => (
                      <div key={skill.skill}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm sm:text-base font-medium text-gray-700">{skill.skill}</span>
                          <span className="text-xs sm:text-sm font-bold text-blue-600">{skill.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${skill.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 text-base sm:text-lg mb-3">Recent Achievements</h4>
                  <div className="space-y-2">
                    {progress.achievements.map(achievement => (
                      <div key={achievement} className="flex items-center text-sm sm:text-base text-gray-600">
                        <Award className="w-4 h-4 text-yellow-500 mr-2 sm:mr-3 flex-shrink-0" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg text-sm sm:text-base">
                  View Detailed Report
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-lg">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center sm:text-left">Analytics Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md border border-gray-100 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-400 rounded-xl flex items-center justify-center mb-3 shadow-lg mx-auto">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">89%</div>
            <div className="text-xs sm:text-sm text-gray-600">Average Progress</div>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md border border-gray-100 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-green-400 rounded-xl flex items-center justify-center mb-3 shadow-lg mx-auto">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">24</div>
            <div className="text-xs sm:text-sm text-gray-600">Goals Achieved</div>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md border border-gray-100 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-purple-400 rounded-xl flex items-center justify-center mb-3 shadow-lg mx-auto">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">156</div>
            <div className="text-xs sm:text-sm text-gray-600">Hours Mentored</div>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md border border-gray-100 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-orange-400 rounded-xl flex items-center justify-center mb-3 shadow-lg mx-auto">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">4.8</div>
            <div className="text-xs sm:text-sm text-gray-600">Avg Rating</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent mb-4">
            GELEP Mentorship Platform
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Empowering Rwandan women leaders through intelligent mentorship matching, virtual collaboration, and comprehensive progress tracking
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center mb-8 sm:mb-12 space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => setActiveTab('matching')}
            className={`px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-xl font-semibold transition-all duration-300 transform shadow-lg text-sm sm:text-base lg:text-lg ${
              activeTab === 'matching'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white scale-105 shadow-xl'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-[1.02]'
            }`}
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
            Smart Matching
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-xl font-semibold transition-all duration-300 transform shadow-lg text-sm sm:text-base lg:text-lg ${
              activeTab === 'sessions'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white scale-105 shadow-xl'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-[1.02]'
            }`}
          >
            <Video className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
            Virtual Sessions
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-xl font-semibold transition-all duration-300 transform shadow-lg text-sm sm:text-base lg:text-lg ${
              activeTab === 'progress'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white scale-105 shadow-xl'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-[1.02]'
            }`}
          >
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
            Progress Analytics
          </button>
        </div>

        {activeTab === 'matching' && renderMatching()}
        {activeTab === 'sessions' && renderSessions()}
        {activeTab === 'progress' && renderProgress()}

        <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 lg:p-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">Stay Connected</h3>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Get notified about new mentor matches, upcoming sessions, and progress milestones to maximize your leadership development journey.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-[1.02] shadow-lg text-sm sm:text-base">
                Enable Notifications
              </button>
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:scale-[1.02] shadow-lg text-sm sm:text-base">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GELEPMentorshipPlatform;