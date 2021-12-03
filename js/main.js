const akey = '50a74e4f4f23452c81f7a9cf6a73f124';
let statDefinitions = {};
let itemDetails = {};
let lang = '';
let playerlist = {};

InitData();

async function buttonClick(membershipId, platformType){
		//checks if div-container is already existing for current player & add player if not
		if(!document.getElementById("acc-" + membershipId)){
			currentPlayer = await getPlayer(membershipId, platformType); //temporary function to add a player | will be replaced by searchbar-submit
			addPlayer(currentPlayer);
			addPlayerToStorage(currentPlayer);
		}else{
			console.log("already existing player");
		}
}

async function getData(url, useApiKey = true) {
		//fetch json response for getRequests | use false as option to generate a request without using the apikey
		let tmpHead = new Headers();
		if(useApiKey){tmpHead.set('X-API-Key', akey);}
		const fetchOptions = {method:'GET', mode:'cors', cache:'default', credentials:'same-origin',redirect:'follow', referrerPolicy:'no-referrer', headers:tmpHead,};
		const response = await fetch(url, fetchOptions);
		return response.json();
}

async function checkManifestVersion(language) {
	if(localStorage.getItem("manifestPaths")){
		var manifestPaths = JSON.parse(localStorage.getItem("manifestPaths"));
	}else{
		var manifestPaths = {'statDefinitions':'/oops'};
	}
	const check = await fetch(manifestPaths.statDefinitions, {method:'GET', mode:'cors', cache:'default', credentials:'same-origin',redirect:'follow', referrerPolicy:'no-referrer',});
	if (check.status == 404) {
	// get manifest details
		rqURL = 'https://www.bungie.net/Platform/Destiny2/Manifest/';
		const resManifest = await getData(rqURL, false);
		// store .json-paths in object manifestPaths
			manifestPaths = {
				'statDefinitions':'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][language]['DestinyStatDefinition'], // like [567] -> resilience
				'itemDetails':'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][language]['DestinyInventoryItemLiteDefinition'], // like [123] -> xenophage
				'itemCategoryDetails':'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][language]['DestinyItemCategoryDefinition'], // like [234] -> kinetic weapon
				'itemBucketDetails':'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][language]['DestinyInventoryBucketDefinition'] // like [345] -> leg armor
			};
			localStorage.setItem("manifestPaths", JSON.stringify(manifestPaths));
	}
	return manifestPaths;
}

async function InitData(){
	if(localStorage.getItem("lang")){
		lang = JSON.parse(localStorage.getItem("lang"));
	}else{
		lang = 'en';
		localStorage.setItem("lang", JSON.stringify(lang));
	}
	let maniPaths = await checkManifestVersion(lang);

			
	// load initData from browserstorage
	if(localStorage.getItem("statDefinitions")){
		statDefinitions = JSON.parse(localStorage.getItem("statDefinitions"));
		itemDetails = JSON.parse(localStorage.getItem("itemDetails"));
	}else{
		// get details for stats from manifest
			const resStatDefinitions = await getData(maniPaths.statDefinitions, false);
			// for every item
				for (let resStatDef in resStatDefinitions) {
					(statDefinitions.name = statDefinitions.name || []).push(resStatDefinitions[resStatDef]['displayProperties']['name']);
					(statDefinitions.hash = statDefinitions.hash || []).push(resStatDefinitions[resStatDef]['hash']);
					(statDefinitions.iconURL = statDefinitions.iconURL || []).push('https://www.bungie.net' + resStatDefinitions[resStatDef]['displayProperties']['icon']);
				};
		
		// get details for items from manifest
			const resItemDetails = await getData(maniPaths.itemDetails, false);
			const resItemCategoryDetails = await getData(maniPaths.itemCategoryDetails, false);
			// for every item
				for (let resItem in resItemDetails) {
					// filter only exotic weapons & every item once; otherwise, resItemDetails[resItem].itemCategoryHashes can be undefined
					if (resItemDetails[resItem]['equippingBlock'] !== undefined && resItemDetails[resItem]['equippingBlock']['uniqueLabel'] !== undefined && resItemDetails[resItem]['collectibleHash'] !== undefined && (resItemDetails[resItem]['equippingBlock']['uniqueLabel'] == 'exotic_weapon' || resItemDetails[resItem]['equippingBlock']['uniqueLabel'] == 'exotic_armor')) {
						(itemDetails.name = itemDetails.name || []).push(resItemDetails[resItem]['displayProperties']['name']);
						(itemDetails.id = itemDetails.id || []).push(resItem);
						(itemDetails.iconURL = itemDetails.iconURL || []).push('https://www.bungie.net' + resItemDetails[resItem]['displayProperties']['icon']);
						(itemDetails.collectibleID = itemDetails.collectibleID || []).push(resItemDetails[resItem]['collectibleHash']);
						(itemDetails.type = itemDetails.type || []).push(resItemDetails[resItem]['itemTypeDisplayName']);
						(itemDetails.categoryHash = itemDetails.categoryHash || []).push(resItemDetails[resItem]['itemCategoryHashes'][0]);
						(itemDetails.category = itemDetails.category || []).push(resItemCategoryDetails[resItemDetails[resItem]['itemCategoryHashes'][0]]['shortTitle']);
						(itemDetails.subcategoryHash = itemDetails.subcategoryHash || []).push(resItemDetails[resItem]['itemCategoryHashes'][2]);
						(itemDetails.subcategory = itemDetails.subcategory || []).push(resItemCategoryDetails[resItemDetails[resItem]['itemCategoryHashes'][2]]['shortTitle']);
					}
				};
			
		// save all initData to browserstorage
		localStorage.setItem("statDefinitions", JSON.stringify(statDefinitions));
		localStorage.setItem("itemDetails", JSON.stringify(itemDetails));
	}

// load recent players from browserstorage
	if(localStorage.getItem("loadedPlayers")){
		const loadedPlayers = JSON.parse(localStorage.getItem("loadedPlayers"));
		for (let i in loadedPlayers){
			currentPlayer = await getPlayer(loadedPlayers[i].membershipId[0], loadedPlayers[i].platformType[0]);
			addPlayer(currentPlayer);
		}
	}		
}

async function getPlayer(memberID, memberType){
	// get player details from memberID & memberType (platform)
		rqURL = 'https://www.bungie.net/Platform/User/GetMembershipsById/' + memberID + '/All/';
		const resPlayerDetails = await getData(rqURL);
		// store info in obj playerDetails 
			let playerDetails = {
				'nameCode':resPlayerDetails['Response']['destinyMemberships'][0]['bungieGlobalDisplayNameCode']
			};
			playerDetails.profilePicturePath = "https://www.bungie.net" + resPlayerDetails['Response']['bungieNetUser']['profilePicturePath'];																														
			playerDetails.bungieName = resPlayerDetails['Response']['bungieNetUser']['uniqueName'];
			for (let i = 0; i < resPlayerDetails['Response']['destinyMemberships'].length; i++){
				(playerDetails.platformName = playerDetails.platformName || []).push(resPlayerDetails['Response']['destinyMemberships'][i]['displayName']);
				(playerDetails.membershipId = playerDetails.membershipId || []).push(resPlayerDetails['Response']['destinyMemberships'][i]['membershipId']);
				(playerDetails.platformType = playerDetails.platformType || []).push(resPlayerDetails['Response']['destinyMemberships'][i]['membershipType']);
			};
		
	// get all details for profile
		// 100 = profile (displayName, characterIds), 102 = profileInventory, 200 = characters (data for characters), 201 = character inventories,
		// 205 = characterEquipment, 800 = profileCollectibles & characterCollectibles, 900 = profileRecords & characterRecords
		rqURL = 'https://www.bungie.net/Platform/Destiny2/' + memberType + '/Profile/' + memberID + '/?components=100,102,200,201,205,800,900';
		const resProfile = await getData(rqURL);
		// store info in obj playerDetails 
			playerDetails.charIDs = resProfile['Response']['profile']['data']['characterIds'];
			playerDetails.profileInventory = resProfile['Response']['profileInventory']['data']['items'];
			// for every character
			for (let i = 0; i < playerDetails.charIDs.length; i++) {
				(playerDetails.charLight = playerDetails.charLight || []).push(resProfile['Response']['characters']['data'][playerDetails.charIDs[i]]['light']);
				(playerDetails.charClass = playerDetails.charClass || []).push(resProfile['Response']['characters']['data'][playerDetails.charIDs[i]]['classType']);
				(playerDetails.charRace = playerDetails.charRace || []).push(resProfile['Response']['characters']['data'][playerDetails.charIDs[i]]['raceType']);
				(playerDetails.charGender = playerDetails.charGender || []).push(resProfile['Response']['characters']['data'][playerDetails.charIDs[i]]['genderType']);
				(playerDetails.charEmblem = playerDetails.charEmblem || []).push("https://www.bungie.net" + resProfile['Response']['characters']['data'][playerDetails.charIDs[i]]['emblemBackgroundPath']);
				(playerDetails.charStats = playerDetails.charStats || []).push(resProfile['Response']['characters']['data'][playerDetails.charIDs[i]]['stats']); // 7 stats: [hash] -> value
				(playerDetails.charLastPlayed = playerDetails.charLastPlayed || []).push(resProfile['Response']['characters']['data'][playerDetails.charIDs[i]]['dateLastPlayed']); // wollte ich vllt später gebrauchen
				(playerDetails.charInventory = playerDetails.charInventory || []).push(resProfile['Response']['characterInventories']['data'][playerDetails.charIDs[i]]['items']);
				(playerDetails.charEquipment = playerDetails.charEquipment || []).push(resProfile['Response']['characterEquipment']['data'][playerDetails.charIDs[i]]['items']);
			}
			return playerDetails;
}

function addPlayer(cP){
	
	// add HTML
	HTML = "<div id='acc-" + cP.membershipId + "'>" +
				"<h4>" +
				"<img src='" + cP.profilePicturePath + "' width='40' height='40'>"	+
				cP.bungieName +
				"<img class='platformLogo' src='css/images/logo" + cP.platformType[0] + ".svg'>" + // hier muss man noch schauen, platformtype ist nicht immer 0, zb. bei drasuk ist es [3,5], da muss man das jeweilige gesuchte nehmen
				"</h4>" +
				"<div class='charList'>";
				for (index in cP.charIDs) {
	HTML += 		"<div class='charEmblemImg'>" +
						"<img src='" + cP.charEmblem[index] + "'>" +
						"<div class='charEmblemClass'>" + cP.charClass[index] + "</div>" +
						"<div class='charEmblemLvl'> &#10023;" + cP.charLight[index] + "</div>" +
					"</div>";
				}
	HTML +=		"</div>" +
				"<div class='charList'>";
				for (index in cP.charIDs) {
	HTML +=			"<div class='charStats'>";
					for (let stat in cP.charStats[index]) {
	HTML +=				"<img src='" + statDefinitions.iconURL[statDefinitions.hash.indexOf(parseInt(stat, 10))] + "'>" +
						cP.charStats[index][stat] + "&emsp;&emsp;";
					}
	HTML +=			"</div>";				
					}
	HTML +=		"</div>" +
			"</div>";
	document.getElementById("main").innerHTML += HTML;
	document.getElementById("playerBucket").innerHTML += "<li class='acc-"+ cP.membershipId[0] + "'>" +
																"<a>" +
																	"<img class='platformLogo' src='css/images/logo" + cP.platformType[0] + ".svg'>" +
																	"<span class='links_name'>" + cP.platformName[0] + "</span>" +
																	"<i class='bx bx-bookmark-minus' onclick=\"deletePlayer('" + cP.membershipId[0] + "')\"></i>" +
																"</a>";
															"</li>";
}

function deletePlayer(membershipId){
	HTML = document.getElementsByClassName("acc-" + membershipId);
	while (HTML[0]){
		HTML[0].remove(); //has to be index0 because element also gets deleted from array for whatever reason
	}
	let storageTmp = JSON.parse(localStorage.getItem("loadedPlayers"));
	let index = storageTmp.findIndex(function(toBeDeleted) {
		return toBeDeleted.membershipId[0] == membershipId
	});
	storageTmp.splice(index, 1);
	console.log(storageTmp);
	console.log("deleting " + membershipId + " from local player storage");
	localStorage.setItem("loadedPlayers", JSON.stringify(storageTmp));
}

function addPlayerToStorage(data){
	let storageTmp = JSON.parse(localStorage.getItem("loadedPlayers"));
	(storageTmp = storageTmp || []).push(data);
	console.log("saving " + data.platformName + " to local player storage");
	localStorage.setItem("loadedPlayers", JSON.stringify(storageTmp));
}

/*
test ids:
Hühnchen: 4611686018471653494 (für Umlaute)
BlackBlotch: 4611686018471477303 (für mehrere Platformen)
quaithemerald: 4611686018489703844 (für nur zwei character) 

method: 'GET', // *GET, POST, PUT, DELETE, etc.
mode: 'cors', // no-cors, *cors, same-origin
cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
credentials: 'same-origin', // include, *same-origin, omit
headers: { 'X-API-Key': akey },
redirect: 'follow', // manual, *follow, error
referrerPolicy: 'no-referrer', // *no-referrer, no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
*/