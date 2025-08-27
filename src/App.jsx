// import React, { Component, useEffect } from 'react';
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// // Import your proper ThemeProvider
// import { ThemeProvider } from './components/Dashboard/theme-context';
// import GELEPAdminDashboard from "@/components/User/GELEPAdminDashboard";
// import Login from "@/components/Authantication/Login";
// import ModernTrainingCourseManagement from '@/components/TrainingCourse/ModernTrainingCourseManagement.jsx';
// import ModernProgressTrackingManagements from '@/components/Progress_Tracking/progress_trackingManagment.jsx';
// import MentorshipRelationshipsManagement from '@/components/Mentorship/MentorshipRelationshipsManagement.jsx';
// import NetworkConnectionsManagement from '@/components/NetworkConnections/NetworkConnectionsManagement.jsx';
// import ModernForumManagement from '@/components/Forums/ModernForumManagement.jsx';
// import JobOpportunitiesManagement from './components/JobOpportunities/JobOpportunitiesManagement';
// import EventManagement from './components/Events/EventManagement.jsx';
// import SignUp from './components/Authantication/SignUp.jsx';
// import UpdatePassword from './components/Authantication/UpdatePassword.jsx';
// import AdminDashboard from './components/Dashboard/AdminDashboard.jsx';
// import DashboardLayout from './components/Dashboard/DashboardLayout.jsx';
// import DashboardMain from './components/Dashboard/DashboardMain.jsx';
// import ModernCourseModulesManagement from './components/ModernCourseModules/ModernCourseModulesManagement'
// import ModernEnrollmentManagement from './components/Enrollment/ModernEnrollmentManagement'
// import ModernCertificationManagement from './components/Certification/ModernCertificationManagement'
// import LeadershipTrainingDevelopment from './components/online_course/LeadershipTrainingDevelopment'
// import OnlineCourse from './components/online_course/OnlineCourse';
// import LeadershipExam from './components/online_course/LeadershipExam'
// import GELEPMentorshipPlat from './components/GELEPMentorship/GELEPMentorshipPlatform'
// import GELEPPlatform from './components/ProfessionalNetworking/GELEPPlatform'

// import ForumDetail from './components/ProfessionalNetworking/ForumDetail';
// import JobBoard from './components/JobBoardOpportunites/JobBoard'
// import JobApplicationsPage from './components/JobBoardOpportunites/JobApplicationsPage'
// import GELEPDashboard from './components/UserDashboard/GELEPDashboard'
// import { EventsCalendar } from './components/ProfessionalNetworking/EventsCalendar.jsx'
// import UserReportDownloader from './components/Report/UserReportssDashboard';
// import MentorshipProgram from './components/MatchingAlgorithim/MentorshipProgram';
// import { MentorRequests } from './components/MatchingAlgorithim/MentorRequests';
// import  AIChatbot from './components/AI/AIChatbot.jsx';
// import MentorshipDashboard from './components/MatchingAlgorithim/MentorshipDashboard';
// import GELEPLandingPage from './components/Homepage/GELEPLandingPage';
// import { NotFoundPages } from './components/ErrorHandling/NotFoundPage.jsx';
// import {ServerErrorPages} from './components/ErrorHandling/ServerErrorPage.jsx';

// // Dashboard Page Components
// const DashboardUsersPage = () => (
//     <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">User Management</h1>
//         <p>Manage all users in the system</p>
//         {/* You can integrate your existing user management component here */}
//     </div>
// );

// const DashboardEventsPage = () => (
//     <div className="p-6">
//         <EventManagement />
//     </div>
// );

// const DashboardMentorshipPage = () => (
//     <div className="p-6">
//         <MentorshipRelationshipsManagement />
//     </div>
// );

// const DashboardForumPage = () => (
//     <div className="p-6">
//         <ModernForumManagement />
//     </div>
// );

// const DashboardProgressPage = () => (
//     <div className="p-6">
//         <ModernProgressTrackingManagements />
//     </div>
// );

// const DashboardReportsPage = () => (
//     <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>
//         <p>View system reports and analytics</p>
//         {/* Add your reports component here */}
//     </div>
// );

// const DashboardSettingsPage = () => (
//     <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">Settings</h1>
//         <p>System configuration and settings</p>
//         {/* Add your settings component here */}
//     </div>
// );

// // Error Components
// const ServerErrorPage = () => (
//     <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//             <h1 className="text-2xl font-bold text-red-600">Server Error</h1>
//             <p className="mt-2">Something went wrong on our end.</p>
//         </div>
//     </div>
// );

// const NotFoundPage = () => (
//     <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//             <h1 className="text-2xl font-bold">404 - Not Found</h1>
//             <p className="mt-2">The page you're looking for doesn't exist.</p>
//         </div>
//     </div>
// );

// class ErrorBoundary extends Component {
//     constructor(props) {
//         super(props);
//         this.state = { hasError: false, error: null };
//     }

//     static getDerivedStateFromError(error) {
//         return { hasError: true, error };
//     }

//     componentDidCatch(error, errorInfo) {
//         console.error('Error caught by boundary:', error, errorInfo);
        
//         if (this.isServerError(error)) {
//             window.location.href = '/server-error';
//         }
//     }

//     isServerError(error) {
//         return (
//             error?.message?.includes('NetworkError') ||
//             error?.message?.includes('fetch') ||
//             error?.status >= 500 ||
//             error?.code === 'NETWORK_ERROR'
//         );
//     }

//     render() {
//         if (this.state.hasError) {
//             if (this.isServerError(this.state.error)) {
//                 return <ServerErrorPage />;
//             }
//             return <NotFoundPage />;
//         }

//         return this.props.children;
//     }
// }

// // Global error handling setup
// const setupGlobalErrorHandling = () => {
//     window.addEventListener('unhandledrejection', (event) => {
//         console.error('Unhandled promise rejection:', event.reason);
        
//         if (
//             event.reason?.message?.includes('NetworkError') ||
//             event.reason?.message?.includes('fetch') ||
//             event.reason?.status >= 500 ||
//             !navigator.onLine
//         ) {
//             window.location.href = '/server-error';
//         }
//     });

//     // Handle network status changes
//     window.addEventListener('offline', () => {
//         console.log('Network went offline');
//         window.location.href = '/server-error';
//     });

//     // Monitor fetch requests globally
//     const originalFetch = window.fetch;
//     window.fetch = async (...args) => {
//         try {
//             const response = await originalFetch(...args);
            
//             if (response.status >= 500) {
//                 console.error('Server error detected:', response.status);
//                 window.location.href = '/server-error';
//                 return response;
//             }
            
//             return response;
//         } catch (error) {
//             console.error('Fetch error:', error);
            
//             if (
//                 error.message.includes('NetworkError') ||
//                 error.message.includes('fetch') ||
//                 !navigator.onLine
//             ) {
//                 window.location.href = '/server-error';
//             }
            
//             throw error;
//         }
//     };
// };

// function App() {
//     useEffect(() => {
//         setupGlobalErrorHandling();
//     }, []);

//     const router = createBrowserRouter([
//         // Root route - Login page as startup
//         {
//             path: "/",
//             element: <Login />,
//             errorElement: <ServerErrorPage />,
//         },
        
//         // Dashboard Routes with Layout
//         {
//             path: "/dashboard",
//             element: <DashboardLayout />,
//             errorElement: <ServerErrorPage />,
//             children: [
//                 {
//                     index: true,
//                     element: <DashboardMain />,
//                 },
//                 {
//                     path: "users",
//                     element: <GELEPAdminDashboard />,
//                     // element: <DashboardUsersPage />,
//                 },
//                 {
//                     path: "events",
//                     element: <DashboardEventsPage />,
//                 },
//                 {
//                     path: "mentorship",
//                     element: <DashboardMentorshipPage />,
//                 },
//                 {
//                     path: "forum",
//                     element: <DashboardForumPage />,
//                 },
//                 {
//                     path: "progress",
//                     element: <DashboardProgressPage />,
//                 },
//                 {
//                     path: "reports",
//                     element: <UserReportDownloader/>
//                     // element: <DashboardReportsPage />,

//                 },
//                 {
//                     path: "training-courses",
//                     element: <ModernTrainingCourseManagement />,
//                 },
//                 {
//                     path: "job-opportunities",
//                     element: <JobOpportunitiesManagement />,
//                 },
//                 {
//                     path: "testTraining",
//                     element: <OnlineCourse/>

//                 },
//                 {
//                     path: "settings",
//                     element: <DashboardSettingsPage />,
//                 },
//             ],
//         },
        
//         // Standalone Routes (without dashboard layout)
//         {
//             path: "/admin",
//             element: <AdminDashboard />,
//         },
//         {
//             path: "/connections",
//             element: <NetworkConnectionsManagement />,
//         },
//         {
//             path: "/events",
//             element: <EventManagement />,
//         },
//         {
//             path: "/job-opportunities",
//             element: <JobOpportunitiesManagement />,
//         },
//         {
//             path : "/enrollment",
//             element: <ModernEnrollmentManagement/>
//         },
//         {
//             path: "/forums",
//             element: <ModernForumManagement />,
//         },
//         {
//             path: "/mentorship",
//             element: <MentorshipRelationshipsManagement />,
//         },
//         {
//             path: "/about",
//             element: <ModernProgressTrackingManagements />,
//         },
//         // {
//         //     path: "/training-courses",
//         //     element: <ModernTrainingCourseManagement />,
//         // },
//         {
//             path: "/one",
//             element: <MentorshipProgram/>
//         },
        
//         // Authentication Routes
//         {
//             path: "/login",
//             element: <Login />,
//         },
//         {
//             path: "/JobBoard",
//             element: <JobBoard/>
//         },
//         {
//             path: "/testrequest",
//             element: <MentorRequests    />
//         },
//         {
//             path: "/applicationstatus",
//             element: <JobApplicationsPage/>
//         },
//         {
//             path : "/modules",
//             element : <ModernCourseModulesManagement/>
//         },
//         {
//             path: "/signup",
//             element: <SignUp />,
//         },
//         {
//             path: "/certification",
//             element: <ModernCertificationManagement/>
//         },
//         {
//             path: "/update-password",
//             element: <UpdatePassword />,
//         },
//         {
//             path: "/forum/:forumId",
//             element: <ForumDetail />,
//         },
//         {
//             path: "/leadershipTraining",
//             element: <LeadershipTrainingDevelopment/>
//         },
//         {
//             path: "/testTraining",
//             element: <OnlineCourse/>
//         },
//         {
//             path: "/serverErrors",
//             element: <ServerErrorPages/>
//         },
//         {
//             path: "/mentorshiptest",
//             element: <MentorshipDashboard />
//         },
//         {
//             path: '/GELEPMentorship',
//             element: <GELEPMentorshipPlat/>
//         },
//         {
//             path: '/not-found',
//             element: <NotFoundPages/>
//         },
//         {
//             path: "/farmer",
//             element : <GELEPDashboard/>
//         },
//         {
//             path: "/eventsCalendar",
//             element: <EventsCalendar/>
//         },
//         {
//             path: "/GELEPPlatform",
//             element: <GELEPPlatform/>
//         },
//         {
//             path:"/report",
//             element: <UserReportDownloader/>
//         }
//         ,
//         {
//             path : "/exam",
//             element: <LeadershipExam/>
//         },
//         {
//             path: "/ai-chatbot",
//             element: <AIChatbot />
//         },
//         {
//             path: "/home",
//             element: <GELEPLandingPage />,
//         },
//         {
//             path: "/user",
//             element: <GELEPAdminDashboard />,
//         },
        
//         // Error Routes
//         {
//             path: "/server-error",
//             element: <ServerErrorPage />,
//         },
//         {
//             path: "*",
//             element: <NotFoundPage />,
//         }
//     ]);

//     return (
//         <ErrorBoundary>
//             <ThemeProvider 
//                 defaultTheme="light" 
//                 storageKey="gelep-app-theme"
//             >
//                 <RouterProvider router={router} />
//             </ThemeProvider>
//         </ErrorBoundary>
//     );
// }

// export default App;


import React, { Component, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// Import your proper ThemeProvider
import { ThemeProvider } from './components/Dashboard/theme-context';
import GELEPAdminDashboard from "@/components/User/GELEPAdminDashboard";
import Login from "@/components/Authantication/Login";
import ModernTrainingCourseManagement from '@/components/TrainingCourse/ModernTrainingCourseManagement.jsx';
import ModernProgressTrackingManagements from '@/components/Progress_Tracking/progress_trackingManagment.jsx';
import MentorshipRelationshipsManagement from '@/components/Mentorship/MentorshipRelationshipsManagement.jsx';
import NetworkConnectionsManagement from '@/components/NetworkConnections/NetworkConnectionsManagement.jsx';
import ModernForumManagement from '@/components/Forums/ModernForumManagement.jsx';
import JobOpportunitiesManagement from './components/JobOpportunities/JobOpportunitiesManagement';
import EventManagement from './components/Events/EventManagement.jsx';
import SignUp from './components/Authantication/SignUp.jsx';
import UpdatePassword from './components/Authantication/UpdatePassword.jsx';
import AdminDashboard from './components/Dashboard/AdminDashboard.jsx';
import DashboardLayout from './components/Dashboard/DashboardLayout.jsx';
import DashboardMain from './components/Dashboard/DashboardMain.jsx';
import ModernCourseModulesManagement from './components/ModernCourseModules/ModernCourseModulesManagement'
import ModernEnrollmentManagement from './components/Enrollment/ModernEnrollmentManagement'
import ModernCertificationManagement from './components/Certification/ModernCertificationManagement'
import LeadershipTrainingDevelopment from './components/online_course/LeadershipTrainingDevelopment'
import OnlineCourse from './components/online_course/OnlineCourse';
import LeadershipExam from './components/online_course/LeadershipExam'
import GELEPMentorshipPlat from './components/GELEPMentorship/GELEPMentorshipPlatform'
import GELEPPlatform from './components/ProfessionalNetworking/GELEPPlatform'

import ForumDetail from './components/ProfessionalNetworking/ForumDetail';
import JobBoard from './components/JobBoardOpportunites/JobBoard'
import JobApplicationsPage from './components/JobBoardOpportunites/JobApplicationsPage'
import GELEPDashboard from './components/UserDashboard/GELEPDashboard'
import { EventsCalendar } from './components/ProfessionalNetworking/EventsCalendar.jsx'
import UserReportDownloader from './components/Report/UserReportssDashboard';
import MentorshipProgram from './components/MatchingAlgorithim/MentorshipProgram';
import { MentorRequests } from './components/MatchingAlgorithim/MentorRequests';
import  AIChatbot from './components/AI/AIChatbot.jsx';
import MentorshipDashboard from './components/MatchingAlgorithim/MentorshipDashboard';
import GELEPLandingPage from './components/Homepage/GELEPLandingPage';
import { NotFoundPages } from './components/ErrorHandling/NotFoundPage.jsx';

// Safe import with error boundary for ServerErrorPage
let ServerErrorPage = null;
let serverErrorImportFailed = false;

try {
    const serverErrorModule = require('./components/ErrorHandling/ServerErrorPage.jsx');
    ServerErrorPage = serverErrorModule.ServerErrorPage;
} catch (error) {
    console.warn('Failed to import ServerErrorPage, using fallback:', error);
    serverErrorImportFailed = true;
}

// Dashboard Page Components
const DashboardUsersPage = () => (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
        <p>Manage all users in the system</p>
    </div>
);

const DashboardEventsPage = () => (
    <div className="p-6">
        <EventManagement />
    </div>
);

const DashboardMentorshipPage = () => (
    <div className="p-6">
        <MentorshipRelationshipsManagement />
    </div>
);

const DashboardForumPage = () => (
    <div className="p-6">
        <ModernForumManagement />
    </div>
);

const DashboardProgressPage = () => (
    <div className="p-6">
        <ModernProgressTrackingManagements />
    </div>
);

const DashboardReportsPage = () => (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>
        <p>View system reports and analytics</p>
    </div>
);

const DashboardSettingsPage = () => (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p>System configuration and settings</p>
    </div>
);

// Fallback Error Component (only used if import fails)
const FallbackServerErrorPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
                <div className="w-24 h-24 mx-auto mb-6 relative">
                    <div className="w-full h-full bg-gradient-to-b from-gray-600 to-gray-800 rounded-lg shadow-lg">
                        <div className="absolute top-2 left-2 right-2 h-2 bg-red-500 rounded"></div>
                        <div className="absolute top-5 left-2 right-2 h-1 bg-gray-400 rounded"></div>
                        <div className="absolute top-7 left-2 right-2 h-1 bg-gray-400 rounded"></div>
                        <div className="absolute bottom-2 left-2 right-2 h-4 bg-gray-700 rounded"></div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-bold text-red-600 mb-4">500</h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Server Error</h2>
                <p className="text-lg text-gray-600 mb-6">Something went wrong on our end. Please try again.</p>
            </div>

            <div className="space-y-4">
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Try Again
                </button>
                <br />
                <button
                    onClick={() => window.location.href = '/'}
                    className="px-6 py-2 text-blue-600 hover:text-blue-800 underline"
                >
                    Go to Homepage
                </button>
            </div>
        </div>
    </div>
);

const FallbackNotFoundPage = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-600 mb-4">404</h1>
            <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
            <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Go Home
            </button>
        </div>
    </div>
);

// Safe wrapper component for ServerErrorPage
const SafeServerErrorPage = () => {
    if (serverErrorImportFailed || !ServerErrorPage) {
        return <FallbackServerErrorPage />;
    }

    try {
        return <ServerErrorPage />;
    } catch (error) {
        console.error('ServerErrorPage render failed:', error);
        return <FallbackServerErrorPage />;
    }
};

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null,
            isServerError: false
        };
    }

    static getDerivedStateFromError(error) {
        console.error('ErrorBoundary caught error:', error);
        return { 
            hasError: true, 
            error,
            isServerError: ErrorBoundary.isServerError(error)
        };
    }

    static isServerError(error) {
        return (
            error?.message?.includes('NetworkError') ||
            error?.message?.includes('fetch') ||
            error?.message?.includes('ChunkLoadError') ||
            error?.message?.includes('Loading chunk') ||
            error?.status >= 500 ||
            error?.code === 'NETWORK_ERROR' ||
            !navigator.onLine
        );
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.state.isServerError) {
                return <SafeServerErrorPage />;
            }
            return <FallbackNotFoundPage />;
        }

        return this.props.children;
    }
}

// Improved global error handling
const setupGlobalErrorHandling = () => {
    if (window.errorHandlingSetup) {
        return;
    }
    window.errorHandlingSetup = true;

    const handleError = (error, source = 'unknown') => {
        console.error(`Global error from ${source}:`, error);
        
        // Don't redirect if we're already on an error page
        if (window.location.pathname.includes('/server-error') || 
            window.location.pathname.includes('/not-found')) {
            return;
        }

        const isServerError = (
            error?.message?.includes('NetworkError') ||
            error?.message?.includes('fetch') ||
            error?.message?.includes('ChunkLoadError') ||
            error?.message?.includes('Loading chunk') ||
            error?.status >= 500 ||
            !navigator.onLine
        );

        if (isServerError) {
            setTimeout(() => {
                window.location.href = '/server-error';
            }, 100);
        }
    };

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        handleError(event.reason, 'unhandledrejection');
        event.preventDefault();
    });

    // Handle network status changes
    window.addEventListener('offline', () => {
        console.log('Network went offline');
        if (!window.location.pathname.includes('/server-error')) {
            setTimeout(() => {
                window.location.href = '/server-error';
            }, 100);
        }
    });

    // Monitor fetch requests globally
    if (typeof window.originalFetch === 'undefined') {
        window.originalFetch = window.fetch;
        
        window.fetch = async (...args) => {
            try {
                const response = await window.originalFetch(...args);
                
                if (response.status >= 500) {
                    handleError({ status: response.status }, 'fetch');
                }
                
                return response;
            } catch (error) {
                handleError(error, 'fetch');
                throw error;
            }
        };
    }
};

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [hasInitialError, setHasInitialError] = useState(false);

    useEffect(() => {
        try {
            setupGlobalErrorHandling();
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to setup global error handling:', error);
            setHasInitialError(true);
            setIsLoading(false);
        }
    }, []);

    if (hasInitialError) {
        return <SafeServerErrorPage />;
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    const router = createBrowserRouter([
        // Root route - Login page as startup
        {
            path: "/",
            // element: <Login />,
            element: <GELEPLandingPage />,
            errorElement: <SafeServerErrorPage />,
        },
        
        // Dashboard Routes with Layout
        {
            path: "/dashboard",
            element: <DashboardLayout />,
            errorElement: <SafeServerErrorPage />,
            children: [
                {
                    index: true,
                    element: <DashboardMain />,
                },
                {
                    path: "users",
                    element: <GELEPAdminDashboard />,
                },
                {
                    path: "events",
                    element: <DashboardEventsPage />,
                },
                {
                    path: "mentorship",
                    element: <DashboardMentorshipPage />,
                },
                {
                    path: "forum",
                    element: <DashboardForumPage />,
                },
                {
                    path: "progress",
                    element: <DashboardProgressPage />,
                },
                {
                    path: "reports",
                    element: <UserReportDownloader/>
                },
                {
                    path: "training-courses",
                    element: <ModernTrainingCourseManagement />,
                },
                {
                    path: "job-opportunities",
                    element: <JobOpportunitiesManagement />,
                },
                {
                    path: "testTraining",
                    element: <OnlineCourse/>
                },
                {
                    path: "settings",
                    element: <DashboardSettingsPage />,
                },
            ],
        },
        
        // Standalone Routes (without dashboard layout)
        {
            path: "/admin",
            element: <AdminDashboard />,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/connections",
            element: <NetworkConnectionsManagement />,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/events",
            element: <EventManagement />,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/job-opportunities",
            element: <JobOpportunitiesManagement />,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path : "/enrollment",
            element: <ModernEnrollmentManagement/>,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/forums",
            element: <ModernForumManagement />,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/mentorship",
            element: <MentorshipRelationshipsManagement />,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/about",
            element: <ModernProgressTrackingManagements />,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/one",
            element: <MentorshipProgram/>,
            errorElement: <SafeServerErrorPage />,
        },
        
        // Authentication Routes
        {
            path: "/login",
            element: <Login />,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/JobBoard",
            element: <JobBoard/>,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/testrequest",
            element: <MentorRequests />,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/applicationstatus",
            element: <JobApplicationsPage/>,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path : "/modules",
            element : <ModernCourseModulesManagement/>,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/signup",
            element: <SignUp />,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/certification",
            element: <ModernCertificationManagement/>,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/update-password",
            element: <UpdatePassword />,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/forum/:forumId",
            element: <ForumDetail />,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/leadershipTraining",
            element: <LeadershipTrainingDevelopment/>,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/testTraining",
            element: <OnlineCourse/>,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/mentorshiptest",
            element: <MentorshipDashboard />,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: '/GELEPMentorship',
            element: <GELEPMentorshipPlat/>,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: '/not-found',
            element: <NotFoundPages/>,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/farmer",
            element : <GELEPDashboard/>,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/eventsCalendar",
            element: <EventsCalendar/>,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/GELEPPlatform",
            element: <GELEPPlatform/>,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path:"/report",
            element: <UserReportDownloader/>,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path : "/exam",
            element: <LeadershipExam/>,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/ai-chatbot",
            element: <AIChatbot />,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/home",
            element: <GELEPLandingPage />,
            errorElement: <SafeServerErrorPage />,
        },
        {
            path: "/user",
            element: <GELEPAdminDashboard />,
            errorElement: <SafeServerErrorPage />,
        },
        
        // Error Routes - Now safely use the original component
        {
            path: "/server-error",
            element: <SafeServerErrorPage />,
        },
        {
            path: "/serverErrors",
            element: <SafeServerErrorPage />,
        },
        {
            path: "*",
            element: <FallbackNotFoundPage />,
        }
    ]);

    return (
        <ErrorBoundary>
            <ThemeProvider 
                defaultTheme="light" 
                storageKey="gelep-app-theme"
            >
                <RouterProvider router={router} />
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;