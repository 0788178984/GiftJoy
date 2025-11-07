# 🎁 GiftJoy - Modern Digital Gift Platform

Create and share beautiful, personalized digital gifts for any occasion with interactive animations and fun puzzles!

## ✨ Features

### 🎨 Gift Creation
- **Multiple Gift Types**: Choose from gift boxes, love letters, birthday cakes, hearts, surprise eggs, bubble wrap, and scratch cards
- **Photo Upload**: Add custom photos to personalize your gifts
- **Custom Messages**: Write heartfelt messages for your loved ones
- **Multiple Occasions**: Birthday, Christmas, Easter, Valentine's Day, Anniversary, Thank You, and more
- **Theme Selection**: Classic, Modern, Elegant, and Fun themes

### 🎮 Interactive Experience
- **Quest/Puzzle System**: Recipients solve fun puzzles before revealing their gift
  - Math puzzles
  - Word scramble games
  - Memory matching games
- **Animated Gift Opening**: Beautiful 3D gift box animation
- **Confetti Celebration**: Festive confetti animation when gift is revealed
- **Sound Effects**: Celebration sounds and interactive audio

### 🔗 Sharing & Distribution
- **Unique Gift Links**: Each gift gets a unique shareable URL
- **Multiple Sharing Options**:
  - WhatsApp
  - Facebook
  - Email
  - Direct link copying
- **LocalStorage**: Gifts are saved locally for easy access
- **View Gift**: Preview your created gift before sharing

### 📱 Responsive Design
- Fully responsive layout
- Mobile-friendly interface
- Touch-enabled interactions
- Optimized for all screen sizes

## 🚀 Getting Started

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start creating beautiful gifts!

### Creating a Gift

1. Click the "Create Gift" button
2. Fill in the recipient's name and your name
3. Choose an occasion
4. Write your personalized message
5. (Optional) Upload a photo
6. Select a theme and gift type
7. Click "Preview Gift"
8. Share the generated link with your recipient!

### Receiving a Gift

1. Open the gift link sent to you
2. Solve the fun puzzle (or skip it)
3. Watch the gift box animation
4. Enjoy your personalized gift with confetti!

## 📁 Project Structure

```
GIFT/
├── index.html              # Main landing page
├── gift.html              # Gift reveal page
├── css/
│   ├── style.css          # Main stylesheet
│   └── gift-reveal.css    # Gift reveal page styles
├── js/
│   ├── script-enhanced.js # Main application logic
│   └── gift-reveal.js     # Gift reveal functionality
├── images/                # Image assets
└── README.md             # Documentation
```

## 🎯 Key Technologies

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations and gradients
- **JavaScript (ES6+)**: Interactive functionality
- **LocalStorage API**: Gift data persistence
- **Canvas API**: Scratch card functionality
- **Web Share API**: Native sharing capabilities

## 🎨 Customization

### Adding New Occasions

Edit the occasion data in `js/gift-reveal.js`:

```javascript
const occasions = {
    yourOccasion: { 
        icon: '🎊', 
        title: 'Your Custom Title!' 
    }
};
```

### Adding New Puzzles

Add new puzzle types in the `loadPuzzle()` function in `js/gift-reveal.js`.

### Styling

Modify colors and themes in `css/style.css` by updating the CSS variables:

```css
:root {
    --primary-color: #6c63ff;
    --secondary-color: #ff6b6b;
    /* Add your custom colors */
}
```

## 🌟 Features Comparison with gifft.me

| Feature | GiftJoy | gifft.me |
|---------|---------|----------|
| Interactive Puzzles | ✅ | ✅ |
| Photo Upload | ✅ | ✅ |
| Multiple Gift Types | ✅ | ✅ |
| Unique Gift Links | ✅ | ✅ |
| Confetti Animation | ✅ | ✅ |
| Social Sharing | ✅ | ✅ |
| No Subscription | ✅ | ✅ |
| Offline Support | ✅ | ❌ |
| Modern UI | ✅ | ✅ |

## 📝 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## 🔒 Privacy

- All gifts are stored locally in your browser
- No data is sent to external servers
- Photos are stored as base64 in localStorage
- Share links contain only the gift ID

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available for personal and commercial use.

## 🎉 Credits

Created with ❤️ by asiimwe

Inspired by gifft.me and modern gift-giving experiences.

## 📞 Support

For issues or questions, please open an issue on the repository.

---

**Made with love using GiftJoy** 💝
