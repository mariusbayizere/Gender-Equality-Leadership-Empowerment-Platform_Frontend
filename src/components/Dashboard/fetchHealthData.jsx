

  export const stats = [
    { 
      title: 'Total Users', 
      value: loading ? 'Loading...' : (userCount || 0).toLocaleString(), 
      change: '+12%', 
      icon: Users,
      color: 'bg-white',
      iconColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      trend: 'up'
    },
    { 
      title: 'Active Events', 
      value: loading ? 'Loading...' : (eventCount || 0).toLocaleString(), 
      change: '+8%', 
      icon: Calendar, 
      color: 'bg-white',
      iconColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      trend: 'up'
    },
    { 
      title: 'Mentorship Pairs', 
      value: loading ? 'Loading...' : (mentorshipCount || 0).toLocaleString(), 
      change: '+23%', 
      icon: UserCheck, 
      color: 'bg-white',
      iconColor: 'bg-gradient-to-br from-violet-500 to-violet-600',
      trend: 'up'
    },
    { 
      title: 'Forum Posts', 
      value: loading ? 'Loading...' : (forumCount || 0).toLocaleString(), 
      change: '+15%', 
      icon: MessageSquare, 
      color: 'bg-white',
      iconColor: 'bg-gradient-to-br from-amber-500 to-amber-600',
      trend: 'up'
    },
  ];

  export const quickActions = [
    { title: 'Add New User', icon: UserPlus, color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
    { title: 'Create Event', icon: CalendarPlus, color: 'bg-green-50 hover:bg-green-100 text-green-700' },
    { title: 'View Reports', icon: FileText, color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
    { title: 'Monitor Progress', icon: Target, color: 'bg-red-50 hover:bg-red-100 text-red-700' },
  ];



    export const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return activityTime.toLocaleDateString();
  };
