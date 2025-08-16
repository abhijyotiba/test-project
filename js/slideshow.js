// Enhanced Hero Slideshow with Split Reveal Transition
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Hero Slideshow Implementation
    (function() {
        const slides = document.querySelectorAll('.hero-slide');
        
        if (slides.length <= 1) {
            return;
        }

        let currentSlide = 0;
        const slideInterval = 6000; // 6 seconds
        let isTransitioning = false;
        let autoSlideTimer;

        // Initialize slideshow
        function initSlideshow() {
            
            // Set initial states
            slides.forEach((slide, index) => {
                if (index === 0) {
                    slide.style.opacity = '1';
                    slide.style.zIndex = '2';
                    slide.style.visibility = 'visible';
                    slide.classList.add('active');
                    slide.classList.remove('inactive');
                } else {
                    slide.style.opacity = '0';
                    slide.style.zIndex = '1';
                    slide.style.visibility = 'hidden';
                    slide.classList.remove('active');
                    slide.classList.add('inactive');
                }
            });
            
            // Start auto-slide
            startAutoSlide();
        }

        // Enhanced slide transition
        function showSlide(nextIndex) {
            if (isTransitioning || nextIndex === currentSlide || nextIndex >= slides.length) {
                return Promise.resolve();
            }
            

            isTransitioning = true;
            
            const currentSlideEl = slides[currentSlide];
            const nextSlideEl = slides[nextIndex];
            
            // Check if we should use the enhanced split transition
            const shouldUseSplitTransition = 
                window.innerWidth > 768 && 
                !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
                !document.hidden;
            
            if (shouldUseSplitTransition && typeof window.runSplitTransition === 'function') {
                return window.runSplitTransition(currentSlide, nextIndex).then(() => {
                    currentSlide = nextIndex;
                    isTransitioning = false;
                });
            } else {
                // Simple fade transition
                return simpleTransition(currentSlideEl, nextSlideEl, nextIndex);
            }
        }

        // Simple fade transition fallback
        function simpleTransition(currentSlideEl, nextSlideEl, nextIndex) {
            return new Promise((resolve) => {
                // Prepare next slide
                nextSlideEl.style.opacity = '0';
                nextSlideEl.style.zIndex = '3';
                nextSlideEl.style.visibility = 'visible';
                nextSlideEl.classList.add('active');
                nextSlideEl.classList.remove('inactive');
                
                // Force reflow
                nextSlideEl.offsetHeight;
                
                // Animate transition
                requestAnimationFrame(() => {
                    nextSlideEl.style.transition = 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1)';
                    nextSlideEl.style.opacity = '1';
                    
                    if (currentSlideEl) {
                        currentSlideEl.style.transition = 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1)';
                        currentSlideEl.style.opacity = '0';
                    }
                });
                
                // Clean up after transition
                setTimeout(() => {
                    if (currentSlideEl) {
                        currentSlideEl.style.zIndex = '1';
                        currentSlideEl.style.visibility = 'hidden';
                        currentSlideEl.classList.remove('active');
                        currentSlideEl.classList.add('inactive');
                    }
                    
                    nextSlideEl.style.zIndex = '2';
                    
                    // Clean up other slides
                    slides.forEach((slide, i) => {
                        if (i !== nextIndex) {
                            slide.style.opacity = '0';
                            slide.style.zIndex = '1';
                            slide.style.visibility = 'hidden';
                            slide.classList.remove('active');
                            slide.classList.add('inactive');
                        }
                    });
                    
                    currentSlide = nextIndex;
                    isTransitioning = false;
                    resolve();
                }, 800);
            });
        }

        // Next slide function
        function nextSlide() {
            if (isTransitioning) return;
            
            const nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        }

        // Auto-slide functionality
        function startAutoSlide() {
            stopAutoSlide(); // Clear any existing timer
            
            autoSlideTimer = setInterval(() => {
                if (!document.hidden && !isTransitioning) {
                    nextSlide();
                }
            }, slideInterval);
        }

        function stopAutoSlide() {
            if (autoSlideTimer) {
                clearInterval(autoSlideTimer);
                autoSlideTimer = null;
            }
        }

        // Pause auto-slide when page is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoSlide();
            } else {
                startAutoSlide();
            }
        });

        // Initialize the slideshow
        initSlideshow();
        
        // Make transition function globally available for split animation
        window.runSimpleTransition = simpleTransition;
        
    })();

    // Enhanced Split Transition Effect
    function runSplitTransition(currentIndex, nextIndex) {
        const hero = document.querySelector('.hero');
        const slides = document.querySelectorAll('.hero-slide');
        
        if (!hero || !slides[currentIndex] || !slides[nextIndex]) {
            return Promise.resolve();
        }
        
        return new Promise((resolve) => {
            try {
                const currentSlide = slides[currentIndex];
                const nextSlide = slides[nextIndex];
                
                // Get image source - handle both img elements and background images
                let currentImgSrc = '';
                if (currentSlide.tagName === 'IMG') {
                    currentImgSrc = currentSlide.src;
                } else {
                    // Try to get background image from computed styles
                    const bgImage = window.getComputedStyle(currentSlide).backgroundImage;
                    const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                    currentImgSrc = match ? match[1] : '';
                }
                
                if (!currentImgSrc) {
                    // Fallback to simple transition if no image source found
                    return window.runSimpleTransition(currentSlide, nextSlide, nextIndex).then(resolve);
                }
                

                
                // Prepare next slide
                nextSlide.style.opacity = '1';
                nextSlide.style.zIndex = '3';
                nextSlide.style.visibility = 'visible';
                nextSlide.classList.add('active');
                nextSlide.classList.remove('inactive');
                
                // Create slice overlay
                const overlay = document.createElement('div');
                overlay.className = 'slice-overlay';
                overlay.setAttribute('aria-hidden', 'true');
                
                // Create slices
                const sliceCount = Math.min(7, Math.max(3, Math.floor(window.innerWidth / 200)));
                
                for (let i = 0; i < sliceCount; i++) {
                    const slice = document.createElement('div');
                    slice.className = 'slice';
                    slice.style.backgroundImage = `url(${currentImgSrc})`;
                    slice.style.backgroundSize = `${sliceCount * 100}% 100%`;
                    slice.style.backgroundPosition = `${(i * 100) / (sliceCount - 1)}% center`;
                    slice.style.backgroundRepeat = 'no-repeat';
                    overlay.appendChild(slice);
                }
                
                hero.appendChild(overlay);
                
                // Animate slices
                requestAnimationFrame(() => {
                    const slices = overlay.querySelectorAll('.slice');
                    slices.forEach((slice, index) => {
                        setTimeout(() => {
                            slice.style.transform = 'translateY(-100%)';
                        }, index * 80);
                    });
                });
                
                // Clean up
                setTimeout(() => {
                    currentSlide.style.opacity = '0';
                    currentSlide.style.zIndex = '1';
                    currentSlide.style.visibility = 'hidden';
                    currentSlide.classList.remove('active');
                    currentSlide.classList.add('inactive');
                    
                    nextSlide.style.zIndex = '2';
                    
                    overlay.remove();
                    resolve();
                }, sliceCount * 80 + 600);
                
            } catch (error) {
                console.error('Split transition error:', error);
                // Fallback to simple transition
                window.runSimpleTransition(slides[currentIndex], slides[nextIndex], nextIndex).then(resolve);
            }
        });
    }
    
    // Make split transition globally available
    window.runSplitTransition = runSplitTransition;
    
});
