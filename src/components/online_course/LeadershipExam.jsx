// import React, { useState, useEffect } from 'react';
// import { 
//   Clock, CheckCircle, XCircle, Award, Download, Share2, 
//   ChevronRight, ChevronLeft, AlertCircle, Star, Trophy,
//   BookOpen, User, Calendar
// } from 'lucide-react';

// import {examQuestions} from './examQuestions'

// const LeadershipExam = ({ onClose, studentName = "John Doe", courseName = "Complete Leadership Masterclass" }) => {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
//   const [examCompleted, setExamCompleted] = useState(false);
//   const [score, setScore] = useState(0);
//   const [showResults, setShowResults] = useState(false);
//   const [showCertificate, setShowCertificate] = useState(false);
//   const [examStarted, setExamStarted] = useState(false);
//   const [correctCount, setCorrectCount] = useState(0);

  

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
    
//     // Go through each question and check the answer
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
      
//       // Direct comparison (both should be numbers)
//       if (userAnswer === correctAnswer) {
//         correctAnswers++;
//         console.log(`   ✅ CORRECT!`);
//       } else {
//         console.log(`   ❌ WRONG!`);
//       }
//     });
    
//     const finalScore = Math.round((correctAnswers / examQuestions.length) * 100);
    
//     console.log(`\n🎯 FINAL RESULTS:`);
//     console.log(`   Correct Answers: ${correctAnswers}/${examQuestions.length}`);
//     console.log(`   Final Score: ${finalScore}%`);
//     console.log('=====================================\n');
    
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

//   // Certificate Component
//   const Certificate = () => (
//     <div className="bg-white max-w-4xl mx-auto relative overflow-hidden shadow-2xl">
//       {/* Blue gradient background at bottom */}
//       <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-primary to-primary/20"></div>
      
//       {/* Certificate content */}
//       <div className="relative z-10 p-12">
//         {/* Header with logo */}
//         <div className="text-center mb-12">
//           <div className="flex items-center justify-center mb-8">
//             <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3">
//               <Award className="w-6 h-6 text-primary-foreground" />
//             </div>
//             <span className="text-2xl font-bold text-foreground">GELEP</span>
//           </div>
          
//           <h1 className="text-6xl font-black text-foreground mb-4 tracking-wide">CERTIFICATE</h1>
//           <h2 className="text-2xl font-medium text-foreground">OF COMPLETION</h2>
//         </div>
        
//         {/* Main content */}
//         <div className="text-center space-y-8 mb-16">
//           <p className="text-lg text-muted-foreground">This Certificate is Proudly Awarded to,</p>
          
//           <h3 className="text-4xl font-bold text-foreground py-4">
//             {studentName}
//           </h3>
          
//           <p className="text-lg text-muted-foreground">For Successfully Completing the</p>
          
//           <h4 className="text-2xl font-semibold text-foreground">{courseName}</h4>
//         </div>
        
//         {/* QR Code and signature area */}
//         <div className="flex justify-between items-end relative z-20">
//           <div className="flex-1"></div>
          
//           <div className="text-center">
//             {/* QR Code placeholder */}
//             <div className="w-24 h-24 bg-foreground/10 border-2 border-foreground/20 mb-4 mx-auto flex items-center justify-center">
//               <div className="text-xs text-muted-foreground">QR CODE</div>
//             </div>
//             <p className="text-sm text-muted-foreground">(Founder, MIGEPROF)</p>
//           </div>
//         </div>
        
//         {/* Action buttons */}
//         <div className="flex justify-center space-x-4 mt-12 relative z-20">
//           <button 
//             onClick={() => window.print()}
//             className="flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
//           >
//             <Download className="w-5 h-5" />
//             <span>Download Certificate</span>
//           </button>
//           <button 
//             className="flex items-center space-x-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors"
//           >
//             <Share2 className="w-5 h-5" />
//             <span>Share Achievement</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   if (!examStarted) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-card rounded-2xl p-8 max-w-2xl w-full">
//           <div className="text-center">
//             <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
//             <h2 className="text-3xl font-bold text-card-foreground mb-4">Leadership Assessment</h2>
//             <p className="text-muted-foreground mb-6">
//               Complete this comprehensive exam to earn your Leadership Certificate. 
//               You need to score 85% or higher to pass.
//             </p>
            
//             <div className="bg-muted rounded-lg p-6 mb-6">
//               <h3 className="font-semibold text-card-foreground mb-4">Exam Details:</h3>
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div className="flex items-center">
//                   <Clock className="w-4 h-4 mr-2 text-primary" />
//                   <span>Duration: 30 minutes</span>
//                 </div>
//                 <div className="flex items-center">
//                   <BookOpen className="w-4 h-4 mr-2 text-primary" />
//                   <span>Questions: {examQuestions.length}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <CheckCircle className="w-4 h-4 mr-2 text-success" />
//                   <span>Passing Score: 85%</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Award className="w-4 h-4 mr-2 text-warning" />
//                   <span>Certificate: Yes</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex justify-center space-x-4">
//               <button 
//                 onClick={onClose}
//                 className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleStartExam}
//                 className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
//               >
//                 Start Exam
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (showCertificate) {
//     return (
//       <div className="fixed inset-0 bg-muted flex items-center justify-center z-50 p-4 overflow-auto">
//         <div className="w-full max-w-5xl">
//           <div className="mb-4 text-center">
//             <button 
//               onClick={() => setShowCertificate(false)}
//               className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
//             >
//               Back to Results
//             </button>
//           </div>
//           <Certificate />
//         </div>
//       </div>
//     );
//   }

//   if (showResults) {
//     const incorrectCount = examQuestions.length - correctCount;
    
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-card rounded-2xl p-8 max-w-2xl w-full max-h-screen overflow-auto">
//           <div className="text-center mb-6">
//             {isPassed ? (
//               <div>
//                 <Trophy className="w-16 h-16 text-warning mx-auto mb-4" />
//                 <h2 className="text-3xl font-bold text-success mb-2">Congratulations!</h2>
//                 <p className="text-muted-foreground">You have passed the Leadership Assessment!</p>
//               </div>
//             ) : (
//               <div>
//                 <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
//                 <h2 className="text-3xl font-bold text-destructive mb-2">Try Again</h2>
//                 <p className="text-muted-foreground">You need 85% to pass. Review the course and retake the exam.</p>
//               </div>
//             )}
//           </div>
          
//           <div className="bg-muted rounded-lg p-6 mb-6">
//             <div className="grid grid-cols-3 gap-4 text-center">
//               <div>
//                 <p className="text-2xl font-bold text-primary">{score}%</p>
//                 <p className="text-sm text-muted-foreground">Your Score</p>
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-success">{correctCount}</p>
//                 <p className="text-sm text-muted-foreground">Correct</p>
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-destructive">{incorrectCount}</p>
//                 <p className="text-sm text-muted-foreground">Incorrect</p>
//               </div>
//             </div>
//           </div>

//           {/* Debug Information */}
//           <div className="bg-warning/10 border border-warning rounded-lg p-4 mb-6 text-xs">
//             <h4 className="font-semibold mb-2 text-warning-foreground">Debug Info:</h4>
//             <p>Total Questions: {examQuestions.length}</p>
//             <p>Answered Questions: {getAnsweredCount()}</p>
//             <p>Correct Answers: {correctCount}</p>
//             <p>Score Calculation: {correctCount}/{examQuestions.length} = {score}%</p>
//             <p className="mt-2 text-muted-foreground">Check browser console (F12) for detailed answer comparison</p>
//           </div>
          
//           <div className="flex justify-center space-x-4">
//             {isPassed && (
//               <button 
//                 onClick={() => setShowCertificate(true)}
//                 className="flex items-center space-x-2 bg-warning text-warning-foreground px-6 py-3 rounded-lg hover:bg-warning/90 transition-colors"
//               >
//                 <Award className="w-5 h-5" />
//                 <span>View Certificate</span>
//               </button>
//             )}
//             <button 
//               onClick={onClose}
//               className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
//             >
//               {isPassed ? 'Continue' : 'Back to Course'}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const currentQ = examQuestions[currentQuestion];

//   return (
//     <div className="fixed inset-0 bg-background z-50 flex flex-col">
//       {/* Header */}
//       <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
//         <div>
//           <h1 className="text-xl font-bold">Leadership Assessment</h1>
//           <p className="text-primary-foreground/80 text-sm">Question {currentQuestion + 1} of {examQuestions.length}</p>
//         </div>
//         <div className="flex items-center space-x-4">
//           <div className="flex items-center space-x-2">
//             <Clock className="w-5 h-5" />
//             <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
//           </div>
//           <div className="text-sm">
//             <span className="font-semibold">{getAnsweredCount()}</span>/{examQuestions.length} answered
//           </div>
//         </div>
//       </div>
      
//       {/* Progress bar */}
//       <div className="w-full bg-muted h-2">
//         <div 
//           className="bg-primary h-2 transition-all duration-300" 
//           style={{ width: `${((currentQuestion + 1) / examQuestions.length) * 100}%` }}
//         ></div>
//       </div>
      
//       {/* Question content */}
//       <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
//         <div className="mb-8">
//           <h2 className="text-2xl font-semibold text-foreground mb-6">{currentQ.question}</h2>
          
//           <div className="space-y-3">
//             {currentQ.options.map((option, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleAnswerSelect(currentQuestion, index)}
//                 className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
//                   answers[currentQuestion] === index
//                     ? 'border-primary bg-primary/10 text-primary'
//                     : 'border-border hover:border-muted-foreground hover:bg-muted'
//                 }`}
//               >
//                 <div className="flex items-center">
//                   <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
//                     answers[currentQuestion] === index
//                       ? 'border-primary bg-primary'
//                       : 'border-muted-foreground'
//                   }`}>
//                     {answers[currentQuestion] === index && (
//                       <div className="w-3 h-3 bg-primary-foreground rounded-full"></div>
//                     )}
//                   </div>
//                   <span className="mr-2 text-muted-foreground">({String.fromCharCode(65 + index)})</span>
//                   <span>{option}</span>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
      
//       {/* Navigation */}
//       <div className="border-t bg-muted p-6">
//         <div className="max-w-4xl mx-auto flex justify-between items-center">
//           <button
//             onClick={prevQuestion}
//             disabled={currentQuestion === 0}
//             className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
//               currentQuestion === 0
//                 ? 'text-muted-foreground cursor-not-allowed'
//                 : 'text-primary hover:bg-primary/10'
//             }`}
//           >
//             <ChevronLeft className="w-5 h-5" />
//             <span>Previous</span>
//           </button>
          
//           <div className="flex space-x-4">
//             {currentQuestion === examQuestions.length - 1 ? (
//               <button
//                 onClick={handleSubmitExam}
//                 disabled={getAnsweredCount() < examQuestions.length}
//                 className={`px-6 py-2 rounded-lg font-semibold ${
//                   getAnsweredCount() < examQuestions.length
//                     ? 'bg-muted text-muted-foreground cursor-not-allowed'
//                     : 'bg-success text-success-foreground hover:bg-success/90'
//                 }`}
//               >
//                 Submit Exam ({getAnsweredCount()}/{examQuestions.length})
//               </button>
//             ) : (
//               <button
//                 onClick={nextQuestion}
//                 className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
//               >
//                 <span>Next</span>
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeadershipExam;



import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle, XCircle, Award, Download, Share2, 
  ChevronRight, ChevronLeft, AlertCircle, Star, Trophy,
  BookOpen, User, Calendar
} from 'lucide-react';

// Sample exam questions - replace with your actual questions
const examQuestions = [
  {
    question: "What is the most important quality of effective leadership?",
    options: [
      "Having all the answers",
      "Being the smartest person in the room", 
      "Inspiring and motivating others toward a common goal",
      "Making all decisions independently"
    ],
    correct: 2
  },
  {
    question: "Which leadership skill is most crucial for team success?",
    options: [
      "Micromanaging",
      "Delegating",
      "Working alone",
      "Avoiding feedback"
    ],
    correct: 1
  },
  {
    question: "How should a leader handle team conflicts?",
    options: [
      "Ignore them and hope they resolve themselves",
      "Take sides immediately",
      "Address them directly and facilitate resolution",
      "Remove all conflicting team members"
    ],
    correct: 2
  },
  {
    question: "What is emotional intelligence in leadership?",
    options: [
      "Being overly emotional",
      "Understanding and managing emotions effectively",
      "Suppressing all emotions",
      "Only focusing on logic"
    ],
    correct: 1
  },
  {
    question: "Which communication style is most effective for leaders?",
    options: [
      "One-way communication only",
      "Active listening and clear articulation",
      "Speaking loudly to show authority",
      "Avoiding difficult conversations"
    ],
    correct: 1
  }
];

const LeadershipExam = ({ onClose, studentName = "John Doe", courseName = "Complete Leadership Masterclass" }) => {
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
    // Prevent double execution
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
    
    // Go through each question and check the answer
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
      
      // Direct comparison (both should be numbers)
      if (userAnswer === correctAnswer) {
        correctAnswers++;
        console.log(`   ✅ CORRECT!`);
      } else {
        console.log(`   ❌ WRONG!`);
      }
    });
    
    const finalScore = Math.round((correctAnswers / examQuestions.length) * 100);
    
    console.log(`\n🎯 FINAL RESULTS:`);
    console.log(`   Correct Answers: ${correctAnswers}/${examQuestions.length}`);
    console.log(`   Final Score: ${finalScore}%`);
    console.log('=====================================\n');
    
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

  // Certificate Component
  const Certificate = () => (
    <div className="bg-white max-w-4xl mx-auto relative overflow-hidden shadow-2xl rounded-lg">
      {/* Blue gradient background at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-blue-600 to-blue-200"></div>
      
      {/* Certificate content */}
      <div className="relative z-10 p-12">
        {/* Header with logo */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">GELEP</span>
          </div>
          
          <h1 className="text-6xl font-black text-gray-800 mb-4 tracking-wide">CERTIFICATE</h1>
          <h2 className="text-2xl font-medium text-gray-800">OF COMPLETION</h2>
        </div>
        
        {/* Main content */}
        <div className="text-center space-y-8 mb-16">
          <p className="text-lg text-gray-600">This Certificate is Proudly Awarded to,</p>
          
          <h3 className="text-4xl font-bold text-gray-800 py-4">
            {studentName}
          </h3>
          
          <p className="text-lg text-gray-600">For Successfully Completing the</p>
          
          <h4 className="text-2xl font-semibold text-gray-800">{courseName}</h4>
        </div>
        
        {/* QR Code and signature area */}
        <div className="flex justify-between items-end relative z-20">
          <div className="flex-1"></div>
          
          <div className="text-center">
            {/* QR Code placeholder */}
            <div className="w-24 h-24 bg-gray-100 border-2 border-gray-300 mb-4 mx-auto flex items-center justify-center">
              <div className="text-xs text-gray-500">QR CODE</div>
            </div>
            <p className="text-sm text-gray-600">(Founder, MIGEPROF)</p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-center space-x-4 mt-12 relative z-20">
          <button 
            onClick={() => window.print()}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Download Certificate</span>
          </button>
          <button 
            className="flex items-center space-x-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span>Share Achievement</span>
          </button>
        </div>
      </div>
    </div>
  );

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

          {/* Debug Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-xs">
            <h4 className="font-semibold mb-2 text-yellow-800">Debug Info:</h4>
            <p>Total Questions: {examQuestions.length}</p>
            <p>Answered Questions: {getAnsweredCount()}</p>
            <p>Correct Answers: {correctCount}</p>
            <p>Score Calculation: {correctCount}/{examQuestions.length} = {score}%</p>
            <p className="mt-2 text-gray-600">Check browser console (F12) for detailed answer comparison</p>
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