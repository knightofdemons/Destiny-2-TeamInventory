const apiKey = "50a74e4f4f23452c81f7a9cf6a73f124";
const dbVersion = 1;
const dbStoreName = "inventory";

// Check for IndexedDB support
if (!window.indexedDB) {
  console.log("Your browser doesn't support IndexedDB.");
}

// Open the IndexedDB database
const request = window.indexedDB.open(dbStoreName, dbVersion);
let db;

request.onerror = function (event) {
  console.log("Database error: " + event.target.errorCode);
};

request.onsuccess = function (event) {
  console.log("Database opened successfully.");
  db = event.target.result;
};

request.onupgradeneeded = function (event) {
  console.log("Database upgrade needed.");
  db = event.target.result;
  const store = db.createObjectStore(dbStoreName);
};

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const inventoryTitle = document.getElementById("inventory-title");
const weaponsTitle = document.getElementById("weapons-title");
const gearTitle = document.getElementById("gear-title");
const inventoryList = document.getElementById("inventory-list");
const weaponsList = document.getElementById("weapons-list");
const gearList = document.getElementById("gear-list");
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebar = document.getElementById("sidebar");

// Add event listener for input event on search input
searchInput.addEventListener("input", function(event) {
  event.preventDefault();
  searchResults.innerHTML = ""; // Clear previous search results

  const searchTerm = searchInput.value.trim(); // Get search term and remove whitespace
  if (searchTerm.length < 3) return; // Don't search if search term is too short

  // Make search request to Bungie API
  const searchUrl = `https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/-1/${encodeURIComponent(searchTerm)}/`;
  fetch(searchUrl, {
    headers: {
      "X-API-Key": apiKey
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => {
    const searchResultsHtml = data.Response.map(player => {
      return `
        <li class="search-result">
          <a href="#" data-membership-type="${player.membershipType}" data-membership-id="${player.membershipId}">
            ${player.displayName} (${player.membershipType})
          </a>
        </li>
      `;
    }).join("");
    searchResults.innerHTML = searchResultsHtml;
  })
  .catch(error => {
    console.error("There was a problem with the search request:", error);
  });
});

// Handle inventory button click
inventoryTitle.addEventListener("click", () => {
  inventory.scrollIntoView();
});

// Handle weapons button click
weaponsTitle.addEventListener("click", () => {
  document.querySelector("#weapons").scrollIntoView();
});

// Handle gear button click
gearTitle.addEventListener("click", () => {
  document.querySelector("#gear").scrollIntoView();
});

// Handle search result click
searchResults.addEventListener("click", (event) => {
  if (event.target.matches("li")) {
    const membershipType = event.target.dataset.membershipType;
    const membershipId = event.target.dataset.membershipId;
    const displayName = event.target.dataset.displayName;
    displayInventory(membershipType, membershipId, displayName);
  }
});

// Search Bungie.net accounts
async function searchAccounts(searchTerm) {
  const url = `https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/-1/${encodeURIComponent(
    searchTerm
  )}/`;
  const response = await fetch(url, {
    headers: {
      "X-API-Key": apiKey,
    },
  });
  const data = await response.json();
  if (data.Response.length > 0) {
    data.Response.forEach((result) => {
      const li = document.createElement("li");
      li.dataset.membershipType = result.membershipType;
      li.dataset.membershipId = result.membershipId;
      li.dataset.displayName = result.displayName;
      li.textContent = result.displayName;
      searchResults.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "No results found.";
    searchResults.appendChild(li);
  }
}

// function to display player inventory
function displayPlayerInventory(data) {
  const characterId = data.Response.characterId;
  const inventory = data.Response.inventory.data.items;
  const equipped = data.Response.equipment.data.items;

  const characterName = getCharacterName(characterId);
  const characterClass = getClassFromType(data.Response.character.data.classType);

  // display character name and class
  const characterHeader = document.createElement("div");
  characterHeader.classList.add("character-header");
  characterHeader.innerHTML = `<h2>${characterName}</h2><span>${characterClass}</span>`;
  mainContent.appendChild(characterHeader);

  // display inventory categories
  const categories = ["Weapons", "Armor", "General"];
  for (let category of categories) {
    const categoryHeader = document.createElement("div");
    categoryHeader.classList.add("category-header");
    categoryHeader.innerHTML = `<h3>${category}</h3>`;
    mainContent.appendChild(categoryHeader);

    // display inventory items
    const categoryItems = getCategoryItems(category, inventory);
    const categoryEquippedItems = getCategoryItems(category, equipped);
    for (let item of categoryItems) {
      const itemElement = createInventoryItemElement(item, categoryEquippedItems);
      mainContent.appendChild(itemElement);
    }
  }

  // update indexedDB with new inventory data
  const dbPromise = openDatabase();
  dbPromise.then(db => {
    const tx = db.transaction("playerInventory", "readwrite");
    const store = tx.objectStore("playerInventory");
    store.put({ membershipId: currentMembershipId, characterId: characterId, inventory: data.Response });
    return tx.complete;
  });
}

// function to retrieve player inventory data
function getPlayerInventoryData(membershipId, characterId) {
  const dbPromise = openDatabase();
  dbPromise.then(db => {
    const tx = db.transaction("playerInventory", "readonly");
    const store = tx.objectStore("playerInventory");
    const index = store.index("byMembershipAndCharacter");
    return index.get([membershipId, characterId]);
  }).then(data => {
    if (data) {
      // if inventory data exists in indexedDB, use it
      displayPlayerInventory(data.inventory);
    } else {
      // if inventory data does not exist in indexedDB, request it from the API
      const url = `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${membershipId}/Character/${characterId}/?components=Inventory,Character,Equipment`;
      fetch(url, {
        headers: {
          "X-API-Key": apiKey
        }
      }).then(response => {
        return response.json();
      }).then(data => {
        displayPlayerInventory(data);
      }).catch(error => {
        console.error(error);
      });
    }
  });
}
