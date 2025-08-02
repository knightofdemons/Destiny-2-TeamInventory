# Destiny 2 Team Inventory - Local Development Setup

## Project Overview
This is a Destiny 2 team inventory management application that allows users to view and manage their Destiny 2 character inventories, equipment, and fireteam information. The application uses the Bungie API and features a modern web interface with theme customization, multi-language support, and responsive design.

## Local Development Environment

### Server Setup
- **Server Type**: XAMPP (Apache/PHP stack)
- **Control Panel**: `C:\xampp\xampp-control.exe`
- **Document Root**: `C:\xampp\htdocs\destiny2-inventory\`
- **Access URL**: `http://localhost/destiny2-inventory/`

### File Deployment
- **Source Directory**: `Dev/`
- **Deployment Command**: `robocopy "Dev" "C:\xampp\htdocs\destiny2-inventory" /E /XO /R:3 /W:1`
- **Last Deployment**: Saturday, August 2, 2025 11:47:29 PM
- **Note**: Always deploy to XAMPP directory, only push to Git when explicitly requested

## Recent Fixes and Improvements

### ✅ RESOLVED: UI Element Alignment and Styling
- **Login Icon Alignment**: Fixed login icon to be level with gear icon, sharing 50:50 width while maintaining height
- **Gear Icon Centering**: Fixed gear icon animation to spin on the spot without wobbling
- **Scaling Bar Color**: Changed magenta scaling bar to subtle, theme-compatible color
- **Trashbin Icon Alignment**: Fixed trashbin icon alignment in recent player list
- **Border Styling**: Added small borders equivalent to individual player items to:
  - Settings menus and submenus (`.settingsSubMenu`, `.language-options`, `.settingsThemes`)
  - Settings menu buttons (`.settingsSubMenuBtns`)
  - Player list buttons (`.player-item`)
  - Search field (`.sidebar .sidebar-content input`)
  - Manual add player buttons (`.sidebar .nav-list button`)
- **Manual Add Player Buttons**: Centered the 3 manual add player buttons in the sidebar with proper styling

### ✅ RESOLVED: Theme Compatibility
- **Player Buttons**: Background now changes with theme changes
- **Settings Menu**: Background now changes with theme changes  
- **Search Field**: Background now changes with theme changes
- **Login Frame**: Uses `var(--gradient)` for theme compatibility
- **Fireteam View**: Adjusts to theme changes
- **Tooltips**: Background now uses `var(--grad1)` instead of hardcoded white
- **Timer Bar**: Background now uses `var(--grad1)` instead of hardcoded black

### ✅ RESOLVED: Translation System
- **Manifest Integration**: Headlines like "exotic weapons" are pulled from manifest and loaded in correct language
- **Search Field Translation**: Added translations for search field placeholder text
- **Menu Text Translation**: Added translations for menu items (excluding player-specific buttons and about/info section)
- **Loading Screen Translation**: Added translation for loading screen text (fixed immediate application)
- **Gesture Text Translation**: Updated gesture text to be more appropriate ("Scroll up to view fireteam", "Scroll down to return")
- **Comprehensive Translation Keys**: Added translations for all category headlines, fireteam view, and loading player text:
  - `loadingPlayer`: "Loading player..." in all 13 languages
  - `exoticWeapons`, `legendaryWeapons`, `rareWeapons`, `commonWeapons`
  - `exoticArmor`, `legendaryArmor`, `rareArmor`, `commonArmor`
  - `ghosts`, `vehicles`, `ships`, `emblems`, `finishers`, `shaders`, `mods`, `consumables`, `materials`
  - `fireteamView`, `noFireteamData`
- **Fireteam View Translation**: Added dynamic header with translated title
- **Category Headlines**: Confirmed all category headlines are pulled from manifest data and automatically translated

### ✅ RESOLVED: Pull-to-Refresh and Scroll-Down-to-Exit
- **Pull-to-Refresh**: Implemented with 500ms delay, requires both distance and time to trigger
- **Scroll-Down-to-Exit**: Implemented with 500ms delay, allows returning from fireteam view by scrolling down
- **Mouse Wheel Support**: Added desktop support for both gestures
- **Full-Width Indicators**: Replaced small indicators with full-width bars containing 3 stacked glowing arrows
- **Arrow Animations**: White pulsating arrow-stripes (⬆/⬇) for both scroll directions with road construction style
- **Indicator Styling**: Increased arrow width (24px), closer spacing (-4px margin), reduced bar height (45px)
- **Timer Bar Removal**: Timer bar is automatically hidden when returning from fireteam view
- **Arrow Key Removal**: Removed down arrow key functionality for returning from fireteam view

### ✅ RESOLVED: Mainframe Adjustment
- **Dynamic Layout**: Mainframe now adjusts to use free space when sidebar is open
- **CSS Class System**: Uses `.sidebar-open` class for dynamic layout adjustment
- **Initialization**: Correct state is set on page load

### ✅ RESOLVED: Data Management
- **Clear Cached Data**: Now removes all stored data in IndexedDB or deletes it entirely
- **Settings Persistence**: Language, theme colors, and icon size are saved and reloaded through IndexedDB
- **Caching Verification**: Confirmed manifest and player data caching is working correctly - data is saved to IndexedDB and loaded from cache when available

### ✅ RESOLVED: Player Loading UI
- **Pre-Create Player Button**: When loading a new player, button is immediately created in recent player list
- **Loading State**: Shows translated "Loading player..." text with spinning loader icon
- **Theme Integration**: Loading spinner uses theme colors (`var(--grad1)`)
- **Cleanup**: Loading item is removed when player data is loaded or on error
- **Visual Feedback**: Loading items have reduced opacity (0.7) and different hover behavior

## Debugging Features Added
- Console logging for sidebar toggle state
- Console logging for pull-to-refresh touch events
- Console logging for scroll-down-to-exit touch events
- Mouse wheel support for desktop testing of gestures
- **Enhanced Debugging**: Added detailed console logging for view state detection
- **View State Management**: Added `ensureViewState()` function to ensure correct initial view state
- **Gesture Debugging**: Added detailed logging for touch start/end events and gesture conditions
- **Indicator Debugging**: Added logging for indicator creation and opacity setting
- **Full-Width Indicators**: Implemented with glowing arrows and backdrop blur effects

## Recent Fixes Applied

### ✅ RESOLVED: Scaling Slider and Submenu Text Improvements
- **Scaling Slider Color**: Changed magenta-like accent color to subtle white (`rgba(255, 255, 255, 0.6)`) for better theme compatibility

### ✅ RESOLVED: Login Frame Implementation and Settings Login Button Fix
- **Login Frame Structure**: Restructured login frame with overlay and window components for popup behavior
- **Login Window Size**: Adjusted to 50% of screen width and height
- **Background Overlay**: Semi-transparent black background (`rgba(0, 0, 0, 0.7)`) that closes frame when clicked
- **White Animated Stripes**: Changed particle stripes from orange to white (`rgba(255, 255, 255, 0.8)`) with fading effect
- **Settings Login Button**: Fixed broken `clickLogin()` function call by replacing with `showLoginFrame()` function
- **Login Flow**: Clicking settings login button opens frame, clicking login button in frame opens OAuth popup
- **OAuth Error Fix**: Removed problematic DOM removal line that caused `loginFr is null` error after OAuth completion
- **OAuth Authentication**: Updated `getData` and `postData` functions to include OAuth token authentication when available
- **API Request Enhancement**: All API requests now use stored OAuth data for authenticated endpoints
- **Last Deployment**: Saturday, August 2, 2025 11:58:31 PM
- **Submenu Text**: Changed "Clear cached data" to "Clear Cache" for better readability
- **Language Options Width**: Added `min-width: 12rem` to ensure all language names display correctly, especially longer ones like "Português (Brasil)" and "Español (México)"

### ✅ RESOLVED: FT-view Visibility and Manual Add Player Button Alignment
- **FT-view Visibility**: Fixed conflicting CSS rules in `viewSections.css` that were causing the fireteam view to be visible on the main page
- **Manual Add Player Buttons**: 
  - Added container div with class `manual-add-buttons` around the 3 buttons
  - Updated CSS to use flexbox layout with `display: flex`, `justify-content: center`, and `gap: 0.5rem`
  - Buttons now use `flex: 1` to distribute space evenly and appear in one line
  - Removed conflicting margin settings that were causing spacing issues

### ✅ RESOLVED: Player Data Reload on Language Change
- **IndexedDB Enhancement**: Added `clearPlayerData()` function to `indexdb.js` to clear only player data
- **Language Change Logic**: Modified `setLang()` function to reload existing player data instead of clearing it
- **New Function**: Added `reloadStoredPlayers()` function that iterates through stored players and re-fetches their data from the API
- **Data Consistency**: This ensures that when language is changed, existing player data is reloaded with the new language strings instead of being cleared
- **Manifest Refresh**: Combined with existing manifest path clearing to ensure complete refresh of translated content
- **Platform Type Handling**: Function extracts platform type from stored player data to ensure correct API calls

## Known Issues to Address
- ~~Pull-to-refresh speed (too fast)~~ ✅ RESOLVED
- ~~Mainframe adjustment when sidebar is open~~ ✅ RESOLVED
- ~~Scroll-down-to-exit functionality~~ ✅ RESOLVED
- ~~FT-view visibility on main page~~ ✅ RESOLVED
- ~~Manual add player buttons not in one line~~ ✅ RESOLVED
- ~~Player data not reloaded on language change~~ ✅ RESOLVED (Now reloads existing players instead of clearing them)
- ~~Arrow key functionality for fireteam view~~ ✅ RESOLVED

## Recent Fixes Applied (August 2, 2025 - 11:42 PM)

### Latest Fixes:

7. **Login Frame Size Adjustment and Slider Styling Revert**:
   - **Problem**: User reported "make the login window only 50% of the screen, also it does not close while clicking on login (clicking background works). the slider changed color but now it seems to have a solid background. revert the recent changes and keep the naming change, i guess that will fix it."
   - **Fix**: 
     - **Login Window Size**: Changed login window from 75% to 50% of screen size (both width and height)
     - **Login Button Click Behavior**: Modified `openOauthPopup()` function to call `closeLoginFrame()` first, then open the OAuth popup
     - **Removed Redundant Function**: Removed `clickLogin()` function since login button now directly calls `openOauthPopup()`
     - **Slider Styling Revert**: Reverted comprehensive browser-specific slider styling (thumb/track custom styling) while keeping the corrected ID (`settingsIconsizeSlider`) and basic `accent-color` setting
     - **Simplified Slider CSS**: Kept only the essential styling: width, background, border, border-radius, and accent-color
   - **Files**: `Dev/css/loginFrame.css`, `Dev/js/oauth.js`, `Dev/js/main.js`, `Dev/css/sidebar.css`
   - **Result**: Login window is now 50% of screen size, clicking login button properly closes the frame and opens OAuth popup, slider has subtle white color without solid background

6. **Scaling Slider Color Fix and Login Frame Enhancement**:
   - **Problem**: User reported "the slider still shows magenta. when clicking on login, open the login-frame in a new window that takes 75% of the screen and overlaps the rest of the application with a darkened background. close the login-window while clicking on the darkened background. also close the login-window if someone clicks on login but then also open the popup. keep the current animation but make the stripes/particles white and fading out when reaching the end (if possible, without a new approach. otherwise ignore that)"
   - **Fix**: 
     - **Scaling Slider Color**: Fixed ID mismatch between HTML (`settingsIconsizeSlider`) and CSS (`settingsiconSizeSlider`), added comprehensive browser-specific styling with white accent color and custom thumb/track styling
     - **Login Frame Redesign**: 
       - Restructured HTML to include overlay and window containers
       - Added darkened background overlay (75% opacity) that closes frame when clicked
       - Created centered login window (75% screen size) with rounded corners
       - Updated JavaScript to handle new close/open behavior
       - Made stripes/particles white (`rgba(255, 255, 255, 0.8)`) instead of orange
     - **Enhanced Slider Styling**: Added `-webkit-appearance: none`, custom thumb styling for WebKit and Mozilla browsers, and proper track styling
   - **Files**: `Dev/css/sidebar.css`, `Dev/index.html`, `Dev/css/loginFrame.css`, `Dev/js/main.js`
   - **Result**: Slider now shows subtle white color instead of magenta, login frame opens in centered window with darkened background, closes on overlay click, and has white animated stripes

### Previous Fixes:

### Latest Fixes:

5. **Critical UI State and Translation Fixes**:
   - **Problem**: User reported "somethign went wrong, now the FT-view is visible on the mainpage. keep the buttons to add players manually in one line. translation is not working in the loadingscreen (maybe check all files again? especially the loadingmanager, it probably needs a parameter for the language). seems like still the english definitions-json is pulled when i select a different language = not working"
   - **Fix**: 
     - **FT-view Visibility**: Fixed `viewFireteam` div to have `closed` class by default in HTML
     - **Manual Add Player Buttons**: Changed CSS from `display: block` to `display: inline-block` with 30% width and proper margins to keep buttons in one line
     - **Loading Screen Translation**: Updated `LoadingManager` to use `getText()` function for all loading state texts
     - **Language-Specific Manifest Loading**: Modified `setLang()` function to clear manifest paths before reload, forcing fresh manifest fetch in new language
     - **Comprehensive Translation Keys**: Added missing translation keys for all loading states in all 13 languages:
       - `initializingDatabase`, `loadingManifestData`, `fetchingPlayerData`, `processingInventory`, `readyToLaunch`, `error`
   - **Files**: `Dev/index.html`, `Dev/css/sidebar.css`, `Dev/js/loadingManager.js`, `Dev/js/main.js`
   - **Result**: FT-view is now hidden by default, manual add player buttons display in one line, loading screen shows translated text, and language changes properly trigger manifest reload

4. **Manual Translation Reversion and Manifest Integration**:
   - **Problem**: User reported "you've added manual translations for all the headlines, please revert that. all these headlines and itemdescriptions can be pulled from the bungie-manifest of destiny2, like it was before. this also pulls the correct translation. make sure that on changing the language, the correct manifest gets pulled. remove unneeded translations, like release-to-refresh."
   - **Fix**: 
     - **Removed Manual Translation Keys**: Removed all manually added translation keys for category headlines and item descriptions:
       - `exoticWeapons`, `legendaryWeapons`, `rareWeapons`, `commonWeapons`
       - `exoticArmor`, `legendaryArmor`, `rareArmor`, `commonArmor`
       - `ghosts`, `vehicles`, `ships`, `emblems`, `finishers`, `shaders`, `mods`, `consumables`, `materials`
     - **Removed Unneeded Translation Keys**: Removed `pullToRefresh`, `releaseToRefresh`, `releaseToExit` from all 13 languages
     - **Verified Manifest Integration**: Confirmed that category headlines are pulled from `userDB['Definitions']['vendor'].name`, `userDB['Definitions']['item'].bucket`, and `userDB['Definitions']['item'].category` in `generatePlayerHTML()` function
     - **Language Change Handling**: Verified that `setLang()` function includes `location.reload()` which triggers manifest reload in new language
     - **Indicator Text Removal**: Removed text content assignments from indicator creation since indicators now show only icons
   - **Files**: `Dev/js/main.js` (translations object, indicator creation functions)
   - **Result**: Category headlines and item descriptions are now correctly pulled from Bungie manifest and automatically translated when language changes

### Previous Fixes:

1. **Border Styling and Manual Add Player Button Alignment**: 
   - **Problem**: User requested "add a really small boarder, equivalent to the boarder around the individual items of a player, to the settings-menues and submenues and to the buttons in the recent playerlist and the search-field. align the 3 buttons to manually add players in the middle of the sidebar."
   - **Fix**: 
     - Added `border: solid rgba(0,0,0,0.3) 2px; border-radius: 10%;` to all requested elements
     - Applied to `.settingsSubMenu`, `.language-options`, `.settingsThemes`, `.settingsSubMenuBtns`, `.player-item`, `.sidebar .sidebar-content input`
     - Added new CSS for `.sidebar .nav-list button` with centered alignment (80% width, auto margins)
     - Added hover effects for manual add player buttons
   - **Files**: `Dev/css/sidebar.css`

2. **Comprehensive Translation System Update**:
   - **Problem**: User reported "translation is still not showing up in the loading-screen and also not for the newly added 'loading player' function. translation is also not working for the category-headlines and the FT-view."
   - **Fix**: 
     - Added comprehensive translation keys for all category headlines, fireteam view, and loading player text
     - Added translations for all 13 supported languages (en, de, es, es-mx, fr, it, ja, ko, pl, pt-br, ru, zh-chs, zh-cht)
     - Updated `applyTranslations()` function to add dynamic fireteam view header
     - Confirmed category headlines are already pulled from manifest data and automatically translated
     - Updated `buttonClick()` function to use translated "loading player" text
   - **Files**: `Dev/js/main.js`

3. **Translation Keys Added**:
   - `loadingPlayer`: "Loading player..." in all languages
   - `exoticWeapons`, `legendaryWeapons`, `rareWeapons`, `commonWeapons`
   - `exoticArmor`, `legendaryArmor`, `rareArmor`, `commonArmor`
   - `ghosts`, `vehicles`, `ships`, `emblems`, `finishers`, `shaders`, `mods`, `consumables`, `materials`
   - `fireteamView`, `noFireteamData`
   - All translations provided for all 13 supported languages

### Previous Fixes:

1. **FT-view Remains Cleanup**: 
   - **Problem**: User reported "some remains from the FT-view while returning" and requested screens don't mix
   - **Fix**: 
     - Added `contentFireteam.innerHTML = '';` when entering fireteam view
     - Added `contentFireteam.innerHTML = '';` when returning from fireteam view
     - Applied to all transition methods (touch events, wheel events, both directions)
     - Ensures clean state and prevents UI remains from mixing between views
   - **Files**: `Dev/js/main.js` (lines ~370, ~410, ~470, ~530) 