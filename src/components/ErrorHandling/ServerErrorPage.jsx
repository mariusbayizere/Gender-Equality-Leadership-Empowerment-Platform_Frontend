// import React from 'react';

// export const ServerErrorPage = () => {
//     const handleRefresh = () => {
//         window.location.reload();
//     };

//     const handleGoHome = () => {
//         window.location.href = '/';
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
//             <div className="max-w-2xl mx-auto text-center animate-fade-in">
//                 {/* Server Error Illustration */}
//                 <div className="mb-8 animate-slide-up" style={{animationDelay: '0.2s', animationFillMode: 'both'}}>
//                     <div className="w-24 h-24 mx-auto mb-6 relative animate-bounce-gentle">
//                         {/* Server icon */}
//                         <div className="w-full h-full bg-gradient-to-b from-gray-600 to-gray-800 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
//                             <div className="absolute top-2 left-2 right-2 h-2 bg-blue-500 rounded animate-pulse"></div>
//                             <div className="absolute top-5 left-2 right-2 h-1 bg-gray-400 rounded animate-fade-in-delayed" style={{animationDelay: '0.8s'}}></div>
//                             <div className="absolute top-7 left-2 right-2 h-1 bg-gray-400 rounded animate-fade-in-delayed" style={{animationDelay: '1s'}}></div>
//                             <div className="absolute bottom-2 left-2 right-2 h-4 bg-gray-700 rounded animate-fade-in-delayed" style={{animationDelay: '1.2s'}}></div>
//                         </div>
//                         {/* Error indicators */}
//                         <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
//                         <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" style={{animationDelay: '0.7s'}}></div>
//                     </div>
                    
//                     <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-600 mb-4 animate-number-grow" style={{animationDelay: '0.4s', animationFillMode: 'both'}}>
//                         500
//                     </h1>
//                     <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 animate-slide-up" style={{animationDelay: '0.6s', animationFillMode: 'both'}}>
//                         Internal Server Error
//                     </h2>
//                     <p className="text-lg text-gray-600 leading-relaxed animate-slide-up" style={{animationDelay: '0.8s', animationFillMode: 'both'}}>
//                         Something went wrong on our end. Our team has been notified and is working to fix the issue.
//                     </p>
//                 </div>

//                 {/* Primary Action */}
//                 <div className="mb-6 animate-slide-up" style={{animationDelay: '1s', animationFillMode: 'both'}}>
//                     <button
//                         onClick={handleRefresh}
//                         className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 animate-button-appear"
//                     >
//                         Try Again
//                     </button>
//                 </div>

//                 {/* Secondary Suggestions */}
//                 <div className="text-sm text-gray-500 animate-slide-up" style={{animationDelay: '1.2s', animationFillMode: 'both'}}>
//                     <p>You can also try:</p>
//                     <div className="mt-2 space-x-4">
//                         <button 
//                             onClick={handleGoHome}
//                             className="text-blue-600 hover:text-blue-800 underline transition-colors hover:scale-105 transform duration-200"
//                         >
//                             Going to the homepage
//                         </button>
//                         <span>•</span>
//                         <button 
//                             onClick={() => window.location.reload()}
//                             className="text-blue-600 hover:text-blue-800 underline transition-colors hover:scale-105 transform duration-200"
//                         >
//                             Refreshing the page in a few minutes
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <style>{`
//                 @keyframes fadeIn {
//                     from { opacity: 0; }
//                     to { opacity: 1; }
//                 }
                
//                 @keyframes slideUp {
//                     from { 
//                         opacity: 0;
//                         transform: translateY(20px);
//                     }
//                     to { 
//                         opacity: 1;
//                         transform: translateY(0);
//                     }
//                 }
                
//                 @keyframes bounceGentle {
//                     0%, 100% { transform: translateY(0); }
//                     50% { transform: translateY(-5px); }
//                 }
                
//                 @keyframes numberGrow {
//                     from { 
//                         opacity: 0;
//                         transform: scale(0.5);
//                     }
//                     to { 
//                         opacity: 1;
//                         transform: scale(1);
//                     }
//                 }
                
//                 @keyframes buttonAppear {
//                     from { 
//                         opacity: 0;
//                         transform: translateY(10px) scale(0.95);
//                     }
//                     to { 
//                         opacity: 1;
//                         transform: translateY(0) scale(1);
//                     }
//                 }
                
//                 @keyframes fadeInDelayed {
//                     from { opacity: 0; }
//                     to { opacity: 1; }
//                 }
                
//                 .animate-fade-in {
//                     animation: fadeIn 0.8s ease-out;
//                 }
                
//                 .animate-slide-up {
//                     animation: slideUp 0.6s ease-out;
//                 }
                
//                 .animate-bounce-gentle {
//                     animation: bounceGentle 3s ease-in-out infinite;
//                 }
                
//                 .animate-number-grow {
//                     animation: numberGrow 0.8s ease-out;
//                 }
                
//                 .animate-button-appear {
//                     animation: buttonAppear 0.6s ease-out;
//                 }
                
//                 .animate-fade-in-delayed {
//                     animation: fadeInDelayed 0.5s ease-out;
//                 }
//             `}</style>
//         </div>
//     );
// };


import React, { useEffect, useState } from 'react';

export const ServerErrorPage = () => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Ensure the component is fully mounted before showing animations
        const timer = setTimeout(() => {
            setIsReady(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    const handleRefresh = () => {
        try {
            window.location.reload();
        } catch (error) {
            console.error('Failed to reload:', error);
            // Fallback: redirect to home
            window.location.href = '/';
        }
    };

    const handleGoHome = () => {
        try {
            window.location.href = '/';
        } catch (error) {
            console.error('Failed to navigate home:', error);
            // Force reload as fallback
            window.location.reload();
        }
    };

    // Show a simple loading state first to prevent flash issues
    if (!isReady) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
            <div className="max-w-2xl mx-auto text-center animate-fade-in">
                {/* Server Error Illustration */}
                <div className="mb-8 animate-slide-up" style={{animationDelay: '0.2s', animationFillMode: 'both'}}>
                    <div className="w-24 h-24 mx-auto mb-6 relative animate-bounce-gentle">
                        {/* Server icon */}
                        <div className="w-full h-full bg-gradient-to-b from-gray-600 to-gray-800 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <div className="absolute top-2 left-2 right-2 h-2 bg-blue-500 rounded animate-pulse"></div>
                            <div className="absolute top-5 left-2 right-2 h-1 bg-gray-400 rounded animate-fade-in-delayed" style={{animationDelay: '0.8s'}}></div>
                            <div className="absolute top-7 left-2 right-2 h-1 bg-gray-400 rounded animate-fade-in-delayed" style={{animationDelay: '1s'}}></div>
                            <div className="absolute bottom-2 left-2 right-2 h-4 bg-gray-700 rounded animate-fade-in-delayed" style={{animationDelay: '1.2s'}}></div>
                        </div>
                        {/* Error indicators */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" style={{animationDelay: '0.7s'}}></div>
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-600 mb-4 animate-number-grow" style={{animationDelay: '0.4s', animationFillMode: 'both'}}>
                        500
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 animate-slide-up" style={{animationDelay: '0.6s', animationFillMode: 'both'}}>
                        Internal Server Error
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed animate-slide-up" style={{animationDelay: '0.8s', animationFillMode: 'both'}}>
                        Something went wrong on our end. Our team has been notified and is working to fix the issue.
                    </p>
                </div>

                {/* Primary Action */}
                <div className="mb-6 animate-slide-up" style={{animationDelay: '1s', animationFillMode: 'both'}}>
                    <button
                        onClick={handleRefresh}
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 animate-button-appear"
                        type="button"
                    >
                        Try Again
                    </button>
                </div>

                {/* Secondary Suggestions */}
                <div className="text-sm text-gray-500 animate-slide-up" style={{animationDelay: '1.2s', animationFillMode: 'both'}}>
                    <p>You can also try:</p>
                    <div className="mt-2 space-x-4">
                        <button 
                            onClick={handleGoHome}
                            className="text-blue-600 hover:text-blue-800 underline transition-colors hover:scale-105 transform duration-200"
                            type="button"
                        >
                            Going to the homepage
                        </button>
                        <span>•</span>
                        <button 
                            onClick={handleRefresh}
                            className="text-blue-600 hover:text-blue-800 underline transition-colors hover:scale-105 transform duration-200"
                            type="button"
                        >
                            Refreshing the page
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes bounceGentle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                
                @keyframes numberGrow {
                    from { 
                        opacity: 0;
                        transform: scale(0.5);
                    }
                    to { 
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @keyframes buttonAppear {
                    from { 
                        opacity: 0;
                        transform: translateY(10px) scale(0.95);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                @keyframes fadeInDelayed {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out;
                }
                
                .animate-slide-up {
                    animation: slideUp 0.6s ease-out;
                }
                
                .animate-bounce-gentle {
                    animation: bounceGentle 3s ease-in-out infinite;
                }
                
                .animate-number-grow {
                    animation: numberGrow 0.8s ease-out;
                }
                
                .animate-button-appear {
                    animation: buttonAppear 0.6s ease-out;
                }
                
                .animate-fade-in-delayed {
                    animation: fadeInDelayed 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};