// getting all required elements
const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("#search");
const suggBox = searchWrapper.querySelector(".autocom-box");
const icon = searchWrapper.querySelector(".icon");
let linkTag = searchWrapper.querySelector("a");
let webLink;
let rqURL;
let suggestions;
let emptyArray = [];
// if user press any key and release
inputBox.onkeyup = (e)=>{
    let userData = e.target.value; //user enetered data
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
		console.log(element);
		newAccount = selectData.split('#');
        window.open("index.php?account=" + newAccount[0],"_self");
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
function getSearchResults(URL) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", URL);
	xhr.setRequestHeader("X-API-Key",akey);

	xhr.onreadystatechange = function () {
	   if (xhr.readyState === 4) {
		  //console.log(xhr.status);
		  xh = JSON.parse(xhr.responseText);
		  tmp = xh.Response.searchResults;
		  var tmpR = [];
		  tmp.forEach(function(item, index, array) {
			  imgp = 'https://www.bungie.net' + item.destinyMemberships[0].iconPath;
			  data = item.destinyMemberships[0].membershipId + item.destinyMemberships[0].membershipType;
			  t = "<li><div class='sresult'><img src='"+imgp+"'>" + item.bungieGlobalDisplayName + "#" + item.bungieGlobalDisplayNameCode + "</div></li>";
			  tmpR.push(t);
			});
			searchWrapper.classList.add("active");
			showSuggestions(tmpR);
				let allList = suggBox.querySelectorAll("li");
				for (let i = 0; i < allList.length; i++) {
					//adding onclick attribute in all li tag
					allList[i].setAttribute("onclick", "select(this)");
				}
	   }};
	xhr.send();
}