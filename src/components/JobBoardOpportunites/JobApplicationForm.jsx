// import React, { useState } from 'react';
// import { X, Upload, FileText, User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

// const JobApplicationForm = ({ isOpen, onClose, jobDetails, onSubmit }) => {
//   const [formData, setFormData] = useState({
//     coverLetter: '',
//     experience: '',
//     education: '',
//     skills: '',
//     availability: '',
//     motivationStatement: '',
//     linkedinProfile: '',
//     portfolioUrl: '',
//     additionalComments: ''
//   });

//   const [cvFile, setCvFile] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState({});

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file type and size
//       const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
//       const maxSize = 5 * 1024 * 1024; // 5MB

//       if (!allowedTypes.includes(file.type)) {
//         setErrors(prev => ({
//           ...prev,
//           cvFile: 'Please upload a PDF or Word document'
//         }));
//         return;
//       }

//       if (file.size > maxSize) {
//         setErrors(prev => ({
//           ...prev,
//           cvFile: 'File size must be less than 5MB'
//         }));
//         return;
//       }

//       setCvFile(file);
//       setErrors(prev => ({
//         ...prev,
//         cvFile: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.coverLetter.trim()) {
//       newErrors.coverLetter = 'Cover letter is required';
//     } else if (formData.coverLetter.length < 100) {
//       newErrors.coverLetter = 'Cover letter must be at least 100 characters';
//     }

//     if (!formData.experience.trim()) {
//       newErrors.experience = 'Experience description is required';
//     }

//     if (!formData.education.trim()) {
//       newErrors.education = 'Education information is required';
//     }

//     if (!formData.skills.trim()) {
//       newErrors.skills = 'Skills information is required';
//     }

//     if (!formData.motivationStatement.trim()) {
//       newErrors.motivationStatement = 'Motivation statement is required';
//     }

//     if (!cvFile) {
//       newErrors.cvFile = 'CV/Resume is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const applicationData = new FormData();
      
//       // Append form data
//       Object.keys(formData).forEach(key => {
//         applicationData.append(key, formData[key]);
//       });
      
//       // Append file
//       if (cvFile) {
//         applicationData.append('cv', cvFile);
//       }
      
//       // Append job ID
//       applicationData.append('jobId', jobDetails.id);

//       await onSubmit(applicationData);
      
//       // Reset form
//       setFormData({
//         coverLetter: '',
//         experience: '',
//         education: '',
//         skills: '',
//         availability: '',
//         motivationStatement: '',
//         linkedinProfile: '',
//         portfolioUrl: '',
//         additionalComments: ''
//       });
//       setCvFile(null);
//       onClose();
      
//     } catch (error) {
//       console.error('Application submission error:', error);
//       setErrors({ submit: 'Failed to submit application. Please try again.' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Apply for Position</h2>
//             <p className="text-sm text-gray-600 mt-1">
//               {jobDetails?.title} at {jobDetails?.company}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//             disabled={isSubmitting}
//           >
//             <X className="w-6 h-6 text-gray-500" />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {errors.submit && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//               <p className="text-red-600 text-sm">{errors.submit}</p>
//             </div>
//           )}

//           {/* Cover Letter */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               <Mail className="w-4 h-4 inline mr-1" />
//               Cover Letter *
//             </label>
//             <textarea
//               name="coverLetter"
//               value={formData.coverLetter}
//               onChange={handleInputChange}
//               placeholder="Explain why you're interested in this position and how your background makes you a strong candidate for leadership roles..."
//               rows={6}
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                 errors.coverLetter ? 'border-red-300' : 'border-gray-300'
//               }`}
//             />
//             {errors.coverLetter && (
//               <p className="text-red-500 text-xs mt-1">{errors.coverLetter}</p>
//             )}
//             <p className="text-xs text-gray-500 mt-1">
//               {formData.coverLetter.length}/500 characters (minimum 100)
//             </p>
//           </div>

//           {/* CV Upload */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               <FileText className="w-4 h-4 inline mr-1" />
//               CV/Resume *
//             </label>
//             <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
//               errors.cvFile ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
//             }`}>
//               <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//               <input
//                 type="file"
//                 accept=".pdf,.doc,.docx"
//                 onChange={handleFileChange}
//                 className="hidden"
//                 id="cv-upload"
//               />
//               <label htmlFor="cv-upload" className="cursor-pointer">
//                 <span className="text-blue-600 hover:text-blue-700 font-medium">
//                   Click to upload
//                 </span>
//                 <span className="text-gray-500"> or drag and drop</span>
//               </label>
//               <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 5MB</p>
//               {cvFile && (
//                 <p className="text-green-600 text-sm mt-2">
//                   ✓ {cvFile.name} selected
//                 </p>
//               )}
//             </div>
//             {errors.cvFile && (
//               <p className="text-red-500 text-xs mt-1">{errors.cvFile}</p>
//             )}
//           </div>

//           {/* Two Column Layout */}
//           <div className="grid md:grid-cols-2 gap-6">
//             {/* Experience */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 <Briefcase className="w-4 h-4 inline mr-1" />
//                 Relevant Experience *
//               </label>
//               <textarea
//                 name="experience"
//                 value={formData.experience}
//                 onChange={handleInputChange}
//                 placeholder="Describe your leadership experience, achievements, and relevant work history..."
//                 rows={4}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                   errors.experience ? 'border-red-300' : 'border-gray-300'
//                 }`}
//               />
//               {errors.experience && (
//                 <p className="text-red-500 text-xs mt-1">{errors.experience}</p>
//               )}
//             </div>

//             {/* Education */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 <User className="w-4 h-4 inline mr-1" />
//                 Education Background *
//               </label>
//               <textarea
//                 name="education"
//                 value={formData.education}
//                 onChange={handleInputChange}
//                 placeholder="List your educational qualifications, certifications, and relevant training..."
//                 rows={4}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                   errors.education ? 'border-red-300' : 'border-gray-300'
//                 }`}
//               />
//               {errors.education && (
//                 <p className="text-red-500 text-xs mt-1">{errors.education}</p>
//               )}
//             </div>
//           </div>

//           {/* Skills */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Key Skills & Competencies *
//             </label>
//             <textarea
//               name="skills"
//               value={formData.skills}
//               onChange={handleInputChange}
//               placeholder="List your key skills, technical competencies, and leadership abilities..."
//               rows={3}
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                 errors.skills ? 'border-red-300' : 'border-gray-300'
//               }`}
//             />
//             {errors.skills && (
//               <p className="text-red-500 text-xs mt-1">{errors.skills}</p>
//             )}
//           </div>

//           {/* Motivation Statement */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Motivation Statement *
//             </label>
//             <textarea
//               name="motivationStatement"
//               value={formData.motivationStatement}
//               onChange={handleInputChange}
//               placeholder="What motivates you to pursue leadership roles? How do you envision contributing to gender equality in leadership?"
//               rows={4}
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                 errors.motivationStatement ? 'border-red-300' : 'border-gray-300'
//               }`}
//             />
//             {errors.motivationStatement && (
//               <p className="text-red-500 text-xs mt-1">{errors.motivationStatement}</p>
//             )}
//           </div>

//           {/* Optional Fields */}
//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 LinkedIn Profile
//               </label>
//               <input
//                 type="url"
//                 name="linkedinProfile"
//                 value={formData.linkedinProfile}
//                 onChange={handleInputChange}
//                 placeholder="https://linkedin.com/in/your-profile"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Portfolio/Website
//               </label>
//               <input
//                 type="url"
//                 name="portfolioUrl"
//                 value={formData.portfolioUrl}
//                 onChange={handleInputChange}
//                 placeholder="https://your-portfolio.com"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//               />
//             </div>
//           </div>

//           {/* Availability */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               <MapPin className="w-4 h-4 inline mr-1" />
//               Availability
//             </label>
//             <input
//               type="text"
//               name="availability"
//               value={formData.availability}
//               onChange={handleInputChange}
//               placeholder="When can you start? Any notice period requirements?"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//             />
//           </div>

//           {/* Additional Comments */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Additional Comments
//             </label>
//             <textarea
//               name="additionalComments"
//               value={formData.additionalComments}
//               onChange={handleInputChange}
//               placeholder="Any additional information you'd like to share..."
//               rows={3}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//             />
//           </div>

//           {/* Form Actions */}
//           <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={isSubmitting}
//               className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-8 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
//             >
//               {isSubmitting ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                   <span>Submitting...</span>
//                 </>
//               ) : (
//                 <span>Submit Application</span>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default JobApplicationForm;


import React, { useState } from 'react';
import { X, Upload, FileText, User, Mail, Phone, MapPin, Briefcase, Award } from 'lucide-react';

const JobApplicationForm = ({ isOpen, onClose, jobDetails, onSubmit }) => {
  const [formData, setFormData] = useState({
    coverLetter: '',
    experience: '',
    education: ''
  });

  const [cvFile, setCvFile] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [fileType]: 'Please upload a PDF or Word document'
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          [fileType]: 'File size must be less than 5MB'
        }));
        return;
      }

      if (fileType === 'cv') {
        setCvFile(file);
      } else {
        setCertificateFile(file);
      }

      setErrors(prev => ({
        ...prev,
        [fileType]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Cover letter validation (min 100 chars, max 1500 chars)
    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    } else if (formData.coverLetter.length < 100) {
      newErrors.coverLetter = 'Cover letter must be at least 100 characters';
    } else if (formData.coverLetter.length > 1500) {
      newErrors.coverLetter = 'Cover letter must not exceed 1500 characters';
    }

    // Experience validation (min 50 chars, max 1000 chars)
    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience description is required';
    } else if (formData.experience.length < 50) {
      newErrors.experience = 'Experience must be at least 50 characters';
    } else if (formData.experience.length > 1000) {
      newErrors.experience = 'Experience must not exceed 1000 characters';
    }

    // Education validation (min 20 chars, max 500 chars)
    if (!formData.education.trim()) {
      newErrors.education = 'Education information is required';
    } else if (formData.education.length < 20) {
      newErrors.education = 'Education must be at least 20 characters';
    } else if (formData.education.length > 500) {
      newErrors.education = 'Education must not exceed 500 characters';
    }

    // CV file validation
    if (!cvFile) {
      newErrors.cv = 'CV/Resume is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationData = new FormData();
      
      // Add job ID (automatically handled by the system)
      applicationData.append('jobId', jobDetails.id);
      
      // Add form data with correct field names matching backend
      applicationData.append('coverLetter', formData.coverLetter);
      applicationData.append('experience', formData.experience);
      applicationData.append('education', formData.education);
      
      // Add files
      if (cvFile) {
        applicationData.append('cv', cvFile);
      }
      
      if (certificateFile) {
        applicationData.append('certificate', certificateFile);
      }

      await onSubmit(applicationData);
      
      // Reset form
      setFormData({
        coverLetter: '',
        experience: '',
        education: ''
      });
      setCvFile(null);
      setCertificateFile(null);
      onClose();
      
    } catch (error) {
      console.error('Application submission error:', error);
      setErrors({ submit: 'Failed to submit application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Apply for Position</h2>
            <p className="text-sm text-gray-600 mt-1">
              {jobDetails?.title} at {jobDetails?.company}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Cover Letter *
            </label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              placeholder="Explain why you're interested in this position and how your background makes you a strong candidate for leadership roles..."
              rows={6}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.coverLetter ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.coverLetter && (
              <p className="text-red-500 text-xs mt-1">{errors.coverLetter}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.coverLetter.length}/1500 characters (minimum 100)
            </p>
          </div>

          {/* CV Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              CV/Resume *
            </label>
            <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              errors.cv ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
            }`}>
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange(e, 'cv')}
                className="hidden"
                id="cv-upload"
              />
              <label htmlFor="cv-upload" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700 font-medium">
                  Click to upload
                </span>
                <span className="text-gray-500"> or drag and drop</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 5MB</p>
              {cvFile && (
                <p className="text-green-600 text-sm mt-2">
                  ✓ {cvFile.name} selected
                </p>
              )}
            </div>
            {errors.cv && (
              <p className="text-red-500 text-xs mt-1">{errors.cv}</p>
            )}
          </div>

          {/* Certificate Upload (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Award className="w-4 h-4 inline mr-1" />
              Certificate (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg p-6 text-center transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, 'certificate')}
                className="hidden"
                id="certificate-upload"
              />
              <label htmlFor="certificate-upload" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700 font-medium">
                  Click to upload
                </span>
                <span className="text-gray-500"> or drag and drop</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, JPEG, PNG up to 5MB</p>
              {certificateFile && (
                <p className="text-green-600 text-sm mt-2">
                  ✓ {certificateFile.name} selected
                </p>
              )}
            </div>
            {errors.certificate && (
              <p className="text-red-500 text-xs mt-1">{errors.certificate}</p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Briefcase className="w-4 h-4 inline mr-1" />
              Relevant Experience *
            </label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="Describe your leadership experience, achievements, and relevant work history..."
              rows={5}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.experience ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.experience && (
              <p className="text-red-500 text-xs mt-1">{errors.experience}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.experience.length}/1000 characters (minimum 50)
            </p>
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Education Background *
            </label>
            <textarea
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              placeholder="List your educational qualifications, certifications, and relevant training..."
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.education ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.education && (
              <p className="text-red-500 text-xs mt-1">{errors.education}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.education.length}/500 characters (minimum 20)
            </p>
          </div>

          {/* Information Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  AI Document Verification
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Your application will be automatically verified using AI. If all documents are complete and meet requirements, an interview will be scheduled automatically within 3 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

{/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationForm;