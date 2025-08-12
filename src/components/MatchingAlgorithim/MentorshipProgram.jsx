    import React, { useState, useEffect } from 'react';
    import { Users, Video, TrendingUp, Calendar,  MessageCircle,  FileText, Star,UserCheck, Clock, Target, Award, ChevronRight, Plus, Search, Filter, BarChart3, Brain } from 'lucide-react';
    import  { MentorMatching }  from './MentorMatching'

    const MentorshipProgram = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [mentorshipData, setMentorshipData] = useState({
        relationships: [],
        progressTracking: [],
        sessions: [],
        loading: false,
        error: null
    });

    // Mock API functions - replace with actual API calls
    const apiCall = async (endpoint, method = 'GET', data = null) => {
        try {
        const token = localStorage.getItem('authToken');
        const config = {
            method,
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            }
        };
        
        if (data && method !== 'GET') {
            config.body = JSON.stringify(data);
        }
        
        const response = await fetch(`http://localhost:3000/api/v1${endpoint}`, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
        } catch (error) {
        console.error('API call failed:', error);
        throw error;
        }
    };

    // Load initial data
    useEffect(() => {
        loadMentorshipData();
    }, []);

    const loadMentorshipData = async () => {
        setMentorshipData(prev => ({ ...prev, loading: true }));
        try {
        const [relationships, progress] = await Promise.all([
            apiCall('/mentorship'),
            apiCall('/progress_tracking')
        ]);
        
        setMentorshipData(prev => ({
            ...prev,
            relationships: relationships || [],
            progressTracking: progress || [],
            loading: false,
            error: null
        }));
        } catch (error) {
        setMentorshipData(prev => ({
            ...prev,
            loading: false,
            error: error.message
        }));
        }
    };

    // Dashboard Component
    const Dashboard = () => {
        const stats = {
        totalRelationships: mentorshipData.relationships.length,
        activeRelationships: mentorshipData.relationships.filter(r => r.program_status === 'active').length,
        completedSessions: mentorshipData.progressTracking.length,
        averageProgress: mentorshipData.progressTracking.length > 0 
            ? Math.round(mentorshipData.progressTracking.reduce((acc, p) => acc + (p.progress_percentage || 0), 0) / mentorshipData.progressTracking.length)
            : 0
        };

        return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Mentorships</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalRelationships}</p>
                </div>
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                    <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Programs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeRelationships}</p>
                </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completedSessions}</p>
                </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageProgress}%</p>
                </div>
                </div>
            </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Mentorship Activities</h3>
                <div className="space-y-4">
                {mentorshipData.relationships.slice(0, 5).map((relationship, index) => (
                    <div key={relationship.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                        <p className="text-sm font-medium text-gray-900">Mentorship Relationship</p>
                        <p className="text-xs text-gray-500">Status: {relationship.program_status}</p>
                        </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                        relationship.program_status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : relationship.program_status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                        {relationship.program_status}
                    </span>
                    </div>
                ))}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
                <div className="space-y-4">
                {mentorshipData.progressTracking.slice(0, 5).map((progress, index) => (
                    <div key={progress.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                        <p className="text-sm font-medium text-gray-900">Progress Update</p>
                        <p className="text-xs text-gray-500">{progress.feedback?.substring(0, 30)}...</p>
                        </div>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">
                        {progress.progress_percentage}%
                    </span>
                    </div>
                ))}
                </div>
            </div>
            </div>
        </div>
        );
    };

    // Matching Component
    // const MentorMatching = () => {
    //     const [matchingState, setMatchingState] = useState({
    //     loading: false,
    //     matches: [],
    //     showResults: false
    //     });

    //     const handleCreateMatches = async () => {
    //     setMatchingState(prev => ({ ...prev, loading: true }));
    //     try {
    //         const response = await apiCall('/mentorship/match', 'POST');
    //         setMatchingState({
    //         loading: false,
    //         matches: response.matches || [],
    //         showResults: true
    //         });
    //     } catch (error) {
    //         setMatchingState(prev => ({ ...prev, loading: false }));
    //         alert('Failed to create matches: ' + error.message);
    //     }
    //     };

    //     const handleAIMatching = async () => {
    //     setMatchingState(prev => ({ ...prev, loading: true }));
    //     try {
    //         const response = await apiCall('/mentorship/ai-match', 'POST');
    //         setMatchingState({
    //         loading: false,
    //         matches: response.matches || [],
    //         showResults: true
    //         });
    //     } catch (error) {
    //         setMatchingState(prev => ({ ...prev, loading: false }));
    //         alert('Failed to create AI matches: ' + error.message);
    //     }
    //     };

    //     return (
    //     <div className="space-y-6">
    //         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    //         <div className="flex items-center justify-between mb-6">
    //             <div>
    //             <h3 className="text-lg font-semibold text-gray-900">Mentor-Mentee Matching</h3>
    //             <p className="text-gray-600">Create optimal mentor-mentee pairings using advanced algorithms</p>
    //             </div>
    //             <div className="flex space-x-3">
    //             <button
    //                 onClick={handleCreateMatches}
    //                 disabled={matchingState.loading}
    //                 className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
    //             >
    //                 <Users className="w-4 h-4 mr-2" />
    //                 {matchingState.loading ? 'Matching...' : 'Create Matches'}
    //             </button>
    //             <button
    //                 onClick={handleAIMatching}
    //                 disabled={matchingState.loading}
    //                 className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
    //             >
    //                 <Brain className="w-4 h-4 mr-2" />
    //                 {matchingState.loading ? 'AI Matching...' : 'AI Match'}
    //             </button>
    //             </div>
    //         </div>

    //         {matchingState.showResults && (
    //             <div className="space-y-4">
    //             <h4 className="text-md font-medium text-gray-900">Matching Results</h4>
    //             <div className="grid gap-4">
    //                 {matchingState.matches.map((match, index) => (
    //                 <div key={match.id || index} className="p-4 border border-gray-200 rounded-lg">
    //                     <div className="flex items-center justify-between">
    //                     <div className="flex items-center space-x-4">
    //                         <div className="flex items-center space-x-2">
    //                         <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
    //                             <Users className="w-4 h-4 text-blue-600" />
    //                         </div>
    //                         <div>
    //                             <p className="text-sm font-medium text-gray-900">
    //                             {match.mentor || 'Mentor'} ↔ {match.mentee || 'Mentee'}
    //                             </p>
    //                             <p className="text-xs text-gray-500">{match.matching_criteria}</p>
    //                         </div>
    //                         </div>
    //                     </div>
    //                     <div className="flex items-center space-x-2">
    //                         {match.score && (
    //                         <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
    //                             Score: {match.score}
    //                         </span>
    //                         )}
    //                         <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
    //                         {match.status}
    //                         </span>
    //                     </div>
    //                     </div>
    //                 </div>
    //                 ))}
    //             </div>
    //             </div>
    //         )}
    //         </div>

    //         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    //         <h4 className="text-md font-medium text-gray-900 mb-4">Current Mentorship Relationships</h4>
    //         <div className="space-y-3">
    //             {mentorshipData.relationships.map((relationship, index) => (
    //             <div key={relationship.id || index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
    //                 <div className="flex items-center space-x-3">
    //                 <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
    //                     <Users className="w-4 h-4 text-gray-600" />
    //                 </div>
    //                 <div>
    //                     <p className="text-sm font-medium text-gray-900">Mentorship #{index + 1}</p>
    //                     <p className="text-xs text-gray-500">
    //                     Started: {new Date(relationship.start_date).toLocaleDateString()}
    //                     </p>
    //                 </div>
    //                 </div>
    //                 <span className={`px-2 py-1 text-xs rounded-full ${
    //                 relationship.program_status === 'active' 
    //                     ? 'bg-green-100 text-green-800' 
    //                     : relationship.program_status === 'completed'
    //                     ? 'bg-blue-100 text-blue-800'
    //                     : 'bg-gray-100 text-gray-800'
    //                 }`}>
    //                 {relationship.program_status}
    //                 </span>
    //             </div>
    //             ))}
    //         </div>
    //         </div>
    //     </div>
    //     );
    // };

    // Virtual Sessions Component
    const VirtualSessions = () => {
        const [sessionForm, setSessionForm] = useState({
        mentorship_id: '',
        title: '',
        description: '',
        event_date: '',
        session_link: '',
        location: 'Virtual'
        });
        const [loading, setLoading] = useState(false);

        const handleCreateSession = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiCall('/mentorship/sessions', 'POST', sessionForm);
            alert('Session created successfully!');
            setSessionForm({
            mentorship_id: '',
            title: '',
            description: '',
            event_date: '',
            session_link: '',
            location: 'Virtual'
            });
            loadMentorshipData();
        } catch (error) {
            alert('Failed to create session: ' + error.message);
        } finally {
            setLoading(false);
        }
        };

        return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Schedule Virtual Session</h3>
            
            <form onSubmit={handleCreateSession} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mentorship Relationship
                    </label>
                    <select
                    value={sessionForm.mentorship_id}
                    onChange={(e) => setSessionForm(prev => ({ ...prev, mentorship_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    >
                    <option value="">Select Mentorship</option>
                    {mentorshipData.relationships.filter(r => r.program_status === 'active').map((rel, index) => (
                        <option key={rel.id || index} value={rel.id}>
                        Mentorship #{index + 1} - {rel.status}
                        </option>
                    ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Title
                    </label>
                    <input
                    type="text"
                    value={sessionForm.title}
                    onChange={(e) => setSessionForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter session title"
                    required
                    />
                </div>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    value={sessionForm.description}
                    onChange={(e) => setSessionForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Session description and agenda"
                />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Date & Time
                    </label>
                    <input
                    type="datetime-local"
                    value={sessionForm.event_date}
                    onChange={(e) => setSessionForm(prev => ({ ...prev, event_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Link
                    </label>
                    <input
                    type="url"
                    value={sessionForm.session_link}
                    onChange={(e) => setSessionForm(prev => ({ ...prev, session_link: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://meet.google.com/... or YouTube link"
                    />
                </div>
                </div>

                <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                <Calendar className="w-4 h-4 mr-2" />
                {loading ? 'Creating...' : 'Schedule Session'}
                </button>
            </form>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Session Tools</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg text-center">
                <Video className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h5 className="font-medium text-gray-900">Video Calls</h5>
                <p className="text-sm text-gray-600">Host virtual meetings</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg text-center">
                <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h5 className="font-medium text-gray-900">Chat</h5>
                <p className="text-sm text-gray-600">Real-time messaging</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg text-center">
                <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h5 className="font-medium text-gray-900">Document Sharing</h5>
                <p className="text-sm text-gray-600">Share resources</p>
                </div>
            </div>
            </div>
        </div>
        );
    };

    // Progress Tracking Component
    const ProgressTracking = () => {
        const [progressForm, setProgressForm] = useState({
        mentorship_id: '',
        feedback: '',
        session_count: 1,
        goals: '',
        progress_percentage: 0
        });
        const [loading, setLoading] = useState(false);

        const handleTrackProgress = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = {
            ...progressForm,
            goals: progressForm.goals.split(',').map(g => g.trim()).filter(g => g)
            };
            
            await apiCall('/mentorship/progress', 'POST', formData);
            alert('Progress tracked successfully!');
            setProgressForm({
            mentorship_id: '',
            feedback: '',
            session_count: 1,
            goals: '',
            progress_percentage: 0
            });
            loadMentorshipData();
        } catch (error) {
            alert('Failed to track progress: ' + error.message);
        } finally {
            setLoading(false);
        }
        };

        const handleAIFeedback = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = {
            feedback: progressForm.feedback,
            status: 'in_progress',
            progress_percentage: progressForm.progress_percentage,
            completion_date: new Date().toISOString(),
            user_id: 'mentee_id', // This would come from selected mentorship
            training_course_id: progressForm.mentorship_id,
            session_count: progressForm.session_count,
            goals: progressForm.goals.split(',').map(g => g.trim()).filter(g => g)
            };
            
            await apiCall('/mentorship/ai-feedback', 'POST', formData);
            alert('AI-enhanced progress tracked successfully!');
            setProgressForm({
            mentorship_id: '',
            feedback: '',
            session_count: 1,
            goals: '',
            progress_percentage: 0
            });
            loadMentorshipData();
        } catch (error) {
            alert('Failed to create AI feedback: ' + error.message);
        } finally {
            setLoading(false);
        }
        };

        return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Track Mentee Progress</h3>
            
            <form onSubmit={handleTrackProgress} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mentorship Relationship
                    </label>
                    <select
                    value={progressForm.mentorship_id}
                    onChange={(e) => setProgressForm(prev => ({ ...prev, mentorship_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    >
                    <option value="">Select Mentorship</option>
                    {mentorshipData.relationships.filter(r => r.program_status === 'active').map((rel, index) => (
                        <option key={rel.id || index} value={rel.id}>
                        Mentorship #{index + 1} - {rel.status}
                        </option>
                    ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Progress Percentage
                    </label>
                    <input
                    type="number"
                    min="0"
                    max="100"
                    value={progressForm.progress_percentage}
                    onChange={(e) => setProgressForm(prev => ({ ...prev, progress_percentage: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    />
                </div>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback
                </label>
                <textarea
                    value={progressForm.feedback}
                    onChange={(e) => setProgressForm(prev => ({ ...prev, feedback: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Provide detailed feedback on mentee's progress..."
                    required
                />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Count
                    </label>
                    <input
                    type="number"
                    min="1"
                    value={progressForm.session_count}
                    onChange={(e) => setProgressForm(prev => ({ ...prev, session_count: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goals (comma-separated)
                    </label>
                    <input
                    type="text"
                    value={progressForm.goals}
                    onChange={(e) => setProgressForm(prev => ({ ...prev, goals: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Goal 1, Goal 2, Goal 3"
                    required
                    />
                </div>
                </div>

                <div className="flex space-x-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {loading ? 'Tracking...' : 'Track Progress'}
                </button>
                
                <button
                    type="button"
                    onClick={handleAIFeedback}
                    disabled={loading}
                    className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                    <Brain className="w-4 h-4 mr-2" />
                    {loading ? 'Generating...' : 'AI Feedback'}
                </button>
                </div>
            </form>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Progress History</h4>
            <div className="space-y-3">
                {mentorshipData.progressTracking.map((progress, index) => (
                <div key={progress.id || index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">Progress Update #{index + 1}</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">
                        {progress.progress_percentage}%
                    </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{progress.feedback}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Sessions: {progress.session_count}</span>
                    <span>{new Date(progress.completion_date).toLocaleDateString()}</span>
                    </div>
                    {progress.goals && progress.goals.length > 0 && (
                    <div className="mt-2">
                        <span className="text-xs text-gray-500">Goals: </span>
                        <span className="text-xs text-gray-700">{progress.goals.join(', ')}</span>
                    </div>
                    )}
                </div>
                ))}
            </div>
            </div>
        </div>
        );
    };

    // Main render function and navigation
    const renderContent = () => {
        if (mentorshipData.loading) {
        return (
            <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
        }

        if (mentorshipData.error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
                <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
                <div className="mt-2 text-sm text-red-700">
                    <p>{mentorshipData.error}</p>
                </div>
                <div className="mt-4">
                    <button
                    onClick={loadMentorshipData}
                    className="bg-red-100 px-2 py-1 text-red-800 text-sm rounded hover:bg-red-200"
                    >
                    Try again
                    </button>
                </div>
                </div>
            </div>
            </div>
        );
        }

        switch (activeTab) {
        case 'dashboard':
            return <Dashboard />;
        case 'matching':
            return <MentorMatching />;
        case 'sessions':
            return <VirtualSessions />;
        case 'progress':
            return <ProgressTracking />;
        default:
            return <Dashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <Users className="w-8 h-8 text-blue-600" />
                    <h1 className="text-xl font-bold text-gray-900">Mentorship Program</h1>
                </div>
                </div>
                <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Search className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Filter className="w-5 h-5" />
                </button>
                </div>
            </div>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
                {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'matching', label: 'Mentor Matching', icon: Users },
                { id: 'sessions', label: 'Virtual Sessions', icon: Video },
                { id: 'progress', label: 'Progress Tracking', icon: TrendingUp }
                ].map((tab) => {
                const Icon = tab.icon;
                return (
                    <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    </button>
                );
                })}
            </nav>
            </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
        </div>
        </div>
    );
    };

    export default MentorshipProgram;