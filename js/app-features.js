// Additional features for GiftJoy - Color picker, Audio, Stickers, Firebase integration

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase
    if (typeof window.firebaseApp !== 'undefined') {
        window.firebaseApp.initialize();
        setupAuthUI();
    }
    
    // Feature variables
    let selectedColor = '#FF6B9D';
    let selectedStickers = [];
    let uploadedAudio = null;
    
    // Setup event listeners for new features
    setupColorPicker();
    setupStickerSelector();
    setupAudioUpload();
    
    // Color Picker
    function setupColorPicker() {
        const colorOptions = document.querySelectorAll('.color-option');
        
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                colorOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                selectedColor = option.getAttribute('data-color');
                console.log('Selected color:', selectedColor);
            });
        });
    }
    
    // Sticker Selector
    function setupStickerSelector() {
        const stickerItems = document.querySelectorAll('.sticker-item');
        const selectedStickersContainer = document.getElementById('selected-stickers');
        
        stickerItems.forEach(item => {
            item.addEventListener('click', () => {
                const sticker = item.getAttribute('data-sticker');
                
                if (item.classList.contains('selected')) {
                    // Remove sticker
                    item.classList.remove('selected');
                    selectedStickers = selectedStickers.filter(s => s !== sticker);
                } else {
                    // Add sticker (max 5)
                    if (selectedStickers.length < 5) {
                        item.classList.add('selected');
                        selectedStickers.push(sticker);
                    } else {
                        alert('You can add up to 5 stickers only!');
                        return;
                    }
                }
                
                updateSelectedStickers();
            });
        });
        
        function updateSelectedStickers() {
            if (selectedStickers.length > 0) {
                selectedStickersContainer.classList.add('active');
                selectedStickersContainer.innerHTML = selectedStickers.map((sticker, index) => `
                    <span class="selected-sticker">
                        ${sticker}
                        <span class="remove-sticker" onclick="removeSticker(${index})">×</span>
                    </span>
                `).join('');
            } else {
                selectedStickersContainer.classList.remove('active');
                selectedStickersContainer.innerHTML = '';
            }
        }
        
        // Make removeSticker globally accessible
        window.removeSticker = function(index) {
            const sticker = selectedStickers[index];
            selectedStickers.splice(index, 1);
            
            // Unselect the sticker item
            stickerItems.forEach(item => {
                if (item.getAttribute('data-sticker') === sticker) {
                    item.classList.remove('selected');
                }
            });
            
            updateSelectedStickers();
        };
    }
    
    // Music Library Selection
    function setupAudioUpload() {
        const musicOptions = document.querySelectorAll('.music-option');
        const audioPreview = document.getElementById('audio-preview');
        const customUploadSection = document.getElementById('custom-audio-upload');
        const audioInput = document.getElementById('gift-audio');
        
        let selectedMusicName = 'None';
        
        // Handle music option selection
        musicOptions.forEach(option => {
            option.addEventListener('click', () => {
                musicOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                const musicUrl = option.getAttribute('data-music');
                const musicName = option.getAttribute('data-name') || 'No Music';
                
                if (musicUrl === 'none') {
                    // No music selected
                    uploadedAudio = null;
                    selectedMusicName = 'None';
                    audioPreview.innerHTML = '';
                    audioPreview.classList.remove('active');
                    customUploadSection.style.display = 'none';
                } else if (musicUrl === 'custom') {
                    // Show custom upload
                    customUploadSection.style.display = 'block';
                    audioPreview.innerHTML = '';
                    audioPreview.classList.remove('active');
                } else {
                    // Pre-selected music
                    uploadedAudio = musicUrl;
                    selectedMusicName = musicName;
                    customUploadSection.style.display = 'none';
                    showAudioPreview(musicUrl, musicName);
                }
            });
        });
        
        // Handle custom audio upload
        if (audioInput) {
            audioInput.addEventListener('change', handleAudioUpload);
        }
        
        function handleAudioUpload(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('audio/')) {
                // Check file size (limit to 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('Audio file is too large. Please choose a file smaller than 5MB.');
                    e.target.value = '';
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(event) {
                    uploadedAudio = event.target.result;
                    selectedMusicName = file.name;
                    showAudioPreview(uploadedAudio, file.name);
                    console.log('✅ Custom audio uploaded');
                };
                reader.readAsDataURL(file);
            }
        }
        
        function showAudioPreview(audioUrl, audioName) {
            audioPreview.innerHTML = `
                <div class="audio-info">
                    <i class="fas fa-music"></i>
                    <div class="audio-name">${audioName}</div>
                    <button class="remove-image" onclick="removeAudio()">Remove</button>
                </div>
                <audio controls>
                    <source src="${audioUrl}">
                    Your browser does not support the audio element.
                </audio>
            `;
            audioPreview.classList.add('active');
        }
        
        window.removeAudio = function() {
            uploadedAudio = null;
            selectedMusicName = 'None';
            audioPreview.innerHTML = '';
            audioPreview.classList.remove('active');
            if (audioInput) audioInput.value = '';
            customUploadSection.style.display = 'none';
            
            // Reset to "No Music"
            musicOptions.forEach((opt, i) => {
                opt.classList.toggle('active', i === 0);
            });
        };
    }
    
    // Auth UI Setup
    function setupAuthUI() {
        const signInBtn = document.getElementById('sign-in-btn');
        const accountBtn = document.getElementById('account-btn');
        const userName = document.getElementById('user-name');
        
        // Listen for auth state changes
        window.firebaseApp.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in
                signInBtn.style.display = 'none';
                accountBtn.style.display = 'inline-flex';
                userName.textContent = user.displayName || 'Account';
                console.log('✅ User signed in:', user.displayName);
            } else {
                // User is signed out
                signInBtn.style.display = 'inline-block';
                accountBtn.style.display = 'none';
                console.log('👤 No user signed in');
            }
        });
        
        // Sign in button
        if (signInBtn) {
            signInBtn.addEventListener('click', async () => {
                const user = await window.firebaseApp.signInWithGoogle();
                if (user) {
                    alert(`Welcome, ${user.displayName}! Your gifts will now be saved to the cloud.`);
                }
            });
        }
        
        // Account button (sign out)
        if (accountBtn) {
            accountBtn.addEventListener('click', async () => {
                if (confirm('Do you want to sign out?')) {
                    await window.firebaseApp.signOut();
                    alert('You have been signed out.');
                }
            });
        }
    }
    
    // Export feature data for use in gift creation
    window.giftFeatures = {
        getColor: () => selectedColor,
        getStickers: () => selectedStickers,
        getAudio: () => uploadedAudio,
        reset: () => {
            selectedColor = '#FF6B9D';
            selectedStickers = [];
            uploadedAudio = null;
            
            // Reset UI
            document.querySelectorAll('.color-option').forEach((opt, i) => {
                opt.classList.toggle('active', i === 0);
            });
            document.querySelectorAll('.sticker-item').forEach(item => {
                item.classList.remove('selected');
            });
            document.getElementById('selected-stickers').innerHTML = '';
            document.getElementById('selected-stickers').classList.remove('active');
            
            const audioPreview = document.getElementById('audio-preview');
            if (audioPreview) {
                audioPreview.innerHTML = '';
                audioPreview.classList.remove('active');
            }
            const audioInput = document.getElementById('gift-audio');
            if (audioInput) audioInput.value = '';
        }
    };
});
