/*********************************************************************************/
/* Browser Cache Saving/Reading (IndexedDB API) 								 */
/*********************************************************************************/
<script src="https://unpkg.com/dexie/dist/dexie.js"></script>

db = new Dexie("ghostPartition");
db.version(1).stores({
    storeSettings: `
    lang,
    sizeMultiplier,
    ThemeGrad0,
    ThemeGrad1`,
  });
db.storeSettings.bulkPut([
    { id: 1, lang: "en", sizeMultiplier: 1, ThemeGrad0: "#393956", ThemeGrad1: "#161627" }
])


function readGhostPartition(ghostTable, item){
	req = indexedDB.open("ghostPartition", 1);
	req.onerror = function (event) {
		console.error("Error (ghostPartition|read): " + event);
	}
	req.onsuccess = function () {
		db = req.result;
		store = db.transaction(ghostTable, "readonly").objectStore(ghostTable);
		query = store.get(item);
		query.onsuccess = function () {
			//console.log(query);
			return query.result;
		}
	}
}


function updateUserDB() {
// updates userDB in storage from internal userDB
	/*
	userDBtmp = Object.assign({},userDB);
	delete userDBtmp.loadedPlayers;
	userDBtmp.loadedPlayers = Object.keys(userDB['loadedPlayers']);
	localStorage.setItem("userDB", JSON.stringify(userDBtmp));
	*/
}


function writeGhostPartition(storeName, key, val) {
	req = indexedDB.open("ghostPartition", 1);
	req.onerror = function (event) {
		console.error("Error in ghostPartition|readwrite: " + event);
	}
	req.onsuccess = function () {
		db = req.result;
		store = db.transaction(storeName, "readwrite").objectStore(storeName);
		query = store.put(val,key);
		query.onerror = function () {
			console.error("Error in ghostPartition|" + storeName + ": " + key + " could not be updated to: " + val + ". Please try again.");
		}
		query.onsuccess = function () {
			console.log("ghostPartition|" + storeName + ": " + key + " updated to: " + val);
		}
		query.oncomplete = function () {
			db.close;
		}
		
	}
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
	req = indexedDB.open("ghostPartition", 1);
	req.onerror = function (event) {
		console.error("Error (savePlayer): " + event);
	}
	req.onsuccess = function () {
		db = req.result;
		transaction = db.transaction("loadedPlayers", "readwrite");
		store = transaction.objectStore("loadedPlayers");
		store.put(cP.membershipId[0] + "," + cP.platformType[0] + "," + cP.platformName[0]);
		db.close();
	}
}

/*	if(!userDB.hasOwnProperty('loadedPlayers')){
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
		}*/