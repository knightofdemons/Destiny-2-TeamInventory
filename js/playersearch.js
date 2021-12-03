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
let emptyArray = [];

// if user press any key and release
inputBox.onkeyup = (e)=>{
	searchPlayer(e.target.value);
}

async function searchPlayer(inputData){
	if(inputData){
		let rqURL = "https://www.bungie.net/Platform/User/Search/Prefix/" + inputData + "/0/";
		let temp = await getData(rqURL);
		let tmp = temp.Response.searchResults;
			var tmpR = [];
			tmp.forEach(function(item, index, array) {
			  imgp = 'https://www.bungie.net' + item.destinyMemberships[0].iconPath;
			  IDs = item.destinyMemberships[0].membershipId + "|" + item.destinyMemberships[0].membershipType;
			  t = "<li><div class='sresult'><img alt='" + IDs + "' src='"+imgp+"'>" + item.bungieGlobalDisplayName + "#" + item.bungieGlobalDisplayNameCode + "</div></li>";
			  tmpR.push(t);
			});
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
    if(!list.length){
        userValue = inputBox.value;
        listData = '<li>${userValue}</li>';
    }else{
      listData = list.join('');
    }
    suggBox.innerHTML = listData;
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
}