// Property Popup Modal JavaScript
// Handles property detail modal with image slideshow

class PropertyModal {
    constructor() {
        this.modal = null;
        this.currentSlide = 0;
        this.slides = [];
        this.isOpen = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        this.createModalStructure();
        this.bindEvents();
        this.bindPropertyCardEvents();
    }
    
    createModalStructure() {
        // Create modal overlay
        this.modal = document.createElement('div');
        this.modal.className = 'property-modal-overlay';
        this.modal.innerHTML = `
            <div class="property-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <button class="property-modal-close" aria-label="Close modal">&times;</button>
                
                <div class="property-modal-gallery">
                    <div class="property-modal-slideshow">
                        <!-- Slides will be dynamically added here -->
                    </div>
                    <button class="property-modal-nav property-modal-nav-prev" aria-label="Previous image">&#8249;</button>
                    <button class="property-modal-nav property-modal-nav-next" aria-label="Next image">&#8250;</button>
                    <div class="property-modal-indicators">
                        <!-- Indicators will be dynamically added here -->
                    </div>
                </div>
                
                <div class="property-modal-details">
                    <div class="property-modal-header">
                        <h2 class="property-modal-title" id="modal-title"></h2>
                        <div class="property-modal-location"></div>
                        <div class="property-modal-price"></div>
                    </div>
                    
                    <div class="property-modal-description"></div>
                    
                    <div class="property-modal-features">
                        <h3 class="property-modal-features-title">Key Features</h3>
                        <div class="property-modal-features-grid">
                            <!-- Features will be dynamically added here -->
                        </div>
                    </div>
                    
                    <div class="property-modal-amenities">
                        <h3 class="property-modal-amenities-title">Amenities</h3>
                        <div class="property-modal-amenities-list">
                            <!-- Amenities will be dynamically added here -->
                        </div>
                    </div>
                    
                    <div class="property-modal-specifications" style="display: none;">
                        <h3 class="property-modal-specifications-title">Specifications</h3>
                        <div class="property-modal-specifications-list">
                            <!-- Specifications will be dynamically added here -->
                        </div>
                    </div>
                    
                    <div class="property-modal-location-section" style="display: none;">
                        <h3 class="property-modal-location-title">Location & Connectivity</h3>
                        <div class="property-modal-map-placeholder">
                            Interactive Map Coming Soon
                        </div>
                    </div>
                    
                    <div class="property-modal-actions">
                        <button class="property-modal-button property-modal-button-primary">Schedule Viewing</button>
                        <button class="property-modal-button property-modal-button-secondary">Full Details</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.modal);
    }
    
    bindEvents() {
        // Close modal events
        const closeBtn = this.modal.querySelector('.property-modal-close');
        closeBtn.addEventListener('click', () => this.close());
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch(e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    this.nextSlide();
                    break;
            }
        });
        
        // Navigation buttons
        const prevBtn = this.modal.querySelector('.property-modal-nav-prev');
        const nextBtn = this.modal.querySelector('.property-modal-nav-next');
        
        prevBtn.addEventListener('click', () => this.previousSlide());
        nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Touch/swipe events for mobile
        const slideshow = this.modal.querySelector('.property-modal-slideshow');
        slideshow.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        slideshow.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
        
        // Action buttons
        const scheduleBtn = this.modal.querySelector('.property-modal-button-primary');
        const infoBtn = this.modal.querySelector('.property-modal-button-secondary');
        
        scheduleBtn.addEventListener('click', () => this.scheduleViewing());
        infoBtn.addEventListener('click', () => this.getMoreInfo());
    }
    
    bindPropertyCardEvents() {
        // Bind click events to property cards and overlay links
        document.addEventListener('click', (e) => {
            // Check if clicked element is a property card or its "See Details" link
            const propertyCard = e.target.closest('.property-card');
            const seeDetailsLink = e.target.closest('.property-overlay-link');
            
            if (seeDetailsLink) {
                e.preventDefault();
                const card = seeDetailsLink.closest('.property-card');
                if (card) {
                    this.openModal(card);
                }
            } else if (propertyCard && !e.target.closest('.property-overlay-link')) {
                // Only open modal if not clicking on the overlay link
                const hasOverlay = propertyCard.querySelector('.property-overlay');
                if (!hasOverlay || !e.target.closest('.property-overlay')) {
                    this.openModal(propertyCard);
                }
            }
        });
    }
    
    openModal(propertyCard) {
        const propertyData = this.extractPropertyData(propertyCard);
        this.populateModal(propertyData);
        this.show();
    }
    
    extractPropertyData(card) {
        // Extract data from the property card
        const title = card.querySelector('.property-title, .property-overlay-title')?.textContent || 'Luxury Property';
        const location = card.querySelector('.property-location, .property-overlay-location')?.textContent || 'Premium Location';
        const price = card.querySelector('.property-price, .property-overlay-price')?.textContent || 'Price on Request';
        const image = card.querySelector('img')?.src || '';
        const description = card.querySelector('.property-overlay-description')?.textContent || 
                          'Experience unparalleled luxury in this stunning property with premium amenities and world-class finishes.';
        
        // Extract features from the card or use defaults
        const featuresElement = card.querySelector('.property-features');
        let features = [];
        if (featuresElement) {
            features = Array.from(featuresElement.querySelectorAll('span')).map(span => span.textContent);
        }
        
        // Default features if none found
        if (features.length === 0) {
            features = this.getDefaultFeatures(title);
        }
        
        return {
            title,
            location,
            price,
            description,
            features,
            images: this.getPropertyImages(title, image),
            amenities: this.getPropertyAmenities(title)
        };
    }
    
    getDefaultFeatures(title) {
        // Property-specific features
        const propertyFeatures = {
            'Verdant Vistas': [
                { icon: '🏠', text: '3&4 Bedrooms' },
                { icon: '📐', text: '2244 sq.ft' },
                { icon: '🌿', text: 'Private Terrace Balconies' },
                { icon: '🏗️', text: 'Modern Architecture' },
                { icon: '✨', text: 'Luxury Amenities' },
                { icon: '🌆', text: 'City Views' },
                { icon: '🚗', text: 'Covered Parking' }
            ],
            'La Familia': [
                { icon: '🏠', text: '2&3 Bedrooms' },
                { icon: '📐', text: '1850 sq.ft' },
                { icon: '👨‍👩‍👧‍👦', text: 'Family-Oriented Design' },
                { icon: '📍', text: 'Premium Location' },
                { icon: '🏋️', text: 'Modern Amenities' },
                { icon: '🏡', text: 'Spacious Layout' },
                { icon: '🌳', text: 'Garden Views' }
            ],
            'La Vie': [
                { icon: '🏠', text: '3&4 Bedrooms' },
                { icon: '📐', text: '2200 sq.ft' },
                { icon: '🌅', text: 'Panoramic Views' },
                { icon: '🎨', text: 'Contemporary Design' },
                { icon: '🏆', text: 'World-Class Amenities' },
                { icon: '🏢', text: 'Prime Location' },
                { icon: '💎', text: 'Luxury Living' }
            ]
        };
        
        // Check if we have specific features for this property
        const propertySpecificFeatures = propertyFeatures[title];
        if (propertySpecificFeatures) {
            return propertySpecificFeatures;
        }
        
        // Generate features based on property title (fallback)
        const baseFeatures = [
            { icon: '🏠', text: 'Premium Location' },
            { icon: '🚗', text: 'Covered Parking' },
            { icon: '🏊', text: 'Swimming Pool' },
            { icon: '🏋️', text: 'Fitness Center' }
        ];
        
        if (title.toLowerCase().includes('penthouse') || title.toLowerCase().includes('sky')) {
            baseFeatures.push(
                { icon: '🌅', text: 'Panoramic Views' },
                { icon: '🏢', text: 'Private Terrace' },
                { icon: '✨', text: 'Luxury Finishes' }
            );
        } else if (title.toLowerCase().includes('ocean') || title.toLowerCase().includes('sea')) {
            baseFeatures.push(
                { icon: '🌊', text: 'Ocean Views' },
                { icon: '🏖️', text: 'Beach Access' },
                { icon: '🌅', text: 'Sunset Views' }
            );
        } else {
            baseFeatures.push(
                { icon: '🌳', text: 'Garden Views' },
                { icon: '🔒', text: 'Security System' },
                { icon: '🎯', text: 'Prime Location' }
            );
        }
        
        return baseFeatures;
    }
    
    getPropertyImages(title, mainImage) {
        // Property-specific image arrays
        const propertyImages = {
            'Verdant Vistas': [
                'images/properties/1-verdant vistas/Elevation 2.jpg',
                'images/properties/1-verdant vistas/1.webp',
                'images/properties/1-verdant vistas/2.jpg',
                'images/properties/1-verdant vistas/3.webp',
                'images/properties/1-verdant vistas/Clubhouse-Pool.webp',
                'images/properties/1-verdant vistas/Children\'s-Play-Area.webp',
                'images/properties/1-verdant vistas/Reading-Pod.webp',
                'images/properties/1-verdant vistas/Rooftop.webp',
                'images/properties/1-verdant vistas/Sky-Bar.webp'
            ],
            'La Familia': [
                'images/properties/2-La familia/1.webp',
                'images/properties/2-La familia/2.webp',
                'images/properties/2-La familia/3.webp',
                'images/properties/2-La familia/4.webp',
                'images/properties/2-La familia/5.webp',
                'images/properties/2-La familia/6.webp',
                'images/properties/2-La familia/7.webp'
            ],
            'La Vie': [
                'images/properties/3-La Vie/1.jpg',
                'images/properties/3-La Vie/2.jpg',
                'images/properties/3-La Vie/3.jpg',
                'images/properties/3-La Vie/4.jpg',
                'images/properties/3-La Vie/5.jpg',
                'images/properties/3-La Vie/6.jpg',
                'images/properties/3-La Vie/7.jpg'
            ]
        };
        
        // Check if we have specific images for this property
        const propertySpecificImages = propertyImages[title];
        if (propertySpecificImages) {
            return propertySpecificImages;
        }
        
        // Fallback: Create a set of images for the slideshow
        const images = [mainImage];
        
        // Add more stock images for demo with square 400x400 ratio
        const stockImages = [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&h=400&q=80',
            'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=400&h=400&q=80',
            'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=400&h=400&q=80',
            'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=400&h=400&q=80',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=400&h=400&q=80'
        ];
        
        // Add 3-4 additional images
        images.push(...stockImages.slice(0, 4));
        
        return images.filter(img => img); // Remove any empty strings
    }
    
    getPropertyAmenities(title) {
        // Property-specific amenities
        const propertyAmenities = {
            'Verdant Vistas': [
                'Swimming Pool',
                'Children\'s Play Area',
                'Reading Pod',
                'Rooftop Terrace',
                'Sky Bar',
                'Clubhouse',
                'Gymnasium',
                '24/7 Security',
                'Covered Parking',
                'Landscaped Gardens',
                'Power Backup',
                'Water Supply',
                'Maintenance Service',
                'Intercom Facility'
            ],
            'La Familia': [
                'Community Hall',
                'Garden Area',
                'Children\'s Play Zone',
                'Fitness Center',
                '24/7 Security',
                'Visitor Parking',
                'Power Backup',
                'High-Speed Internet',
                'Air Conditioning',
                'Modern Kitchen',
                'Marble Flooring',
                'Balcony/Terrace',
                'Water Supply',
                'Maintenance Service'
            ],
            'La Vie': [
                'Infinity Pool',
                'Spa & Wellness Center',
                'Business Lounge',
                'Concierge Service',
                'Valet Parking',
                'Rooftop Garden',
                'Smart Home Features',
                'High-Speed Internet',
                'Air Conditioning',
                'Premium Kitchen',
                'Italian Marble Flooring',
                'Private Balconies',
                'Power Backup',
                'Water Treatment Plant'
            ]
        };
        
        // Check if we have specific amenities for this property
        const propertySpecificAmenities = propertyAmenities[title];
        if (propertySpecificAmenities) {
            return propertySpecificAmenities;
        }
        
        // Fallback amenities
        const baseAmenities = [
            'High-Speed Internet',
            'Air Conditioning',
            'Modern Kitchen',
            'Marble Flooring',
            'Balcony/Terrace',
            'Power Backup',
            'Water Supply',
            'Maintenance Service'
        ];
        
        if (title.toLowerCase().includes('penthouse') || title.toLowerCase().includes('luxury')) {
            baseAmenities.push(
                'Concierge Service',
                'Valet Parking',
                'Private Elevator',
                'Butler Service',
                'Wine Cellar',
                'Home Theater'
            );
        }
        
        if (title.toLowerCase().includes('ocean') || title.toLowerCase().includes('sea')) {
            baseAmenities.push(
                'Beach Club Access',
                'Water Sports',
                'Boat Dock',
                'Outdoor Kitchen'
            );
        }
        
        return baseAmenities;
    }
    
    populateModal(data) {
        // Populate title, location, price
        this.modal.querySelector('.property-modal-title').textContent = data.title;
        this.modal.querySelector('.property-modal-location').textContent = data.location;
        this.modal.querySelector('.property-modal-price').textContent = data.price;
        this.modal.querySelector('.property-modal-description').textContent = data.description;
        
        // Populate images
        this.populateSlideshow(data.images);
        
        // Populate features
        this.populateFeatures(data.features);
        
        // Populate amenities
        this.populateAmenities(data.amenities);
    }
    
    populateSlideshow(images) {
        const slideshow = this.modal.querySelector('.property-modal-slideshow');
        const indicators = this.modal.querySelector('.property-modal-indicators');
        
        // Clear existing slides and indicators
        slideshow.innerHTML = '';
        indicators.innerHTML = '';
        
        this.slides = images;
        this.currentSlide = 0;
        
        // Create slides with optimized loading
        images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = `property-modal-slide ${index === 0 ? 'active' : ''}`;
            
            // Create image with proper loading attributes
            const img = document.createElement('img');
            img.src = image;
            img.alt = `Property image ${index + 1}`;
            img.loading = index === 0 ? 'eager' : 'lazy';
            img.decoding = 'async';
            
            // Ensure high quality image loading
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.objectPosition = 'center';
            img.style.display = 'block';
            
            // Add error handling for missing images
            img.onerror = function() {
                this.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&h=400&q=80';
                this.alt = 'Placeholder property image';
            };
            
            // Add loading state with smooth transition
            img.onload = function() {
                this.style.opacity = '1';
                this.style.filter = 'none';
            };
            
            // Start with opacity 0 for smooth loading
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            
            slide.appendChild(img);
            slideshow.appendChild(slide);
            
            // Create indicator
            const indicator = document.createElement('button');
            indicator.className = `property-modal-indicator ${index === 0 ? 'active' : ''}`;
            indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
            indicator.addEventListener('click', () => this.goToSlide(index));
            indicators.appendChild(indicator);
        });
        
        // Hide navigation if only one image
        const navBtns = this.modal.querySelectorAll('.property-modal-nav');
        navBtns.forEach(btn => {
            btn.style.display = images.length > 1 ? 'flex' : 'none';
        });
        indicators.style.display = images.length > 1 ? 'flex' : 'none';
        
        // Preload first few images for better performance
        this.preloadNextImages();
    }
    
    populateFeatures(features) {
        const grid = this.modal.querySelector('.property-modal-features-grid');
        grid.innerHTML = '';
        
        features.forEach(feature => {
            const featureElement = document.createElement('div');
            featureElement.className = 'property-modal-feature';
            
            if (typeof feature === 'object' && feature.icon) {
                featureElement.innerHTML = `
                    <span class="property-modal-feature-icon">${feature.icon}</span>
                    <span>${feature.text}</span>
                `;
            } else {
                featureElement.innerHTML = `
                    <span class="property-modal-feature-icon">✨</span>
                    <span>${feature}</span>
                `;
            }
            
            grid.appendChild(featureElement);
        });
    }
    
    populateAmenities(amenities) {
        const list = this.modal.querySelector('.property-modal-amenities-list');
        list.innerHTML = '';
        
        amenities.forEach(amenity => {
            const amenityElement = document.createElement('div');
            amenityElement.className = 'property-modal-amenity';
            amenityElement.textContent = amenity;
            list.appendChild(amenityElement);
        });
    }
    
    show() {
        document.body.style.overflow = 'hidden';
        this.modal.classList.add('active');
        this.isOpen = true;
        
        // Focus management for accessibility
        setTimeout(() => {
            const closeBtn = this.modal.querySelector('.property-modal-close');
            closeBtn.focus();
        }, 400);
    }
    
    close() {
        document.body.style.overflow = '';
        this.modal.classList.remove('active');
        this.isOpen = false;
    }
    
    nextSlide() {
        if (this.slides.length <= 1) return;
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlideDisplay();
    }
    
    previousSlide() {
        if (this.slides.length <= 1) return;
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlideDisplay();
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.currentSlide = index;
            this.updateSlideDisplay();
        }
    }
    
    updateSlideDisplay() {
        const slides = this.modal.querySelectorAll('.property-modal-slide');
        const indicators = this.modal.querySelectorAll('.property-modal-indicator');
        
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
        
        // Preload adjacent images for smoother transitions
        this.preloadAdjacentImages();
    }
    
    preloadNextImages() {
        // Preload first 3 images for better performance
        for (let i = 0; i < Math.min(3, this.slides.length); i++) {
            const img = new Image();
            img.src = this.slides[i];
        }
    }
    
    preloadAdjacentImages() {
        // Preload previous and next images
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        
        [prevIndex, nextIndex].forEach(index => {
            if (index !== this.currentSlide) {
                const img = new Image();
                img.src = this.slides[index];
            }
        });
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
        
        this.touchStartX = 0;
        this.touchEndX = 0;
    }
    
    scheduleViewing() {
        // Scroll to contact form
        this.close();
        setTimeout(() => {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                // Pre-fill the form if possible
                const propertyTitle = this.modal.querySelector('.property-modal-title').textContent;
                const messageField = document.querySelector('#message');
                const propertyTypeField = document.querySelector('#property_type');
                const budgetField = document.querySelector('#budget');
                if (messageField) {
                    messageField.value = `I would like to schedule a viewing for ${propertyTitle}. Please contact me with available times.`;
                    messageField.focus();
                }
                if (propertyTypeField) {
                    propertyTypeField.value = this.getPropertyTypeForTitle(propertyTitle);
                }
                if (budgetField) {
                    budgetField.value = this.getBudgetForTitle(propertyTitle);
                }
            }
        }, 500);
    }
    
    getMoreInfo() {
        // Redirect to WhatsApp with pre-filled message
        this.close();
        setTimeout(() => {
            const propertyTitle = this.modal.querySelector('.property-modal-title').textContent;
            const whatsappNumber = '9930363731';
            const message = encodeURIComponent(`Hello Palm properties! I would like more information about ${propertyTitle}.`);
            const whatsappUrl = `https://api.whatsapp.com/send/?phone=${whatsappNumber}&text=${message}&type=phone_number&app_absent=0`;
            window.open(whatsappUrl, '_blank');
        }, 300);
    }
    // Helper to map property title to property type dropdown value
    getPropertyTypeForTitle(title) {
        title = title.toLowerCase();
        if (title.includes('verdant vistas')) return 'Residential Apartment';
        if (title.includes('la familia')) return 'Residential Apartment';
        if (title.includes('la vie')) return 'Penthouse';
        // Add more mappings as needed
        return '';
    }

    // Helper to map property title to budget dropdown value
    getBudgetForTitle(title) {
        title = title.toLowerCase();
        if (title.includes('verdant vistas')) return '2 - 5 Crores';
        if (title.includes('la familia')) return '2 - 5 Crores';
        if (title.includes('la vie')) return '5+ Crores';
        // Add more mappings as needed
        return '';
    }
}

// Initialize the property modal when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're not already initialized
    if (!window.propertyModal) {
        window.propertyModal = new PropertyModal();
    }
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PropertyModal;
}
