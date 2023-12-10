/*********************************************************************************/
/* Browser Cache Saving/Reading (IndexedDB API) 								 */
/*********************************************************************************/

const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.shimIndexedDB;
const request = indexedDB.open("ghostPartition", 1);

//const idQuery = Sstore.get(1);

request.onerror = function (event) {
	console.error("Error (IndexedDB): " + event);
}

request.onupgradeneeded = function (event) {
	const db = request.result;
	switch(event.oldVersion) { // existing db version
		case 0:
			const storeSettings = db.createObjectStore("siteSettings");
			const storePaths = db.createObjectStore("manifestPaths", {autoIncrement: true});
			const storeDefStat = db.createObjectStore("statDef", {keyPath: "hash"});
			const storeDefItem = db.createObjectStore("itemDef", {keyPath: "id"});
			const storeDefClass = db.createObjectStore("classDef", {keyPath: "no"});
			const storeDefEnergy = db.createObjectStore("energyDef", {keyPath: "no"});
			const storeDefDmg = db.createObjectStore("dmgtypeDef", {keyPath: "no"});
			const storeDefVendor = db.createObjectStore("vendorDef", {keyPath: "hash"});
			const storeDefRecord = db.createObjectStore("recordDef", {keyPath: "hash"});
			const storePlayer = db.createObjectStore("loadedPlayers", {autoIncrement: true});
			
			//Building tables
			storeSettings.put("en","lang");
			storeSettings.put(1,"sizeMultiplier");
			storeSettings.put("#393956","ThemeGrad0");
			storeSettings.put("#161627","ThemeGrad1");
			

			storeDefStat.createIndex("name","name");
			storeDefStat.createIndex("info","info");
			storeDefStat.createIndex("hash","hash", {unique:true});
			storeDefStat.createIndex("iconURL","iconURL");

			// nur zum testen
			storeDefStat.add({ info: "asdf", name: "test1", hash: 123, iconurl: "asdf.com" });
			storeDefStat.add({ info: "wer", name: "test2", hash: 234, iconurl: "wer.com" });
	
			storeDefItem.createIndex("type","type");
			storeDefItem.createIndex("name","name");
			storeDefItem.createIndex("id","id", {unique:true});
			storeDefItem.createIndex("iconURL","iconURL");
			storeDefItem.createIndex("collectibleID","collectibleID");
			storeDefItem.createIndex("bucketHash","bucketHash");
			storeDefItem.createIndex("bucket","bucket");
			storeDefItem.createIndex("bucketOrder","bucketOrder");
			storeDefItem.createIndex("categoryHash","categoryHash");
			storeDefItem.createIndex("category","category");
			storeDefItem.createIndex("subcategoryHash","subcategoryHash");
			storeDefItem.createIndex("subcategory","subcategory");
			storeDefItem.createIndex("exo","exo");
			storeDefItem.createIndex("catHash","catHash");
			
			storeDefClass.createIndex("name","name");
			storeDefClass.createIndex("no","no", {unique:true});
			
			storeDefEnergy.createIndex("name","name");
			storeDefEnergy.createIndex("iconURL","iconURL");
			storeDefEnergy.createIndex("no","no", {unique:true});
			
			storeDefDmg.createIndex("name","name");
			storeDefDmg.createIndex("iconURL","iconURL");
			storeDefDmg.createIndex("no","no", {unique:true});
			
			storeDefVendor.createIndex("name","name");
			storeDefVendor.createIndex("iconURL","iconURL");
			storeDefVendor.createIndex("hash","hash", {unique:true});
			
			storeDefRecord.createIndex("hash","hash", {unique:true});
			storeDefRecord.createIndex("objectiveHash","objectiveHash");
			
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
	db.transaction.oncomplete = function () {
		db.close();
	}
}


async function readGhostPartition(ghostTable, item){
	req = indexedDB.open("ghostPartition", 1);
	req.onerror = function (event) {
		console.error("Error (ghostPartition|read): " + event);
	}
	req.onsuccess = function () {
		db = req.result;
		store = db.transaction(ghostTable, "readonly").objectStore(ghostTable);
		query = store.get(item);
		query.onsuccess = function () {
			console.log("test" + query.result);
			db.close();
		}
	}
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