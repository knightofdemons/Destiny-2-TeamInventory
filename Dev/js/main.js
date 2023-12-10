/*********************************************************************************/
/* Variables & Elements                                                          */
/*********************************************************************************/

let userDB = new Object();
userDB = JSON.parse(localStorage.getItem("userDB"));
let placeholderHTML = 	"<div id='placeholder'><div class='loader-wrapper'><div class='loader'><div class='loader-inner'></div></div></div></div>";
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
	}else if(keycode == 37 && viewMain.classList.contains("open") && localGhost['playerCursor'] > 0){
		localGhost['playerCursor']--;
		switchPlayer();
	}else if(keycode == 39 && viewMain.classList.contains("open") && localGhost['playerCursor'] < (Object.keys(userDB['loadedPlayers']).length - 1)){
		localGhost['playerCursor']++;
		switchPlayer();
	}
}


/*********************************************************************************/
/* Element Actions	                                                             */
/*********************************************************************************/

async function switchPlayer(){
	viewMain.innerHTML = generatePlayerHTML(userDB['loadedPlayers'][Object.keys(userDB['loadedPlayers'])[userDB['siteSettings']['playerCursor']]]);
}

function showPlayer(membershipId){
	t = readGhostPartition("loadedPlayers",1);
	console.log(t);
	cursor = Object.keys(userDB['loadedPlayers']).indexOf(membershipId);
	userDB['siteSettings']['playerCursor'] = cursor;
	switchPlayer();
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



function clearData() {
	localStorage.clear();
	location.reload();
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
			savePlayer(currentPlayer);
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


function setLang(lang) {
	// close language-window
	langOpt.classList.toggle("open");
	// show active language
	var x = document.getElementsByClassName("lang-opt");
	for (let i = 0; i<x.length; i++){
		x[i].classList.toggle("act",false);
	}
	document.getElementById(lang).classList.toggle("act",true);
	langBtn.classList.replace(langBtn.classList.item(1), "flag-icon-"+lang);
	writeGhostPartition("siteSettings","lang", lang);
	location.reload();
}

function clickLogout() {
	document.querySelector(".settingsSubMenu").classList.toggle("open");
	document.querySelector(".language-options").classList.remove("open");
	localStorage.removeItem("oauthToken");
	document.querySelector("#settingsLogin").style.display = 'flex';
	document.querySelector("#settingsLogout").style.display = 'none';
}

function clickLogin() {
	showLoginFrame();
}

function showTheme() {
	document.querySelector(".settingsThemes").classList.toggle("open")
}

function setTheme(color0,color1) {
	//document.querySelector(".theme-opt.act").classList.remove("act");
	//element.classList.add("act");
	grad0 = getComputedStyle(document.documentElement).getPropertyValue(color0);
	grad1 = getComputedStyle(document.documentElement).getPropertyValue(color1);
	writeGhostPartition("siteSettings","ThemeGrad0", grad0);
	writeGhostPartition("siteSettings","ThemeGrad1", grad1);
	document.documentElement.style.setProperty('--grad0',grad0);
	document.documentElement.style.setProperty('--grad1',grad1);
}

function setIconsize(val) {
	document.documentElement.style.setProperty('--sizeMultiplier', val);
	writeGhostPartition("siteSettings","sizeMultiplier", val);
}


/*********************************************************************************/
/* Temp 			                                                             */
/*********************************************************************************/
async function buttonClick(mshipId, platType){
		let cP = await getPlayer(mshipId, platType);
		savePlayer(cP);
}