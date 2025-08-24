import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, Target, Award, MapPin, Mail, Phone, Menu, X, ArrowUp, Star, BookOpen, Heart, Globe } from 'lucide-react';

export default function GELEPLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const testimonials = [
    {
      name: "Marie Uwimana",
      role: "Entrepreneur, Kigali",
      text: "GELEP transformed my leadership journey. The mentorship and resources provided helped me launch my tech startup and create jobs for other women.",
      rating: 5
    },
    {
      name: "Grace Mukamana",
      role: "Community Leader, Huye",
      text: "Through GELEP's programs, I gained the confidence to run for local leadership. Today, I'm making real change in my community.",
      rating: 5
    },
    {
      name: "Jeanne Ingabire",
      role: "Agricultural Cooperative Leader",
      text: "The platform connected me with other women leaders across Rwanda. Together, we're revolutionizing agriculture in our regions.",
      rating: 5
    }
  ];

  const programs = [
    {
      icon: BookOpen,
      title: "Leadership Development",
      description: "Comprehensive training programs designed to build strong, confident women leaders across all sectors.",
      features: ["Mentorship matching", "Skill workshops", "Leadership certification"]
    },
    {
      icon: Users,
      title: "Network Building",
      description: "Connect with like-minded women leaders and create powerful professional networks nationwide.",
      features: ["Regional meetups", "Online community", "Peer mentoring"]
    },
    {
      icon: Target,
      title: "Career Advancement",
      description: "Strategic support for women seeking leadership positions in government, business, and civil society.",
      features: ["Career coaching", "Interview preparation", "Position placement"]
    },
    {
      icon: Globe,
      title: "Community Impact",
      description: "Drive meaningful change in your community through collaborative projects and initiatives.",
      features: ["Project funding", "Implementation support", "Impact measurement"]
    }
  ];

  const stats = [
    { number: "2,500+", label: "Women Empowered" },
    { number: "30", label: "Districts Reached" },
    { number: "500+", label: "Leaders Developed" },
    { number: "85%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Coat_of_arms_of_Rwanda.svg/200px-Coat_of_arms_of_Rwanda.svg.png" 
                  alt="Rwanda Coat of Arms"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GELEP</h1>
                <p className="text-xs text-gray-600">By Migeprof Rwanda</p>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">About</a>
              <a href="#programs" className="text-gray-700 hover:text-green-600 transition-colors">Programs</a>
              <a href="#impact" className="text-gray-700 hover:text-green-600 transition-colors">Impact</a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">Contact</a>
            </nav>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-2">
              <a href="#about" className="block py-2 text-gray-700 hover:text-green-600">About</a>
              <a href="#programs" className="block py-2 text-gray-700 hover:text-green-600">Programs</a>
              <a href="#impact" className="block py-2 text-gray-700 hover:text-green-600">Impact</a>
              <a href="#contact" className="block py-2 text-gray-700 hover:text-green-600">Contact</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 text-sm font-medium">
                  <MapPin className="w-4 h-4 mr-2" />
                  Proudly Serving Rwanda
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Empowering
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"> Women Leaders</span>
                  <br />Across Rwanda
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  The Gender Equality Leadership Empowerment Platform (GELEP) by Migeprof Rwanda 
                  is transforming lives, building leaders, and creating a more equitable future for all Rwandan women.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg">
                  Join GELEP Today
                  <ChevronRight className="inline w-5 h-5 ml-2" />
                </button>
                <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-green-500 hover:text-green-600 transition-all">
                  Learn More
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-4">
                {stats.slice(0, 3).map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden">
                <img
                    // src="https://upload.wikimedia.org/wikipedia/commons/3/31/President_Paul_Kagame_%28portrait%29.jpg"
                    src="/51048.jpg"
                    alt="President Paul Kagame of Rwanda"
                    className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-lg font-semibold">Rwanda's Future Leaders</h3>
                  <p className="text-sm opacity-90">Building tomorrow, today</p>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About GELEP</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Designed by Migeprof in Rwanda, GELEP is a comprehensive platform dedicated to supporting women 
              across all regions of our beautiful country. We believe that when women lead, communities thrive 
              and nations prosper.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700">
                To empower Rwandan women through leadership development, professional networking, 
                and strategic support systems that enable them to achieve their full potential.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700">
                A Rwanda where gender equality is not just an aspiration but a lived reality, 
                with women leading in every sector and region of our nation.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Impact</h3>
              <p className="text-gray-700">
                Creating lasting change through mentorship, education, and opportunity creation 
                that transforms individual lives and strengthens entire communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Programs</h2>
            <p className="text-lg text-gray-600">
              Comprehensive programs designed to support women at every stage of their leadership journey
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <program.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{program.title}</h3>
                    <p className="text-gray-600 mb-4">{program.description}</p>
                    <ul className="space-y-2">
                      {program.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-700">
                          <ChevronRight className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-12">Success Stories</h2>
          
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl text-white mb-6">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <div className="text-white/90">
                <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                <div className="text-sm">{testimonials[currentTestimonial].role}</div>
              </div>
            </div>
            
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section id="impact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Impact Across Rwanda</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From Kigali to the most remote districts, GELEP is creating waves of positive change 
              and empowering women to lead in their communities.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-medium text-gray-700">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Join the Movement?</h3>
            <p className="text-lg text-gray-600 mb-6">
              Be part of Rwanda's gender equality revolution. Connect with inspiring women, 
              develop your leadership skills, and create the change you want to see.
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg">
              Get Started Today
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Get in Touch</h2>
              <p className="text-lg text-gray-300 mb-8">
                Ready to start your leadership journey? Have questions about our programs? 
                We'd love to hear from you and support your goals.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Email Us</div>
                    <div className="text-gray-300">info@gelep-rwanda.org</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Call Us</div>
                    <div className="text-gray-300">+250 788 123 456</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Visit Us</div>
                    <div className="text-gray-300">Kigali, Rwanda</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Tell us about your leadership goals..."
                  ></textarea>
                </div>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Coat_of_arms_of_Rwanda.svg/200px-Coat_of_arms_of_Rwanda.svg.png" 
                    alt="Rwanda Coat of Arms"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">GELEP</h3>
                  <p className="text-xs text-gray-400">By Migeprof Rwanda</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering women leaders across Rwanda through innovative programs, 
                mentorship, and community building.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#programs" className="hover:text-white transition-colors">Programs</a></li>
                <li><a href="#impact" className="hover:text-white transition-colors">Impact</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
              <p className="text-gray-400 mb-4">
                Follow our journey and stay updated with the latest news and opportunities.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
                  <span className="text-white text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
                  <span className="text-white text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
                  <span className="text-white text-sm font-bold">in</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 GELEP by Migeprof Rwanda. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-4 md:mt-0">
              Proudly serving all regions of Rwanda 🇷🇼
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-50"
        >
          <ArrowUp className="w-6 h-6 mx-auto" />
        </button>
      )}
    </div>
  );
}