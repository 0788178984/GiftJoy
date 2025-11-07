document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const modal = document.getElementById('gift-modal');
    const createGiftBtn = document.querySelector('.btn-primary');
    const closeBtn = document.querySelector('.close');
    const previewGiftBtn = document.getElementById('preview-gift');
    const themeOptions = document.querySelectorAll('.theme-option');
    const giftTypeOptions = document.querySelectorAll('.gift-type-option');
    const occasionCards = document.querySelectorAll('.occasion-card');
    
    // Current gift type and uploaded image
    let selectedGiftType = 'gift-box';
    let uploadedImage = null;
    
    // Audio elements for different occasions
    const audioElements = {
        birthday: new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'),
        christmas: new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'),
        easter: new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'),
        valentine: new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'),
        anniversary: new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'),
        thankyou: new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3')
    };
    
    // Gift templates for different occasions
    const giftTemplates = {
        birthday: {
            background: 'linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)',
            image: '🎂',
            message: 'Wishing you a fantastic birthday filled with joy and happiness!'
        },
        christmas: {
            background: 'linear-gradient(135deg, #2BC0E4 0%, #EAECC6 100%)',
            image: '🎄',
            message: 'Wishing you a Merry Christmas and a Happy New Year!'
        },
        easter: {
            background: 'linear-gradient(135deg, #A1FFCE 0%, #FAFFD1 100%)',
            image: '🐰',
            message: 'Wishing you a hoppy Easter filled with joy and chocolate!'
        },
        valentine: {
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
            image: '❤️',
            message: 'Sending you all my love on this special day!'
        },
        anniversary: {
            background: 'linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)',
            image: '💝',
            message: 'Celebrating the love and memories we\'ve shared. Happy Anniversary!'
        },
        thankyou: {
            background: 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)',
            image: '🙏',
            message: 'Thank you for everything. Your kindness means the world to me!'
        }
    };
    
    // Initialize the app
    function init() {
        setupEventListeners();
        animateElementsOnScroll();
        preloadAudio();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Modal controls
        document.querySelectorAll('.btn-primary:not(#preview-gift)').forEach(btn => {
            btn.addEventListener('click', openModal);
        });
        
        closeBtn.addEventListener('click', closeModal);
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
                updateGiftPreview();
            });
        });
        
        // Occasion card selection
        occasionCards.forEach(card => {
            card.addEventListener('click', () => {
                const occasion = card.getAttribute('data-occasion');
                openModal(occasion);
            });
        });
        
        // Form submission
        previewGiftBtn.addEventListener('click', createGift);
    }
    
    // Open modal with optional occasion pre-selection
    function openModal(occasion = '') {
        if (occasion) {
            document.getElementById('occasion').value = occasion;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Stop any playing audio when closing modal
        Object.values(audioElements).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }
    
    // Update gift preview based on selected type
    function updateGiftPreview() {
        const giftPreview = document.querySelector('.gift-card-preview');
        if (!giftPreview) return;
        
        // Clear previous content
        giftPreview.innerHTML = '';
        giftPreview.className = 'gift-card-preview';
        giftPreview.classList.add(selectedGiftType);
        
        // Add content based on gift type
        switch(selectedGiftType) {
            case 'gift-box':
                giftPreview.innerHTML = `
                    <div class="gift-box">
                        <div class="gift-lid"></div>
                        <div class="gift-body">
                            <div class="ribbon"></div>
                            <div class="ribbon ribbon-2"></div>
                        </div>
                        <div class="gift-tag">To: You</div>
                    </div>
                `;
                break;
                
            case 'love-letter':
                giftPreview.innerHTML = `
                    <div class="love-letter">
                        <div class="envelope">
                            <div class="letter">
                                <div class="letter-content">
                                    <p>Dear You,</p>
                                    <p>You're amazing!</p>
                                    <p class="signature">❤️</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            case 'birthday':
                giftPreview.innerHTML = `
                    <div class="birthday-cake">
                        <div class="cake">
                            <div class="candle">
                                <div class="flame"></div>
                            </div>
                        </div>
                        <div class="plate"></div>
                    </div>
                `;
                break;
                
            case 'heart':
                giftPreview.innerHTML = `
                    <div class="heart-container">
                        <div class="form-group">
                            <label for="sender-name-input">Your Name</label>
                            <input type="text" id="sender-name-input" placeholder="Enter your name">
                        </div>
                        <div class="form-group">
                            <label for="message">Your Message</label>
                            <textarea id="message" rows="4" placeholder="Write your heartfelt message here..."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="gift-image">Add a Photo (Optional)</label>
                            <input type="file" id="gift-image" accept="image/*">
                            <div id="image-preview" class="image-preview"></div>
                        </div>
                    </div>
                `;
                break;
                
            case 'egg':
                giftPreview.innerHTML = `
                    <div class="easter-egg">
                        <div class="egg">
                            <div class="pattern"></div>
                        </div>
                        <div class="shadow"></div>
                    </div>
                `;
                break;
                
            case 'bubble-wrap':
                let bubbles = '';
                for (let i = 0; i < 16; i++) {
                    bubbles += '<div class="bubble"></div>';
                }
                giftPreview.innerHTML = `
                    <div class="bubble-wrap">
                        ${bubbles}
                    </div>
                    <p class="bubble-instruction">Click to pop!</p>
                `;
                
                // Add bubble pop functionality
                setTimeout(() => {
                    document.querySelectorAll('.bubble').forEach(bubble => {
                        bubble.addEventListener('click', function() {
                            this.style.transform = 'scale(0.2)';
                            this.style.opacity = '0';
                            
                            // Play pop sound
                            const popSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2582/2582-preview.mp3');
                            popSound.volume = 0.3;
                            popSound.play().catch(e => console.log('Audio play failed:', e));
                        });
                    });
                }, 100);
                break;
                
            case 'scratch':
                giftPreview.innerHTML = `
                    <div class="scratch-card">
                        <div class="scratch-overlay"></div>
                        <div class="scratch-content">
                            <div class="surprise">
                                <div class="surprise-icon">🎉</div>
                                <p>You won a surprise!</p>
                            </div>
                        </div>
                    </div>
                `;
                
                // Initialize scratch card
                setTimeout(() => {
                    initScratchCard();
                }, 100);
                break;
        }
    }
    
    // Initialize scratch card functionality
    function initScratchCard() {
        const overlay = document.querySelector('.scratch-overlay');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        
        // Set canvas size
        function resizeCanvas() {
            const rect = overlay.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            
            // Fill with gray
            ctx.fillStyle = '#999';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add scratch text
            ctx.fillStyle = '#777';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Scratch to reveal', canvas.width / 2, canvas.height / 2);
        }
        
        // Initial resize
        resizeCanvas();
        
        // Replace overlay with canvas
        overlay.innerHTML = '';
        overlay.appendChild(canvas);
        
        // Mouse/touch event handlers
        function startDrawing(e) {
            isDrawing = true;
            [lastX, lastY] = getPosition(e);
        }
        
        function draw(e) {
            if (!isDrawing) return;
            
            const [x, y] = getPosition(e);
            
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.lineWidth = 40;
            
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
            
            [lastX, lastY] = [x, y];
        }
        
        function stopDrawing() {
            isDrawing = false;
            
            // Check if most of the card is revealed
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let transparentPixels = 0;
            
            for (let i = 0; i < pixels.length; i += 4) {
                if (pixels[i + 3] < 128) {
                    transparentPixels++;
                }
            }
            
            const transparency = (transparentPixels / (pixels.length / 4)) * 100;
            if (transparency > 50) {
                // Play reveal sound
                const revealSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1432/1432-preview.mp3');
                revealSound.volume = 0.5;
                revealSound.play().catch(e => console.log('Audio play failed:', e));
            }
        }
        
        function getPosition(e) {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const y = (e.clientY || e.touches[0].clientY) - rect.top;
            return [x, y];
        }
        
        // Add event listeners
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        
        // Touch events for mobile
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startDrawing(e.touches[0]);
        });
        
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            draw(e.touches[0]);
        });
        
        canvas.addEventListener('touchend', stopDrawing);
        
        // Handle window resize
        window.addEventListener('resize', resizeCanvas);
    }
    
    // Create and display the gift
    function createGift() {
        const occasion = document.getElementById('occasion').value;
        const recipientName = document.getElementById('recipient-name').value || 'Friend';
        const message = document.getElementById('message').value || giftTemplates[occasion].message;
        const theme = document.querySelector('.theme-option.active')?.getAttribute('data-theme') || 'classic';
        
        // Create gift preview container
        const giftPreview = document.createElement('div');
        giftPreview.className = 'gift-preview';
        giftPreview.style.background = giftTemplates[occasion].background;
        giftPreview.style.padding = '2rem';
        giftPreview.style.borderRadius = '15px';
        giftPreview.style.textAlign = 'center';
        giftPreview.style.color = 'white';
        giftPreview.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        
        // Add content based on gift type
        switch(selectedGiftType) {
            case 'gift-box':
                giftPreview.innerHTML = `
                    <div class="gift-box-preview">
                        <div class="gift-box">
                            <div class="gift-lid"></div>
                            <div class="gift-body">
                                <div class="ribbon"></div>
                                <div class="ribbon ribbon-2"></div>
                            </div>
                            <div class="gift-tag">To: ${recipientName}</div>
                        </div>
                        <div class="gift-message">
                            <h3>For ${recipientName}</h3>
                            <p>${message}</p>
                        </div>
                    </div>
                    <p style="margin-top: 2rem; font-style: italic;">Created with ❤️ using GiftJoy</p>
                `;
                break;
                
            case 'love-letter':
                giftPreview.innerHTML = `
                    <div class="love-letter-preview">
                        <div class="envelope">
                            <div class="letter">
                                <div class="letter-content">
                                    <p>Dear ${recipientName},</p>
                                    <p>${message}</p>
                                    <p class="signature">❤️</p>
                                </div>
                            </div>
                        </div>
                        <p style="margin-top: 2rem; font-style: italic;">Created with ❤️ using GiftJoy</p>
                    </div>
                `;
                break;
                
            // Add other gift type previews...
            
            default:
                // Default gift preview
                giftPreview.innerHTML = `
                    <div style="font-size: 4rem; margin-bottom: 1rem;">${giftTemplates[occasion].image}</div>
                    <h2 style="color: white; margin-bottom: 1rem;">For ${recipientName}</h2>
                    <p style="font-size: 1.2rem; line-height: 1.6;">${message}</p>
                    <p style="margin-top: 2rem; font-style: italic;">Created with ❤️ using GiftJoy</p>
                `;
        }
        
        // Clear previous preview if any
        const existingPreview = document.querySelector('.gift-preview-container');
        if (existingPreview) {
            existingPreview.remove();
        }
        
        const previewContainer = document.createElement('div');
        previewContainer.className = 'gift-preview-container';
        previewContainer.style.marginTop = '2rem';
        previewContainer.appendChild(giftPreview);
        
        // Add share buttons
        const shareButtons = document.createElement('div');
        shareButtons.className = 'share-buttons';
        shareButtons.style.marginTop = '2rem';
        shareButtons.style.display = 'flex';
        shareButtons.style.justifyContent = 'center';
        shareButtons.style.gap = '1rem';
        shareButtons.innerHTML = `
            <button id="share-whatsapp" class="btn-primary" style="background: #25D366;">
                <i class="fab fa-whatsapp"></i> Share on WhatsApp
            </button>
            <button id="copy-link" class="btn-primary" style="background: var(--primary-color);">
                <i class="fas fa-link"></i> Copy Link
            </button>
            <button id="download-gift" class="btn-primary" style="background: #FF6B6B;">
                <i class="fas fa-download"></i> Download
            </button>
        `;
        
        previewContainer.appendChild(shareButtons);
        document.querySelector('.gift-form').appendChild(previewContainer);
        
        // Add event listeners for share buttons
        document.getElementById('share-whatsapp').addEventListener('click', () => {
            const text = `Check out this ${occasion} gift I made for you!`;
            const url = window.location.href;
            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        });
        
        document.getElementById('copy-link').addEventListener('click', () => {
            const tempInput = document.createElement('input');
            tempInput.value = window.location.href;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            const copyBtn = document.getElementById('copy-link');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        });
        
        document.getElementById('download-gift').addEventListener('click', () => {
            // In a real app, this would generate and download an image of the gift
            alert('In a real implementation, this would download the gift as an image.');
        });
        
        // Play appropriate audio for the occasion
        playAudio(occasion);
        
        // Scroll to preview
        giftPreview.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Play audio for the selected occasion
    function playAudio(occasion) {
        // Stop any currently playing audio
        Object.values(audioElements).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        
        // Play the audio for the selected occasion
        if (audioElements[occasion]) {
            audioElements[occasion].play().catch(e => console.log('Auto-play was prevented:', e));
        }
    }
    
    // Preload audio files
    function preloadAudio() {
        Object.values(audioElements).forEach(audio => {
            audio.preload = 'auto';
            audio.load();
        });
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
    
    // Initialize the app
    init();
});
