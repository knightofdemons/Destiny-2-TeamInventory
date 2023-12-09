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
			const sStore = db.createObjectStore("siteSettings");
			const mStore = db.createObjectStore("manifestPaths", { autoIncrement: true });
			const dStore = db.createObjectStore("definitions", { autoIncrement: true });
			const pStore = db.createObjectStore("loadedPlayers", { autoIncrement: true });
			
			//Building tables
			sStore.put("en","lang");
			sStore.put(1,"sizeMultiplier");
			sStore.put("#393956","ThemeGrad0");
			sStore.put("#161627","ThemeGrad1");
			
			mStore.put("","stat");
			mStore.put("","item");
			mStore.put("","itemCategoryDetails");
			mStore.put("","itemBucketDetails");
			mStore.put("","classDef");
			mStore.put("","energy");
			mStore.put("","damageType");
			mStore.put("","vendor");
			mStore.put("","record");

			dStore.put("","stat");
			dStore.put("","item");
			dStore.put("","classDef");
			dStore.put("","energy");
			dStore.put("","damageType");
			dStore.put("","vendor");
			dStore.put("","record");

			//pStore.put("membershipId,platformType,platformName","id");
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

	const sStoreT = sTransaction.objectStore("SiteSettings");
	const mStoreT = mTransaction.objectStore("manifestPaths");
	const dStoreT = dTransaction.objectStore("Definitions");
	const pStoreT = pTransaction.objectStore("loadedPlayers");
	*/
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
	req = indexedDB.open("userDB", 1);
	req.onerror = function (event) {
		console.error("Error (savePlayer): " + event);
	}
	req.onsuccess = function () {
		db = req.result;
		transaction = db.transaction("loadedPlayers", "readwrite");
		store = transaction.objectStore("loadedPlayers");
		store.put(cP.membershipId[0] + "," + cP.platformType[0] + "," + cP.platformName[0]);
		db.close();

		/* später
		const db = request.result;
		const sTransaction = db.transaction("siteSettings", "readwrite");
		const mTransaction = db.transaction("manifestPaths", "readwrite");
		const dTransaction = db.transaction("definitions", "readwrite");
		const pTransaction = db.transaction("loadedPlayers", "readwrite");
	
		const sStoreT = sTransaction.objectStore("siteSettings");
		const mStoreT = mTransaction.objectStore("manifestPaths");
		const dStoreT = dTransaction.objectStore("definitions");
		const pStoreT = pTransaction.objectStore("loadedPlayers");
		*/
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