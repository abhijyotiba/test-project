// /**
//  * Prestige Properties - Contact Form Handler
//  * Clean implementation with Netlify Forms integration
//  */

// class ContactFormHandler {
//     constructor() {
//         this.form = document.querySelector('.contact-form');
//         this.submitButton = document.querySelector('.form-submit');
//         this.formGroups = document.querySelectorAll('.form-group');
//         this.inputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
        
//         this.isSubmitting = false;
        
//         // Initialize form
//         this.init();
//     }

//     init() {
//         if (!this.form) {
//             console.warn('Contact form not found');
//             return;
//         }

//         this.setupEventListeners();
//         this.setupFloatingLabels();
//         console.log('Contact form handler initialized with Netlify Forms');
//     }

//     setupEventListeners() {
//         // Form submission - only validation trigger
//         this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
//         // Focus/blur effects for floating labels only
//         this.inputs.forEach(input => {
//             input.addEventListener('focus', (e) => this.handleInputFocus(e));
//             input.addEventListener('blur', (e) => this.handleInputBlur(e));
//             input.addEventListener('input', (e) => this.handleInputChange(e));
//         });

//         // Enhanced keyboard navigation
//         this.inputs.forEach(input => {
//             if (input.tagName !== 'TEXTAREA') {
//                 input.addEventListener('keydown', (e) => {
//                     if (e.key === 'Enter') {
//                         e.preventDefault();
//                         this.focusNextInput(input);
//                     }
//                 });
//             }
//         });
//     }

//     setupFloatingLabels() {
//         this.inputs.forEach(input => {
//             // Check if input has value on page load
//             if (input.value.trim() !== '') {
//                 this.addFocusedState(input);
//             }
//         });
//     }

//     handleInputFocus(e) {
//         this.addFocusedState(e.target);
//         // Clear any existing errors when user starts typing again
//         this.clearFieldError(e.target);
//     }

//     handleInputBlur(e) {
//         if (e.target.value.trim() === '') {
//             this.removeFocusedState(e.target);
//         }
//     }

//     handleInputChange(e) {
//         const input = e.target;
//         if (input.value.trim() !== '') {
//             this.addFocusedState(input);
//         }
//         // Clear errors when user starts typing
//         this.clearFieldError(input);
//     }

//     addFocusedState(input) {
//         const formGroup = input.closest('.form-group');
//         if (formGroup) {
//             formGroup.classList.add('focused');
//         }
//     }

//     removeFocusedState(input) {
//         const formGroup = input.closest('.form-group');
//         if (formGroup) {
//             formGroup.classList.remove('focused');
//         }
//     }

//     focusNextInput(currentInput) {
//         const inputsArray = Array.from(this.inputs);
//         const currentIndex = inputsArray.indexOf(currentInput);
//         const nextInput = inputsArray[currentIndex + 1];
        
//         if (nextInput) {
//             nextInput.focus();
//         } else {
//             this.submitButton.focus();
//         }
//     }

//     // Validation only happens on form submission
//     validateField(input) {
//         const value = input.value.trim();
//         const fieldName = input.name;
//         let isValid = true;
//         let errorMessage = '';

//         // Required field validation
//         if (input.hasAttribute('required') && !value) {
//             isValid = false;
//             errorMessage = 'This field is required';
//         }

//         // Specific field validations (only if field has value)
//         if (value) {
//             switch (fieldName) {
//                 case 'name':
//                     if (value.length < 2) {
//                         isValid = false;
//                         errorMessage = 'Name must be at least 2 characters';
//                     } else if (!/^[a-zA-Z\s]+$/.test(value)) {
//                         isValid = false;
//                         errorMessage = 'Name should only contain letters and spaces';
//                     }
//                     break;

//                 case 'email':
//                     if (!this.isValidEmail(value)) {
//                         isValid = false;
//                         errorMessage = 'Please enter a valid email address';
//                     }
//                     break;

//                 case 'phone':
//                     if (!this.isValidPhone(value)) {
//                         isValid = false;
//                         errorMessage = 'Please enter a valid phone number';
//                     }
//                     break;
//             }
//         }

//         if (!isValid) {
//             this.showFieldError(input, errorMessage);
//         }

//         return isValid;
//     }

//     isValidEmail(email) {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     }

//     isValidPhone(phone) {
//         const cleanPhone = phone.replace(/\D/g, '');
//         return cleanPhone.length >= 10 && cleanPhone.length <= 15;
//     }

//     showFieldError(input, message) {
//         // Remove existing error message
//         const existingError = input.parentNode.querySelector('.error-message');
//         if (existingError) {
//             existingError.remove();
//         }

//         // Create and add new error message
//         const errorElement = document.createElement('div');
//         errorElement.className = 'error-message';
//         errorElement.textContent = message;
        
//         input.parentNode.appendChild(errorElement);
        
//         // Add subtle error styling to form group (not aggressive red)
//         const formGroup = input.closest('.form-group');
//         if (formGroup) {
//             formGroup.classList.add('has-error');
//         }
//     }

//     clearFieldError(input) {
//         const errorMessage = input.parentNode.querySelector('.error-message');
//         if (errorMessage) {
//             errorMessage.remove();
//         }

//         const formGroup = input.closest('.form-group');
//         if (formGroup) {
//             formGroup.classList.remove('has-error');
//         }
//     }

//     validateForm() {
//         let isValid = true;
//         const requiredFields = this.form.querySelectorAll('[required]');
        
//         // Clear all previous errors first
//         this.inputs.forEach(input => this.clearFieldError(input));
        
//         // Validate each required field
//         requiredFields.forEach(field => {
//             if (!this.validateField(field)) {
//                 isValid = false;
//             }
//         });

//         return isValid;
//     }

//     async handleSubmit(e) {
//         e.preventDefault();
        
//         if (this.isSubmitting) {
//             return;
//         }

//         // Validate form only on submission
//         if (!this.validateForm()) {
//             this.showMessage('Please fill in all required fields correctly', 'error');
//             this.focusFirstError();
//             return;
//         }

//         this.isSubmitting = true;
//         this.setSubmitState('loading');

//         try {
//             // Submit to Netlify
//             await this.submitForm();
//             this.handleSuccess();
//         } catch (error) {
//             console.error('Form submission error:', error);
//             this.handleError(error);
//         } finally {
//             this.isSubmitting = false;
//         }
//     }

//     async submitForm() {
//         // Create FormData from the form
//         const formData = new FormData(this.form);
        
//         // Add timestamp
//         formData.append('timestamp', new Date().toLocaleString());
        
//         // Check if we're running locally (for development)
//         const isLocal = window.location.hostname === 'localhost' || 
//                        window.location.hostname === '127.0.0.1' || 
//                        window.location.hostname === '' ||
//                        window.location.protocol === 'file:';
        
//         if (isLocal) {
//             // For local development - simulate successful submission
//             console.log('Local development mode - Form data:', Object.fromEntries(formData));
            
//             // Simulate network delay
//             await new Promise(resolve => setTimeout(resolve, 1000));
            
//             // Return a mock successful response
//             return { ok: true, status: 200 };
//         } else {
//             // Submit to Netlify Forms when deployed
//             const response = await fetch('/', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//                 body: new URLSearchParams(formData).toString()
//             });

//             if (!response.ok) {
//                 throw new Error(`Network response was not ok: ${response.status}`);
//             }

//             return response;
//         }
//     }

//     handleSuccess() {
//         this.setSubmitState('success');
//         this.showMessage('Thank you! Your inquiry has been sent successfully. We\'ll get back to you within 24 hours.', 'success');
//         this.resetForm();
        
//         setTimeout(() => {
//             this.setSubmitState('normal');
//         }, 3000);
//     }

//     handleError(error) {
//         this.setSubmitState('error');
        
//         let errorMessage = 'Sorry, there was an error sending your message. Please try again.';
        
//         if (error.text) {
//             errorMessage = `Error: ${error.text}`;
//         } else if (error.message) {
//             errorMessage = error.message;
//         }
        
//         this.showMessage(errorMessage, 'error');
        
//         setTimeout(() => {
//             this.setSubmitState('normal');
//         }, 3000);
//     }

//     setSubmitState(state) {
//         const button = this.submitButton;
//         const buttonText = button.querySelector('span');
        
//         button.classList.remove('loading', 'success', 'error');
        
//         switch (state) {
//             case 'loading':
//                 button.classList.add('loading');
//                 button.disabled = true;
//                 if (buttonText) buttonText.textContent = 'Sending...';
//                 break;
                
//             case 'success':
//                 button.classList.add('success');
//                 button.disabled = false;
//                 if (buttonText) buttonText.textContent = 'Sent Successfully!';
//                 break;
                
//             case 'error':
//                 button.classList.add('error');
//                 button.disabled = false;
//                 if (buttonText) buttonText.textContent = 'Failed - Try Again';
//                 break;
                
//             default:
//                 button.disabled = false;
//                 if (buttonText) buttonText.textContent = 'Begin Private Consultation';
//                 break;
//         }
//     }

//     showMessage(text, type = 'info') {
//         const existingMessage = document.querySelector('.form-message');
//         if (existingMessage) {
//             existingMessage.remove();
//         }

//         const messageElement = document.createElement('div');
//         messageElement.className = `form-message form-message-${type}`;
//         messageElement.textContent = text;
        
//         // Add close button for error messages
//         if (type === 'error') {
//             const closeButton = document.createElement('button');
//             closeButton.innerHTML = '&times;';
//             closeButton.className = 'form-message-close';
//             closeButton.onclick = () => messageElement.remove();
//             messageElement.appendChild(closeButton);
//         }
        
//         // Append to body instead of before form to prevent layout shifts
//         document.body.appendChild(messageElement);
        
//         if (type !== 'error') {
//             setTimeout(() => {
//                 if (messageElement.parentNode) {
//                     messageElement.remove();
//                 }
//             }, 5000);
//         }
//     }

//     focusFirstError() {
//         const firstError = this.form.querySelector('.has-error input, .has-error select, .has-error textarea');
//         if (firstError) {
//             firstError.focus();
//             firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//     }

//     resetForm() {
//         this.form.reset();
        
//         this.formGroups.forEach(group => {
//             group.classList.remove('focused', 'has-error');
//         });
        
//         this.inputs.forEach(input => {
//             this.clearFieldError(input);
//         });
//     }
// }

// // Initialize when DOM is ready or immediately if already loaded
// function initContactFormHandler() {
//     if (document.readyState === 'loading') {
//         document.addEventListener('DOMContentLoaded', function() {
//             window.contactFormHandler = new ContactFormHandler();
//         });
//     } else {
//         window.contactFormHandler = new ContactFormHandler();
//     }
// }

// // Initialize the form handler
// initContactFormHandler();
