/**
 * EmailJS Contact Form Handler
 * Sends form data via EmailJS and shows a popup on success
 * Does NOT interfere with Netlify form submission
 * Usage: include this script in your HTML after including EmailJS SDK
 */

// Import EmailJS config
// No need to import EmailJS keys; handled by Netlify function


class EmailJSContactFormHandler {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.submitButton = document.querySelector('.form-submit');
        this.isSubmitting = false;
        this.init();
    }

    init() {
        if (!this.form) return;
        // Only handle EmailJS submission if enabled
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        // Prevent default only for EmailJS, not Netlify
        if (window.useEmailJS) {
            e.preventDefault();
            if (this.isSubmitting) return;
            this.isSubmitting = true;
            this.setSubmitState('loading');
            try {
                await this.sendEmail();
                this.handleSuccess();
            } catch (error) {
                this.handleError(error);
            } finally {
                this.isSubmitting = false;
            }
        }
        // If not using EmailJS, allow native Netlify submission
    }

    async sendEmail() {
        // Collect form data
        const formData = new FormData(this.form);
        // Convert FormData to object and map property-type to property_type
        const data = {};
        formData.forEach((value, key) => {
            if (key === 'property-type') {
                data['property_type'] = value;
            } else {
                data[key] = value;
            }
        });
        // Send to Netlify serverless function
        const response = await fetch('/.netlify/functions/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || 'Serverless function error');
        }
        return result;
    }

    handleSuccess() {
        this.setSubmitState('success');
        this.showPopup('Thank you! Your inquiry has been sent successfully. We will contact you soon.', 'success');
        this.form.reset();
        setTimeout(() => this.setSubmitState('normal'), 3000);
    }

    handleError(error) {
        this.setSubmitState('error');
        this.showPopup('Sorry, there was an error sending your message. Please try again.', 'error');
        setTimeout(() => this.setSubmitState('normal'), 3000);
    }

    setSubmitState(state) {
        const button = this.submitButton;
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

    showPopup(message, type) {
        let popup = document.createElement('div');
        popup.className = `form-popup form-popup-${type}`;
        popup.innerHTML = `<div class="form-popup-content">${message}<button class="form-popup-close">&times;</button></div>`;
        document.body.appendChild(popup);
        popup.querySelector('.form-popup-close').onclick = () => popup.remove();
        setTimeout(() => { if (popup.parentNode) popup.remove(); }, 6000);
    }
}

function initEmailJSContactFormHandler() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.emailJSContactFormHandler = new EmailJSContactFormHandler();
        });
    } else {
        window.emailJSContactFormHandler = new EmailJSContactFormHandler();
    }
}

initEmailJSContactFormHandler();
