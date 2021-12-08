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
		viewFireteam.classList.remove("open");
		viewMain.classList.add("open");
	}else if(keycode == 38 && viewMain.classList.contains("open")){
		viewMain.classList.remove("open");
		viewFireteam.classList.add("open");
			document.getElementById("viewFireteam").innerHTML = "";
			const HTML = getFireteam();
			document.getElementById("viewFireteam").innerHTML = HTML;
	}
}

async function getFireteam(){
	const HTML = "";
	let temp = JSON.parse(localStorage.getItem("oauthToken"));
	let rqURL = 'https://www.bungie.net/Platform/User/GetBungieNetUserById/' + temp["membership_id"] + '/';
	temp = await getData(rqURL);
	console.log(temp["Response"] );
	rqURL = "https://www.bungie.net/Platform/User/Search/Prefix/" + temp["Response"] + "/0/";
	temp = await getData(rqURL);
	
	//let rqURL = 'https://www.bungie.net/Platform/Destiny2/' + memberType + '/Profile/' + memberID + '/?components=1000';
	//temp = await getData(rqURL);
	
	
	
	return HTML;
}


async function searchPlayer(inputData){
	if(inputData){
		let rqURL = "https://www.bungie.net/Platform/User/Search/GlobalName/" + inputData + "/";
		let temp = await getData(rqURL);
		if (temp['Response']['searchResults'].length > 0) {
		let tmp = temp.Response.searchResults;
			var tmpR = [];
			tmp.forEach(function(item, index, array) {
			  IDs = item.destinyMemberships[0].membershipId + "|" + item.destinyMemberships[0].membershipType;
			  t = "<li><div class='sresult'><img class='platformLogo' alt='" + IDs + "' src='css/images/logo" + item.destinyMemberships[0].membershipType + ".svg'>" + item.bungieGlobalDisplayName + "#" + item.bungieGlobalDisplayNameCode + "</div></li>";
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
			addPlayer(currentPlayer);
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

async function postData(url = '', data = {}, UseJSON = true) {
	if(UseJSON){
		let h = "'Content-Type': 'application/json'";
	}else{
		let h = "'Content-Type': 'application/x-www-form-urlencoded'";
	}
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: { h },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: data // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
