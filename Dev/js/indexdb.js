/*********************************************************************************/
/* Browser Cache Saving/Reading (IndexedDB API) 								 */
/*********************************************************************************/

const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.shimIndexedDB;
const request = indexedDB.open("userDB", 1);

//const idQuery = Sstore.get(1);

request.onerror = function (event) {
	console.error("Error (IndexedDB): " + event);
}

request.onupgradeneeded = function (event) {
	const db = request.result;
	switch(event.oldVersion) { // existing db version
		case 0:
			const storeSettings = db.createObjectStore("siteSettings");
			const storePaths = db.createObjectStore("manifestPaths", { autoIncrement: true });
			const storeDefStat = db.createObjectStore("statDef");
			const storeDefItem = db.createObjectStore("itemDef");
			const storeDefClass = db.createObjectStore("classDef");
			const storeDefEnergy = db.createObjectStore("energyDef");
			const storeDefDmg = db.createObjectStore("dmgtypeDef");
			const storeDefVendor = db.createObjectStore("vendorDef");
			const storeDefRecord = db.createObjectStore("recordDef");
			const storePlayer = db.createObjectStore("loadedPlayers", { autoIncrement: true });
			
			//Building tables
			storeSettings.put("en","lang");
			storeSettings.put(1,"sizeMultiplier");
			storeSettings.put("#393956","ThemeGrad0");
			storeSettings.put("#161627","ThemeGrad1");
			
			storeDefStat.put("","name");
			storeDefStat.put("","info");
			storeDefStat.put("","hash");
			storeDefStat.put("","iconURL");
			
			storeDefItem.put("","type");
			storeDefItem.put("","name");
			storeDefItem.put("","id");
			storeDefItem.put("","iconURL");
			storeDefItem.put("","collectibleID");
			storeDefItem.put("","bucketHash");
			storeDefItem.put("","bucket");
			storeDefItem.put("","bucketOrder");
			storeDefItem.put("","categoryHash");
			storeDefItem.put("","category");
			storeDefItem.put("","subcategoryHash");
			storeDefItem.put("","subcategory");
			storeDefItem.put("","exo");
			storeDefItem.put("","catHash");
			
			storeDefClass.put("","name");
			storeDefClass.put("","no");
			
			storeDefEnergy.put("","name");
			storeDefEnergy.put("","iconURL");
			storeDefEnergy.put("","no");
			
			storeDefDmg.put("","name");
			storeDefDmg.put("","iconURL");
			storeDefDmg.put("","no");
			
			storeDefVendor.put("","name");
			storeDefVendor.put("","iconURL");
			storeDefVendor.put("","hash");
			
			storeDefRecord.put("","hash");
			storeDefRecord.put("","objectiveHash");
			
			//storePlayer.put("membershipId,platformType,platformName","id");
			db.close();
			location.reload();
		case 1:
			try{
				let updateStore = event.currentTarget.transaction.objectStore("siteSettings");
				//updateStore.put("test","test");
			}catch(err){
				console.log(err.message);
				db.close();
			}
	  }
}

request.onsuccess = function () {
	const db = request.result;
	
	/* später
	const db = request.result;
	const sTransaction = db.transaction("SiteSettings", "readwrite");
	const mTransaction = db.transaction("manifestPaths", "readwrite");
	const dTransaction = db.transaction("Definitions", "readwrite");
	const pTransaction = db.transaction("loadedPlayers", "readwrite");

	const sStoreT = sTransaction.objectStore("SiteSettings");
	const mStoreT = mTransaction.objectStore("manifestPaths");
	const dStoreT = dTransaction.objectStore("Definitions");
	const pStoreT = pTransaction.objectStore("loadedPlayers");
	*/
}


function readGhostPartition(ghostTable, item){
	req = indexedDB.open("ghostPartition", 1);
	req.onerror = function (event) {
		console.error("Error (ghostPartition|read): " + event);
	}
	req.onsuccess = function () {
		db = request.result;
		store = db.transaction(ghostTable, "readonly").objectStore(ghostTable);
		return store.get(item);
		db.close();
	}
}


function updateGhostPartition() {
// updates ghostPartition in Indexed DB
	ghostPartitionTmp = Object.assign({},ghostPartition);
	delete ghostPartitionTmp.loadedPlayers;
	ghostPartitionTmp.loadedPlayers = Object.keys(ghostPartition['loadedPlayers']);
	localStorage.setItem("ghostPartition", JSON.stringify(ghostPartitionTmp));
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
	req = indexedDB.open("ghostPartition", 1);
	req.onerror = function (event) {
		console.error("Error (savePlayer): " + event);
	}
	req.onsuccess = function () {
		db = req.result;
		transaction = db.transaction("loadedPlayers", "readwrite");
		store = transaction.objectStore("loadedPlayers");
		store.add(cP.membershipId[0] + "," + cP.platformType[0] + "," + cP.platformName[0]);
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