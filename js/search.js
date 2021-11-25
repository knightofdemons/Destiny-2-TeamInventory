// getting all required elements
const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("#searchAcc");
const suggBox = searchWrapper.querySelector(".autocom-box");
const icon = searchWrapper.querySelector(".icon");
let linkTag = searchWrapper.querySelector("a");
let webLink;
let rqURL;
let suggestions;
let emptyArray = [];
let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#sidebar-btn");
let searchBtn = document.querySelector(".bx-search");
let searchBar = document.querySelector("#searchAcc");

// if user press any key and release
inputBox.onkeyup = (e)=>{
    let userData = e.target.value; //user entered data
	if(userData){
		rqURL = "https://www.bungie.net/Platform/User/Search/Prefix/" + userData + "/0/";
		temp = getSearchResults(rqURL);
    }else{
        searchWrapper.classList.remove("active"); //hide autocomplete box
    }
}
function select(element){
    let selectData = element.textContent;
    inputBox.value = selectData;
    if (selectData) {
		pName = selectData.split('#');
		playerName = pName[0];
        selectedValue = $(element).find("img").attr("alt");
         if (playerCounter > 0) {
            var xmlhttp = new XMLHttpRequest();
            var vars = 'playerDetails=' + escape(JSON.stringify(playerDetails)) + '&playerCounter=' + playerCounter;
            xmlhttp.open("POST", "incMain.php?account=" + playerName + '&platform=' + selectedValue, true);
            xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xmlhttp.onreadystatechange = function() {
                if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var return_data = xmlhttp.responseText;
                    document.getElementById("main").insertAdjacentHTML('afterbegin', return_data); // add new player
                    showFirstPlayer(); // show new player
                    hideLoadingBanner(); // hide loading banner
                    document.getElementById('searchAcc').value = ''; // clear search field
                }
            }
            xmlhttp.send(vars);
            document.getElementById('loading').style.display = "flex"; // show loading banner
        } else {
            window.location.href = (window.location.href.split('?')[0]) + "?account=" + playerName + '&platform=' + selectedValue;
            document.getElementById('loading').style.display = "flex"; // show loading banner
    
        }    
    }
    searchWrapper.classList.remove("active");
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
function XMLReq(URL) {

}
function getSearchResults(URL) {
		var xhr = new XMLHttpRequest();
	xhr.open("GET", URL);
	xhr.setRequestHeader("X-API-Key",akey);

	xhr.onreadystatechange = function () {
	   if (xhr.readyState === 4) {
			xh = JSON.parse(xhr.responseText);
		  	tmp = xh.Response.searchResults;
			var tmpR = [];
			tmp.forEach(function(item, index, array) {
			  imgp = 'https://www.bungie.net' + item.destinyMemberships[0].iconPath;
			  mshps = item.destinyMemberships[0].membershipType;
			  data = item.destinyMemberships[0].membershipId + item.destinyMemberships[0].membershipType;
			  t = "<li><div class='sresult'><img alt='"+mshps+"' src='"+imgp+"'>" + item.bungieGlobalDisplayName + "#" + item.bungieGlobalDisplayNameCode + "</div></li>";
			  tmpR.push(t);
			});
			searchWrapper.classList.add("active");
			showSuggestions(tmpR);
			let allList = suggBox.querySelectorAll("li");
			for (let i = 0; i < allList.length; i++) {
				//adding onclick attribute in all li tag
				allList[i].setAttribute("onclick", "select(this)");
			}
	   }
	};
	xhr.send();

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

// reload page on click & show loading banner
function searchAcc() {

}

// add Player to sidebar-bucket
function addPlayer(playerName) {
    if (!document.getElementById("playerBucket_" + playerName)) {
        document.getElementById("playerBucket").insertAdjacentHTML('beforeend', "<a id='playerBucket_" + playerName + "' onclick=togglePlayer('" + encodeURI(playerName) + "')><i class='bx bxs-heart'></i><span class='links_name'>" + playerName + "</span><i class='bx bx-trash' onclick=deletePlayer(event,'" + encodeURI(playerName) + "')></i></a>");
        playerCounter ++;   
    } else {
        document.getElementById('playerBucket_' + playerName).style.display = "flex";
    }
}

// delete Player from sidebar-bucket
function deletePlayer(event,playerName) {
    document.getElementById('playerBucket_' + decodeURI(playerName)).style.display = "none";
    event.stopPropagation();
}

// show / hide player div
function togglePlayer(playerName) {
  if (document.getElementById(decodeURI(playerName)).style.display === "none") {
    hideLastPlayer();
    document.getElementById(decodeURI(playerName)).style.display = "block";
    window.location.href = "#" + playerName + "_" + window.location.hash.substr(1).split("_").pop(); // go to same anchor as before
    
  }
}

// show first player div
function showFirstPlayer() {
     hideLastPlayer();
     $(".playerWrapper:first").eq(0).css("display", "block");
}

// hide all
function hideLastPlayer() {
     $(".playerWrapper").css("display", "none");
     
}

// hide loading banner
function hideLoadingBanner() {
    document.getElementById('loading').style.display = "none";
}

// jump to section of player
function jumpTo(section) { 
    var x = document.getElementsByClassName("playerWrapper");
    var l = Object.keys(x).length;
    for (var i = 0; i <= l-1; i++) {
    	var style = window.getComputedStyle(x[i]); // get actual style of the element with class name playerWrapper
    	if (style.display === 'block') {
        	var y = x[i].id; // set y to id of element which has display:block
        }
    }
    window.location.href = "#" + y + "_" + section;   
}

// show class nav settings
function showSubNav() {
    document.getElementsByClassName("nav-settings")[0].style.display = "block";
}