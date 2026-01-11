/**
 * Contact Form Hook
 * Manages contact form state and API integration
 */

import { useState, useCallback } from 'react';
import { apiService, apiUtils } from '../services/apiService';

export const useContactForm = (onSuccess, onError) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const validation = apiUtils.validateContactData(formData);
    
    if (!validation.isValid) {
      const fieldErrors = {};
      validation.errors.forEach(error => {
        if (error.includes('Name')) fieldErrors.name = error;
        else if (error.includes('Email')) fieldErrors.email = error;
        else if (error.includes('Subject')) fieldErrors.subject = error;
        else if (error.includes('Message')) fieldErrors.message = error;
        else fieldErrors.general = error;
      });
      
      setErrors(fieldErrors);
      return false;
    }
    
    setErrors({});
    return true;
  }, [formData]);

  const submitForm = useCallback(async () => {
    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);
    
    try {
      const response = await apiService.sendContactMessage(formData);
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      if (onSuccess) {
        onSuccess(response);
      }
      
      return true;
    } catch (error) {
      if (onError) {
        onError(error);
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSuccess, onError]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    submitForm,
    resetForm,
    isValid: Object.keys(errors).length === 0
  };
};

export default useContactForm;