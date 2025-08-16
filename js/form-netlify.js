/**
 * Netlify-friendly Contact Form Handler
 * Only validates, then allows native submission for Netlify Forms
 */

class NetlifyContactFormHandler {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.submitButton = document.querySelector('.form-submit');
        this.formGroups = document.querySelectorAll('.form-group');
        this.inputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
        this.isSubmitting = false;
        this.init();
    }

    init() {
        if (!this.form) return;
        this.setupEventListeners();
        this.setupFloatingLabels();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.inputs.forEach(input => {
            input.addEventListener('focus', (e) => this.addFocusedState(e.target));
            input.addEventListener('blur', (e) => this.removeFocusedStateIfEmpty(e.target));
            input.addEventListener('input', (e) => this.clearFieldError(e.target));
        });
    }

    setupFloatingLabels() {
        this.inputs.forEach(input => {
            if (input.value.trim() !== '') this.addFocusedState(input);
        });
    }

    addFocusedState(input) {
        const formGroup = input.closest('.form-group');
        if (formGroup) formGroup.classList.add('focused');
    }

    removeFocusedStateIfEmpty(input) {
        if (input.value.trim() === '') {
            const formGroup = input.closest('.form-group');
            if (formGroup) formGroup.classList.remove('focused');
        }
    }

    clearFieldError(input) {
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) errorMessage.remove();
        const formGroup = input.closest('.form-group');
        if (formGroup) formGroup.classList.remove('has-error');
    }

    validateField(input) {
        const value = input.value.trim();
        const fieldName = input.name;
        let isValid = true;
        let errorMessage = '';
        if (input.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        if (value) {
            switch (fieldName) {
                case 'name':
                    if (value.length < 2) {
                        isValid = false;
                        errorMessage = 'Name must be at least 2 characters';
                    } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                        isValid = false;
                        errorMessage = 'Name should only contain letters and spaces';
                    }
                    break;
                case 'email':
                    if (!this.isValidEmail(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                    break;
                case 'phone':
                    if (!this.isValidPhone(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number';
                    }
                    break;
            }
        }
        if (!isValid) this.showFieldError(input, errorMessage);
        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 15;
    }

    showFieldError(input, message) {
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        input.parentNode.appendChild(errorElement);
        const formGroup = input.closest('.form-group');
        if (formGroup) formGroup.classList.add('has-error');
    }

    validateForm() {
        let isValid = true;
        const requiredFields = this.form.querySelectorAll('[required]');
        this.inputs.forEach(input => this.clearFieldError(input));
        requiredFields.forEach(field => {
            if (!this.validateField(field)) isValid = false;
        });
        return isValid;
    }

    handleSubmit(e) {
        try {
            if (!this.validateForm()) {
                e.preventDefault();
                this.focusFirstError();
                return;
            }
            // If valid, allow native submission (Netlify will process)
            this.setSubmitState('loading');
        } catch (error) {
            console.error('Form validation error:', error);
            e.preventDefault();
        }
    }

    setSubmitState(state) {
        const button = this.submitButton;
        if (!button) return;
        
        const buttonText = button.querySelector('span');
        button.classList.remove('loading', 'success', 'error');
        
        switch (state) {
            case 'loading':
                button.classList.add('loading');
                button.disabled = true;
                if (buttonText) buttonText.textContent = 'Sending...';
                break;
            case 'success':
                button.classList.add('success');
                button.disabled = false;
                if (buttonText) buttonText.textContent = 'Sent Successfully!';
                break;
            case 'error':
                button.classList.add('error');
                button.disabled = false;
                if (buttonText) buttonText.textContent = 'Failed - Try Again';
                break;
            default:
                button.disabled = false;
                if (buttonText) buttonText.textContent = 'Begin Private Consultation';
                break;
        }
    }

    focusFirstError() {
        const firstError = this.form.querySelector('.has-error input, .has-error select, .has-error textarea');
        if (firstError) {
            firstError.focus();
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

function initNetlifyContactFormHandler() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.netlifyContactFormHandler = new NetlifyContactFormHandler();
        });
    } else {
        window.netlifyContactFormHandler = new NetlifyContactFormHandler();
    }
}

initNetlifyContactFormHandler();
