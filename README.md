# 🎮 Destiny 2 Team Inventory

<div align="center">

![Destiny 2 Logo](Dev/css/images/ico/favicon512.png)

**A modern, responsive web application for managing Destiny 2 team inventories with real-time data synchronization**

[![Destiny 2](https://img.shields.io/badge/Destiny%202-API-ff6b35?style=for-the-badge&logo=playstation)](https://www.bungie.net/en/Help/Article/45481)
[![IndexedDB](https://img.shields.io/badge/IndexedDB-Storage-4CAF50?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
[![HTML5](https://img.shields.io/badge/HTML5-Standard-E34F26?style=for-the-badge&logo=html5)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Styling-1572B6?style=for-the-badge&logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

</div>

---

## ✨ Features

### 🎯 **Core Functionality**
- **Real-time Inventory Management** - View and manage your entire Destiny 2 inventory
- **Team Collaboration** - Share inventory data with your fireteam members
- **Cross-platform Support** - Works on PC, PlayStation, and Xbox
- **Offline Capability** - Data persists locally using IndexedDB

### 🎨 **User Experience**
- **Destiny 2 Themed Design** - Authentic visual style matching the game
- **Responsive Layout** - Optimized for desktop, tablet, and mobile
- **Smooth Animations** - Beautiful loading screens and transitions
- **Dark Theme** - Easy on the eyes during long gaming sessions

### 🔧 **Technical Features**
- **IndexedDB Storage** - Modern, reliable local data persistence
- **Bungie.net API Integration** - Real-time data from official Destiny 2 API
- **OAuth 2.0 Authentication** - Secure login with Bungie.net
- **Progressive Loading** - Optimized performance with lazy loading

---

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Destiny 2 account with Bungie.net access
- Local web server (XAMPP, Live Server, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/knightofdemons/Destiny-2-TeamInventory.git
   cd Destiny-2-TeamInventory
   ```

2. **Set up local server**
   - **Option A: XAMPP**
     ```bash
     # Copy Dev folder to htdocs
     xcopy "Dev" "C:\xampp\htdocs\destiny2-inventory\" /E /I
     ```
   - **Option B: Live Server (VS Code)**
     - Install Live Server extension
     - Right-click `Dev/index.html` → "Open with Live Server"

3. **Access the application**
   - Navigate to `http://localhost/destiny2-inventory/`
   - Or `http://localhost:5500/Dev/index.html` (Live Server)

### First Time Setup

1. **Login with Bungie.net**
   - Click "Login" in the sidebar
   - Authorize the application with your Bungie.net account

2. **Add Players**
   - Enter player Bungie.net usernames
   - The app will fetch their inventory data automatically

3. **Explore Features**
   - Browse inventory items by category
   - View detailed item statistics
   - Share data with your team

---

## 📁 Project Structure

```
Destiny-2-TeamInventory/
├── Dev/
│   ├── index.html              # Main application entry point
│   ├── api.js                  # API configuration
│   ├── css/
│   │   ├── style.css           # Main stylesheet
│   │   ├── loadingScreen.css   # Destiny 2 themed loading screen
│   │   ├── sidebar.css         # Navigation sidebar styles
│   │   ├── viewSections.css    # Main content layout
│   │   ├── playerDetails-classes.css # Player data styling
│   │   ├── loginFrame.css      # Authentication UI
│   │   ├── aboutFrame.css      # About page styling
│   │   ├── conf.css           # Configuration styles
│   │   ├── bx-icons.css       # Icon library
│   │   ├── flag-icons.css     # Language flags
│   │   └── images/            # Application assets
│   └── js/
│       ├── indexdb.js         # IndexedDB operations
│       ├── loadingManager.js  # Loading screen management
│       ├── functions.js       # Core application logic
│       ├── main.js           # UI interactions
│       └── oauth.js          # Authentication handling
└── README.md                 # This file
```

---

## 🔧 Configuration

### API Setup
The application uses the official Bungie.net API. No additional configuration is required as it uses public endpoints.

### Local Development
For development, ensure you have:
- A local web server (XAMPP recommended)
- Modern browser with IndexedDB support
- Internet connection for API calls

---

## 🎮 Usage Guide

### Adding Players
1. Click "Add Player" in the sidebar
2. Enter the player's Bungie.net username
3. Select their platform (PC, PlayStation, Xbox)
4. Click "Add" to fetch their inventory

### Managing Inventory
- **Weapons** - View all equipped and stored weapons
- **Armor** - Browse armor sets and stats
- **Consumables** - Check materials and consumables
- **Collections** - View completed triumphs and collections

### Team Features
- **Shared Data** - All team members can view each other's inventories
- **Real-time Updates** - Data refreshes automatically
- **Offline Access** - Previously loaded data available offline

---

## 🛠️ Technical Details

### Data Storage
- **IndexedDB** - Modern browser database for local storage
- **Automatic Migration** - Seamless transition from localStorage
- **Data Persistence** - Survives browser restarts and updates

### API Integration
- **Bungie.net API v2** - Official Destiny 2 data source
- **OAuth 2.0** - Secure authentication flow
- **Rate Limiting** - Respects API usage limits

### Performance
- **Lazy Loading** - Images and data load on demand
- **Caching** - Manifest data cached locally
- **Optimized Queries** - Efficient API calls

---

## 🎨 Customization

### Themes
The application supports Destiny 2's visual theme with:
- Dark color scheme
- Orange accent colors
- Futuristic UI elements
- Responsive design

### Localization
- Multi-language support
- Flag icons for language selection
- Localized content

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test on multiple browsers
- Ensure responsive design

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Bungie** - For the amazing Destiny 2 API
- **Destiny 2 Community** - For inspiration and feedback
- **Open Source Community** - For the tools and libraries used

---

## 📞 Support

- **Issues** - [GitHub Issues](https://github.com/knightofdemons/Destiny-2-TeamInventory/issues)
- **Discussions** - [GitHub Discussions](https://github.com/knightofdemons/Destiny-2-TeamInventory/discussions)
- **Wiki** - [Project Wiki](https://github.com/knightofdemons/Destiny-2-TeamInventory/wiki)

---

<div align="center">

**Ready to manage your Destiny 2 team inventory like a pro?** 🚀

[Get Started Now](#quick-start)

---

*Built with ❤️ for the Destiny 2 community*

</div> 