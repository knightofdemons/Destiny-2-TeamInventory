/*********************************************************************************/
/* Variables & Elements                                                          */
/*********************************************************************************/

// Global variables
let userDB = {
    loadedPlayers: {},
    siteSettings: {},
    Definitions: {},
    manifestPaths: {}
};
let placeholderHTML = "<div id='placeholder'><div class='loader-wrapper'><div class='loader'><div class='loader-inner'></div></div></div></div>";
let statDefinitions = new Object();
let classDefinitions = new Object();
let itemDefinitions = new Object();
let itemDefinitionsTmp = new Object();
let energyDefinitions = new Object();
let catDefinitions = new Object();
let playerlist = new Object();
let siteSettings = new Object();
let lang = '';
let charStatOrder = [2996146975,392767087,1943323491,1735777505,144602215,4244567218];
let buckets = [1498876634,2465295065,953998645,3448274439,3551918588,14239492,20886954,1585787867];
let vendorHashList = [1037843411, 3989934776, 864211278];
let fireteamInterval;
let fireteamCounter;
let fireteamTimer = 60;

let searchWrapper = document.querySelector(".search-input");
let inputBox = searchWrapper.querySelector("#searchAcc");
let suggBox = searchWrapper.querySelector(".autocom-box");
let icon = searchWrapper.querySelector(".icon");
let linkTag = searchWrapper.querySelector("a");
let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#sidebar-btn");
let searchBtn = document.querySelector(".bx-search");
let searchBar = document.querySelector("#searchAcc");
let settingsSubMenu = document.querySelector(".settingsSubMenu");
let aboutFrame = document.querySelector(".aboutFrameOuter");
let settingsThemes = document.querySelector(".settingsThemes");
let settingsBtnCog = document.querySelector("#settingsBtnCog");
let langBtn = document.querySelector("#lang-btn");
let langOpt = document.querySelector(".language-options");
let viewMain = document.querySelector("#viewMain");
let viewFireteam = document.querySelector("#viewFireteam");
let contentFireteam = document.querySelector("#contentFireteam");
let timerBar = document.querySelector(".timerBar");
let viewDIM = document.querySelector(".viewDIM");
let emptyArray = [];
let myInterval;


/*********************************************************************************/
/* document KeyInputs                                                            */
/*********************************************************************************/
inputBox.onkeyup = (e)=>{
	searchPlayer(e.target.value);
}

suggBox.onclick = (e)=>{
	console.log(e.target.value);
}

suggBox.addEventListener('blur', (event) => {
	searchWrapper.classList.remove("active"); //hide autocomplete box
});

document.onmousedown = (e)=> {
	if(!langOpt.contains(e.target) && !settingsSubMenu.contains(e.target) && !settingsThemes.contains(e.target)&& !settingsBtnCog.contains(e.target) && !aboutFrame.contains(e.target)){
		langOpt.classList.remove("open");
		settingsSubMenu.classList.remove("open");
		settingsThemes.classList.remove("open");
		aboutFrame.classList.add("closed");
	}
}

document.onkeydown = (e)=> {
	var keycode;
	if (window.event)
		{keycode = window.event.keyCode;}
	else if (e)
		{keycode = e.which;}
	//Fireteam
	if(keycode == 40 && viewFireteam.classList.contains("open")){
		sidebar.style.display = "block";
		sidebar.classList.toggle("open");
		clearInterval(fireteamInterval);
		viewFireteam.classList.remove("open");
		viewMain.classList.add("open");
	}else if(keycode == 38 && viewMain.classList.contains("open")){
		sidebar.style.display = "none";
		sidebar.classList.toggle("open");
		viewMain.classList.remove("open");
		viewFireteam.classList.add("open");
		countDown(fireteamTimer, getFireteam());
		
	//Playerscrolling
	}else if(keycode == 37 && viewMain.classList.contains("open") && userDB.siteSettings.playerCursor > 0){
		userDB.siteSettings.playerCursor--;
		window.dbOperations.setSetting("playerCursor", userDB.siteSettings.playerCursor);
		switchPlayer();
	}else if(keycode == 39 && viewMain.classList.contains("open") && userDB.siteSettings.playerCursor < (Object.keys(userDB.loadedPlayers).length - 1)){
		userDB.siteSettings.playerCursor++;
		window.dbOperations.setSetting("playerCursor", userDB.siteSettings.playerCursor);
		switchPlayer();
	}
}


/*********************************************************************************/
/* Element Actions	                                                             */
/*********************************************************************************/

async function switchPlayer(){
	try {
		const playerKeys = Object.keys(userDB.loadedPlayers);
		if (playerKeys.length > 0 && userDB.siteSettings.playerCursor < playerKeys.length) {
			const currentPlayer = userDB.loadedPlayers[playerKeys[userDB.siteSettings.playerCursor]];
			viewMain.innerHTML = generatePlayerHTML(currentPlayer);
		}
	} catch (error) {
		console.error("Error switching player:", error);
	}
}

async function showPlayer(membershipId){
	try {
		const cursor = Object.keys(userDB.loadedPlayers).indexOf(membershipId);
		if (cursor !== -1) {
			userDB.siteSettings.playerCursor = cursor;
			await window.dbOperations.setSetting("playerCursor", cursor);
			await switchPlayer();
		}
	} catch (error) {
		console.error("Error showing player:", error);
	}
}

function showItemDetails(){
	// echo "";
}

function showSuggestions(list){
    let listData;
    if (list !== undefined){
		if(!list.length){
			userValue = inputBox.value;
			listData = '<li>${userValue}</li>';
		}else{
		  listData = list.join('');
		}
		suggBox.innerHTML = listData;
	}
}

function countDown(time, callback) {
    fireteamInterval = setInterval(function() {
		if(fireteamCounter == -1){
			timerBar.innerHTML = "<div class='timerBar'>" +
								"You're not logged in - <i onClick='refreshTimer()' class='bx bx-sync'></i> in " + time + "s</div>";			
		}else if(fireteamCounter == 0){
			timerBar.innerHTML = "<div class='timerBar'><span id='offdot'>&#9679;</span>&nbsp;" +
								"Offline (no data) - <i onClick='refreshTimer()' class='bx bx-sync'></i> in " + time + "s</div>";			
		}else if(fireteamCounter > 0){
			timerBar.innerHTML = "<div class='timerBar'><span id='livedot'>&#9679;</span>&nbsp;" +
								"Live Fireteam - <i onClick='refreshTimer()' class='bx bx-sync'></i> in " + time + "s</div>";
		}
        time-- || (clearInterval(fireteamInterval), time=fireteamTimer, countDown(fireteamTimer, getFireteam()));
    }, 1000);
}

function refreshTimer() {
	clearInterval(fireteamInterval);
	time=fireteamTimer;
	countDown(fireteamTimer, getFireteam());
}

function showSettingsSubmenu(){
	settingsSubMenu.classList.toggle("open");
}

function showSettingsAbout(){
	aboutFrame.classList.toggle("closed");
}

function showLoginFrame(){
	loginFrame.classList.toggle("closed");
}

function showLoadingFrame(){
	loadingFrame.classList.add("closed");
}



async function clearData() {
	try {
		await window.dbOperations.clearAllData();
		location.reload();
	} catch (error) {
		console.error("Error clearing data:", error);
	}
}


async function searchPlayer(inputData){
	if(inputData){
		tmpData = inputData.split('#');
		inputData = tmpData[0];
		let postJson = new Object();
		postJson.displayNamePrefix = inputData;
		let rqURL = "https://www.bungie.net/Platform/User/Search/GlobalName/0/";
		let temp = await postData(rqURL, postJson); //data is requested as json
		let tmpRes = temp['Response']['searchResults'];
		if (tmpRes.length > 0) {
			var tmpR = [];
			tmpRes.forEach(function(item, index, array) {
			  IDs = item.destinyMemberships[0].membershipId + "|" + item.destinyMemberships[0].applicableMembershipTypes[0];
			  t = "<li><div class='sresult'><img class='platformLogo' alt='" + IDs + "' src='css/images/logo" + item.destinyMemberships[0].applicableMembershipTypes[0] + ".svg'>" + item.bungieGlobalDisplayName + "#" + item.bungieGlobalDisplayNameCode + "</div></li>";
			  tmpR.push(t);
			});
		}
			searchWrapper.classList.add("active");
			showSuggestions(tmpR);
			let allList = suggBox.querySelectorAll("li");
			for (let i = 0; i < allList.length; i++) {
				//adding onclick attribute in all li tag
				allList[i].setAttribute("onclick", "select(this)");
			}
    }else{
        searchWrapper.classList.remove("active"); //hide autocomplete box
    }
	
}

async function select(element){
    let selectData = element.textContent;
    inputBox.value = selectData;
    if (selectData) {
		selectedAttribute = element.firstChild.firstChild.alt;
        membershipType = (selectedAttribute.split('|'))[1];
        membershipId = (selectedAttribute.split('|'))[0];
		try {
			currentPlayer = await getPlayer(membershipId, membershipType);
			await window.dbOperations.savePlayer(currentPlayer);
			
			// Update local userDB
			userDB.loadedPlayers[currentPlayer.membershipId[0]] = currentPlayer;
			
			// Display the player
			viewMain.innerHTML = generatePlayerHTML(currentPlayer);
			
			suggBox.innerHTML = "";
			inputBox.value = "";
		}catch(err){
			console.log(err.message);
			inputBox.value = "An error occured...";
		}
		searchWrapper.classList.remove("active");
    }
}

// close sidebar when clicking on menu icon
    closeBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      menuBtnChange();
    });


// change sidebar button appearance
function menuBtnChange() {
  if (sidebar.classList.contains("open")) {
    closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
  } else {
    closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
  }
  if (langOpt.classList.contains("open")) {
    langOpt.classList.toggle("open");
  }
}

// toggle navigation button appearance
/*
function anchBtnChange() {
	if (window.location.hash.substr(1) == 'anch-vault') {
		anchorVault.classList.add("selected");
		anchorInv.classList.remove("selected");
		anchorExo.classList.remove("selected");
	} else if (window.location.hash.substr(1) == 'anch-equip') {
		anchorInv.classList.add("selected");
		anchorVault.classList.remove("selected");
		anchorExo.classList.remove("selected");
	} else {
		anchorExo.classList.add("selected");
		anchorVault.classList.remove("selected");
		anchorInv.classList.remove("selected");
	}		
}
*/

function anchBtnChange(anch) {
	anchorVault.classList.remove("selected");
	anchorInv.classList.remove("selected");
	anchorExo.classList.remove("selected");
	document.getElementById(anch).classList.add("selected");
}

// Language
// toggle language when clicking on icon
    langBtn.addEventListener("click", () => {
      langOpt.classList.toggle("open");
    });


async function setLang(lang) {
	try {
		// close language-window
		langOpt.classList.toggle("open");
		// show active language
		var x = document.getElementsByClassName("lang-opt");
		for (let i = 0; i<x.length; i++){
			x[i].classList.toggle("act",false);
		}
		document.getElementById(lang).classList.toggle("act",true);
		langBtn.classList.replace(langBtn.classList.item(1), "flag-icon-"+lang);
		await window.dbOperations.setSetting("lang", lang);
		location.reload();
	} catch (error) {
		console.error("Error setting language:", error);
	}
}

async function clickLogout() {
	try {
		document.querySelector(".settingsSubMenu").classList.toggle("open");
		document.querySelector(".language-options").classList.remove("open");
		await window.dbOperations.deleteOAuthToken();
		document.querySelector("#settingsLogin").style.display = 'flex';
		document.querySelector("#settingsLogout").style.display = 'none';
	} catch (error) {
		console.error("Error logging out:", error);
	}
}

function clickLogin() {
	showLoginFrame();
}

function showTheme() {
	document.querySelector(".settingsThemes").classList.toggle("open")
}

async function setTheme(element) {
	try {
		document.querySelector(".theme-opt.act").classList.remove("act");
		element.classList.add("act");
		
		if(element.id == "red"){
			document.documentElement.style.setProperty('--grad0', getComputedStyle(document.documentElement).getPropertyValue('--themeRedA'));
			document.documentElement.style.setProperty('--grad1', getComputedStyle(document.documentElement).getPropertyValue('--themeRedB'));		
		}else if(element.id == "blue"){
			document.documentElement.style.setProperty('--grad0', getComputedStyle(document.documentElement).getPropertyValue('--themeBlueA'));
			document.documentElement.style.setProperty('--grad1', getComputedStyle(document.documentElement).getPropertyValue('--themeBlueB'));		
		}else if(element.id == "green"){
			document.documentElement.style.setProperty('--grad0', getComputedStyle(document.documentElement).getPropertyValue('--themeGreenA'));
			document.documentElement.style.setProperty('--grad1', getComputedStyle(document.documentElement).getPropertyValue('--themeGreenB'));
		}else if(element.id == "yellow"){
			document.documentElement.style.setProperty('--grad0', getComputedStyle(document.documentElement).getPropertyValue('--themeYellowA'));
			document.documentElement.style.setProperty('--grad1', getComputedStyle(document.documentElement).getPropertyValue('--themeYellowB'));
		}else if(element.id == "orange"){
			document.documentElement.style.setProperty('--grad0', getComputedStyle(document.documentElement).getPropertyValue('--themeOrangeA'));
			document.documentElement.style.setProperty('--grad1', getComputedStyle(document.documentElement).getPropertyValue('--themeOrangeB'));
		}else if(element.id == "purple"){
			document.documentElement.style.setProperty('--grad0', getComputedStyle(document.documentElement).getPropertyValue('--themePurpleA'));
			document.documentElement.style.setProperty('--grad1', getComputedStyle(document.documentElement).getPropertyValue('--themePurpleB'));
		}else if(element.id == "black"){
			document.documentElement.style.setProperty('--grad0', getComputedStyle(document.documentElement).getPropertyValue('--themeBlackA'));
			document.documentElement.style.setProperty('--grad1', getComputedStyle(document.documentElement).getPropertyValue('--themeBlackB'));
		}else if(element.id == "white"){
			document.documentElement.style.setProperty('--grad0', getComputedStyle(document.documentElement).getPropertyValue('--themeWhiteA'));
			document.documentElement.style.setProperty('--grad1', getComputedStyle(document.documentElement).getPropertyValue('--themeWhiteB'));
		}
		await window.dbOperations.setSetting("ThemeGrad0", getComputedStyle(document.documentElement).getPropertyValue('--grad0'));
		await window.dbOperations.setSetting("ThemeGrad1", getComputedStyle(document.documentElement).getPropertyValue('--grad1'));
	} catch (error) {
		console.error("Error setting theme:", error);
	}
}

async function setIconsize(val) {
	try {
		document.documentElement.style.setProperty('--sizeMultiplier', val);
		await window.dbOperations.setSetting("sizeMultiplier", val);
	} catch (error) {
		console.error("Error setting icon size:", error);
	}
}


/*********************************************************************************/
/* Temp 			                                                             */
/*********************************************************************************/

// Function to populate the player bucket in the sidebar
function populatePlayerBucket() {
    const playerBucket = document.getElementById('playerBucket');
    if (!playerBucket) return;
    
    // Clear existing content
    playerBucket.innerHTML = '';
    
    // Add each player from userDB.loadedPlayers
    Object.values(userDB.loadedPlayers).forEach(player => {
        const membershipId = Array.isArray(player.membershipId) ? player.membershipId[0] : player.membershipId;
        const playerName = Array.isArray(player.bungieName) ? player.bungieName[0] : player.bungieName;
        
        const playerElement = document.createElement('li');
        playerElement.id = `acc-${membershipId}`;
        playerElement.className = 'player-item';
        playerElement.innerHTML = `
            <div class="player-info" onclick="showPlayer('${membershipId}')">
                <span class="player-name">${playerName}</span>
            </div>
            <div class="player-actions">
                <i class="bx bx-trash" onclick="deletePlayer('${membershipId}')" title="Remove player"></i>
            </div>
        `;
        
        playerBucket.appendChild(playerElement);
    });
}

// Function to show a specific player
async function showPlayer(membershipId) {
    try {
        const player = userDB.loadedPlayers[membershipId];
        if (player) {
            viewMain.innerHTML = generatePlayerHTML(player);
        }
    } catch (error) {
        console.error("Error showing player:", error);
    }
}

// Function to delete a player from the database and sidebar
async function deletePlayer(membershipId) {
    try {
        // Remove from database
        await window.dbOperations.deletePlayer(membershipId);
        
        // Remove from local userDB
        delete userDB.loadedPlayers[membershipId];
        
        // Update sidebar
        populatePlayerBucket();
        
        // If this was the currently displayed player, show the first available player
        if (viewMain.innerHTML.includes(membershipId)) {
            const playerKeys = Object.keys(userDB.loadedPlayers);
            if (playerKeys.length > 0) {
                const firstPlayer = userDB.loadedPlayers[playerKeys[0]];
                viewMain.innerHTML = generatePlayerHTML(firstPlayer);
            } else {
                viewMain.innerHTML = '<div class="no-players">No players loaded. Add a player to get started.</div>';
            }
        }
    } catch (error) {
        console.error("Error deleting player:", error);
    }
}

async function buttonClick(mshipId, platType){
	try {
		let cP = await getPlayer(mshipId, platType);
		await window.dbOperations.savePlayer(cP);
		
		// Update local userDB
		userDB.loadedPlayers[cP.membershipId[0]] = cP;
		
		// Update sidebar
		populatePlayerBucket();
		
		// Display the player
		viewMain.innerHTML = generatePlayerHTML(cP);
	} catch (error) {
		console.error("Error adding player:", error);
	}
}

// Function to handle scroll-based anchor highlighting
function handleScrollHighlighting() {
    const sections = [
        { id: 'anch-exos', anchor: 'anchorExo' },
        { id: 'anch-equip', anchor: 'anchorInv' },
        { id: 'anch-vault', anchor: 'anchorVault' }
    ];
    
    const scrollPosition = window.scrollY + 100; // Offset for better detection
    
    // Find which section is currently in view
    let currentSection = null;
    
    for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + window.scrollY;
            const elementBottom = elementTop + rect.height;
            
            if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
                currentSection = section;
                break;
            }
        }
    }
    
    // Update anchor highlighting
    if (currentSection) {
        anchBtnChange(currentSection.anchor);
    }
}

// Add scroll event listener when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add scroll event listener for anchor highlighting
    window.addEventListener('scroll', handleScrollHighlighting);
    
    // Initial call to set correct anchor on page load
    setTimeout(handleScrollHighlighting, 100);
});