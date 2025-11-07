document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const giftData = {
        recipient: urlParams.get('recipient') || 'Friend',
        sender: urlParams.get('sender') || 'Someone Special',
        message: urlParams.get('message') || 'Wishing you all the happiness in the world!',
        occasion: urlParams.get('occasion') || 'birthday',
        image: urlParams.get('image') || '',
        giftId: urlParams.get('id') || null
    };

    // If gift ID exists, try to load from localStorage
    if (giftData.giftId) {
        const savedGift = localStorage.getItem(`gift_${giftData.giftId}`);
        if (savedGift) {
            Object.assign(giftData, JSON.parse(savedGift));
        }
    }

    // Puzzle types
    const puzzles = ['math', 'word', 'memory'];
    let currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    
    // Sections
    const questSection = document.getElementById('quest-section');
    const openingSection = document.getElementById('opening-section');
    const revealSection = document.getElementById('reveal-section');
    
    // Initialize
    init();
    
    function init() {
        // Skip puzzle and go directly to opening animation
        setupEventListeners();
        showOpening();
    }
    
    function setupEventListeners() {
        document.getElementById('skip-quest').addEventListener('click', skipQuest);
        document.getElementById('create-own-gift').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    // Load puzzle based on type
    function loadPuzzle(type) {
        const puzzleContainer = document.getElementById('puzzle-type');
        
        switch(type) {
            case 'math':
                loadMathPuzzle(puzzleContainer);
                break;
            case 'word':
                loadWordPuzzle(puzzleContainer);
                break;
            case 'memory':
                loadMemoryGame(puzzleContainer);
                break;
        }
    }
    
    // Math Puzzle
    function loadMathPuzzle(container) {
        const num1 = Math.floor(Math.random() * 20) + 1;
        const num2 = Math.floor(Math.random() * 20) + 1;
        const answer = num1 + num2;
        
        container.innerHTML = `
            <div class="math-puzzle">
                <h3>Solve this simple math problem:</h3>
                <div class="math-question">${num1} + ${num2} = ?</div>
                <input type="number" id="math-answer" placeholder="Your answer">
                <br>
                <button onclick="checkMathAnswer(${answer})">Submit Answer</button>
                <div id="math-feedback" class="puzzle-feedback"></div>
            </div>
        `;
        
        // Add enter key support
        document.getElementById('math-answer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkMathAnswer(answer);
            }
        });
    }
    
    window.checkMathAnswer = function(correctAnswer) {
        const userAnswer = parseInt(document.getElementById('math-answer').value);
        const feedback = document.getElementById('math-feedback');
        
        if (userAnswer === correctAnswer) {
            feedback.textContent = '🎉 Correct! Opening your gift...';
            feedback.className = 'puzzle-feedback correct';
            setTimeout(showOpening, 1000);
        } else {
            feedback.textContent = '❌ Try again!';
            feedback.className = 'puzzle-feedback incorrect';
            document.getElementById('math-answer').value = '';
        }
    };
    
    // Word Puzzle
    function loadWordPuzzle(container) {
        const words = [
            { word: 'CELEBRATION', hint: 'A joyful event or party' },
            { word: 'HAPPINESS', hint: 'A feeling of joy and contentment' },
            { word: 'SURPRISE', hint: 'An unexpected event' },
            { word: 'FRIENDSHIP', hint: 'A close bond between people' },
            { word: 'BIRTHDAY', hint: 'The anniversary of your birth' }
        ];
        
        const selected = words[Math.floor(Math.random() * words.length)];
        const scrambled = scrambleWord(selected.word);
        
        container.innerHTML = `
            <div class="word-puzzle">
                <h3>Unscramble this word:</h3>
                <p>Hint: ${selected.hint}</p>
                <div class="scrambled-word">${scrambled}</div>
                <input type="text" id="word-answer" placeholder="Your answer" maxlength="${selected.word.length}">
                <br>
                <button onclick="checkWordAnswer('${selected.word}')">Submit Answer</button>
                <div id="word-feedback" class="puzzle-feedback"></div>
            </div>
        `;
        
        // Add enter key support
        document.getElementById('word-answer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkWordAnswer(selected.word);
            }
        });
    }
    
    function scrambleWord(word) {
        const arr = word.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    }
    
    window.checkWordAnswer = function(correctWord) {
        const userAnswer = document.getElementById('word-answer').value.toUpperCase();
        const feedback = document.getElementById('word-feedback');
        
        if (userAnswer === correctWord) {
            feedback.textContent = '🎉 Correct! Opening your gift...';
            feedback.className = 'puzzle-feedback correct';
            setTimeout(showOpening, 1000);
        } else {
            feedback.textContent = '❌ Try again!';
            feedback.className = 'puzzle-feedback incorrect';
            document.getElementById('word-answer').value = '';
        }
    };
    
    // Memory Game
    function loadMemoryGame(container) {
        const emojis = ['🎁', '🎂', '🎉', '🎈', '🎊', '🎀', '💝', '🌟'];
        const gameEmojis = [...emojis.slice(0, 4), ...emojis.slice(0, 4)];
        shuffleArray(gameEmojis);
        
        let flippedCards = [];
        let matchedPairs = 0;
        
        container.innerHTML = `
            <div class="memory-game">
                <h3>Match all the pairs:</h3>
                <div class="memory-grid" id="memory-grid"></div>
                <div id="memory-feedback" class="puzzle-feedback"></div>
            </div>
        `;
        
        const grid = document.getElementById('memory-grid');
        gameEmojis.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            card.innerHTML = `
                <div class="card-back">?</div>
                <div class="card-front">${emoji}</div>
            `;
            
            card.addEventListener('click', function() {
                if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
                    this.classList.add('flipped');
                    flippedCards.push(this);
                    
                    if (flippedCards.length === 2) {
                        setTimeout(() => checkMatch(), 500);
                    }
                }
            });
            
            grid.appendChild(card);
        });
        
        function checkMatch() {
            const [card1, card2] = flippedCards;
            const feedback = document.getElementById('memory-feedback');
            
            if (card1.dataset.emoji === card2.dataset.emoji) {
                card1.classList.add('matched');
                card2.classList.add('matched');
                matchedPairs++;
                
                if (matchedPairs === 4) {
                    feedback.textContent = '🎉 All matched! Opening your gift...';
                    feedback.className = 'puzzle-feedback correct';
                    setTimeout(showOpening, 1000);
                }
            } else {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }
            
            flippedCards = [];
        }
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    // Skip quest
    function skipQuest() {
        showOpening();
    }
    
    // Show opening animation
    function showOpening() {
        questSection.classList.remove('active');
        openingSection.classList.add('active');
        
        // Update gift box based on occasion
        updateGiftBoxDesign(giftData.occasion);
        
        setTimeout(showGift, 3000);
    }
    
    // Update gift box design based on occasion
    function updateGiftBoxDesign(occasion) {
        const giftBox = document.querySelector('.animated-gift-box');
        const lid = document.querySelector('.box-lid');
        const body = document.querySelector('.box-body');
        const ribbon = document.querySelector('.box-ribbon');
        const ribbonV = document.querySelector('.box-ribbon-v');
        
        switch(occasion) {
            case 'christmas':
                lid.style.background = 'linear-gradient(135deg, #c41e3a 0%, #e74c3c 50%, #c41e3a 100%)';
                body.style.background = 'linear-gradient(180deg, #27ae60 0%, #229954 100%)';
                ribbon.style.background = 'linear-gradient(90deg, #f1c40f 0%, #f39c12 50%, #f1c40f 100%)';
                ribbonV.style.background = 'linear-gradient(90deg, #f1c40f 0%, #f39c12 50%, #f1c40f 100%)';
                break;
                
            case 'valentine':
                lid.style.background = 'linear-gradient(135deg, #e74c3c 0%, #ff6b9d 50%, #e74c3c 100%)';
                body.style.background = 'linear-gradient(180deg, #ff6b9d 0%, #c0392b 100%)';
                ribbon.style.background = 'linear-gradient(90deg, #fff 0%, #ffe6f0 50%, #fff 100%)';
                ribbonV.style.background = 'linear-gradient(90deg, #fff 0%, #ffe6f0 50%, #fff 100%)';
                // Add hearts
                giftBox.innerHTML += '<div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 2rem;">💕</div>';
                break;
                
            case 'birthday':
                lid.style.background = 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 50%, #9b59b6 100%)';
                body.style.background = 'linear-gradient(180deg, #3498db 0%, #2980b9 100%)';
                ribbon.style.background = 'linear-gradient(90deg, #f39c12 0%, #f1c40f 50%, #f39c12 100%)';
                ribbonV.style.background = 'linear-gradient(90deg, #f39c12 0%, #f1c40f 50%, #f39c12 100%)';
                // Add balloons
                giftBox.innerHTML += '<div style="position: absolute; top: -30px; right: -20px; font-size: 2rem;">🎈</div>';
                break;
                
            case 'easter':
                lid.style.background = 'linear-gradient(135deg, #f39c12 0%, #f1c40f 50%, #f39c12 100%)';
                body.style.background = 'linear-gradient(180deg, #e8daef 0%, #d7bde2 100%)';
                ribbon.style.background = 'linear-gradient(90deg, #aed6f1 0%, #85c1e9 50%, #aed6f1 100%)';
                ribbonV.style.background = 'linear-gradient(90deg, #aed6f1 0%, #85c1e9 50%, #aed6f1 100%)';
                break;
                
            case 'anniversary':
                lid.style.background = 'linear-gradient(135deg, #d4af37 0%, #f4e5c3 50%, #d4af37 100%)';
                body.style.background = 'linear-gradient(180deg, #8e44ad 0%, #6c3483 100%)';
                ribbon.style.background = 'linear-gradient(90deg, #d4af37 0%, #f4e5c3 50%, #d4af37 100%)';
                ribbonV.style.background = 'linear-gradient(90deg, #d4af37 0%, #f4e5c3 50%, #d4af37 100%)';
                break;
                
            default:
                // Keep default red/gold colors
                break;
        }
    }
    
    // Show gift reveal
    function showGift() {
        openingSection.classList.remove('active');
        revealSection.classList.add('active');
        
        // Populate gift data
        document.getElementById('recipient-name').textContent = giftData.recipient;
        document.getElementById('sender-name').textContent = giftData.sender;
        document.getElementById('gift-message').textContent = giftData.message;
        
        // Set occasion-specific content
        const occasionData = getOccasionData(giftData.occasion);
        document.getElementById('gift-icon').textContent = occasionData.icon;
        document.getElementById('gift-title').textContent = occasionData.title;
        
        // Add occasion class to gift card for styling
        const giftCard = document.querySelector('.gift-card');
        giftCard.classList.add(giftData.occasion);
        
        // Set custom image if provided
        const imageContainer = document.getElementById('gift-image-container');
        if (giftData.image) {
            imageContainer.innerHTML = `<img src="${giftData.image}" alt="Gift Image">`;
        } else {
            imageContainer.classList.add('empty');
        }
        
        // Trigger confetti
        createConfetti();
        
        // Trigger star animations
        createStars();
        
        // Play celebration sound
        playSound();
    }
    
    // Get occasion-specific data
    function getOccasionData(occasion) {
        const occasions = {
            birthday: { icon: '🎂', title: 'Happy Birthday!' },
            christmas: { icon: '🎄', title: 'Merry Christmas!' },
            easter: { icon: '🐰', title: 'Happy Easter!' },
            valentine: { icon: '❤️', title: 'Happy Valentine\'s Day!' },
            anniversary: { icon: '💝', title: 'Happy Anniversary!' },
            thankyou: { icon: '🙏', title: 'Thank You!' },
            congratulations: { icon: '🎉', title: 'Congratulations!' },
            graduation: { icon: '🎓', title: 'Congratulations Graduate!' }
        };
        
        return occasions[occasion] || occasions.birthday;
    }
    
    // Create confetti animation
    function createConfetti() {
        const confettiContainer = document.getElementById('confetti');
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'];
        
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 3 + 's';
                confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
                
                confettiContainer.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 5000);
            }, i * 30);
        }
    }
    
    // Create star animations
    function createStars() {
        const starsContainer = document.getElementById('stars');
        
        // Create twinkling stars (background stars)
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const star = document.createElement('div');
                star.className = 'twinkling-star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 2 + 's';
                star.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
                
                starsContainer.appendChild(star);
            }, i * 50);
        }
        
        // Create falling stars
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const star = document.createElement('div');
                star.className = 'falling-star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = -10 + 'px';
                star.style.animationDelay = Math.random() * 2 + 's';
                star.style.animationDuration = (Math.random() * 2 + 2) + 's';
                
                starsContainer.appendChild(star);
                
                setTimeout(() => star.remove(), 5000);
            }, i * 500);
        }
        
        // Create shooting stars
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const star = document.createElement('div');
                star.className = 'shooting-star';
                star.style.left = Math.random() * 50 + '%';
                star.style.top = Math.random() * 50 + '%';
                star.style.animationDelay = Math.random() * 1 + 's';
                
                starsContainer.appendChild(star);
                
                setTimeout(() => star.remove(), 3000);
            }, i * 600);
        }
        
        // Continue creating shooting stars periodically
        setInterval(() => {
            const star = document.createElement('div');
            star.className = 'shooting-star';
            star.style.left = Math.random() * 50 + '%';
            star.style.top = Math.random() * 50 + '%';
            
            starsContainer.appendChild(star);
            
            setTimeout(() => star.remove(), 2000);
        }, 3000);
    }
    
    // Play celebration sound
    function playSound() {
        // Try multiple audio sources for better compatibility
        const audioSources = [
            'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c6c1e57f.mp3', // Celebration sound
            'https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3', // Happy birthday
            'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3'
        ];
        
        const audio = new Audio(audioSources[0]);
        audio.volume = 0.5;
        
        // Try to play with user interaction fallback
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Audio playing successfully');
                })
                .catch(error => {
                    console.log('Auto-play prevented, adding click listener');
                    // Add one-time click listener to play sound
                    document.addEventListener('click', function playOnClick() {
                        audio.play();
                        document.removeEventListener('click', playOnClick);
                    }, { once: true });
                });
        }
        
        // Also play occasion-specific sound
        playOccasionSound(giftData.occasion);
    }
    
    // Play occasion-specific background music
    function playOccasionSound(occasion) {
        const occasionSounds = {
            birthday: 'https://cdn.pixabay.com/audio/2022/03/24/audio_c8b4c7c9b5.mp3',
            christmas: 'https://cdn.pixabay.com/audio/2021/11/23/audio_d0c8c8c9d8.mp3',
            valentine: 'https://cdn.pixabay.com/audio/2022/03/15/audio_e8e8e8e8e8.mp3'
        };
        
        if (occasionSounds[occasion]) {
            const bgMusic = new Audio(occasionSounds[occasion]);
            bgMusic.volume = 0.3;
            bgMusic.loop = false;
            
            setTimeout(() => {
                bgMusic.play().catch(e => {
                    console.log('Background music play prevented:', e);
                });
            }, 500);
        }
    }
});
