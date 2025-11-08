document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const modal = document.getElementById('gift-modal');
    const createGiftBtn = document.querySelector('.btn-primary');
    const closeBtn = document.querySelector('.close');
    const previewGiftBtn = document.getElementById('preview-gift');
    const themeOptions = document.querySelectorAll('.theme-option');
    const giftTypeOptions = document.querySelectorAll('.gift-type-option');
    const occasionCards = document.querySelectorAll('.occasion-card');
    const imageInput = document.getElementById('gift-image');
    const imagePreview = document.getElementById('image-preview');
    
    // Current gift type and uploaded image
    let selectedGiftType = 'gift-box';
    let uploadedImage = null;
    
    // Initialize the app
    init();
    
    function init() {
        setupEventListeners();
        animateElementsOnScroll();
        checkStorageUsage();
    }
    
    // Check localStorage usage and warn if getting full
    function checkStorageUsage() {
        try {
            let totalSize = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    totalSize += localStorage[key].length + key.length;
                }
            }
            
            // Convert to KB
            const sizeInKB = (totalSize / 1024).toFixed(2);
            const estimatedLimit = 5120; // ~5MB in KB
            const percentUsed = ((totalSize / 1024) / estimatedLimit * 100).toFixed(1);
            
            console.log(`📦 Storage Usage: ${sizeInKB} KB / ~${estimatedLimit} KB (${percentUsed}%)`);
            
            // Warn if over 80% full
            if (percentUsed > 80) {
                console.warn('⚠️ Storage is getting full! Consider clearing old gifts.');
            }
        } catch (e) {
            console.error('Could not check storage usage:', e);
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('nav');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                nav.classList.toggle('active');
            });
            
            // Close menu when clicking on a link
            document.querySelectorAll('nav a').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('active');
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                    nav.classList.remove('active');
                }
            });
        }
        
        // Modal controls
        document.querySelectorAll('.btn-primary:not(#preview-gift)').forEach(btn => {
            btn.addEventListener('click', openModal);
        });
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Theme selection
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });
        
        // Gift type selection
        giftTypeOptions.forEach(option => {
            option.addEventListener('click', () => {
                giftTypeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                selectedGiftType = option.getAttribute('data-gift-type');
            });
        });
        
        // Occasion card selection
        occasionCards.forEach(card => {
            card.addEventListener('click', () => {
                const occasion = card.getAttribute('data-occasion');
                openModal(occasion);
            });
        });
        
        // Image upload
        if (imageInput) {
            imageInput.addEventListener('change', handleImageUpload);
        }
        
        // Form submission
        if (previewGiftBtn) {
            previewGiftBtn.addEventListener('click', createGift);
        }
    }
    
    // Handle image upload with compression
    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            // Check file size (limit to 2MB before compression)
            if (file.size > 2 * 1024 * 1024) {
                alert('Image is too large. Please choose an image smaller than 2MB.');
                e.target.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                // Compress the image before storing
                compressImage(event.target.result, (compressedImage) => {
                    uploadedImage = compressedImage;
                    imagePreview.innerHTML = `<img src="${uploadedImage}" alt="Preview">`;
                    imagePreview.classList.add('active');
                });
            };
            reader.readAsDataURL(file);
        }
    }
    
    // Compress image to reduce storage size
    function compressImage(dataUrl, callback) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set max dimensions
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            
            let width = img.width;
            let height = img.height;
            
            // Calculate new dimensions
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to JPEG with 0.7 quality for better compression
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            callback(compressedDataUrl);
        };
        img.src = dataUrl;
    }
    
    // Open modal with optional occasion pre-selection
    function openModal(occasion = '') {
        if (occasion && typeof occasion === 'string') {
            const occasionSelect = document.getElementById('occasion');
            if (occasionSelect) {
                occasionSelect.value = occasion;
            }
        }
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Close modal
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    
    // Generate unique gift ID
    function generateGiftId() {
        return 'gift_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Create and display the gift
    async function createGift() {
        const occasion = document.getElementById('occasion')?.value || 'birthday';
        const recipientName = document.getElementById('recipient-name')?.value || 'Friend';
        const senderName = document.getElementById('sender-name-input')?.value || 'Someone Special';
        const message = document.getElementById('message')?.value || 'Wishing you all the happiness in the world!';
        const theme = document.querySelector('.theme-option.active')?.getAttribute('data-theme') || 'classic';
        const enableQuest = document.getElementById('enable-quest')?.checked || false;
        
        // Get new features data
        const color = window.giftFeatures ? window.giftFeatures.getColor() : '#FF6B9D';
        const stickers = window.giftFeatures ? window.giftFeatures.getStickers() : [];
        const audio = window.giftFeatures ? window.giftFeatures.getAudio() : null;
        
        // Generate unique gift ID
        const giftId = generateGiftId();
        
        // Create gift data object
        const giftData = {
            id: giftId,
            occasion,
            recipient: recipientName,
            sender: senderName,
            message,
            theme,
            giftType: selectedGiftType,
            image: uploadedImage,
            audio: audio,
            color: color,
            stickers: stickers,
            enableQuest: enableQuest,
            createdAt: new Date().toISOString()
        };
        
        // Save to cloud if Firebase is available, otherwise use local storage
        try {
            if (window.firebaseApp && window.firebaseApp.isInitialized) {
                // Upload image and audio to cloud storage if present
                if (uploadedImage) {
                    giftData.image = await window.firebaseApp.uploadImage(uploadedImage, giftId);
                }
                if (audio) {
                    giftData.audio = await window.firebaseApp.uploadAudio(audio, giftId);
                }
                
                await window.firebaseApp.saveGift(giftData);
                console.log('✅ Gift saved to cloud');
            } else {
                await window.giftStorage.saveGift(giftData);
                console.log('✅ Gift saved to local storage');
            }
        } catch (e) {
            console.error('Error saving gift:', e);
            alert('❌ Failed to save gift. Please try again.');
            return;
        }
        
        // Generate gift link
        const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');
        const giftUrl = `${baseUrl}gift.html?id=${giftId}${enableQuest ? '&quest=true' : ''}`;
        
        // Create preview container
        const existingPreview = document.querySelector('.gift-preview-container');
        if (existingPreview) {
            existingPreview.remove();
        }
        
        const previewContainer = document.createElement('div');
        previewContainer.className = 'gift-preview-container';
        previewContainer.style.marginTop = '2rem';
        
        // Create gift preview
        const giftPreview = document.createElement('div');
        giftPreview.className = 'gift-preview';
        giftPreview.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        giftPreview.style.padding = '2rem';
        giftPreview.style.borderRadius = '15px';
        giftPreview.style.textAlign = 'center';
        giftPreview.style.color = 'white';
        giftPreview.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        
        giftPreview.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">🎁</div>
            <h2 style="color: white; margin-bottom: 1rem;">Gift Created Successfully!</h2>
            <p style="font-size: 1rem; margin-bottom: 1.5rem;">Your gift for ${recipientName} is ready to be shared!</p>
            <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 10px; margin: 1rem 0;">
                <p style="font-size: 0.9rem; word-break: break-all;">${giftUrl}</p>
            </div>
        `;
        
        previewContainer.appendChild(giftPreview);
        
        // Add share buttons
        const shareButtons = document.createElement('div');
        shareButtons.className = 'share-buttons';
        shareButtons.style.marginTop = '2rem';
        shareButtons.style.display = 'flex';
        shareButtons.style.flexWrap = 'wrap';
        shareButtons.style.justifyContent = 'center';
        shareButtons.style.gap = '1rem';
        shareButtons.innerHTML = `
            <button id="view-gift" class="btn-primary" style="background: #667eea;">
                <i class="fas fa-eye"></i> View Gift
            </button>
            <button id="copy-link" class="btn-primary" style="background: #764ba2;">
                <i class="fas fa-link"></i> Copy Link
            </button>
            <button id="share-whatsapp" class="btn-primary" style="background: #25D366;">
                <i class="fab fa-whatsapp"></i> WhatsApp
            </button>
            <button id="share-twitter" class="btn-primary" style="background: #1DA1F2;">
                <i class="fab fa-twitter"></i> Twitter
            </button>
            <button id="share-email" class="btn-primary" style="background: #EA4335;">
                <i class="fas fa-envelope"></i> Email
            </button>
            <button id="share-facebook" class="btn-primary" style="background: #1877F2;">
                <i class="fab fa-facebook"></i> Facebook
            </button>
        `;
        
        previewContainer.appendChild(shareButtons);
        
        const giftForm = document.querySelector('.gift-form');
        if (giftForm) {
            giftForm.appendChild(previewContainer);
        }
        
        // Add event listeners for share buttons
        setTimeout(() => {
            document.getElementById('view-gift')?.addEventListener('click', () => {
                window.open(giftUrl, '_blank');
            });
            
            document.getElementById('copy-link')?.addEventListener('click', () => {
                copyToClipboard(giftUrl);
                const btn = document.getElementById('copy-link');
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                }, 2000);
            });
            
            document.getElementById('share-whatsapp')?.addEventListener('click', () => {
                const text = `🎁 ${senderName} sent you a special gift! Open it here:`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + giftUrl)}`, '_blank');
            });
            
            document.getElementById('share-twitter')?.addEventListener('click', () => {
                const text = `🎁 I just received an amazing gift! Check out GiftJoy to create your own surprise gifts!`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(giftUrl)}`, '_blank');
            });
            
            document.getElementById('share-email')?.addEventListener('click', () => {
                const subject = `${senderName} sent you a gift!`;
                const body = `Hi ${recipientName},\n\n${senderName} has created a special gift for you!\n\nOpen your gift here: ${giftUrl}\n\nEnjoy!\n\nCreated with ❤️ using GiftJoy`;
                window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            });
            
            document.getElementById('share-facebook')?.addEventListener('click', () => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(giftUrl)}`, '_blank');
            });
        }, 100);
        
        // Scroll to preview
        previewContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Copy to clipboard function
    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).catch(err => {
                fallbackCopyToClipboard(text);
            });
        } else {
            fallbackCopyToClipboard(text);
        }
    }
    
    function fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
        document.body.removeChild(textArea);
    }
    
    // Animate elements when they come into view
    function animateElementsOnScroll() {
        const animateElements = document.querySelectorAll('.occasion-card, .step');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        animateElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
            observer.observe(element);
        });
    }
});

// Global function to clear old gifts
async function clearOldGifts() {
    try {
        const gifts = await window.giftStorage.getAllGifts();
        
        if (gifts.length === 0) {
            alert('No gifts found in storage.');
            return;
        }
        
        const message = `Found ${gifts.length} gift(s) in storage.\n\nClearing these will free up space for new gifts.\n\nDo you want to continue?`;
        
        if (confirm(message)) {
            await window.giftStorage.clearAllGifts();
            alert(`✅ Successfully cleared ${gifts.length} gift(s)!\n\nYou can now create new gifts.`);
            
            // Show updated storage info
            const estimate = await window.giftStorage.getStorageEstimate();
            if (estimate) {
                console.log('💾 Storage Available:', estimate.available);
            }
        }
    } catch (e) {
        console.error('Error clearing gifts:', e);
        alert('Failed to clear gifts. Please try again.');
    }
}
