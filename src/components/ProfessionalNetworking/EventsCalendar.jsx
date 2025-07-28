import React, { useState, useEffect } from 'react';
import { Users, Calendar, MessageSquare, Search, Bell, Plus, Filter, Star, MapPin, Clock, User, Send, Heart, Share2, Eye, MessageCircle } from 'lucide-react';





// Events Calendar Component
export const EventsCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const sampleEvents = [
    {
      id: 1,
      title: 'Women in Tech Leadership Summit',
      date: '2024-08-15',
      time: '09:00',
      location: 'Kigali Convention Centre',
      type: 'conference',
      description: 'Annual summit bringing together female tech leaders across East Africa.',
      attendees: 250,
      isRegistered: false
    },
    {
      id: 2,
      title: 'Entrepreneurship Bootcamp for Women',
      date: '2024-08-20',
      time: '14:00',
      location: 'Impact Hub Kigali',
      type: 'workshop',
      description: 'Intensive 3-day bootcamp on starting and scaling businesses.',
      attendees: 50,
      isRegistered: true
    },
    {
      id: 3,
      title: 'Monthly Networking Mixer',
      date: '2024-08-25',
      time: '18:00',
      location: 'Serena Hotel Kigali',
      type: 'networking',
      description: 'Casual networking event for women professionals.',
      attendees: 100,
      isRegistered: false
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(sampleEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const registerForEvent = async (eventId) => {
    try {
      // API call would go here
      setEvents(prev =>
        prev.map(event =>
          event.id === eventId
            ? { ...event, isRegistered: true, attendees: event.attendees + 1 }
            : event
        )
      );
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  const filteredEvents = events.filter(event =>
    filter === 'all' || event.type === filter
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Events Calendar</h2>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Event
          </button>
        </div>
        
        <div className="flex gap-2">
          {['all', 'conference', 'workshop', 'networking'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                filter === type
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.type === 'conference' ? 'bg-blue-100 text-blue-700' :
                      event.type === 'workshop' ? 'bg-green-100 text-green-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {event.attendees} attendees
                    </span>
                  </div>
                </div>
                
                <div className="ml-4">
                  {event.isRegistered ? (
                    <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg" disabled>
                      Registered
                    </button>
                  ) : (
                    <button
                      onClick={() => registerForEvent(event.id)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Register
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};