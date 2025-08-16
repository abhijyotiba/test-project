# Images Folder Structure

This folder contains all organized images for the Prestige Properties website.

## 📁 Folder Structure

### `/properties/`
**Purpose**: Property listing images for the main property cards
**Usage**: Featured property photos, property thumbnails
**Recommended formats**: JPG, WebP
**Optimal size**: 600x400px to 800x600px
**Examples**:
- `sky-sanctuary.jpg`
- `ocean-embrace.jpg`
- `metropolitan-muse.jpg`

### `/hero/`
**Purpose**: Hero section slideshow images
**Usage**: Background images for the main hero carousel
**Recommended formats**: JPG, WebP
**Optimal size**: 1920x1080px (Full HD)
**Examples**:
- `hero-slide-1.jpg`
- `hero-slide-2.jpg`
- `hero-slide-3.jpg`

### `/partners/`
**Purpose**: Partner company logos
**Usage**: Trusted partners carousel section
**Recommended formats**: PNG (with transparency), SVG
**Optimal size**: 200x100px to 300x150px
**Examples**:
- `dlf-logo.png`
- `godrej-logo.png`
- `lodha-logo.png`

### `/about/`
**Purpose**: About section images
**Usage**: Team photos, company images, testimonial backgrounds
**Recommended formats**: JPG, WebP
**Optimal size**: 800x600px
**Examples**:
- `family-photo.jpg`
- `team-photo.jpg`
- `office-interior.jpg`

### `/contact/`
**Purpose**: Contact section images
**Usage**: Contact form background, office photos
**Recommended formats**: JPG, WebP
**Optimal size**: 800x600px
**Examples**:
- `contact-bg.jpg`
- `office-exterior.jpg`

### `/refined-living/`
**Purpose**: Refined living section images
**Usage**: Lifestyle and luxury living showcase
**Recommended formats**: JPG, WebP
**Optimal size**: 800x600px
**Examples**:
- `luxury-interior.jpg`
- `refined-lifestyle.jpg`

### `/icons/`
**Purpose**: UI icons, logos, and small graphics
**Usage**: Website icons, social media icons, decorative elements
**Recommended formats**: SVG, PNG
**Optimal size**: 24x24px to 64x64px
**Examples**:
- `logo.svg`
- `arrow-right.svg`
- `location-pin.svg`

## 🎯 Image Guidelines

### Quality Standards
- **Resolution**: High-resolution images for crisp display
- **Compression**: Optimize for web (balance quality vs file size)
- **Format**: Use WebP when possible for better compression

### Naming Convention
- Use lowercase letters
- Use hyphens instead of spaces
- Be descriptive but concise
- Include version numbers if needed (e.g., `hero-v2.jpg`)

### Performance Tips
- Optimize images before uploading
- Use appropriate formats (JPG for photos, PNG for graphics with transparency, SVG for icons)
- Consider using different sizes for responsive design
- Implement lazy loading for better performance

## 🔄 Migration from /assets/

To migrate existing images from the `/assets/` folder:

1. Move partner logos from `/assets/` to `/images/partners/`
2. Move family.jpeg from `/assets/` to `/images/about/`
3. Update HTML references accordingly

## 📱 Responsive Considerations

Consider creating multiple sizes for responsive design:
- Mobile: 400x300px
- Tablet: 600x400px  
- Desktop: 800x600px
- Large screens: 1200x800px

## 🚀 Future Additions

As the website grows, consider adding:
- `/images/gallery/` - Property gallery images
- `/images/blog/` - Blog post featured images
- `/images/testimonials/` - Client photos
- `/images/awards/` - Awards and certifications
