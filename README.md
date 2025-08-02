# 🎮 Destiny 2 Team Inventory

[![Destiny 2](https://img.shields.io/badge/Destiny%202-API%20v2.0-orange?style=for-the-badge&logo=destiny)](https://www.bungie.net/en/Help/Article/45481)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.0-blue?style=for-the-badge)](https://github.com/knightofdemons/Destiny-2-TeamInventory/releases)
[![Languages](https://img.shields.io/badge/Languages-13-yellow?style=for-the-badge)](https://github.com/knightofdemons/Destiny-2-TeamInventory#multilingual-support)

> **A modern, feature-rich Destiny 2 inventory management application with real-time team coordination capabilities.**

---

## 🌟 Features

### 🎯 **Core Functionality**
- **Real-time Inventory Management** - View and manage your Destiny 2 character inventories
- **Multi-Platform Support** - Works with Steam, PlayStation, Xbox, and Stadia accounts
- **Team Coordination** - Fireteam view for real-time team status and coordination
- **Advanced Search** - Powerful search functionality with auto-complete suggestions
- **OAuth Integration** - Secure authentication with Bungie.net

### 🎨 **Modern UI/UX**
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Theme Customization** - Multiple color themes with real-time switching
- **Smooth Animations** - Polished loading screens and transition effects
- **Intuitive Gestures** - Pull-to-refresh and scroll-based navigation
- **Accessibility** - Keyboard navigation and screen reader support

### 🌍 **Multilingual Support**
- **13 Languages** - English, German, Spanish, French, Italian, Japanese, Korean, Polish, Portuguese (Brazil), Russian, Chinese (Simplified), Chinese (Traditional), Spanish (Mexico)
- **Dynamic Translation** - Real-time language switching with persistent settings
- **Manifest Integration** - Category headlines and item descriptions automatically translated from Bungie manifest

### ⚡ **Performance & Caching**
- **IndexedDB Storage** - Offline-capable with persistent data storage
- **Smart Caching** - Manifest and player data cached for optimal performance
- **Progressive Loading** - Efficient data loading with visual feedback
- **Memory Management** - Optimized for large inventories and multiple players

---

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (XAMPP, Apache, or similar)
- Bungie.net account for OAuth authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/knightofdemons/Destiny-2-TeamInventory.git
   cd Destiny-2-TeamInventory
   ```

2. **Set up local server**
   ```bash
   # Using XAMPP (recommended)
   # Copy Dev folder to C:\xampp\htdocs\destiny2-inventory\
   
   # Or using Python
   cd Dev
   python -m http.server 8000
   ```

3. **Access the application**
   ```
   http://localhost/destiny2-inventory/
   # or
   http://localhost:8000/
   ```

### First Time Setup

1. **Configure Settings**
   - Choose your preferred language and theme
   - Adjust icon size and display preferences
   - Settings are automatically saved to local storage

2. **Authenticate with Bungie**
   - Click the login button in the settings menu
   - Complete OAuth authentication with your Bungie.net account
   - OAuth tokens are securely stored locally

3. **Add Players**
   - Use the search bar to find players by name
   - Or manually add players using the sidebar buttons
   - Player data is cached for quick access

---

## 🎮 Usage Guide

### **Searching for Players**
- Type a player's name in the search bar
- Auto-complete suggestions will appear
- Select a player to load their inventory

### **Navigating Inventory**
- **Character Selection** - Switch between characters using the sidebar
- **Category Filtering** - Filter items by type (weapons, armor, etc.)
- **Item Details** - Click items to view detailed information
- **Sorting** - Items are automatically sorted by rarity and power level

### **Fireteam View**
- **Access** - Scroll up persistently to enter fireteam view
- **Team Status** - View real-time team information
- **Exit** - Scroll down to return to main view
- **Visual Indicators** - Glowing arrows guide navigation

### **Settings & Customization**
- **Language** - Switch between 13 supported languages
- **Theme** - Choose from multiple color schemes
- **Icon Size** - Adjust inventory item display size
- **Data Management** - Clear cached data when needed

---

## 🛠️ Technical Architecture

### **Frontend Technologies**
- **HTML5** - Semantic markup with modern features
- **CSS3** - Advanced styling with CSS Grid, Flexbox, and custom properties
- **JavaScript (ES6+)** - Modern JavaScript with async/await patterns
- **IndexedDB** - Client-side database for offline functionality

### **API Integration**
- **Bungie API v2.0** - Official Destiny 2 API
- **OAuth 2.0** - Secure authentication flow
- **RESTful Endpoints** - Player profiles, inventories, and manifest data
- **Rate Limiting** - Respectful API usage with caching

### **Data Management**
- **Manifest System** - Dynamic loading of game definitions
- **Player Caching** - Efficient storage and retrieval of player data
- **Settings Persistence** - User preferences saved locally
- **Offline Support** - Works with cached data when offline

---

## 🌍 Multilingual Support

The application supports **13 languages** with comprehensive localization:

| Language | Code | Status |
|----------|------|--------|
| English | `en` | ✅ Complete |
| German | `de` | ✅ Complete |
| Spanish | `es` | ✅ Complete |
| Spanish (Mexico) | `es-mx` | ✅ Complete |
| French | `fr` | ✅ Complete |
| Italian | `it` | ✅ Complete |
| Japanese | `ja` | ✅ Complete |
| Korean | `ko` | ✅ Complete |
| Polish | `pl` | ✅ Complete |
| Portuguese (Brazil) | `pt-br` | ✅ Complete |
| Russian | `ru` | ✅ Complete |
| Chinese (Simplified) | `zh-chs` | ✅ Complete |
| Chinese (Traditional) | `zh-cht` | ✅ Complete |

### **Translation Features**
- **Dynamic Language Switching** - Change language without page reload
- **Manifest Integration** - Game content automatically translated
- **Persistent Settings** - Language preference saved locally
- **Complete Coverage** - All UI elements and game content translated

---

## 🎨 Theme System

### **Available Themes**
- **Default** - Classic Destiny 2 color scheme
- **Dark** - Dark mode for reduced eye strain
- **Light** - Clean, minimal design
- **Custom** - User-defined color schemes

### **Theme Features**
- **Real-time Switching** - Instant theme changes
- **Persistent Storage** - Theme preference saved
- **CSS Custom Properties** - Efficient theme implementation
- **Accessibility** - High contrast options available

---

## 🔧 Development

### **Project Structure**
```
Destiny-2-TeamInventory/
├── Dev/                    # Development version
│   ├── index.html         # Main application file
│   ├── css/               # Stylesheets
│   │   ├── main.css       # Core styles
│   │   ├── sidebar.css    # Sidebar components
│   │   ├── viewSections.css # View layouts
│   │   └── loginFrame.css # Login interface
│   ├── js/                # JavaScript modules
│   │   ├── main.js        # Core application logic
│   │   ├── functions.js   # Utility functions
│   │   ├── indexdb.js     # Database operations
│   │   ├── oauth.js       # Authentication
│   │   └── loadingManager.js # Loading states
│   └── css/images/        # Assets and icons
├── Release/               # Production version
└── setup-local.md         # Development documentation
```

### **Key Components**

#### **Core Application (`main.js`)**
- Event handling and UI interactions
- Translation system management
- Gesture recognition and navigation
- Settings and theme management

#### **Data Management (`functions.js`)**
- API communication with Bungie
- Player data processing
- Manifest handling and caching
- HTML generation for inventory display

#### **Database Operations (`indexdb.js`)**
- IndexedDB wrapper functions
- Data persistence and retrieval
- Cache management and cleanup
- Settings storage

#### **Authentication (`oauth.js`)**
- OAuth 2.0 flow implementation
- Token management and storage
- Secure API authentication
- Session handling

---

## 🤝 Contributing

We welcome contributions from the Destiny 2 community! Here's how you can help:

### **Reporting Issues**
- Use the [GitHub Issues](https://github.com/knightofdemons/Destiny-2-TeamInventory/issues) page
- Include detailed steps to reproduce the problem
- Provide browser and system information
- Attach screenshots if relevant

### **Feature Requests**
- Submit feature requests through GitHub Issues
- Describe the desired functionality clearly
- Consider the impact on existing features
- Discuss implementation approach

### **Code Contributions**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper documentation
4. Test thoroughly across different browsers
5. Submit a pull request with detailed description

### **Translation Contributions**
- Help improve existing translations
- Add support for new languages
- Review and validate translation accuracy
- Maintain consistency with game terminology

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### **Third-Party Resources**
- **Bungie.net** - Destiny 2 API and game content
- **Boxicons** - Icon library for UI elements
- **Flag Icons** - Country flags for language selection
- **DIM, D2Checklist, DestinyTracker** - Inspiration and reference

---

## 🙏 Acknowledgments

### **Development Team**
- **quaithemerald** - Project lead and core development
- **knighToFdemonS** - UI/UX design and feature implementation

### **Community Support**
- **Destiny 2 Community** - Testing, feedback, and feature suggestions
- **Bungie.net** - Providing the comprehensive Destiny 2 API
- **Open Source Contributors** - Libraries and tools that make this possible

### **Inspiration**
- **DIM (Destiny Item Manager)** - Inventory management concepts
- **D2Checklist** - Data organization and presentation
- **DestinyTracker** - Player statistics and tracking

---

## 📞 Support & Community

### **Getting Help**
- **GitHub Issues** - For bug reports and feature requests
- **Discussions** - For general questions and community chat
- **Wiki** - For detailed documentation and guides

### **Community Links**
- **GitHub Repository** - [knightofdemons/Destiny-2-TeamInventory](https://github.com/knightofdemons/Destiny-2-TeamInventory)
- **Bungie Profile** - [quaithemerald](https://www.bungie.net/7/en/User/Profile/254/22269674/quaithemerald)
- **Reddit** - [r/DestinyTheGame](https://www.reddit.com/r/DestinyTheGame/)

### **Stay Updated**
- **Releases** - Check GitHub releases for latest updates
- **Changelog** - Track feature additions and bug fixes
- **Roadmap** - See planned features and improvements

---

## 🎯 Roadmap

### **Upcoming Features**
- [ ] **Real-time Team Updates** - Live fireteam status synchronization
- [ ] **Advanced Filtering** - More granular item filtering options
- [ ] **Export Functionality** - Export inventory data to various formats
- [ ] **Mobile App** - Native mobile application development
- [ ] **API Rate Optimization** - Improved caching and request efficiency

### **Long-term Goals**
- [ ] **Cross-platform Sync** - Synchronize data across devices
- [ ] **Community Features** - Player groups and sharing
- [ ] **Analytics Dashboard** - Player statistics and trends
- [ ] **Plugin System** - Extensible architecture for custom features

---

<div align="center">

**Made with ❤️ by the Destiny 2 Community**

*Guardians make their own fate.*

[![Destiny 2](https://img.shields.io/badge/Destiny%202-API%20v2.0-orange?style=for-the-badge&logo=destiny)](https://www.bungie.net/en/Help/Article/45481)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

</div> 