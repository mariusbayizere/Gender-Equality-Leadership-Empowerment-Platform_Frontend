

  export const validateForm = () => {
    const newErrors = {};
    
    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 3) {
      newErrors.firstName = 'First name must be at least 3 characters';
    } else if (formData.firstName.length > 20) {
      newErrors.firstName = 'First name must not exceed 20 characters';
    }
    
    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 3) {
      newErrors.lastName = 'Last name must be at least 3 characters';
    } else if (formData.lastName.length > 20) {
      newErrors.lastName = 'Last name must not exceed 20 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (formData.email.length < 5 || formData.email.length > 40) {
      newErrors.email = 'Email must be between 5 and 40 characters';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,26}$/.test(formData.password)) {
      newErrors.password = 'Password must be 6–26 characters and include uppercase, lowercase, number, and symbol';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    // User role validation
    if (!formData.userRole) {
      newErrors.userRole = 'User role is required';
    }
    
    // Telephone validation
    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Telephone is required';
    } else {
      const fullNumber = selectedCountry?.dial_code + formData.telephone;
      if (fullNumber.length < 13 || fullNumber.length > 16) {
        newErrors.telephone = 'Telephone must be between 13 and 16 digits including country code';
      }
    }
    
    return newErrors;
  };
