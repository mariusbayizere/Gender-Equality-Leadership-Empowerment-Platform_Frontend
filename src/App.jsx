// import React from 'react';
// import ExampleComponent from './components/ExampleComponent';

// const App: React.FC = () => {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1 className="text-3xl font-bold">Gender Equality Leadership Empowerment Platform</h1>
//       </header>
//       <main>
//         <ExampleComponent />
//       </main>
//     </div>
//   );
// };

// export default App;


import React, { Component, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";


// import Layout from "@/routes/layout";
// import Homepage from "@/components/Homepage/Homepage";
// import AboutPage from "@/components/Homepage/AboutPage";
// import ContactPage from "@/components/Homepage/ContactPage";
// import ServicePage from "@/components/Homepage/ServicePage";

import GELEPAdminDashboard from "@/components/User/GELEPAdminDashboard";
import Login from "@/components/Authantication/Login";
import ModernTrainingCourseManagement from '@/components/TrainingCourse/ModernTrainingCourseManagement.jsx';
import ModernProgressTrackingManagements from '@/components/Progress_Tracking/progress_trackingManagment.jsx';
import MentorshipRelationshipsManagement from '@/components/Mentorship/MentorshipRelationshipsManagement.jsx';
import NetworkConnectionsManagement from '@/components/NetworkConnections/NetworkConnectionsManagement.jsx';
import  ModernForumManagement from '@/components/Forums/ModernForumManagement.jsx';

// Temporary Error Components (replace with your actual components)
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

// Simple Theme Provider (replace with your actual theme provider)
const ThemeProvider = ({ children, storageKey }) => {
    return <div data-theme={storageKey}>{children}</div>;
};

// Error Boundary Component
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
    // Handle unhandled promise rejections
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
        {
            path: "/",
            element: <GELEPAdminDashboard />,
            // element: <Layout />,
            errorElement: <ServerErrorPage />,
            children: [
                {
                    index: true,
                    element: <GELEPAdminDashboard />,
                },
                {
                    path: "inventory",
                    element: <div className="p-6"><h1 className="text-2xl font-bold">Inventory Management</h1></div>,
                },
                {
                    path: "settings",
                    element: <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1></div>,
                },
            ],
        },
        // Public Routes
        // {
        //     path: "/home",
        //     element: <Homepage />,
        // },
        {
            path: "/connections",
            element: <NetworkConnectionsManagement />,
        },
        {
            path: "/forums",
            element: <ModernForumManagement />,
        },
        {
            path : "/mentorship",
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
            path: "/login",
            element: <Login />,
        },
        {
            path: "/user",
            element: <GELEPAdminDashboard />,
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