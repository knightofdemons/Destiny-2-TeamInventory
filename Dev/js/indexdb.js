/*********************************************************************************/
/* Browser Cache Saving/Reading (IndexedDB API) 								 */
/*********************************************************************************/

const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.shimIndexedDB;

const request = indexedDB.open("userDB", 1);

<<<<<<< HEAD
//const idQuery = Sstore.get(1);
=======
const idQuery = sStore.get(1);
>>>>>>> 83270a8e0d05e3081fbb9d038603d921e71df5f4

request.onerror = function (event) {
	console.error("Error (IndexedDB): " + event);
}

request.onupgradeneeded = function () {
	const db = request.result;
<<<<<<< HEAD
	const Sstore = db.createObjectStore("SiteSettings", { keyPath: "id" });
	const Mstore = db.createObjectStore("manifestPaths", { keyPath: "id" });
	const Dstore = db.createObjectStore("Definitions", { keyPath: "id" });
	const Pstore = db.createObjectStore("loadedPlayers", { keyPath: "id" });
	
	const transaction = db.transaction("userDB", "readwrite");

	const Sstore = transaction.objectStore("SiteSettings");
	const Mstore = transaction.objectStore("manifestPaths");
	const Dstore = transaction.objectStore("Definitions");
	const Pstore = transaction.objectStore("loadedPlayers");

	Sstore.put({lang: "en", sizeMultiplier: 1, ThemeGrad0: "#393956", ThemeGrad1: "#161627"});
	Mstore.put({stat: "", item: "", itemCategoryDetails: "", itemBucketDetails: "", classDef: "", energy: "", damageType: "", vendor: "", record: ""});
	Dstore.put({stat: "", item: "", classDef: "", energy: "", damageType: "", vendor: "", record: ""});
	Pstore.put({0: ""});
}

request.onsuccess = function () {
	const db = request.result;

=======
	const sStore = db.createObjectStore("SiteSettings", { keyPath: "id" });
	const mStore = db.createObjectStore("manifestPaths", { keyPath: "id" });
	const dStore = db.createObjectStore("Definitions", { keyPath: "id" });
	const pStore = db.createObjectStore("loadedPlayers", { keyPath: "id" });
}

request.onsuccess = function () {
	const db = request.result;
	const transaction = db.transaction("userDB", "readwrite");

	const sStore = transaction.objectStore("userDB");
	const mStore = transaction.objectStore("userDB");
	const dStore = transaction.objectStore("userDB");
	const pStore = transaction.objectStore("userDB");

	sStore.put({lang: "en", sizeMultiplier: 1, ThemeGrad0: "#393956", ThemeGrad1: "#161627"});
	mStore.put({stat: "", item: "", itemCategoryDetails: "", itemBucketDetails: "", classDef: "", energy: "", damageType: "", vendor: "", record: ""});
	dStore.put({stat: "", item: "", classDef: "", energy: "", damageType: "", vendor: "", record: ""});
	pStore.put({0: ""});
>>>>>>> 83270a8e0d05e3081fbb9d038603d921e71df5f4

}












function updateUserDB() {
// updates userDB in storage from internal userDB
	userDBtmp = Object.assign({},userDB);
	delete userDBtmp.loadedPlayers;
	userDBtmp.loadedPlayers = Object.keys(userDB['loadedPlayers']);
	localStorage.setItem("userDB", JSON.stringify(userDBtmp));
}

function saveSiteSettings(prop, val){
	if(!userDB['siteSettings'].hasOwnProperty(prop)){
		userDB['siteSettings'][prop] = {};
	}
	userDB['siteSettings'][prop] = val;
	updateUserDB();
}

async function refreshPlayer(membershipId){
	currentPlayer = await getPlayer(userDB['loadedPlayers'][membershipId]['membershipId'][0], userDB['loadedPlayers'][membershipId]['platformType'][0]);
	userDB['loadedPlayers'][membershipId] = currentPlayer;
	updateUserDB();
}

function deletePlayer(membershipID){
	document.getElementById("acc-" + membershipID).remove();
	delete userDB['loadedPlayers'][membershipID];
	console.log("deleted " + membershipID + " from local player storage");
	updateUserDB();
}

async function savePlayer(cP){
	if(!userDB.hasOwnProperty('loadedPlayers')){
			userDB['loadedPlayers'] = {};
		}
		if(!userDB['loadedPlayers'].hasOwnProperty(cP.membershipId)){
			userDB['loadedPlayers'][cP.membershipId[0]] = cP;
			console.log("saved " + cP.membershipId[0] + " to local player storage");
			updateUserDB();
			showPlayer(cP.membershipId[0]);
			document.getElementById("playerBucket").innerHTML += "<li id='acc-"+ cP.membershipId[0] + "'>" +
																		"<a onclick=\"showPlayer('" + cP.membershipId[0] + "')\">" +
																			"<img class='platformLogo' src='css/images/logo" + cP.platformType[0] + ".svg'>" +
																			"<span class='links_name'>" + cP.platformName[0] + "</span>" +
																			"<i class='bx bx-bookmark-minus' onclick=\"deletePlayer('" + cP.membershipId[0] + "')\"></i>" +
																		"</a>";
																	"</li>";
		}else{
			console.log("already existing player");
		}
}