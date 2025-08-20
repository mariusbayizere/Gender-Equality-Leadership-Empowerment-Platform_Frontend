import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Award, Download, Share2, ChevronRight, ChevronLeft, AlertCircle, Star, Trophy, BookOpen, User, Calendar, ExternalLink, Play } from 'lucide-react';
import { examQuestions } from './examQuestions'

// Module data for course topics
export const moduleData = [
  { title: "Introduction to Leadership", duration: "15 min", completed: true, current: false, video_url: "https://youtu.be/0iwvEeGU4B0", description: "Learn the fundamentals of effective leadership" },
  { title: "Communication Skills", duration: "22 min", completed: true, video_url: "https://www.youtube.com/watch?v=S0mbgU239ao", description: "Master verbal and non-verbal communication techniques" },
  { title: "Team Management", duration: "18 min", completed: true, video_url: "https://www.youtube.com/watch?v=tqC1WwWKtfE", description: "Build and manage high-performing teams" },
  { title: "Conflict Resolution", duration: "25 min", completed: true, video_url: "https://www.youtube.com/watch?v=GPrsDWYtrPM", description: "Resolve conflicts effectively in workplace settings" },
  { title: "Strategic Planning", duration: "30 min", completed: true, video_url: "https://www.youtube.com/watch?v=6c5kI5rJyBo", description: "Develop strategic thinking and planning skills" },
  { title: "Decision Making", duration: "28 min", completed: true, video_url: "https://www.youtube.com/watch?v=RRk7G5UO-R8", description: "Master critical thinking and decision-making processes" },
  { title: "Emotional Intelligence", duration: "35 min", completed: true, video_url: "https://www.youtube.com/watch?v=HA15YZlF_kM", description: "Develop emotional awareness and interpersonal skills" },
  { title: "Change Management", duration: "32 min", completed: true, video_url: "https://www.youtube.com/watch?v=4EvkGX_lr1A", description: "Lead organizational change and transformation" },
  { title: "Performance Management", duration: "26 min", completed: true, video_url: "https://www.youtube.com/watch?v=BXD8VaO-Dss", description: "Optimize team performance and productivity" },
  { title: "Leadership Ethics", duration: "20 min", completed: true, video_url: "https://www.youtube.com/watch?v=FxrMso4g2yw", description: "Build ethical leadership and moral decision-making" }
];

// QR Code Generator Component
const QRCodeGenerator = ({ value, size = 120 }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrData = encodeURIComponent(value);
        const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${qrData}&format=png&bgcolor=FFFFFF&color=000000&qzone=1&margin=0&ecc=L`;
        setQrCodeDataURL(qrCodeURL);
      } catch (error) {
        setQrCodeDataURL('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNEMUQ1REIiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSI2MCIgeT0iNjUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjcyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+UVIgQ09ERTwvdGV4dD4KPHN2Zz4K');
      }
    };

    if (value) {
      generateQRCode();
    }
  }, [value, size]);

  return (
    <div className="qr-code-container flex flex-col items-center">
      {qrCodeDataURL ? (
        <img 
          src={qrCodeDataURL} 
          alt="QR Code" 
          className="rounded-md"
          style={{ width: size, height: size }}
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNEMUQ1REIiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSI2MCIgeT0iNjUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjcyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+UVIgQ09ERTwvdGV4dD4KPHN2Zz4K';
          }}
        />
      ) : (
        <div 
          className="bg-gray-100 border-2 border-gray-300 flex items-center justify-center rounded"
          style={{ width: size, height: size }}
        >
          <div className="text-xs text-gray-500 text-center">Loading<br/>QR Code</div>
        </div>
      )}
    </div>
  );
};

// Certificate Verification Page Component
const CertificateVerificationPage = ({ certificateData, onClose }) => {
  const data = JSON.parse(certificateData);
  const completedModules = moduleData.filter(module => module.completed);
  const totalDuration = moduleData.reduce((total, module) => {
    const duration = parseInt(module.duration);
    return total + duration;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Certificate Verification</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">GELEP Leadership Training Program</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Certificate Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Certificate Verified ✓</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Student Name</label>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">{data.studentName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Course Completed</label>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">{data.courseName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Date</label>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">{data.completionDate}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Final Score</label>
                <p className="text-2xl font-bold text-green-600">{data.score}%</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Certificate ID</label>
                <p className="text-sm font-mono text-gray-600 dark:text-gray-400 break-all">{data.certificateId}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Study Time</label>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Topics Covered */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Topics Covered in Course</h2>
          </div>
          
          <div className="grid gap-4">
            {moduleData.map((module, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        module.completed 
                          ? 'bg-green-100 dark:bg-green-900' 
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        {module.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">{module.title}</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">({module.duration})</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 ml-9">{module.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {module.completed && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        Completed
                      </span>
                    )}
                    
                    {module.video_url && (
                      <a
                        href={module.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                        title="Watch video"
                      >
                        <Play className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Course Summary */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Course Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{moduleData.length}</div>
                <div className="text-blue-700 dark:text-blue-300">Total Modules</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{completedModules.length}</div>
                <div className="text-blue-700 dark:text-blue-300">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</div>
                <div className="text-blue-700 dark:text-blue-300">Study Time</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{data.score}%</div>
                <div className="text-blue-700 dark:text-blue-300">Final Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          <p>This certificate has been verified as authentic by GELEP Leadership Training Program</p>
          <p className="mt-1">Scan date: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

const LeadershipExam = ({ onClose, courseName = "Leadership Training Online Courses" }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showVerification, setShowVerification] = useState(false);
  
  // User data state
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setUserLoading(true);
        
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        
        if (!token) {
          setUserError('No authentication token found');
          setUserLoading(false);
          return;
        }

        const URL = 'http://localhost:3000/api/v1/users/me';
        const response = await fetch(URL, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch user data');
        }

        const data = await response.json();
        
        if (data.success && data.user) {
          setCurrentUser(data.user);
        } else {
          throw new Error('Invalid response format');
        }

      } catch (error) {
        setUserError(error.message);
        setCurrentUser({ 
          name: 'Student', 
          firstName: 'Student', 
          lastName: '', 
          email: 'student@example.com' 
        });
      } finally {
        setUserLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Timer effect
  useEffect(() => {
    if (examStarted && !examCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [examStarted, examCompleted, timeLeft]);

  const getStudentName = () => {
    if (!currentUser) return 'Loading...';
    if (currentUser.name) return currentUser.name;
    if (currentUser.firstName && currentUser.lastName) {
      return `${currentUser.firstName} ${currentUser.lastName}`;
    }
    if (currentUser.firstName) return currentUser.firstName;
    if (currentUser.fullName) return currentUser.fullName;
    return currentUser.email?.split('@')[0] || 'Student';
  };

  const studentName = getStudentName();

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleSubmitExam = () => {
    let correctAnswers = 0;
    examQuestions.forEach((question, index) => {
      const userAnswer = answers[index];
      const correctAnswer = question.correct;
      if (userAnswer === correctAnswer) {
        correctAnswers++;
      }
    });
    const finalScore = Math.round((correctAnswers / examQuestions.length) * 100);
    setCorrectCount(correctAnswers);
    setScore(finalScore);
    setExamCompleted(true);
    setShowResults(true);
  };

  const handleStartExam = () => {
    setExamStarted(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < examQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const isPassed = score >= 85;

  // Generate certificate data and verification URL
  const generateCertificateData = () => {
    const certificateId = `GELEP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const verificationUrl = `https://gelep.org/verify/${certificateId}`;
    const verificationData = {
      certificateId,
      studentName,
      courseName,
      score,
      completionDate: new Date().toISOString().split('T')[0],
      verificationUrl,
      modules: moduleData.map(module => ({
        title: module.title,
        duration: module.duration,
        completed: module.completed,
        description: module.description
      })),
      totalDuration: moduleData.reduce((total, module) => {
        const duration = parseInt(module.duration);
        return total + duration;
      }, 0),
      issuer: 'GELEP Leadership Training Program',
      type: 'Leadership Certificate'
    };
    return { verificationData, verificationUrl };
  };

  const downloadCertificate = () => {
    const certificateElement = document.getElementById('certificate-content');
    if (certificateElement) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 800;
      canvas.height = 600;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const gradient = ctx.createLinearGradient(0, canvas.height - 150, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(37, 99, 235, 0.1)');
      gradient.addColorStop(1, 'rgba(37, 99, 235, 0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, canvas.height - 150, canvas.width, 150);
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GELEP', canvas.width / 2, 60);
      ctx.font = 'bold 48px Arial';
      ctx.fillText('CERTIFICATE', canvas.width / 2, 130);
      ctx.font = '18px Arial';
      ctx.fillText('OF COMPLETION', canvas.width / 2, 160);
      ctx.font = '16px Arial';
      ctx.fillText('This Certificate is Proudly Awarded to,', canvas.width / 2, 220);
      ctx.font = 'bold 32px Arial';
      ctx.fillText(studentName, canvas.width / 2, 280);
      ctx.font = '16px Arial';
      ctx.fillText('For Successfully Completing the', canvas.width / 2, 320);
      ctx.font = 'bold 20px Arial';
      ctx.fillText(courseName, canvas.width / 2, 360);
      ctx.font = '12px Arial';
      ctx.fillText(`Score: ${score}%`, canvas.width / 2, 400);
      ctx.font = '10px Arial';
      ctx.fillText(`Certificate ID: GELEP-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, canvas.width / 2, 550);
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${studentName}-Leadership-Certificate.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');
    }
  };

  // Enhanced Certificate Component
  const Certificate = () => {
    const { verificationData, verificationUrl } = generateCertificateData();
    return (
      <div>
        <div className="bg-white dark:bg-gray-800 max-w-4xl mx-auto relative overflow-hidden shadow-2xl" id="certificate-content">
          <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24 bg-gradient-to-t from-blue-600 via-blue-400 to-transparent"></div>
          <div className="relative z-10 p-4 sm:p-6 md:p-8 min-h-[350px] sm:min-h-[400px]">
            <div className="text-center mb-4 sm:mb-6">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center mr-2 sm:mr-3 border-2 border-blue-700">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white tracking-wide">GELEP</span>
              </div>
            </div>
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-800 dark:text-white mb-1 sm:mb-2 tracking-wider">CERTIFICATE</h1>
              <h2 className="text-sm sm:text-base md:text-lg font-medium text-gray-700 dark:text-gray-300">OF COMPLETION</h2>
            </div>
            <div className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">This Certificate is Proudly Awarded to,</p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white py-1 sm:py-2 px-2">
                {studentName}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">For Successfully Completing the</p>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-4 px-2">{courseName}</h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Score: {score}%</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center relative z-20 mb-4 sm:mb-6 space-y-4 sm:space-y-0">
              <div className="text-center sm:text-left order-2 sm:order-1">
                <p className="text-xs text-gray-600 dark:text-gray-400">Date: {new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-center order-1 sm:order-2">
                <div className="mb-2 bg-white p-1.5 sm:p-2 rounded-lg border border-gray-200 inline-block">
                  <QRCodeGenerator 
                    value={verificationUrl} 
                    size={80}
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-30 md:h-30"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-bold">(Founder, GELEP)</p>
                </div>
              </div>
            </div>
            <div className="text-center relative z-20 mt-6 sm:mt-8">
              <p className="text-xs text-gray-200 dark:text-gray-400 break-all">
                Certificate ID: {verificationData.certificateId}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 sm:p-6 bg-gray-100 dark:bg-gray-700 mt-4 sm:mt6">
          <button
            onClick={downloadCertificate}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Certificate</span>
          </button>
          <button
            onClick={() => setShowVerification(true)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Verify Online</span>
          </button>
        </div>
      </div>
    );
  };

  // Loading state
  if (userLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading user information...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show verification page
  if (showVerification) {
    const { verificationData } = generateCertificateData();
    return <CertificateVerificationPage certificateData={JSON.stringify(verificationData)} onClose={() => setShowVerification(false)} />;
  }

  // Exam start screen
  if (!examStarted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Leadership Training Exam</h2>
                <p className="text-gray-600 dark:text-gray-300">Test your knowledge from the leadership course modules</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">Exam Instructions</h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                <li>• Total questions: {examQuestions.length}</li>
                <li>• Time limit: 30 minutes</li>
                <li>• Passing score: 85%</li>
                <li>• You can navigate between questions</li>
                <li>• Review your answers before submitting</li>
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Student Information</h3>
              <p className="text-gray-600 dark:text-gray-300">Name: {studentName}</p>
              <p className="text-gray-600 dark:text-gray-300">Course: {courseName}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleStartExam}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Start Exam</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show certificate
  if (showCertificate) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Your Certificate</h2>
              <button onClick={() => setShowCertificate(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <Certificate />
          </div>
        </div>
      </div>
    );
  }

  // Show exam results
  if (showResults) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Exam Results</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                isPassed ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
              }`}>
                {isPassed ? (
                  <Trophy className="w-10 h-10 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                )}
              </div>
              <h3 className={`text-3xl font-bold mb-2 ${
                isPassed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {score}%
              </h3>
              <p className={`text-lg font-semibold mb-4 ${
                isPassed ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
              }`}>
                {isPassed ? 'Congratulations! You Passed!' : 'Sorry, You Need to Retake the Exam'}
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">{correctCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">{examQuestions.length - correctCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Incorrect</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">{examQuestions.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
                </div>
              </div>
            </div>
            {isPassed && (
              <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  🎉 You've earned your certificate!
                </h4>
                <p className="text-green-700 dark:text-green-300 text-sm mb-4">
                  You have successfully completed the Leadership Training course with a passing score.
                </p>
                <button
                  onClick={() => setShowCertificate(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Award className="w-4 h-4" />
                  <span>View Certificate</span>
                </button>
              </div>
            )}
            {!isPassed && (
              <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  Keep Learning!
                </h4>
                <p className="text-red-700 dark:text-red-300 text-sm mb-4">
                  You need at least 85% to pass. Review the course materials and try again.
                </p>
                <button
                  onClick={() => {
                    setExamStarted(false);
                    setExamCompleted(false);
                    setShowResults(false);
                    setCurrentQuestion(0);
                    setAnswers({});
                    setTimeLeft(1800);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Retake Exam
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / examQuestions.length) * 100;
  const currentQ = examQuestions[currentQuestion];

  // Main exam interface
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Leadership Training Exam</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Question {currentQuestion + 1} of {examQuestions.length} • {getAnsweredCount()} answered
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className={`font-mono text-sm ${timeLeft < 300 ? 'text-red-600' : 'text-gray-600 dark:text-gray-300'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        {/* Question */}
        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              {currentQ?.question}
            </h3>
            <div className="space-y-3">
              {currentQ?.options?.map((option, index) => (
                <label
                  key={index}
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    answers[currentQuestion] === index
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={index}
                    checked={answers[currentQuestion] === index}
                    onChange={() => handleAnswerSelect(currentQuestion, index)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion] === index
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300 dark:border-gray-500'
                    }`}>
                      {answers[currentQuestion] === index && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{option}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
        {/* Navigation */}
        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <div className="flex space-x-3">
              {currentQuestion === examQuestions.length - 1 ? (
                <button
                  onClick={handleSubmitExam}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Submit Exam</span>
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getAnsweredCount()} of {examQuestions.length} questions answered
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadershipExam;











// import { Clock, CheckCircle, XCircle, Award, Download, Share2, ChevronRight, ChevronLeft, AlertCircle, Star, Trophy,BookOpen, User, Calendar} from 'lucide-react';
// import {examQuestions} from './examQuestions'
//  // Sample exam questions - replace with your actual questions


// // QR Code Generator Component
// const QRCodeGenerator = ({ value, size = 120 }) => {
//   const [qrCodeDataURL, setQrCodeDataURL] = useState('');

//   useEffect(() => {
//     // Simple QR code generation using a public API
//     const generateQRCode = async () => {
//       try {
//         const qrData = encodeURIComponent(value);
//         const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${qrData}&format=png&bgcolor=FFFFFF&color=000000&qzone=1&margin=0&ecc=L`;
//         setQrCodeDataURL(qrCodeURL);
//       } catch (error) {
//         console.error('Error generating QR code:', error);
//         // Fallback to a simple placeholder
//         setQrCodeDataURL('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNEMUQ1REIiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSI2MCIgeT0iNjUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjcyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+UVIgQ09ERTwvdGV4dD4KPHN2Zz4K');
//       }
//     };

//     if (value) {
//       generateQRCode();
//     }
//   }, [value, size]);

//   return (
//     <div className="qr-code-container flex flex-col items-center">
//       {qrCodeDataURL ? (
//         <img 
//           src={qrCodeDataURL} 
//           alt="QR Code" 
//           className="rounded-md"
//           style={{ width: size, height: size }}
//           onError={(e) => {
//             // Fallback if external API fails
//             e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNEMUQ1REIiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSI2MCIgeT0iNjUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjcyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+UVIgQ09ERTwvdGV4dD4KPHN2Zz4K';
//           }}
//         />
//       ) : (
//         <div 
//           className="bg-gray-100 border-2 border-gray-300 flex items-center justify-center rounded"
//           style={{ width: size, height: size }}
//         >
//           <div className="text-xs text-gray-500 text-center">Loading<br/>QR Code</div>
//         </div>
//       )}
//     </div>
//   );
// };

// const LeadershipExam = ({ onClose, courseName = "Leadership Training Online Courses" }) => {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
//   const [examCompleted, setExamCompleted] = useState(false);
//   const [score, setScore] = useState(0);
//   const [showResults, setShowResults] = useState(false);
//   const [showCertificate, setShowCertificate] = useState(false);
//   const [examStarted, setExamStarted] = useState(false);
//   const [correctCount, setCorrectCount] = useState(0);
  
//   // New state for user data
//   const [currentUser, setCurrentUser] = useState(null);
//   const [userLoading, setUserLoading] = useState(true);
//   const [userError, setUserError] = useState(null);

//   // Fetch current user data
//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         setUserLoading(true);
        
//         // Get token from localStorage or wherever you store it
//         const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        
//         if (!token) {
//           setUserError('No authentication token found');
//           setUserLoading(false);
//           return;
//         }

//         const URL = 'http://localhost:3000/api/v1/users/me';
//         const response = await fetch(URL, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || 'Failed to fetch user data');
//         }

//         const data = await response.json();
        
//         if (data.success && data.user) {
//           setCurrentUser(data.user);
//           console.log('✅ User data fetched successfully:', data.user);
//         } else {
//           throw new Error('Invalid response format');
//         }

//       } catch (error) {
//         console.error('❌ Error fetching current user:', error);
//         setUserError(error.message);
//         // Fallback to default name if API fails
//         setCurrentUser({ 
//           name: 'Student', 
//           firstName: 'Student', 
//           lastName: '', 
//           email: 'student@example.com' 
//         });
//       } finally {
//         setUserLoading(false);
//       }
//     };

//     fetchCurrentUser();
//   }, []);

//   // Get student name from current user data
//   const getStudentName = () => {
//     if (!currentUser) return 'Loading...';
    
//     // Try different name combinations based on your user data structure
//     if (currentUser.name) {
//       return currentUser.name;
//     }
    
//     if (currentUser.firstName && currentUser.lastName) {
//       return `${currentUser.firstName} ${currentUser.lastName}`;
//     }
    
//     if (currentUser.firstName) {
//       return currentUser.firstName;
//     }
    
//     if (currentUser.fullName) {
//       return currentUser.fullName;
//     }
    
//     return currentUser.email?.split('@')[0] || 'Student';
//   };

//   const studentName = getStudentName();

//   // Timer effect
//   useEffect(() => {
//     if (examStarted && !examCompleted && timeLeft > 0) {
//       const timer = setInterval(() => {
//         setTimeLeft(prev => {
//           if (prev <= 1) {
//             handleSubmitExam();
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [examStarted, examCompleted, timeLeft]);

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   };

//   const handleAnswerSelect = (questionIndex, answerIndex) => {
//     console.log(`🎯 Question ${questionIndex + 1}: Selected answer ${answerIndex + 1} (index ${answerIndex})`);
//     console.log(`   Selected option: "${examQuestions[questionIndex].options[answerIndex]}"`);
//     console.log(`   Correct answer index: ${examQuestions[questionIndex].correct}`);
//     console.log(`   Correct option: "${examQuestions[questionIndex].options[examQuestions[questionIndex].correct]}"`);
    
//     setAnswers(prev => {
//       const newAnswers = {
//         ...prev,
//         [questionIndex]: answerIndex
//       };
//       console.log(`   Updated answers:`, newAnswers);
//       return newAnswers;
//     });
//   };

//   const handleSubmitExam = () => {
//     console.log('\n=== 📊 EXAM SUBMISSION ANALYSIS ===');
//     console.log('Total Questions:', examQuestions.length);
//     console.log('All stored answers:', answers);
    
//     let correctAnswers = 0;
    
//     examQuestions.forEach((question, index) => {
//       const userAnswer = answers[index];
//       const correctAnswer = question.correct;
      
//       console.log(`\n📝 Question ${index + 1}: "${question.question}"`);
//       console.log(`   User Answer Index: ${userAnswer} (type: ${typeof userAnswer})`);
//       console.log(`   Correct Answer Index: ${correctAnswer} (type: ${typeof correctAnswer})`);
      
//       if (userAnswer !== undefined) {
//         console.log(`   User Selected: "${question.options[userAnswer]}"`);
//       } else {
//         console.log(`   User Selected: [NO ANSWER]`);
//       }
//       console.log(`   Correct Option: "${question.options[correctAnswer]}"`);
      
//       if (userAnswer === correctAnswer) {
//         correctAnswers++;
//         console.log(`   ✅ CORRECT!`);
//       } else {
//         console.log(`   ❌ WRONG!`);
//       }
//     });
    
//     const finalScore = Math.round((correctAnswers / examQuestions.length) * 100);
    
//     setCorrectCount(correctAnswers);
//     setScore(finalScore);
//     setExamCompleted(true);
//     setShowResults(true);
//   };

//   const handleStartExam = () => {
//     setExamStarted(true);
//   };

//   const nextQuestion = () => {
//     if (currentQuestion < examQuestions.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//     }
//   };

//   const prevQuestion = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(currentQuestion - 1);
//     }
//   };

//   const getAnsweredCount = () => {
//     return Object.keys(answers).length;
//   };

//   const isPassed = score >= 85;

//   // Generate certificate verification URL/data for QR code
//   const generateCertificateData = () => {
//     const certificateId = `MGPRF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//     const verificationData = {
//       certificateId,
//       studentName,
//       courseName,
//       score,
//       completionDate: new Date().toISOString().split('T')[0],
//       verificationUrl: `https://migeprof.org/verify/${certificateId}`
//     };
//     return JSON.stringify(verificationData);
//   };

//   // Download certificate as image
//   const downloadCertificate = () => {
//     const certificateElement = document.getElementById('certificate-content');
//     if (certificateElement) {
//       // Create a canvas to render the certificate
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
      
//       // Set canvas size
//       canvas.width = 800;
//       canvas.height = 600;
      
//       // Create a simple certificate design
//       ctx.fillStyle = '#ffffff';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
      
//       // Add blue gradient at bottom
//       const gradient = ctx.createLinearGradient(0, canvas.height - 150, 0, canvas.height);
//       gradient.addColorStop(0, 'rgba(37, 99, 235, 0.1)');
//       gradient.addColorStop(1, 'rgba(37, 99, 235, 0.8)');
//       ctx.fillStyle = gradient;
//       ctx.fillRect(0, canvas.height - 150, canvas.width, 150);
      
//       // Add text content
//       ctx.fillStyle = '#1f2937';
//       ctx.font = 'bold 24px Arial';
//       ctx.textAlign = 'center';
//       ctx.fillText('MIGEPROF', canvas.width / 2, 60);
      
//       ctx.font = 'bold 48px Arial';
//       ctx.fillText('CERTIFICATE', canvas.width / 2, 130);
      
//       ctx.font = '18px Arial';
//       ctx.fillText('OF COMPLETION', canvas.width / 2, 160);
      
//       ctx.font = '16px Arial';
//       ctx.fillText('This Certificate is Proudly Awarded to,', canvas.width / 2, 220);
      
//       ctx.font = 'bold 32px Arial';
//       ctx.fillText(studentName, canvas.width / 2, 280);
      
//       ctx.font = '16px Arial';
//       ctx.fillText('For Successfully Completing the', canvas.width / 2, 320);
      
//       ctx.font = 'bold 20px Arial';
//       ctx.fillText(courseName, canvas.width / 2, 360);
      
//       ctx.font = '12px Arial';
//       ctx.fillText(`Score: ${score}%`, canvas.width / 2, 400);
      
//       ctx.font = '10px Arial';
//       ctx.fillText(`Certificate ID: MGPRF-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, canvas.width / 2, 550);
//       // 0783907698
//       // Convert canvas to blob and download
//       canvas.toBlob((blob) => {
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `${studentName}-Leadership-Certificate.png`;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);
//       }, 'image/png');
//     }
//   };

//   // Certificate Component - Clean certificate without buttons

// // Certificate Component - Clean certificate without buttons
// const Certificate = () => {
//   const certificateData = generateCertificateData();
  
//   return (
//     <div>
//       {/* Certificate content only - no buttons inside */}
//       <div className="bg-white dark:bg-gray-800 max-w-4xl mx-auto relative overflow-hidden shadow-2xl" id="certificate-content">
//         {/* Blue gradient background at bottom - reduced height */}
//         <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24 bg-gradient-to-t from-blue-600 via-blue-400 to-transparent"></div>
        
//         {/* Certificate content - responsive padding and spacing */}
//         <div className="relative z-10 p-4 sm:p-6 md:p-8 min-h-[350px] sm:min-h-[400px]">
//           {/* Header with MIGEPROF logo - responsive sizing */}
//           <div className="text-center mb-4 sm:mb-6">
//             <div className="flex items-center justify-center mb-3 sm:mb-4">
//               <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center mr-2 sm:mr-3 border-2 border-blue-700">
//                 <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
//               </div>
//               <span className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white tracking-wide">GELEP</span>
//             </div>
//           </div>
          
//           {/* Certificate title - responsive sizes */}
//           <div className="text-center mb-6 sm:mb-8">
//             <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-800 dark:text-white mb-1 sm:mb-2 tracking-wider">CERTIFICATE</h1>
//             <h2 className="text-sm sm:text-base md:text-lg font-medium text-gray-700 dark:text-gray-300">OF COMPLETION</h2>
//           </div>
          
//           {/* Main content - responsive spacing */}
//           <div className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8">
//             <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">This Certificate is Proudly Awarded to,</p>
            
//             <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white py-1 sm:py-2 px-2">
//               {studentName}
//             </h3>
            
//             <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">For Successfully Completing the</p>
            
//             <h4 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-4 px-2">{courseName}</h4>
            
//             <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Score: {score}%</p>
//           </div>
          
//           {/* QR Code and signature - responsive layout */}
//           <div className="flex flex-col sm:flex-row justify-between items-center relative z-20 mb-4 sm:mb-6 space-y-4 sm:space-y-0">
//             <div className="text-center sm:text-left order-2 sm:order-1">
//               <p className="text-xs text-gray-600 dark:text-gray-400">Date: {new Date().toLocaleDateString()}</p>
//             </div>
            
//             <div className="text-center order-1 sm:order-2">
//               {/* QR Code - responsive sizing */}
//               <div className="mb-2 bg-white p-1.5 sm:p-2 rounded-lg border border-gray-200 inline-block">
//                 <QRCodeGenerator 
//                   value={certificateData} 
//                   size={80} // Smaller for mobile, will be styled responsively
//                   className="w-20 h-20 sm:w-24 sm:h-24 md:w-30 md:h-30"
//                 />
//               </div>
              
//               {/* MIGEPROF signature below QR code */}
//               <div>
//                 <p className="text-xs text-gray-700 dark:text-gray-300 font-bold">(Founder, MIGEPROF)</p>
//               </div>
//             </div>
//           </div>
          
//           {/* Certificate ID at bottom - responsive text */}
//           <div className="text-center relative z-20 mt-6 sm:mt-8">
//             <p className="text-xs text-gray-200 dark:text-gray-400 break-all">
//               Certificate ID: MGPRF-{Date.now().toString().slice(-8)}-{Math.random().toString(36).substr(2, 4).toUpperCase()}
//             </p>
//           </div>
//         </div>
//       </div>
      
//       {/* Action buttons - responsive layout */}
//       <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 sm:p-6 bg-gray-100 dark:bg-gray-700 mt-4 sm:mt-6 rounded-lg max-w-4xl mx-auto">
//         <button 
//           onClick={downloadCertificate}
//           className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-sm sm:text-base"
//         >
//           <Download className="w-4 h-4 sm:w-5 sm:h-5" />
//           <span>Download Certificate</span>
//         </button>
//         <button 
//           onClick={() => window.print()}
//           className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-700 transition-colors shadow-lg text-sm sm:text-base"
//         >
//           <Download className="w-4 h-4 sm:w-5 sm:h-5" />
//           <span>Print Certificate</span>
//         </button>
//         <button 
//           className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg text-sm sm:text-base"
//           onClick={() => {
//             if (navigator.share) {
//               navigator.share({
//                 title: 'Leadership Certificate Achievement',
//                 text: `${studentName} has successfully completed the ${courseName} with a score of ${score}%!`,
//                 url: window.location.href
//               });
//             } else {
//               const shareText = `🎓 I just earned my Leadership Certificate from MIGEPROF! Score: ${score}% 🏆`;
//               navigator.clipboard.writeText(shareText).then(() => {
//                 alert('Achievement text copied to clipboard!');
//               });
//             }
//           }}
//         >
//           <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
//           <span>Share Achievement</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// // Show loading screen while fetching user data
// if (userLoading) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-[9999] p-4">
//       <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 md:p-8 max-w-md w-full">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 dark:text-gray-300">Loading user information...</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Show error screen if user fetch failed
// if (userError && !currentUser) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-[9999] p-4">
//       <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 md:p-8 max-w-md w-full">
//         <div className="text-center">
//           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Authentication Error</h2>
//           <p className="text-gray-600 dark:text-gray-300 mb-4">{userError}</p>
//           <button 
//             onClick={onClose}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Start screen - responsive and dark mode
// if (!examStarted) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-[9999] p-4">
//       <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-screen overflow-auto">
//         <div className="text-center">
//           <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 mx-auto mb-3 sm:mb-4" />
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Leadership Assessment</h2>
          
//           {/* Welcome message with user name */}
//           <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm sm:text-base">
//             Welcome, <span className="font-semibold text-blue-600 dark:text-blue-400">{studentName}</span>!
//           </p>
          
//           <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
//             Complete this comprehensive exam to earn your Leadership Certificate. 
//             You need to score 85% or higher to pass.
//           </p>
          
//           <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
//             <h3 className="font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4 text-sm sm:text-base">Exam Details:</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
//               <div className="flex items-center justify-center sm:justify-start">
//                 <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-600" />
//                 <span>Duration: 30 minutes</span>
//               </div>
//               <div className="flex items-center justify-center sm:justify-start">
//                 <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-600" />
//                 <span>Questions: {examQuestions.length}</span>
//               </div>
//               <div className="flex items-center justify-center sm:justify-start">
//                 <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-600" />
//                 <span>Passing Score: 85%</span>
//               </div>
//               <div className="flex items-center justify-center sm:justify-start">
//                 <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-yellow-600" />
//                 <span>Certificate: Yes</span>
//               </div>
//             </div>
//           </div>
          
//           <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
//             <button 
//               onClick={onClose}
//               className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
//             >
//               Cancel
//             </button>
//             <button 
//               onClick={handleStartExam}
//               className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
//             >
//               Start Exam
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Certificate view - responsive
// if (showCertificate) {
//   return (
//     <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 flex items-center justify-center z-[9999] p-2 sm:p-4 overflow-auto">
//       <div className="w-full max-w-5xl">
//         <div className="mb-3 sm:mb-4 text-center">
//           <button 
//             onClick={() => setShowCertificate(false)}
//             className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
//           >
//             Back
//             </button>
//         </div>
//         <Certificate />
//       </div>
//     </div>
//   );
// }

// // Results screen - responsive
// if (showResults) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-[9999] p-4 overflow-auto">
//       <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-screen overflow-auto">
//         <div className="text-center">
//           {isPassed ? (
//             <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto mb-4" />
//           ) : (
//             <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
//           )}
          
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
//             {isPassed ? 'Congratulations!' : 'Exam Completed'}
//           </h2>
          
//           <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6">
//             {isPassed 
//               ? `Well done, ${studentName}! You've passed the exam.`
//               : `${studentName}, you need 85% or higher to pass.`
//             }
//           </p>
          
//           <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 sm:p-6 mb-6">
//             <div className="grid grid-cols-2 gap-4 text-center">
//               <div>
//                 <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{score}%</div>
//                 <div className="text-sm text-gray-600 dark:text-gray-400">Your Score</div>
//               </div>
//               <div>
//                 <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
//                   {correctCount}/{examQuestions.length}
//                 </div>
//                 <div className="text-sm text-gray-600 dark:text-gray-400">Correct Answers</div>
//               </div>
//             </div>
//           </div>
          
//           {isPassed && (
//             <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
//               <div className="flex items-center justify-center mb-2">
//                 <Star className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
//                 <span className="text-green-800 dark:text-green-200 font-semibold">Certificate Earned!</span>
//               </div>
//               <p className="text-green-700 dark:text-green-300 text-sm">
//                 You've successfully completed the Leadership Training course and earned your certificate.
//               </p>
//             </div>
//           )}
          
//           <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
//             <button 
//               onClick={onClose}
//               className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
//             >
//               Close
//             </button>
            
//             {isPassed && (
//               <button 
//                 onClick={() => setShowCertificate(true)}
//                 className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base flex items-center justify-center space-x-2"
//               >
//                 <Award className="w-4 h-4 sm:w-5 sm:h-5" />
//                 <span>View Certificate</span>
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Main exam interface - responsive and dark mode
// return (
//   <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 flex flex-col z-[9999]">
//     {/* Header */}
//     <div className="bg-white dark:bg-gray-800 shadow-md p-3 sm:p-4">
//       <div className="flex justify-between items-center max-w-6xl mx-auto">
//         <div className="flex items-center space-x-2 sm:space-x-4">
//           <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
//           <div>
//             <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">Leadership Exam</h2>
//             <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{studentName}</p>
//           </div>
//         </div>
        
//         <div className="flex items-center space-x-3 sm:space-x-4">
//           <div className="flex items-center space-x-1 sm:space-x-2 bg-blue-50 dark:bg-blue-900 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
//             <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
//             <span className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300">
//               {formatTime(timeLeft)}
//             </span>
//           </div>
          
//           <button 
//             onClick={onClose}
//             className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm sm:text-base"
//           >
//             ✕
//           </button>
//         </div>
//       </div>
//     </div>

//     {/* Progress bar */}
//     <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">
//           <span>Question {currentQuestion + 1} of {examQuestions.length}</span>
//           <span>{getAnsweredCount()} answered</span>
//         </div>
//         <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
//           <div 
//             className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//             style={{ width: `${((currentQuestion + 1) / examQuestions.length) * 100}%` }}
//           ></div>
//         </div>
//       </div>
//     </div>

//     {/* Question content */}
//     <div className="flex-1 overflow-auto p-4 sm:p-6">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6">
//           <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4 sm:mb-6">
//             {examQuestions[currentQuestion].question}
//           </h3>
          
//           <div className="space-y-3 sm:space-y-4">
//             {examQuestions[currentQuestion].options.map((option, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleAnswerSelect(currentQuestion, index)}
//                 className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-sm sm:text-base ${
//                   answers[currentQuestion] === index
//                     ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400'
//                     : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
//                 }`}
//               >
//                 <div className="flex items-center">
//                   <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 mr-3 sm:mr-4 flex-shrink-0 ${
//                     answers[currentQuestion] === index
//                       ? 'border-blue-500 bg-blue-500'
//                       : 'border-gray-300 dark:border-gray-500'
//                   }`}>
//                     {answers[currentQuestion] === index && (
//                       <div className="w-full h-full rounded-full bg-white scale-50"></div>
//                     )}
//                   </div>
//                   <span className="text-gray-800 dark:text-gray-200">{option}</span>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Navigation footer */}
//     <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4">
//       <div className="max-w-6xl mx-auto flex justify-between items-center">
//         <button
//           onClick={prevQuestion}
//           disabled={currentQuestion === 0}
//           className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
//             currentQuestion === 0
//               ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
//               : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
//           }`}
//         >
//           <ChevronLeft className="w-4 h-4" />
//           <span className="hidden sm:inline">Previous</span>
//         </button>
        
//         <div className="flex space-x-2 sm:space-x-3">
//           {currentQuestion === examQuestions.length - 1 ? (
//             <button
//               onClick={handleSubmitExam}
//               disabled={Object.keys(answers).length === 0}
//               className={`px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base ${
//                 Object.keys(answers).length === 0
//                   ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
//                   : 'bg-green-600 text-white hover:bg-green-700'
//               }`}
//             >
//               Submit Exam
//             </button>
//           ) : (
//             <button
//               onClick={nextQuestion}
//               className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm sm:text-base"
//             >
//               <span className="hidden sm:inline">Next</span>
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   </div>
// );
// };

// export default LeadershipExam;
