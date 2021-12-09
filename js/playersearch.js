// getting all required elements
let searchWrapper = document.querySelector(".search-input");
let inputBox = searchWrapper.querySelector("#searchAcc");
let suggBox = searchWrapper.querySelector(".autocom-box");
let icon = searchWrapper.querySelector(".icon");
let linkTag = searchWrapper.querySelector("a");
let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#sidebar-btn");
let searchBtn = document.querySelector(".bx-search");
let searchBar = document.querySelector("#searchAcc");
let langBtn = document.querySelector("#lang-btn");
let langOpt = document.querySelector(".language-options");
let viewMain = document.querySelector("#viewMain");
let viewFireteam = document.querySelector("#viewFireteam");
let emptyArray = [];
let myInterval;

// if user press any key and release
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

async function getFireteam(){
	let temp = JSON.parse(localStorage.getItem("oauthToken"));
	let rqURL = 'https://www.bungie.net/Platform/Destiny2/254/Profile/' + temp["membership_id"] + '/LinkedProfiles/?getAllMemberships=true';
	temp = await getData(rqURL);
		memberID = temp["Response"]["profiles"][0]["membershipId"];
		memberType = temp["Response"]["profiles"][0]["applicableMembershipTypes"][0];
		rqURL = 'https://www.bungie.net/Platform/Destiny2/' + memberType + '/Profile/' + memberID + '/?components=1000';
		temp = await getData(rqURL);
			if (!temp["Response"]["profileTransitoryData"]["data"]){
				viewFireteam.innerHTML = "<div class='warning'><a>You are currently not online!</a></div>";
			}else{
				for (let i = 0; i < temp["Response"]["profileTransitoryData"]["data"]["partyMembers"].length; i++){
					rqURL = 'https://www.bungie.net/Platform/Destiny2/254/Profile/' + temp["Response"]["profileTransitoryData"]["data"]["partyMembers"][i]["membershipId"] + '/LinkedProfiles/?getAllMemberships=true';
					tmpProf = await getData(rqURL);
					console.log(tmpProf);
					currentPlayer = await getPlayer(temp["Response"]["profileTransitoryData"]["data"]["partyMembers"][i]["membershipId"], tmpProf["Response"]["profiles"][0]["applicableMembershipTypes"][0]);
					addPlayer(currentPlayer, "viewFireteam");
				}
			}
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
			suggBox.innerHTML = "";
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


async function getData(url, useApiKey = true) {
		//fetch json response for getRequests | use false as option to generate a request without using the apikey
		let tmpHead = new Headers();
		if(useApiKey){tmpHead.set('X-API-Key', akey);}
		const fetchOptions = {method:'GET', mode:'cors', cache:'default', credentials:'same-origin',redirect:'follow', referrerPolicy:'no-referrer', headers:tmpHead,};
		const response = await fetch(url, fetchOptions);
		return response.json();
}


async function postData(url = '', data = {}, UseJSON = true) {
	var tmpHead = new Headers();
	let tmpData = {};
	if(UseJSON){
		tmpHead.set('Content-Type', 'application/json');
		tmpData = JSON.stringify(data);
	}else{
		tmpHead.set('Content-Type', 'application/x-www-form-urlencoded');
		tmpData = data;
	}
	tmpHead.set('X-API-Key', akey);
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: tmpHead,
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: tmpData // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
