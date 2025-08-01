// import React, { Component, useEffect } from 'react';
// import { createBrowserRouter, RouterProvider } from "react-router-dom";

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

// const ThemeProvider = ({ children, storageKey }) => {
//     return <div data-theme={storageKey}>{children}</div>;
// };

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
//                     element: <DashboardReportsPage />,
//                 },
//                 {
//                     path: "settings",
//                     element: <DashboardSettingsPage />,
//                 },
//             ],
//         },
        
//         // Root route - redirect to dashboard
//         {
//             path: "/",
//             element: <GELEPAdminDashboard />,
//             errorElement: <ServerErrorPage />,
//             children: [
//                 {
//                     index: true,
//                     element: <GELEPAdminDashboard />,
//                 },
//                 {
//                     path: "inventory",
//                     element: <div className="p-6"><h1 className="text-2xl font-bold">Inventory Management</h1></div>,
//                 },
//                 {
//                     path: "settings",
//                     element: <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1></div>,
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
//         {
//             path: "/training-courses",
//             element: <ModernTrainingCourseManagement />,
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
//     path: "/forum/:forumId",
//     element: <ForumDetail />,
// },
//         {
//             path: "/leadershipTraining",
//             element: <LeadershipTrainingDevelopment/>
//         },
//                 {
//             path: "/testTraining",
//             element: <OnlineCourse/>
//         },
//         {
//             path: '/GELEPMentorship',
//             element: <GELEPMentorshipPlat/>
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
//                 path: "/GELEPPlatform",
//                 element: <GELEPPlatform/>
//         },

//         {
//             path : "/exam",
//             element: <LeadershipExam/>
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
//             <ThemeProvider storageKey="agroforest-theme">
//                 <RouterProvider router={router} />
//             </ThemeProvider>
//         </ErrorBoundary>
//     );
// }

// export default App;


import React, { Component, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
import MentorshipProgram from './components/User/MentorshipProgram';


// Dashboard Page Components
const DashboardUsersPage = () => (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
        <p>Manage all users in the system</p>
        {/* You can integrate your existing user management component here */}
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
        {/* Add your reports component here */}
    </div>
);

const DashboardSettingsPage = () => (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p>System configuration and settings</p>
        {/* Add your settings component here */}
    </div>
);

// Error Components
const ServerErrorPage = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Server Error</h1>
            <p className="mt-2">Something went wrong on our end.</p>
        </div>
    </div>
);

const NotFoundPage = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
            <h1 className="text-2xl font-bold">404 - Not Found</h1>
            <p className="mt-2">The page you're looking for doesn't exist.</p>
        </div>
    </div>
);

const ThemeProvider = ({ children, storageKey }) => {
    return <div data-theme={storageKey}>{children}</div>;
};

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        
        if (this.isServerError(error)) {
            window.location.href = '/server-error';
        }
    }

    isServerError(error) {
        return (
            error?.message?.includes('NetworkError') ||
            error?.message?.includes('fetch') ||
            error?.status >= 500 ||
            error?.code === 'NETWORK_ERROR'
        );
    }

    render() {
        if (this.state.hasError) {
            if (this.isServerError(this.state.error)) {
                return <ServerErrorPage />;
            }
            return <NotFoundPage />;
        }

        return this.props.children;
    }
}

// Global error handling setup
const setupGlobalErrorHandling = () => {
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        
        if (
            event.reason?.message?.includes('NetworkError') ||
            event.reason?.message?.includes('fetch') ||
            event.reason?.status >= 500 ||
            !navigator.onLine
        ) {
            window.location.href = '/server-error';
        }
    });

    // Handle network status changes
    window.addEventListener('offline', () => {
        console.log('Network went offline');
        window.location.href = '/server-error';
    });

    // Monitor fetch requests globally
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        try {
            const response = await originalFetch(...args);
            
            if (response.status >= 500) {
                console.error('Server error detected:', response.status);
                window.location.href = '/server-error';
                return response;
            }
            
            return response;
        } catch (error) {
            console.error('Fetch error:', error);
            
            if (
                error.message.includes('NetworkError') ||
                error.message.includes('fetch') ||
                !navigator.onLine
            ) {
                window.location.href = '/server-error';
            }
            
            throw error;
        }
    };
};

function App() {
    useEffect(() => {
        setupGlobalErrorHandling();
    }, []);

    const router = createBrowserRouter([
        // Root route - Login page as startup
        {
            path: "/",
            element: <Login />,
            errorElement: <ServerErrorPage />,
        },
        
        // Dashboard Routes with Layout
        {
            path: "/dashboard",
            element: <DashboardLayout />,
            errorElement: <ServerErrorPage />,
            children: [
                {
                    index: true,
                    element: <DashboardMain />,
                },
                {
                    path: "users",
                    element: <GELEPAdminDashboard />,
                    // element: <DashboardUsersPage />,
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
                    // element: <DashboardReportsPage />,

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
        },
        {
            path: "/connections",
            element: <NetworkConnectionsManagement />,
        },
        {
            path: "/events",
            element: <EventManagement />,
        },
        {
            path: "/job-opportunities",
            element: <JobOpportunitiesManagement />,
        },
        {
            path : "/enrollment",
            element: <ModernEnrollmentManagement/>
        },
        {
            path: "/forums",
            element: <ModernForumManagement />,
        },
        {
            path: "/mentorship",
            element: <MentorshipRelationshipsManagement />,
        },
        {
            path: "/about",
            element: <ModernProgressTrackingManagements />,
        },
        {
            path: "/training-courses",
            element: <ModernTrainingCourseManagement />,
        },
        {
            path: "/one",
            element: <MentorshipProgram/>
        },
        
        // Authentication Routes
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/JobBoard",
            element: <JobBoard/>
        },
        {
            path: "/applicationstatus",
            element: <JobApplicationsPage/>
        },
        {
            path : "/modules",
            element : <ModernCourseModulesManagement/>
        },
        {
            path: "/signup",
            element: <SignUp />,
        },
        {
            path: "/certification",
            element: <ModernCertificationManagement/>
        },
        {
            path: "/update-password",
            element: <UpdatePassword />,
        },
        {
            path: "/forum/:forumId",
            element: <ForumDetail />,
        },
        {
            path: "/leadershipTraining",
            element: <LeadershipTrainingDevelopment/>
        },
        {
            path: "/testTraining",
            element: <OnlineCourse/>
        },
        {
            path: '/GELEPMentorship',
            element: <GELEPMentorshipPlat/>
        },
        {
            path: "/farmer",
            element : <GELEPDashboard/>
        },
        {
            path: "/eventsCalendar",
            element: <EventsCalendar/>
        },
        {
            path: "/GELEPPlatform",
            element: <GELEPPlatform/>
        },
        {
            path:"/report",
            element: <UserReportDownloader/>
        }
        ,
        {
            path : "/exam",
            element: <LeadershipExam/>
        },
        {
            path: "/user",
            element: <GELEPAdminDashboard />,
        },
        
        // Error Routes
        {
            path: "/server-error",
            element: <ServerErrorPage />,
        },
        {
            path: "*",
            element: <NotFoundPage />,
        }
    ]);

    return (
        <ErrorBoundary>
            <ThemeProvider storageKey="agroforest-theme">
                <RouterProvider router={router} />
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;