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

const LeadershipExam = ({ onClose, studentName = "Bayizere Marius", courseName = "Leadership Training Online Courses" }) => {
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
  const Certificate = () => {
    const certificateData = generateCertificateData();
    
    return (
      <div>
        {/* Certificate content only - no buttons inside */}
        <div className="bg-white max-w-4xl mx-auto relative overflow-hidden shadow-2xl" id="certificate-content">
          {/* Blue gradient background at bottom - reduced height */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-600 via-blue-400 to-transparent"></div>
          
          {/* Certificate content - reduced padding and spacing */}
          <div className="relative z-10 p-8 min-h-[400px]">
            {/* Header with MIGEPROF logo - reduced margin */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3 border-2 border-blue-700">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800 tracking-wide">GELEP</span>
              </div>
            </div>
            
            {/* Certificate title - reduced size and margin */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-black text-gray-800 mb-2 tracking-wider">CERTIFICATE</h1>
              <h2 className="text-lg font-medium text-gray-700">OF COMPLETION</h2>
            </div>
            
            {/* Main content - reduced spacing */}
            <div className="text-center space-y-4 mb-8">
              <p className="text-base text-gray-600">This Certificate is Proudly Awarded to,</p>
              
              <h3 className="text-3xl font-bold text-gray-800 py-2">
                {studentName}
              </h3>
              
              <p className="text-base text-gray-600">For Successfully Completing the</p>
              
              <h4 className="text-xl font-semibold text-gray-800 mb-4">{courseName}</h4>
              
              <p className="text-sm text-gray-600">Score: {score}%</p>
            </div>
            
            {/* QR Code and signature - moved above gradient in white area */}
            <div className="flex justify-between items-center relative z-20 mb-6">
              <div className="text-left">
                <p className="text-xs text-gray-600">Date: {new Date().toLocaleDateString()}</p>
              </div>
              
              <div className="text-center">
                {/* QR Code - now in white area above gradient */}
                <div className="mb-2 bg-white p-2 rounded-lg border border-gray-200">
                  <QRCodeGenerator 
                    value={certificateData} 
                    size={120}
                  />
                </div>
                
                {/* MIGEPROF signature below QR code */}
                <div>
                  <p className="text-xs text-gray-700 font-bold">(Founder, MIGEPROF)</p>
                </div>
              </div>
            </div>
            
            {/* Certificate ID at bottom - now in gradient area */}
            <div className="text-center relative z-20 mt-8">
              <p className="text-xs text-gray-200">
                Certificate ID: MGPRF-{Date.now().toString().slice(-8)}-{Math.random().toString(36).substr(2, 4).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
        
        {/* Action buttons completely outside and below certificate */}
        <div className="flex justify-center space-x-4 p-6 bg-gray-100 mt-6 rounded-lg max-w-4xl mx-auto">
          <button 
            onClick={downloadCertificate}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Download className="w-5 h-5" />
            <span>Download Certificate</span>
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
          >
            <Download className="w-5 h-5" />
            <span>Print Certificate</span>
          </button>
          <button 
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Leadership Certificate Achievement',
                  text: `${studentName} has successfully completed the ${courseName} with a score of ${score}%!`,
                  url: window.location.href
                });
              } else {
                // Fallback for browsers that don't support Web Share API
                const shareText = `🎓 I just earned my Leadership Certificate from MIGEPROF! Score: ${score}% 🏆`;
                navigator.clipboard.writeText(shareText).then(() => {
                  alert('Achievement text copied to clipboard!');
                });
              }
            }}
          >
            <Share2 className="w-5 h-5" />
            <span>Share Achievement</span>
          </button>
        </div>
      </div>
    );
  };

  // Start screen
  if (!examStarted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Leadership Assessment</h2>
            <p className="text-gray-600 mb-6">
              Complete this comprehensive exam to earn your Leadership Certificate. 
              You need to score 85% or higher to pass.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Exam Details:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  <span>Duration: 30 minutes</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                  <span>Questions: {examQuestions.length}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  <span>Passing Score: 85%</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-2 text-yellow-600" />
                  <span>Certificate: Yes</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button 
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleStartExam}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Certificate view
  if (showCertificate) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-[9999] p-4 overflow-auto">
        <div className="w-full max-w-5xl">
          <div className="mb-4 text-center">
            <button 
              onClick={() => setShowCertificate(false)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Results
            </button>
          </div>
          <Certificate />
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    const incorrectCount = examQuestions.length - correctCount;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-screen overflow-auto">
          <div className="text-center mb-6">
            {isPassed ? (
              <div>
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-green-600 mb-2">Congratulations!</h2>
                <p className="text-gray-600">You have passed the Leadership Assessment!</p>
              </div>
            ) : (
              <div>
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-red-600 mb-2">Try Again</h2>
                <p className="text-gray-600">You need 85% to pass. Review the course and retake the exam.</p>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{score}%</p>
                <p className="text-sm text-gray-600">Your Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{correctCount}</p>
                <p className="text-sm text-gray-600">Correct</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{incorrectCount}</p>
                <p className="text-sm text-gray-600">Incorrect</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            {isPassed && (
              <button 
                onClick={() => setShowCertificate(true)}
                className="flex items-center space-x-2 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <Award className="w-5 h-5" />
                <span>View Certificate</span>
              </button>
            )}
            <button 
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isPassed ? 'Continue' : 'Back to Course'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main exam interface
  const currentQ = examQuestions[currentQuestion];

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Leadership Assessment</h1>
          <p className="text-blue-100 text-sm">Question {currentQuestion + 1} of {examQuestions.length}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold">{getAnsweredCount()}</span>/{examQuestions.length} answered
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-2">
        <div 
          className="bg-blue-600 h-2 transition-all duration-300" 
          style={{ width: `${((currentQuestion + 1) / examQuestions.length) * 100}%` }}
        ></div>
      </div>
      
      {/* Question content */}
      <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{currentQ.question}</h2>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAnswerSelect(currentQuestion, index);
                }}
                className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                  answers[currentQuestion] === index
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                    answers[currentQuestion] === index
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-400'
                  }`}>
                    {answers[currentQuestion] === index && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="mr-2 text-gray-500">({String.fromCharCode(65 + index)})</span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="border-t bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              currentQuestion === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>
          
          <div className="flex space-x-4">
            {currentQuestion === examQuestions.length - 1 ? (
              <button
                onClick={handleSubmitExam}
                disabled={getAnsweredCount() < examQuestions.length}
                className={`px-6 py-2 rounded-lg font-semibold ${
                  getAnsweredCount() < examQuestions.length
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                Submit Exam ({getAnsweredCount()}/{examQuestions.length})
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadershipExam;