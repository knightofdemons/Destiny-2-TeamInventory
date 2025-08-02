# Local Development Setup Guide

## Project Overview
Destiny 2 Team Inventory - Web application for managing Destiny 2 team inventory with complex loading screens, theme customization, and IndexedDB persistence.

## File Structure
- **Dev/** - Development version with complex loading screen, particles, animations
- **Release/** - Production version with simplified loading screen
- **setup-local.md** - This file (NOT synced to GitHub)

## XAMPP Configuration

### Installation Path
- XAMPP installed at: `C:\xampp\`
- Apache document root: `C:\xampp\htdocs\`
- Project deployment path: `C:\xampp\htdocs\destiny2-inventory\`

### Required Services
- Apache (port 80/443)
- MySQL (if needed for future features)

## Development Workflow

### 1. File Deployment
```powershell
# Copy Dev files to XAMPP htdocs
Copy-Item -Path "Dev\*" -Destination "C:\xampp\htdocs\destiny2-inventory\" -Recurse -Force
```

### 2. Start XAMPP
```powershell
# Start XAMPP Control Panel
Start-Process "C:\xampp\xampp-control.exe"
```
Then manually start Apache from the control panel.

### 3. Access Application
- URL: `http://localhost/destiny2-inventory/`
- Local development server (alternative): `http://localhost:8000/`

## Key Features & Configuration

### Loading Screen
- **Dev version**: Complex loading screen with particles, animations, progress bar
- **Release version**: Simplified loading screen
- **Files involved**: 
  - `Dev/css/loadingScreen.css` - Loading screen styles and animations
  - `Dev/js/loadingManager.js` - Loading screen management class
  - `Dev/index.html` - Loading screen HTML structure

### Theme System
- **Storage**: IndexedDB (persistent across sessions)
- **Settings**: Theme colors, language, icon size
- **Implementation**: 
  - `Dev/js/indexdb.js` - IndexedDB operations
  - `Dev/js/main.js` - Theme and language functions
  - `Dev/js/functions.js` - Initialization and settings application

### Database Schema (IndexedDB)
```javascript
// Object Stores:
- settings: { key, value } // Theme, language, icon size
- oauth: { key, value } // OAuth tokens
- players: { key, value } // Player data
- manifest: { key, value } // Manifest paths
- definitions: { key, value } // Game definitions
```

## Common Issues & Solutions

### PowerShell Command Chaining
- **Wrong**: `cd Dev && python -m http.server 8000`
- **Correct**: `cd Dev; python -m http.server 8000` or `& cd Dev; python -m http.server 8000`

### File Copying
- **Wrong**: Copying to root htdocs
- **Correct**: Copying to `C:\xampp\htdocs\destiny2-inventory\`

### Loading Screen Issues
- Ensure `loadingScreen.css` is imported in `style.css`
- Ensure `loadingManager.js` is included in `index.html`
- Ensure `InitData()` function calls `loadingManager` methods

## Development Commands

### Quick Start Script
```powershell
# Complete setup in one command
Copy-Item -Path "Dev\*" -Destination "C:\xampp\htdocs\destiny2-inventory\" -Recurse -Force; Start-Process "C:\xampp\xampp-control.exe"
```

### Alternative Development Server
```powershell
# If XAMPP not available, use Python server
cd Dev; python -m http.server 8000
```

## File Modifications History

### Recent Changes (Current Session)
1. **Restored complex loading screen** in Dev version
2. **Fixed IndexedDB theme persistence**
3. **Ensured loadingManager integration**
4. **Corrected file deployment path**

### Key Files Modified
- `Dev/index.html` - Restored loading screen HTML and script imports
- `Dev/css/style.css` - Re-added loadingScreen.css import
- `Dev/js/functions.js` - Restored loadingManager calls in InitData()
- `Dev/js/main.js` - Confirmed IndexedDB theme persistence

## Notes
- This file contains confidential setup information and should NOT be committed to GitHub
- Always use the correct deployment path: `C:\xampp\htdocs\destiny2-inventory\`
- The Dev version has the complex loading screen, Release version has simplified loading screen
- IndexedDB handles all persistent settings (themes, language, etc.)

## AI Assistant Behavior Guidelines
- **CRITICAL**: Update this setup file after EVERY change made to the project
- **CRITICAL**: Add detailed notes about what was changed, why, and how it affects the system
- **CRITICAL**: Include file paths, function names, and specific code changes
- **CRITICAL**: Document any issues encountered and their solutions
- **CRITICAL**: Reference this behavior guideline in future sessions
- **CRITICAL**: This file serves as persistent memory between AI sessions
- **CRITICAL**: User prompt: "please adjust the setup-file everytime you make changes so you can keep track of yourself. be free to make additional sidenotes to elaborate on the details (also save this prompt so you can refer to this behaviour in the future)"

### Current Session Updates
- **Files Copied**: Dev files successfully copied to `C:\xampp\htdocs\destiny2-inventory\`
- **Setup File Created**: Comprehensive documentation created to prevent future setup issues
- **User Feedback**: User requested persistent documentation updates for AI memory retention
- **Next Steps**: Application ready for testing at `http://localhost/destiny2-inventory/` 