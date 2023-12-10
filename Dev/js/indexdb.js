/*********************************************************************************/
/* Browser Cache Saving/Reading (IndexedDB API) 								 */
/*********************************************************************************/

const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.shimIndexedDB;

const request = indexedDB.open("ghostPartition", 1);

//const idQuery = storeSettings.get(1);

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
			location.reload();
		case 1:
			try{
				let updateStore = event.currentTarget.transaction.objectStore("siteSettings");
				//updateStore.put("test","test");
			}catch(err){
				console.log(err.message);
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

	const storeSettingsT = sTransaction.objectStore("SiteSettings");
	const storePathsT = mTransaction.objectStore("manifestPaths");
	const dStoreT = dTransaction.objectStore("Definitions");
	const storePlayerT = pTransaction.objectStore("loadedPlayers");
	*/
}












function updateGhostPartition() {
// updates ghostPartition in Indexed DB
	ghostPartitionTmp = Object.assign({},ghostPartition);
	delete ghostPartitionTmp.loadedPlayers;
	ghostPartitionTmp.loadedPlayers = Object.keys(ghostPartition['loadedPlayers']);
	localStorage.setItem("ghostPartition", JSON.stringify(ghostPartitionTmp));
}

function saveSiteSettings(prop, val){
	if(!ghostPartition['siteSettings'].hasOwnProperty(prop)){
		ghostPartition['siteSettings'][prop] = {};
	}
	ghostPartition['siteSettings'][prop] = val;
	updateGhostPartition();
}

async function refreshPlayer(membershipId){
	currentPlayer = await getPlayer(ghostPartition['loadedPlayers'][membershipId]['membershipId'][0], ghostPartition['loadedPlayers'][membershipId]['platformType'][0]);
	ghostPartition['loadedPlayers'][membershipId] = currentPlayer;
	updateGhostPartition();
}

function deletePlayer(membershipID){
	document.getElementById("acc-" + membershipID).remove();
	delete ghostPartition['loadedPlayers'][membershipID];
	console.log("deleted " + membershipID + " from local player storage");
	updateGhostPartition();
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

/*	if(!ghostPartition.hasOwnProperty('loadedPlayers')){
			ghostPartition['loadedPlayers'] = {};
		}
		if(!ghostPartition['loadedPlayers'].hasOwnProperty(cP.membershipId)){
			ghostPartition['loadedPlayers'][cP.membershipId[0]] = cP;
			console.log("saved " + cP.membershipId[0] + " to local player storage");
			updateGhostPartition();
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