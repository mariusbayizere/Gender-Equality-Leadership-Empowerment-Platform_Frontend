// import React, { useState, useEffect } from 'react';
// import { ChevronRight, Users, Target, Award, MapPin, Mail, Phone, Menu, X, ArrowUp, Star, BookOpen, Heart, Globe } from 'lucide-react';

// export default function GELEPLandingPage() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [showScrollTop, setShowScrollTop] = useState(false);
//   const [currentTestimonial, setCurrentTestimonial] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => {
//       setShowScrollTop(window.scrollY > 300);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const testimonials = [
//     {
//       name: "Marie Uwimana",
//       role: "Entrepreneur, Kigali",
//       text: "GELEP transformed my leadership journey. The mentorship and resources provided helped me launch my tech startup and create jobs for other women.",
//       rating: 5
//     },
//     {
//       name: "Grace Mukamana",
//       role: "Community Leader, Huye",
//       text: "Through GELEP's programs, I gained the confidence to run for local leadership. Today, I'm making real change in my community.",
//       rating: 5
//     },
//     {
//       name: "Jeanne Ingabire",
//       role: "Agricultural Cooperative Leader",
//       text: "The platform connected me with other women leaders across Rwanda. Together, we're revolutionizing agriculture in our regions.",
//       rating: 5
//     }
//   ];

//   const programs = [
//     {
//       icon: BookOpen,
//       title: "Leadership Development",
//       description: "Comprehensive training programs designed to build strong, confident women leaders across all sectors.",
//       features: ["Mentorship matching", "Skill workshops", "Leadership certification"]
//     },
//     {
//       icon: Users,
//       title: "Network Building",
//       description: "Connect with like-minded women leaders and create powerful professional networks nationwide.",
//       features: ["Regional meetups", "Online community", "Peer mentoring"]
//     },
//     {
//       icon: Target,
//       title: "Career Advancement",
//       description: "Strategic support for women seeking leadership positions in government, business, and civil society.",
//       features: ["Career coaching", "Interview preparation", "Position placement"]
//     },
//     {
//       icon: Globe,
//       title: "Community Impact",
//       description: "Drive meaningful change in your community through collaborative projects and initiatives.",
//       features: ["Project funding", "Implementation support", "Impact measurement"]
//     }
//   ];

//   const stats = [
//     { number: "2,500+", label: "Women Empowered" },
//     { number: "30", label: "Districts Reached" },
//     { number: "500+", label: "Leaders Developed" },
//     { number: "85%", label: "Success Rate" }
//   ];

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center space-x-3">
//               <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
//                 <img 
//                   src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Coat_of_arms_of_Rwanda.svg/200px-Coat_of_arms_of_Rwanda.svg.png" 
//                   alt="Rwanda Coat of Arms"
//                   className="w-10 h-10 object-contain"
//                 />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">GELEP</h1>
//                 <p className="text-xs text-gray-600">By Migeprof Rwanda</p>
//               </div>
//             </div>
            
//             <nav className="hidden md:flex space-x-8">
//               <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">About</a>
//               <a href="#programs" className="text-gray-700 hover:text-green-600 transition-colors">Programs</a>
//               <a href="#impact" className="text-gray-700 hover:text-green-600 transition-colors">Impact</a>
//               <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">Contact</a>
//             </nav>

//             <button 
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="md:hidden p-2 rounded-lg hover:bg-gray-100"
//             >
//               {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden bg-white border-t">
//             <div className="px-4 py-2 space-y-2">
//               <a href="#about" className="block py-2 text-gray-700 hover:text-green-600">About</a>
//               <a href="#programs" className="block py-2 text-gray-700 hover:text-green-600">Programs</a>
//               <a href="#impact" className="block py-2 text-gray-700 hover:text-green-600">Impact</a>
//               <a href="#contact" className="block py-2 text-gray-700 hover:text-green-600">Contact</a>
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Hero Section */}
//       <section className="pt-20 pb-16 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div className="space-y-8">
//               <div className="space-y-4">
//                 <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 text-sm font-medium">
//                   <MapPin className="w-4 h-4 mr-2" />
//                   Proudly Serving Rwanda
//                 </div>
//                 <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
//                   Empowering
//                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"> Women Leaders</span>
//                   <br />Across Rwanda
//                 </h1>
//                 <p className="text-xl text-gray-600 leading-relaxed">
//                   The Gender Equality Leadership Empowerment Platform (GELEP) by Migeprof Rwanda 
//                   is transforming lives, building leaders, and creating a more equitable future for all Rwandan women.
//                 </p>
//               </div>
              
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg">
//                   Join GELEP Today
//                   <ChevronRight className="inline w-5 h-5 ml-2" />
//                 </button>
//                 <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-green-500 hover:text-green-600 transition-all">
//                   Learn More
//                 </button>
//               </div>

//               <div className="grid grid-cols-3 gap-6 pt-4">
//                 {stats.slice(0, 3).map((stat, index) => (
//                   <div key={index} className="text-center">
//                     <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
//                     <div className="text-sm text-gray-600">{stat.label}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="relative">
//               <div className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden">
//                 <img
//                     // src="https://upload.wikimedia.org/wikipedia/commons/3/31/President_Paul_Kagame_%28portrait%29.jpg"
//                     src="/51048.jpg"
//                     alt="President Paul Kagame of Rwanda"
//                     className="w-full h-96 object-cover"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
//                 <div className="absolute bottom-6 left-6 text-white">
//                   <h3 className="text-lg font-semibold">Rwanda's Future Leaders</h3>
//                   <p className="text-sm opacity-90">Building tomorrow, today</p>
//                 </div>
//               </div>
//               <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20"></div>
//               <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20"></div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* About Section */}
//       <section id="about" className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center max-w-3xl mx-auto mb-16">
//             <h2 className="text-4xl font-bold text-gray-900 mb-6">About GELEP</h2>
//             <p className="text-lg text-gray-600 leading-relaxed">
//               Designed by Migeprof in Rwanda, GELEP is a comprehensive platform dedicated to supporting women 
//               across all regions of our beautiful country. We believe that when women lead, communities thrive 
//               and nations prosper.
//             </p>
//           </div>

//           <div className="grid lg:grid-cols-3 gap-8">
//             <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl">
//               <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-6">
//                 <Heart className="w-6 h-6 text-white" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h3>
//               <p className="text-gray-700">
//                 To empower Rwandan women through leadership development, professional networking, 
//                 and strategic support systems that enable them to achieve their full potential.
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
//               <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
//                 <Target className="w-6 h-6 text-white" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
//               <p className="text-gray-700">
//                 A Rwanda where gender equality is not just an aspiration but a lived reality, 
//                 with women leading in every sector and region of our nation.
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl">
//               <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
//                 <Award className="w-6 h-6 text-white" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-4">Our Impact</h3>
//               <p className="text-gray-700">
//                 Creating lasting change through mentorship, education, and opportunity creation 
//                 that transforms individual lives and strengthens entire communities.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Programs Section */}
//       <section id="programs" className="py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center max-w-3xl mx-auto mb-16">
//             <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Programs</h2>
//             <p className="text-lg text-gray-600">
//               Comprehensive programs designed to support women at every stage of their leadership journey
//             </p>
//           </div>

//           <div className="grid lg:grid-cols-2 gap-8">
//             {programs.map((program, index) => (
//               <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
//                 <div className="flex items-start space-x-4">
//                   <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
//                     <program.icon className="w-6 h-6 text-white" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-xl font-bold text-gray-900 mb-3">{program.title}</h3>
//                     <p className="text-gray-600 mb-4">{program.description}</p>
//                     <ul className="space-y-2">
//                       {program.features.map((feature, idx) => (
//                         <li key={idx} className="flex items-center text-sm text-gray-700">
//                           <ChevronRight className="w-4 h-4 text-green-500 mr-2" />
//                           {feature}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="py-20 bg-gradient-to-br from-green-600 to-blue-600">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-4xl font-bold text-white mb-12">Success Stories</h2>
          
//           <div className="relative">
//             <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
//               <div className="flex justify-center mb-4">
//                 {[...Array(5)].map((_, i) => (
//                   <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
//                 ))}
//               </div>
//               <blockquote className="text-xl text-white mb-6">
//                 "{testimonials[currentTestimonial].text}"
//               </blockquote>
//               <div className="text-white/90">
//                 <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
//                 <div className="text-sm">{testimonials[currentTestimonial].role}</div>
//               </div>
//             </div>
            
//             <div className="flex justify-center mt-6 space-x-2">
//               {testimonials.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentTestimonial(index)}
//                   className={`w-3 h-3 rounded-full transition-all ${
//                     index === currentTestimonial ? 'bg-white' : 'bg-white/30'
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Impact Stats Section */}
//       <section id="impact" className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Impact Across Rwanda</h2>
//             <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//               From Kigali to the most remote districts, GELEP is creating waves of positive change 
//               and empowering women to lead in their communities.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-4 gap-8 mb-16">
//             {stats.map((stat, index) => (
//               <div key={index} className="text-center">
//                 <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-2">
//                   {stat.number}
//                 </div>
//                 <div className="text-lg font-medium text-gray-700">{stat.label}</div>
//               </div>
//             ))}
//           </div>

//           <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
//             <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Join the Movement?</h3>
//             <p className="text-lg text-gray-600 mb-6">
//               Be part of Rwanda's gender equality revolution. Connect with inspiring women, 
//               develop your leadership skills, and create the change you want to see.
//             </p>
//             <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg">
//               Get Started Today
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section id="contact" className="py-20 bg-gray-900">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-12">
//             <div>
//               <h2 className="text-4xl font-bold text-white mb-6">Get in Touch</h2>
//               <p className="text-lg text-gray-300 mb-8">
//                 Ready to start your leadership journey? Have questions about our programs? 
//                 We'd love to hear from you and support your goals.
//               </p>
              
//               <div className="space-y-6">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
//                     <Mail className="w-6 h-6 text-white" />
//                   </div>
//                   <div>
//                     <div className="text-white font-semibold">Email Us</div>
//                     <div className="text-gray-300">info@gelep-rwanda.org</div>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
//                     <Phone className="w-6 h-6 text-white" />
//                   </div>
//                   <div>
//                     <div className="text-white font-semibold">Call Us</div>
//                     <div className="text-gray-300">+250 788 123 456</div>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
//                     <MapPin className="w-6 h-6 text-white" />
//                   </div>
//                   <div>
//                     <div className="text-white font-semibold">Visit Us</div>
//                     <div className="text-gray-300">Kigali, Rwanda</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8">
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
//                   <input 
//                     type="text" 
//                     className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
//                     placeholder="Your full name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
//                   <input 
//                     type="email" 
//                     className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
//                     placeholder="your.email@example.com"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
//                   <textarea 
//                     rows={4}
//                     className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
//                     placeholder="Tell us about your leadership goals..."
//                   ></textarea>
//                 </div>
//                 <button className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all">
//                   Send Message
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-black py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid md:grid-cols-3 gap-8">
//             <div>
//               <div className="flex items-center space-x-3 mb-4">
//                 <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
//                   <img 
//                     src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Coat_of_arms_of_Rwanda.svg/200px-Coat_of_arms_of_Rwanda.svg.png" 
//                     alt="Rwanda Coat of Arms"
//                     className="w-10 h-10 object-contain"
//                   />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold text-white">GELEP</h3>
//                   <p className="text-xs text-gray-400">By Migeprof Rwanda</p>
//                 </div>
//               </div>
//               <p className="text-gray-400 leading-relaxed">
//                 Empowering women leaders across Rwanda through innovative programs, 
//                 mentorship, and community building.
//               </p>
//             </div>
            
//             <div>
//               <h4 className="text-white font-semibold mb-4">Quick Links</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
//                 <li><a href="#programs" className="hover:text-white transition-colors">Programs</a></li>
//                 <li><a href="#impact" className="hover:text-white transition-colors">Impact</a></li>
//                 <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
//               <p className="text-gray-400 mb-4">
//                 Follow our journey and stay updated with the latest news and opportunities.
//               </p>
//               <div className="flex space-x-4">
//                 <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
//                   <span className="text-white text-sm font-bold">f</span>
//                 </div>
//                 <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
//                   <span className="text-white text-sm font-bold">t</span>
//                 </div>
//                 <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
//                   <span className="text-white text-sm font-bold">in</span>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
//             <p className="text-gray-400 text-sm">
//               © 2025 GELEP by Migeprof Rwanda. All rights reserved.
//             </p>
//             <p className="text-gray-400 text-sm mt-4 md:mt-0">
//               Proudly serving all regions of Rwanda 🇷🇼
//             </p>
//           </div>
//         </div>
//       </footer>

//       {/* Scroll to Top Button */}
//       {showScrollTop && (
//         <button
//           onClick={scrollToTop}
//           className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-50"
//         >
//           <ArrowUp className="w-6 h-6 mx-auto" />
//         </button>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, Target, Award, MapPin, Mail, Phone, Menu, X, ArrowUp, Star, BookOpen, Heart, Globe } from 'lucide-react';

export default function GELEPLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      
      // Check visibility for scroll animations
      const sections = ['about', 'programs', 'impact', 'contact'];
      const newVisibility = {};
      
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isInView = rect.top < window.innerHeight && rect.bottom > 0;
          newVisibility[section] = isInView;
        }
      });
      
      setIsVisible(newVisibility);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
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
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-sm animate-slide-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 animate-fade-in-left">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
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
            
            <nav className="hidden md:flex space-x-8 animate-fade-in-right">
              {['About', 'Programs', 'Impact', 'Contact'].map((item, index) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="text-gray-700 hover:text-green-600 transition-colors duration-300 hover:scale-105 transform"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item}
                </a>
              ))}
            </nav>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t animate-slide-down">
            <div className="px-4 py-2 space-y-2">
              {['About', 'Programs', 'Impact', 'Contact'].map((item, index) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="block py-2 text-gray-700 hover:text-green-600 transition-all duration-300 hover:translate-x-2 transform"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item}
                </a>
              ))}
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
                <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 text-sm font-medium animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                  <MapPin className="w-4 h-4 mr-2" />
                  Proudly Serving Rwanda
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                  Empowering
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 animate-pulse"> Women Leaders</span>
                  <br />Across Rwanda
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                  The Gender Equality Leadership Empowerment Platform (GELEP) by Migeprof Rwanda 
                  is transforming lives, building leaders, and creating a more equitable future for all Rwandan women.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl duration-300 cursor-pointer"
                >
                  Join GELEP Today
                  <ChevronRight className="inline w-5 h-5 ml-2 animate-bounce" />
                </button>
                <button 
                  // onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
                  onClick={() => window.location.href = '/login'}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-green-500 hover:text-green-600 transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer"
                >
                  Learn More
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-4">
                {stats.slice(0, 3).map((stat, index) => (
                  <div key={index} className="text-center animate-fade-in-up hover:scale-110 transition-transform duration-300" style={{ animationDelay: `${1000 + index * 100}ms` }}>
                    <div className="text-2xl font-bold text-gray-900 animate-count-up">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-fade-in-right" style={{ animationDelay: '400ms' }}>
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-105">
                <img
                    src="/51048.jpg"
                    alt="President Paul Kagame of Rwanda"
                    className="w-full h-96 object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white animate-fade-in-up" style={{ animationDelay: '1200ms' }}>
                  <h3 className="text-lg font-semibold">Rwanda's Future Leaders</h3>
                  <p className="text-sm opacity-90">Building tomorrow, today</p>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 animate-float"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 animate-float-delayed"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${isVisible.about ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About GELEP</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Designed by Migeprof in Rwanda, GELEP is a comprehensive platform dedicated to supporting women 
              across all regions of our beautiful country. We believe that when women lead, communities thrive 
              and nations prosper.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: "Our Mission", desc: "To empower Rwandan women through leadership development, professional networking, and strategic support systems that enable them to achieve their full potential.", color: "green" },
              { icon: Target, title: "Our Vision", desc: "A Rwanda where gender equality is not just an aspiration but a lived reality, with women leading in every sector and region of our nation.", color: "blue" },
              { icon: Award, title: "Our Impact", desc: "Creating lasting change through mentorship, education, and opportunity creation that transforms individual lives and strengthens entire communities.", color: "purple" }
            ].map((item, index) => (
              <div 
                key={index} 
                className={`bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-500 hover:scale-105 ${isVisible.about ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`w-12 h-12 bg-${item.color}-500 rounded-xl flex items-center justify-center mb-6 hover:rotate-12 transition-transform duration-300`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${isVisible.programs ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Programs</h2>
            <p className="text-lg text-gray-600">
              Comprehensive programs designed to support women at every stage of their leadership journey
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <div 
                key={index} 
                className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 group ${isVisible.programs ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
                    <program.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">{program.title}</h3>
                    <p className="text-gray-600 mb-4">{program.description}</p>
                    <ul className="space-y-2">
                      {program.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-700 hover:text-green-600 transition-colors duration-300">
                          <ChevronRight className="w-4 h-4 text-green-500 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
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
      <section className="py-20 bg-gradient-to-br from-green-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-12 animate-fade-in-up">Success Stories</h2>
          
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current animate-twinkle" style={{ animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
              <blockquote className="text-xl text-white mb-6 animate-fade-in" key={currentTestimonial}>
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
                  className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
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
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.impact ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Impact Across Rwanda</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From Kigali to the most remote districts, GELEP is creating waves of positive change 
              and empowering women to lead in their communities.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center hover:scale-110 transition-transform duration-300 ${isVisible.impact ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-2 animate-count-up">
                  {stat.number}
                </div>
                <div className="text-lg font-medium text-gray-700">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className={`bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-500 ${isVisible.impact ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`} style={{ animationDelay: '600ms' }}>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Join the Movement?</h3>
            <p className="text-lg text-gray-600 mb-6">
              Be part of Rwanda's gender equality revolution. Connect with inspiring women, 
              develop your leadership skills, and create the change you want to see.
            </p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl duration-300 cursor-pointer"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className={`transition-all duration-1000 ${isVisible.contact ? 'animate-fade-in-left' : 'opacity-0 -translate-x-10'}`}>
              <h2 className="text-4xl font-bold text-white mb-6">Get in Touch</h2>
              <p className="text-lg text-gray-300 mb-8">
                Ready to start your leadership journey? Have questions about our programs? 
                We'd love to hear from you and support your goals.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: Mail, title: "Email Us", info: "info@gelep-rwanda.org", color: "green" },
                  { icon: Phone, title: "Call Us", info: "+250 788 123 456", color: "blue" },
                  { icon: MapPin, title: "Visit Us", info: "Kigali, Rwanda", color: "purple" }
                ].map((contact, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-4 hover:scale-105 transition-transform duration-300 ${isVisible.contact ? 'animate-fade-in-left' : 'opacity-0 -translate-x-10'}`}
                    style={{ animationDelay: `${(index + 1) * 200}ms` }}
                  >
                    <div className={`w-12 h-12 bg-${contact.color}-500 rounded-xl flex items-center justify-center hover:rotate-12 transition-transform duration-300`}>
                      <contact.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">{contact.title}</div>
                      <div className="text-gray-300">{contact.info}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 ${isVisible.contact ? 'animate-fade-in-right' : 'opacity-0 translate-x-10'}`}>
              <div className="space-y-6">
                {['Name', 'Email'].map((field, index) => (
                  <div key={field} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{field}</label>
                    <input 
                      type={field === 'Email' ? 'email' : 'text'} 
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 hover:bg-white/15 transition-all duration-300"
                      placeholder={field === 'Email' ? 'your.email@example.com' : 'Your full name'}
                    />
                  </div>
                ))}
                <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 hover:bg-white/15 transition-all duration-300"
                    placeholder="Tell us about your leadership goals..."
                  ></textarea>
                </div>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up" style={{ animationDelay: '300ms' }}>
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
            <div className="animate-fade-in-up">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
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
            
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                {['About Us', 'Programs', 'Impact', 'Contact'].map((link, index) => (
                  <li key={link}>
                    <a 
                      href={`#${link.toLowerCase().replace(' ', '')}`} 
                      className="hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block"
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
              <p className="text-gray-400 mb-4">
                Follow our journey and stay updated with the latest news and opportunities.
              </p>
              <div className="flex space-x-4">
                {['f', 't', 'in'].map((social, index) => (
                  <div 
                    key={social}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <span className="text-white text-sm font-bold">{social}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center animate-fade-in-up" style={{ animationDelay: '600ms' }}>
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
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-50 animate-bounce-in"
        >
          <ArrowUp className="w-6 h-6 mx-auto animate-bounce" />
        </button>
      )}
    </div>
  );
}

/* Custom CSS Animations */
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fade-in-down {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fade-in-left {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fade-in-right {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slide-down {
    from {
      opacity: 0;
      transform: translateY(-100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  @keyframes float-delayed {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(15px);
    }
  }

  @keyframes twinkle {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.2);
    }
  }

  @keyframes count-up {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes bounce-in {
    0% {
      transform: scale(0) rotate(0deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.2) rotate(180deg);
      opacity: 0.8;
    }
    100% {
      transform: scale(1) rotate(360deg);
      opacity: 1;
    }
  }

  .animate-fade-in-up {
    animation: fade-in-up 0.6s ease-out forwards;
  }

  .animate-fade-in-down {
    animation: fade-in-down 0.6s ease-out forwards;
  }

  .animate-fade-in-left {
    animation: fade-in-left 0.6s ease-out forwards;
  }

  .animate-fade-in-right {
    animation: fade-in-right 0.6s ease-out forwards;
  }

  .animate-fade-in {
    animation: fade-in 0.6s ease-out forwards;
  }

  .animate-slide-down {
    animation: slide-down 0.6s ease-out forwards;
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-float-delayed {
    animation: float-delayed 8s ease-in-out infinite;
    animation-delay: 2s;
  }

  .animate-twinkle {
    animation: twinkle 2s ease-in-out infinite;
  }

  .animate-count-up {
    animation: count-up 0.8s ease-out forwards;
  }

  .animate-bounce-in {
    animation: bounce-in 0.6s ease-out forwards;
  }

  /* Hover effects */
  .hover\\:shadow-3xl:hover {
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
  }

  /* Smooth transitions for all elements */
  * {
    transition-property: transform, opacity, box-shadow, background-color, border-color, color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Initial states for animations */
  .animate-fade-in-up,
  .animate-fade-in-down,
  .animate-fade-in-left,
  .animate-fade-in-right,
  .animate-fade-in,
  .animate-slide-down,
  .animate-count-up,
  .animate-bounce-in {
    opacity: 0;
  }

  /* Stagger animation delays */
  .animate-fade-in-up:nth-child(1) { animation-delay: 0ms; }
  .animate-fade-in-up:nth-child(2) { animation-delay: 100ms; }
  .animate-fade-in-up:nth-child(3) { animation-delay: 200ms; }
  .animate-fade-in-up:nth-child(4) { animation-delay: 300ms; }
  .animate-fade-in-up:nth-child(5) { animation-delay: 400ms; }
`;

if (!document.head.querySelector('[data-gelep-animations]')) {
  style.setAttribute('data-gelep-animations', 'true');
  document.head.appendChild(style);
}