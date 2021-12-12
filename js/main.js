/*********************************************************************************/
/* Variables & Elements                                                          */
/*********************************************************************************/

const akey = '50a74e4f4f23452c81f7a9cf6a73f124';
let statDefinitions = {};
let classDefinitions = {};
let itemDefinitions = {};
let itemDefinitionsTmp = {};
let energyDefinitions = {};
let catDefinitions = {};
let lang = '';
let playerlist = {};
let charStatOrder = [2996146975,392767087,1943323491,1735777505,144602215,4244567218];
let buckets = [1498876634,2465295065,953998645,3448274439,3551918588,14239492,20886954,1585787867];
let vendorHashList = [1037843411, 3989934776, 864211278];

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
let langBtn = document.querySelector("#lang-btn");
let langOpt = document.querySelector(".language-options");
let viewMain = document.querySelector("#viewMain");
let viewFireteam = document.querySelector("#viewFireteam");
let emptyArray = [];
let myInterval;


/*********************************************************************************/
/* document KeyInputs                                                            */
/*********************************************************************************/
inputBox.onkeyup = (e)=>{
	searchPlayer(e.target.value);
}

document.onkeydown = (e)=> {
	var keycode;
	if (window.event)
		{keycode = window.event.keyCode;}
	else if (e)
		{keycode = e.which;}
	
	if(keycode == 40 && viewFireteam.classList.contains("open")){
		clearInterval(myInterval);
		viewFireteam.classList.remove("open");
		viewMain.classList.add("open");
	}else if(keycode == 38 && viewMain.classList.contains("open")){
		viewMain.classList.remove("open");
		viewFireteam.classList.add("open");
			document.getElementById("viewFireteam").innerHTML = "";
			getFireteam();
			myInterval = setInterval(getFireteam, 60000);
	}
}

/*********************************************************************************/
/* Element Actions	                                                             */
/*********************************************************************************/

function showSettingsSubmenu(){
	settingsSubMenu.classList.toggle("open");
}


function deletePlayer(membershipId){
	document.getElementById("acc-" + membershipId).parentNode.removeChild(document.getElementById("acc-" + membershipId));
	HTML = document.getElementsByClassName("acc-" + membershipId);
	while (HTML[0]){
		HTML[0].remove(); //has to be index0 because element also gets deleted from array for whatever reason
	}
	let storageTmp = JSON.parse(localStorage.getItem("loadedPlayers"));
	let index = storageTmp.findIndex(function(toBeDeleted) {
		return toBeDeleted.membershipId[0] == membershipId;
	});
	storageTmp.splice(index, 1);
	console.log("deleting " + membershipId + " from local player storage");
	localStorage.setItem("loadedPlayers", JSON.stringify(storageTmp));
}


function addPlayerToStorage(data){
	let storageTmp = JSON.parse(localStorage.getItem("loadedPlayers"));
	(storageTmp = storageTmp || []).push(data);
	console.log("saving " + data.platformName + " to local player storage");
	localStorage.setItem("loadedPlayers", JSON.stringify(storageTmp));
}


async function searchPlayer(inputData){
	if(inputData){
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
	suggBox.innerHTML = "";
    inputBox.value = selectData;
    if (selectData) {
		selectedAttribute = element.firstChild.firstChild.alt;
        membershipType = (selectedAttribute.split('|'))[1];
        membershipId = (selectedAttribute.split('|'))[0];
		//checks if div-container is already existing for current player & add player if not
		if(!document.getElementById("acc-" + membershipId)){
			currentPlayer = await getPlayer(membershipId, membershipType);
			addPlayer(currentPlayer, "viewMain");
			addPlayerToStorage(currentPlayer);
			searchWrapper.classList.remove("active");
			inputBox.value = "";
		}else{
			console.log("already existing player");
		}
    }
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
	// remove output & local storage that depends on language (otherwise new values would be pushed to old)
	document.querySelector(".settingsSubMenu").style.display = "none";
	document.querySelector(".language-options").style.display = "none";
	document.getElementById("viewMain").innerHTML = "";
	document.getElementById("playerBucket").innerHTML ="";
	localStorage.removeItem("manifestPaths");
	localStorage.removeItem("statDefinitions");
	localStorage.removeItem("classDefinitions");
	localStorage.removeItem("itemDetails");
	localStorage.removeItem("itemCategoryDetails");
	localStorage.removeItem("itemBucketDetails");
	// save lang
	localStorage.setItem("lang", JSON.stringify(lang));
	// reload manifest
	InitData();
}

function clearData() {
	document.querySelector(".settingsSubMenu").classList.toggle("open");
	document.querySelector(".language-options").classList.remove("open");
	document.getElementById("viewMain").innerHTML = "";
	document.getElementById("playerBucket").innerHTML ="";
	localStorage.clear();
	// save lang
	localStorage.setItem("lang", JSON.stringify(lang));
	// reload page
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
	location.reload();
}

function showTheme() {
	document.querySelector(".settingsThemes").classList.toggle("open")
}

function setTheme(element) {
	document.querySelector(".theme-opt.act").classList.remove("act");
	element.classList.add("act");
	
	if(element.id == "red"){
		document.documentElement.style.setProperty('--grad0', "#FAACA8");
		document.documentElement.style.setProperty('--grad1', "#DDD6F3");		
	}else if(element.id == "blue"){
		document.documentElement.style.setProperty('--grad0', "#8EC5FC");
		document.documentElement.style.setProperty('--grad1', "#E0C3FC");		
	}else if(element.id == "green"){
		document.documentElement.style.setProperty('--grad0', "#85FFBD");
		document.documentElement.style.setProperty('--grad1', "#FFFB7D");
	}else if(element.id == "yellow"){
		document.documentElement.style.setProperty('--grad0', "#faf6de");
		document.documentElement.style.setProperty('--grad1', "#FFD700");
	}else if(element.id == "orange"){
		document.documentElement.style.setProperty('--grad0', "#FBAB7E");
		document.documentElement.style.setProperty('--grad1', "#F7CE68");
	}else if(element.id == "purple"){
		document.documentElement.style.setProperty('--grad0', "#393956");
		document.documentElement.style.setProperty('--grad1', "#161627");
	}else if(element.id == "black"){
		document.documentElement.style.setProperty('--grad0', "rgba(184,184,184,1)");
		document.documentElement.style.setProperty('--grad1', "rgba(255,255,255,1)");
	}else if(element.id == "white"){
		document.documentElement.style.setProperty('--grad0', "rgba(31,31,31,1)");
		document.documentElement.style.setProperty('--grad1', "rgba(42,14,6,1)");
	}
}

function setIconsize(val) {
	document.documentElement.style.setProperty('--iconsize', val + "px");
}


/*********************************************************************************/
/* Temp 			                                                             */
/*********************************************************************************/
async function buttonClick(membershipId, platformType){
		//checks if div-container is already existing for current player & add player if not
		if(!document.getElementById("acc-" + membershipId)){
			currentPlayer = await getPlayer(membershipId, platformType); //temporary function to add a player | will be replaced by searchbar-submit
			addPlayer(currentPlayer, "viewMain");
			addPlayerToStorage(currentPlayer);
		}else{
			console.log("already existing player");
		}
}


/*
test ids:
Hühnchen: 4611686018471653494 (für Umlaute)
BlackBlotch: 4611686018471477303 (für mehrere Platformen)
quaithemerald: 4611686018489703844 (für nur zwei character) 

method: 'GET', // *GET, POST, PUT, DELETE, etc.
mode: 'cors', // no-cors, *cors, same-origin
cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
credentials: 'same-origin', // include, *same-origin, omit
headers: { 'X-API-Key': akey },
redirect: 'follow', // manual, *follow, error
referrerPolicy: 'no-referrer', // *no-referrer, no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
*/