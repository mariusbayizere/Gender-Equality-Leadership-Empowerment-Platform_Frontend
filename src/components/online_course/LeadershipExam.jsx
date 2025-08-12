import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle, XCircle, Award, Download, Share2, 
  ChevronRight, ChevronLeft, AlertCircle, Star, Trophy,
  BookOpen, User, Calendar
} from 'lucide-react';
import {examQuestions} from './examQuestions'
 // Sample exam questions - replace with your actual questions


// QR Code Generator Component
const QRCodeGenerator = ({ value, size = 120 }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');

  useEffect(() => {
    // Simple QR code generation using a public API
    const generateQRCode = async () => {
      try {
        const qrData = encodeURIComponent(value);
        const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${qrData}&format=png&bgcolor=FFFFFF&color=000000&qzone=1&margin=0&ecc=L`;
        setQrCodeDataURL(qrCodeURL);
      } catch (error) {
        console.error('Error generating QR code:', error);
        // Fallback to a simple placeholder
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
            // Fallback if external API fails
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

const LeadershipExam = ({ onClose, studentName = "Abijuru Raissa", courseName = "Leadership Training Online Courses" }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    console.log(`🎯 Question ${questionIndex + 1}: Selected answer ${answerIndex + 1} (index ${answerIndex})`);
    console.log(`   Selected option: "${examQuestions[questionIndex].options[answerIndex]}"`);
    console.log(`   Correct answer index: ${examQuestions[questionIndex].correct}`);
    console.log(`   Correct option: "${examQuestions[questionIndex].options[examQuestions[questionIndex].correct]}"`);
    
    setAnswers(prev => {
      const newAnswers = {
        ...prev,
        [questionIndex]: answerIndex
      };
      console.log(`   Updated answers:`, newAnswers);
      return newAnswers;
    });
  };

  const handleSubmitExam = () => {
    console.log('\n=== 📊 EXAM SUBMISSION ANALYSIS ===');
    console.log('Total Questions:', examQuestions.length);
    console.log('All stored answers:', answers);
    
    let correctAnswers = 0;
    
    examQuestions.forEach((question, index) => {
      const userAnswer = answers[index];
      const correctAnswer = question.correct;
      
      console.log(`\n📝 Question ${index + 1}: "${question.question}"`);
      console.log(`   User Answer Index: ${userAnswer} (type: ${typeof userAnswer})`);
      console.log(`   Correct Answer Index: ${correctAnswer} (type: ${typeof correctAnswer})`);
      
      if (userAnswer !== undefined) {
        console.log(`   User Selected: "${question.options[userAnswer]}"`);
      } else {
        console.log(`   User Selected: [NO ANSWER]`);
      }
      console.log(`   Correct Option: "${question.options[correctAnswer]}"`);
      
      if (userAnswer === correctAnswer) {
        correctAnswers++;
        console.log(`   ✅ CORRECT!`);
      } else {
        console.log(`   ❌ WRONG!`);
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

  // Generate certificate verification URL/data for QR code
  const generateCertificateData = () => {
    const certificateId = `MGPRF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const verificationData = {
      certificateId,
      studentName,
      courseName,
      score,
      completionDate: new Date().toISOString().split('T')[0],
      verificationUrl: `https://migeprof.org/verify/${certificateId}`
    };
    return JSON.stringify(verificationData);
  };

  // Download certificate as image
  const downloadCertificate = () => {
    const certificateElement = document.getElementById('certificate-content');
    if (certificateElement) {
      // Create a canvas to render the certificate
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size
      canvas.width = 800;
      canvas.height = 600;
      
      // Create a simple certificate design
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add blue gradient at bottom
      const gradient = ctx.createLinearGradient(0, canvas.height - 150, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(37, 99, 235, 0.1)');
      gradient.addColorStop(1, 'rgba(37, 99, 235, 0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, canvas.height - 150, canvas.width, 150);
      
      // Add text content
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('MIGEPROF', canvas.width / 2, 60);
      
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
      ctx.fillText(`Certificate ID: MGPRF-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, canvas.width / 2, 550);
      
      // Convert canvas to blob and download
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

  // Certificate Component - Clean certificate without buttons

// Certificate Component - Clean certificate without buttons
const Certificate = () => {
  const certificateData = generateCertificateData();
  
  return (
    <div>
      {/* Certificate content only - no buttons inside */}
      <div className="bg-white dark:bg-gray-800 max-w-4xl mx-auto relative overflow-hidden shadow-2xl" id="certificate-content">
        {/* Blue gradient background at bottom - reduced height */}
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24 bg-gradient-to-t from-blue-600 via-blue-400 to-transparent"></div>
        
        {/* Certificate content - responsive padding and spacing */}
        <div className="relative z-10 p-4 sm:p-6 md:p-8 min-h-[350px] sm:min-h-[400px]">
          {/* Header with MIGEPROF logo - responsive sizing */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center mr-2 sm:mr-3 border-2 border-blue-700">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white tracking-wide">GELEP</span>
            </div>
          </div>
          
          {/* Certificate title - responsive sizes */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-800 dark:text-white mb-1 sm:mb-2 tracking-wider">CERTIFICATE</h1>
            <h2 className="text-sm sm:text-base md:text-lg font-medium text-gray-700 dark:text-gray-300">OF COMPLETION</h2>
          </div>
          
          {/* Main content - responsive spacing */}
          <div className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">This Certificate is Proudly Awarded to,</p>
            
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white py-1 sm:py-2 px-2">
              {studentName}
            </h3>
            
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">For Successfully Completing the</p>
            
            <h4 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-4 px-2">{courseName}</h4>
            
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Score: {score}%</p>
          </div>
          
          {/* QR Code and signature - responsive layout */}
          <div className="flex flex-col sm:flex-row justify-between items-center relative z-20 mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left order-2 sm:order-1">
              <p className="text-xs text-gray-600 dark:text-gray-400">Date: {new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="text-center order-1 sm:order-2">
              {/* QR Code - responsive sizing */}
              <div className="mb-2 bg-white p-1.5 sm:p-2 rounded-lg border border-gray-200 inline-block">
                <QRCodeGenerator 
                  value={certificateData} 
                  size={80} // Smaller for mobile, will be styled responsively
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-30 md:h-30"
                />
              </div>
              
              {/* MIGEPROF signature below QR code */}
              <div>
                <p className="text-xs text-gray-700 dark:text-gray-300 font-bold">(Founder, MIGEPROF)</p>
              </div>
            </div>
          </div>
          
          {/* Certificate ID at bottom - responsive text */}
          <div className="text-center relative z-20 mt-6 sm:mt-8">
            <p className="text-xs text-gray-200 dark:text-gray-400 break-all">
              Certificate ID: MGPRF-{Date.now().toString().slice(-8)}-{Math.random().toString(36).substr(2, 4).toUpperCase()}
            </p>
          </div>
        </div>
      </div>
      
      {/* Action buttons - responsive layout */}
      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 sm:p-6 bg-gray-100 dark:bg-gray-700 mt-4 sm:mt-6 rounded-lg max-w-4xl mx-auto">
        <button 
          onClick={downloadCertificate}
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-sm sm:text-base"
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Download Certificate</span>
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-700 transition-colors shadow-lg text-sm sm:text-base"
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Print Certificate</span>
        </button>
        <button 
          className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg text-sm sm:text-base"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Leadership Certificate Achievement',
                text: `${studentName} has successfully completed the ${courseName} with a score of ${score}%!`,
                url: window.location.href
              });
            } else {
              const shareText = `🎓 I just earned my Leadership Certificate from MIGEPROF! Score: ${score}% 🏆`;
              navigator.clipboard.writeText(shareText).then(() => {
                alert('Achievement text copied to clipboard!');
              });
            }
          }}
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Share Achievement</span>
        </button>
      </div>
    </div>
  );
};

// Start screen - responsive and dark mode
if (!examStarted) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-screen overflow-auto">
        <div className="text-center">
          <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 mx-auto mb-3 sm:mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Leadership Assessment</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
            Complete this comprehensive exam to earn your Leadership Certificate. 
            You need to score 85% or higher to pass.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4 text-sm sm:text-base">Exam Details:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center justify-center sm:justify-start">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-600" />
                <span>Duration: 30 minutes</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-600" />
                <span>Questions: {examQuestions.length}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-600" />
                <span>Passing Score: 85%</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start">
                <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-yellow-600" />
                <span>Certificate: Yes</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={onClose}
              className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button 
              onClick={handleStartExam}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Start Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Certificate view - responsive
if (showCertificate) {
  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 flex items-center justify-center z-[9999] p-2 sm:p-4 overflow-auto">
      <div className="w-full max-w-5xl">
        <div className="mb-3 sm:mb-4 text-center">
          <button 
            onClick={() => setShowCertificate(false)}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
          >
            Back to Results
          </button>
        </div>
        <Certificate />
      </div>
    </div>
  );
}

// Results screen - responsive and dark mode
if (showResults) {
  const incorrectCount = examQuestions.length - correctCount;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-screen overflow-auto">
        <div className="text-center mb-4 sm:mb-6">
          {isPassed ? (
            <div>
              <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto mb-3 sm:mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">Congratulations!</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">You have passed the Leadership Assessment!</p>
            </div>
          ) : (
            <div>
              <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-3 sm:mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">Try Again</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">You need 85% to pass. Review the course and retake the exam.</p>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{score}%</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Your Score</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{correctCount}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Correct</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-red-600">{incorrectCount}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Incorrect</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          {isPassed && (
            <button 
              onClick={() => setShowCertificate(true)}
              className="flex items-center justify-center space-x-2 bg-yellow-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-yellow-600 transition-colors text-sm sm:text-base"
            >
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>View Certificate</span>
            </button>
          )}
          <button 
            onClick={onClose}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            {isPassed ? 'Continue' : 'Back to Course'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main exam interface - fully responsive
const currentQ = examQuestions[currentQuestion];

return (
  <div className="fixed inset-0 bg-white dark:bg-gray-900 z-[9999] flex flex-col">
    {/* Header - responsive */}
    <div className="bg-blue-600 text-white p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
      <div className="flex-1">
        <h1 className="text-lg sm:text-xl font-bold">Leadership Assessment</h1>
        <p className="text-blue-100 text-xs sm:text-sm">Question {currentQuestion + 1} of {examQuestions.length}</p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-mono text-base sm:text-lg">{formatTime(timeLeft)}</span>
        </div>
        <div className="text-xs sm:text-sm">
          <span className="font-semibold">{getAnsweredCount()}</span>/{examQuestions.length} answered
        </div>
      </div>
    </div>
    
    {/* Progress bar */}
    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 sm:h-2">
      <div 
        className="bg-blue-600 h-1.5 sm:h-2 transition-all duration-300" 
        style={{ width: `${((currentQuestion + 1) / examQuestions.length) * 100}%` }}
      ></div>
    </div>
    
    {/* Question content - responsive padding and typography */}
    <div className="flex-1 p-4 sm:p-6 md:p-8 max-w-4xl mx-auto w-full overflow-auto">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-4 sm:mb-6 leading-relaxed">
          {currentQ.question}
        </h2>
        
        <div className="space-y-2 sm:space-y-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAnswerSelect(currentQuestion, index);
              }}
              className={`w-full p-3 sm:p-4 text-left rounded-lg border-2 transition-colors ${
                answers[currentQuestion] === index
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800'
              }`}
            >
              <div className="flex items-start sm:items-center">
                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 mr-2 sm:mr-3 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0 ${
                  answers[currentQuestion] === index
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-gray-400 dark:border-gray-500'
                }`}>
                  {answers[currentQuestion] === index && (
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="mr-2 text-gray-500 dark:text-gray-400 text-sm sm:text-base flex-shrink-0">
                  ({String.fromCharCode(65 + index)})
                </span>
                <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                  {option}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
    
    {/* Navigation - responsive */}
    <div className="border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className={`flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto ${
            currentQuestion === 0
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'
          }`}
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Previous</span>
        </button>
        
        <div className="flex space-x-3 sm:space-x-4 w-full sm:w-auto">
          {currentQuestion === examQuestions.length - 1 ? (
            <button
              onClick={handleSubmitExam}
              disabled={getAnsweredCount() < examQuestions.length}
              className={`px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto ${
                getAnsweredCount() < examQuestions.length
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <span className="hidden sm:inline">Submit Exam ({getAnsweredCount()}/{examQuestions.length})</span>
              <span className="sm:hidden">Submit ({getAnsweredCount()}/{examQuestions.length})</span>
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);
}

export default LeadershipExam;