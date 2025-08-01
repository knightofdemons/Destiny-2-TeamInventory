/*********************************************************************************/
/* IndexedDB Database Management for Destiny 2 Team Inventory                   */
/*********************************************************************************/

const DB_NAME = "Destiny2TeamInventory";
const DB_VERSION = 1;

// Database instance
let db = null;

// Initialize the database
async function initDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            console.error("Database error:", request.error);
            reject(request.error);
        };
        
        request.onsuccess = () => {
            db = request.result;
            console.log("Database opened successfully");
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Create object stores
            if (!db.objectStoreNames.contains('settings')) {
                const settingsStore = db.createObjectStore('settings', { keyPath: 'key' });
                settingsStore.createIndex('key', 'key', { unique: true });
            }
            
            if (!db.objectStoreNames.contains('manifestPaths')) {
                const manifestStore = db.createObjectStore('manifestPaths', { keyPath: 'id' });
            }
            
            if (!db.objectStoreNames.contains('definitions')) {
                const definitionsStore = db.createObjectStore('definitions', { keyPath: 'type' });
                definitionsStore.createIndex('type', 'type', { unique: true });
            }
            
            if (!db.objectStoreNames.contains('players')) {
                const playersStore = db.createObjectStore('players', { keyPath: 'membershipId' });
                playersStore.createIndex('membershipId', 'membershipId', { unique: true });
                playersStore.createIndex('platformName', 'platformName', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('oauth')) {
                const oauthStore = db.createObjectStore('oauth', { keyPath: 'id' });
            }
            
            if (!db.objectStoreNames.contains('fireteam')) {
                const fireteamStore = db.createObjectStore('fireteam', { keyPath: 'id' });
            }
            
            console.log("Database schema created/updated");
        };
    });
}

// Generic database operations
async function dbOperation(storeName, operation, mode = 'readonly') {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }
        
        const transaction = db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
        
        operation(store);
    });
}

// Settings operations
async function getSetting(key) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }
        
        const transaction = db.transaction('settings', 'readonly');
        const store = transaction.objectStore('settings');
        const request = store.get(key);
        
        request.onsuccess = () => resolve(request.result ? request.result.value : null);
        request.onerror = () => reject(request.error);
    });
}

async function setSetting(key, value) {
    return dbOperation('settings', (store) => {
        store.put({ key, value });
    }, 'readwrite');
}

async function getAllSettings() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }
        
        const transaction = db.transaction('settings', 'readonly');
        const store = transaction.objectStore('settings');
        const request = store.getAll();
        
        request.onsuccess = () => {
            const settings = {};
            request.result.forEach(item => {
                settings[item.key] = item.value;
            });
            resolve(settings);
        };
        request.onerror = () => reject(request.error);
    });
}

// Manifest operations
async function getManifestPaths() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }
        
        const transaction = db.transaction('manifestPaths', 'readonly');
        const store = transaction.objectStore('manifestPaths');
        const request = store.get(1);
        
        request.onsuccess = () => resolve(request.result ? request.result.paths : null);
        request.onerror = () => reject(request.error);
    });
}

async function setManifestPaths(paths) {
    return dbOperation('manifestPaths', (store) => {
        store.put({ id: 1, paths });
    }, 'readwrite');
}

// Definitions operations
async function getDefinitions(type) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }
        
        const transaction = db.transaction('definitions', 'readonly');
        const store = transaction.objectStore('definitions');
        
        // If no type is provided, get all definitions
        if (!type) {
            const request = store.getAll();
            request.onsuccess = () => {
                const definitions = {};
                request.result.forEach(item => {
                    definitions[item.type] = item.data;
                });
                resolve(definitions);
            };
            request.onerror = () => reject(request.error);
        } else {
            // Get specific type
            const request = store.get(type);
            request.onsuccess = () => resolve(request.result ? request.result.data : null);
            request.onerror = () => reject(request.error);
        }
    });
}

async function setDefinitions(type, data) {
    return dbOperation('definitions', (store) => {
        store.put({ type, data });
    }, 'readwrite');
}

async function getAllDefinitions() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }
        
        const transaction = db.transaction('definitions', 'readonly');
        const store = transaction.objectStore('definitions');
        const request = store.getAll();
        
        request.onsuccess = () => {
            const definitions = {};
            request.result.forEach(item => {
                definitions[item.type] = item.data;
            });
            resolve(definitions);
        };
        request.onerror = () => reject(request.error);
    });
}

// Player operations
async function savePlayer(player) {
    return dbOperation('players', (store) => {
        // Check if player object exists and has membershipId
        if (!player || !player.membershipId) {
            throw new Error('Invalid player data: missing membershipId');
        }
        
        // Ensure membershipId is properly structured for the keyPath
        let membershipId;
        if (Array.isArray(player.membershipId)) {
            // If membershipId is an array, use the first element
            if (player.membershipId.length > 0) {
                membershipId = player.membershipId[0];
            } else {
                throw new Error('Invalid player data: empty membershipId array');
            }
        } else {
            // If membershipId is a string/number, use it directly
            membershipId = player.membershipId;
        }
        
        // Validate that we have a valid membershipId
        if (!membershipId || membershipId === '') {
            throw new Error('Invalid player data: no valid membershipId found');
        }
        
        // Create a copy of the player object with the correct membershipId structure
        const playerToStore = {
            ...player,
            membershipId: membershipId // Ensure it's a single value, not an array
        };
        
        // Since the object store uses keyPath: 'membershipId', just pass the object
        store.put(playerToStore);
    }, 'readwrite');
}

async function getPlayer(membershipId) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }
        
        const transaction = db.transaction('players', 'readonly');
        const store = transaction.objectStore('players');
        const request = store.get(membershipId);
        
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
}

async function getAllPlayers() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }
        
        const transaction = db.transaction('players', 'readonly');
        const store = transaction.objectStore('players');
        const request = store.getAll();
        
        request.onsuccess = () => {
            const players = {};
            request.result.forEach(player => {
                // Handle both array and single value membershipId for backward compatibility
                const membershipId = Array.isArray(player.membershipId) ? player.membershipId[0] : player.membershipId;
                players[membershipId] = player;
            });
            resolve(players);
        };
        request.onerror = () => reject(request.error);
    });
}

async function deletePlayer(membershipId) {
    return dbOperation('players', (store) => {
        store.delete(membershipId);
    }, 'readwrite');
}

// OAuth operations
async function saveOAuthToken(token) {
    return dbOperation('oauth', (store) => {
        store.put({ id: 'token', data: token });
    }, 'readwrite');
}

async function getOAuthToken() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }
        
        const transaction = db.transaction('oauth', 'readonly');
        const store = transaction.objectStore('oauth');
        const request = store.get('token');
        
        request.onsuccess = () => resolve(request.result ? request.result.data : null);
        request.onerror = () => reject(request.error);
    });
}

async function deleteOAuthToken() {
    return dbOperation('oauth', (store) => {
        store.delete('token');
    }, 'readwrite');
}

// Fireteam operations
async function saveFireteamData(data) {
    return dbOperation('fireteam', (store) => {
        store.put({ id: 'current', data });
    }, 'readwrite');
}

async function getFireteamData() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }
        
        const transaction = db.transaction('fireteam', 'readonly');
        const store = transaction.objectStore('fireteam');
        const request = store.get('current');
        
        request.onsuccess = () => resolve(request.result ? request.result.data : null);
        request.onerror = () => reject(request.error);
    });
}

// Migration from localStorage
async function migrateFromLocalStorage() {
    try {
        // Check if migration is needed
        const hasLocalStorageData = localStorage.getItem("userDB") || localStorage.getItem("oauthToken");
        
        if (!hasLocalStorageData) {
            console.log("No localStorage data to migrate");
            return;
        }
        
        console.log("Starting migration from localStorage...");
        
        // Migrate settings
        const userDB = JSON.parse(localStorage.getItem("userDB"));
        if (userDB && userDB.siteSettings) {
            for (const [key, value] of Object.entries(userDB.siteSettings)) {
                await setSetting(key, value);
            }
        }
        
        // Migrate OAuth token
        const oauthToken = localStorage.getItem("oauthToken");
        if (oauthToken) {
            await saveOAuthToken(JSON.parse(oauthToken));
        }
        
        // Migrate players
        if (userDB && userDB.loadedPlayers) {
            for (const [membershipId, player] of Object.entries(userDB.loadedPlayers)) {
                try {
                    // Ensure player has the correct structure
                    if (player && typeof player === 'object') {
                        await savePlayer(player);
                    }
                } catch (error) {
                    console.warn(`Failed to migrate player ${membershipId}:`, error);
                }
            }
        }
        
        // Migrate definitions
        if (userDB && userDB.Definitions) {
            for (const [type, data] of Object.entries(userDB.Definitions)) {
                await setDefinitions(type, data);
            }
        }
        
        // Migrate manifest paths
        if (userDB && userDB.manifestPaths) {
            await setManifestPaths(userDB.manifestPaths);
        }
        
        console.log("Migration from localStorage completed successfully");
        
        // Clear localStorage after successful migration
        localStorage.clear();
        
    } catch (error) {
        console.error("Migration error:", error);
        // Don't clear localStorage if migration failed
    }
}

// Clear all data
async function clearAllData() {
    try {
        await dbOperation('settings', (store) => store.clear(), 'readwrite');
        await dbOperation('players', (store) => store.clear(), 'readwrite');
        await dbOperation('oauth', (store) => store.clear(), 'readwrite');
        await dbOperation('fireteam', (store) => store.clear(), 'readwrite');
        await dbOperation('definitions', (store) => store.clear(), 'readwrite');
        await dbOperation('manifestPaths', (store) => store.clear(), 'readwrite');
        
        console.log("All data cleared from IndexedDB");
    } catch (error) {
        console.error("Error clearing data:", error);
    }
}

// Initialize database and migrate data
async function initializeDatabase() {
    try {
        await initDatabase();
        await migrateFromLocalStorage();
        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Database initialization failed:", error);
    }
}

// Export functions for use in other modules
window.dbOperations = {
    initDatabase: initializeDatabase,
    getSetting,
    setSetting,
    getAllSettings,
    getManifestPaths,
    setManifestPaths,
    getDefinitions,
    setDefinitions,
    getAllDefinitions,
    savePlayer,
    getPlayer,
    getAllPlayers,
    deletePlayer,
    saveOAuthToken,
    getOAuthToken,
    deleteOAuthToken,
    saveFireteamData,
    getFireteamData,
    clearAllData
};