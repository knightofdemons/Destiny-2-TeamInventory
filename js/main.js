const akey = '50a74e4f4f23452c81f7a9cf6a73f124';
let statDefinitions = {};
let classDefinitions = {};
let itemDetails = {};
let itemDetailsTmp = {};
let lang = '';
let playerlist = {};

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

// https://gist.github.com/boukeversteegh/3219ffb912ac6ef7282b1f5ce7a379ad
function sortArrays(arrays, comparator = (a, b) => (a < b) ? -1 : (a > b) ? 1 : 0) {
  let arrayKeys = Object.keys(arrays);
  let sortableArray = Object.values(arrays)[0];
  let indexes = Object.keys(sortableArray);
  let sortedIndexes = indexes.sort((a, b) => comparator(sortableArray[a], sortableArray[b]));

  let sortByIndexes = (array, sortedIndexes) => sortedIndexes.map(sortedIndex => array[sortedIndex]);

  if (Array.isArray(arrays)) {
    return arrayKeys.map(arrayIndex => sortByIndexes(arrays[arrayIndex], sortedIndexes));
  } else {
    let sortedArrays = {};
    arrayKeys.forEach((arrayKey) => {
      sortedArrays[arrayKey] = sortByIndexes(arrays[arrayKey], sortedIndexes);
    });
    return sortedArrays;
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
				'itemBucketDetails':'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][language]['DestinyInventoryBucketDefinition'], // like [345] -> leg armor
				'classDefinitions':'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][language]['DestinyClassDefinition'] // like [2] -> warlock 
			};
			localStorage.setItem("manifestPaths", JSON.stringify(manifestPaths));
	}
	return manifestPaths;
}

async function InitData(){
	if(localStorage.getItem("lang")){
		lang = JSON.parse(localStorage.getItem("lang"));
		document.querySelector("#lang-btn").classList.replace(document.querySelector("#lang-btn").classList.item(1), "flag-icon-"+lang);
	}else{
		lang = 'en';
		localStorage.setItem("lang", JSON.stringify(lang));
	}
	let maniPaths = await checkManifestVersion(lang);

			
	// load initData from browserstorage
	if(localStorage.getItem("statDefinitions")){
		statDefinitions = JSON.parse(localStorage.getItem("statDefinitions"));
		itemDetails = JSON.parse(localStorage.getItem("itemDetails"));
		classDefinitions = JSON.parse(localStorage.getItem("classDefinitions"));
	}else{
		// delete (for language change)
		statDefinitions = {};
		itemDetails = {};
		itemDetailsTmp = {};
		classDefinitions = {};
		// get details for stats from manifest
			const resStatDefinitions = await getData(maniPaths.statDefinitions, false);
			// for every item
				for (let resStatDef in resStatDefinitions) {
					(statDefinitions.name = statDefinitions.name || []).push(resStatDefinitions[resStatDef]['displayProperties']['name']);
					(statDefinitions.info = statDefinitions.info || []).push(resStatDefinitions[resStatDef]['displayProperties']['description']);
					(statDefinitions.hash = statDefinitions.hash || []).push(resStatDefinitions[resStatDef]['hash']);
					(statDefinitions.iconURL = statDefinitions.iconURL || []).push('https://www.bungie.net' + resStatDefinitions[resStatDef]['displayProperties']['icon']);
				};
		
		// get details for classes from manifest
			const resClassDefinitions = await getData(maniPaths.classDefinitions, false);
			// for every item
				for (let resClassDef in resClassDefinitions) {
					(classDefinitions.name = classDefinitions.name || []).push(resClassDefinitions[resClassDef]['displayProperties']['name']);
					(classDefinitions.no = classDefinitions.no || []).push(resClassDefinitions[resClassDef]['classType']);
				};
		
		// get details for items from manifest
			const resItemDetails = await getData(maniPaths.itemDetails, false);
			const resItemBucketDetails = await getData(maniPaths.itemBucketDetails, false);
			const resItemCategoryDetails = await getData(maniPaths.itemCategoryDetails, false);
			// for every item
				for (let resItem in resItemDetails) {
					// filter only exotic weapons & every item once; otherwise, resItemDetails[resItem].itemCategoryHashes can be undefined
					if (resItemDetails[resItem]['equippingBlock'] !== undefined && resItemDetails[resItem]['equippingBlock']['uniqueLabel'] !== undefined && resItemDetails[resItem]['collectibleHash'] !== undefined && (resItemDetails[resItem]['equippingBlock']['uniqueLabel'] == 'exotic_weapon' || resItemDetails[resItem]['equippingBlock']['uniqueLabel'] == 'exotic_armor')) {
						(itemDetailsTmp.name = itemDetailsTmp.name || []).push(resItemDetails[resItem]['displayProperties']['name']);
						(itemDetailsTmp.id = itemDetailsTmp.id || []).push(resItem);
						(itemDetailsTmp.iconURL = itemDetailsTmp.iconURL || []).push('https://www.bungie.net' + resItemDetails[resItem]['displayProperties']['icon']);
						(itemDetailsTmp.collectibleID = itemDetailsTmp.collectibleID || []).push(resItemDetails[resItem]['collectibleHash']);
						(itemDetailsTmp.bucketHash = itemDetailsTmp.bucketHash || []).push(resItemDetails[resItem]['inventory']['bucketTypeHash']);
						(itemDetailsTmp.bucket = itemDetailsTmp.bucket ||[]).push(resItemBucketDetails[resItemDetails[resItem]['inventory']['bucketTypeHash']]['displayProperties']['name']);
						(itemDetailsTmp.bucketOrder = itemDetailsTmp.bucketOrder ||[]).push(resItemBucketDetails[resItemDetails[resItem]['inventory']['bucketTypeHash']]['bucketOrder']/10);
						(itemDetailsTmp.type = itemDetailsTmp.type || []).push(resItemDetails[resItem]['itemTypeDisplayName']);
						(itemDetailsTmp.categoryHash = itemDetailsTmp.categoryHash || []).push(resItemDetails[resItem]['itemCategoryHashes'][0]);
						(itemDetailsTmp.category = itemDetailsTmp.category || []).push(resItemCategoryDetails[resItemDetails[resItem]['itemCategoryHashes'][0]]['shortTitle']);
						(itemDetailsTmp.subcategoryHash = itemDetailsTmp.subcategoryHash || []).push(resItemDetails[resItem]['itemCategoryHashes'][2]);
						(itemDetailsTmp.subcategory = itemDetailsTmp.subcategory || []).push(resItemCategoryDetails[resItemDetails[resItem]['itemCategoryHashes'][2]]['shortTitle']);
					}
				};
		
		// sort itemDetailsTmp by .type
			let type = itemDetailsTmp.type;
			let name = itemDetailsTmp.name;
			let id = itemDetailsTmp.id;
			let iconURL = itemDetailsTmp.iconURL;
			let collectibleID = itemDetailsTmp.collectibleID;
			let bucketHash = itemDetailsTmp.bucketHash;
			let bucket = itemDetailsTmp.bucket;
			let bucketOrder = itemDetailsTmp.bucketOrder;
			let categoryHash = itemDetailsTmp.categoryHash;
			let category = itemDetailsTmp.category;
			let subcategoryHash = itemDetailsTmp.subcategoryHash;
			let subcategory = itemDetailsTmp.subcategory;
			itemDetails = sortArrays({type,name,id,iconURL,collectibleID,bucketHash,bucket,bucketOrder,categoryHash,category,subcategoryHash,subcategory});
		
		// save all initData to browserstorage
		localStorage.setItem("statDefinitions", JSON.stringify(statDefinitions));
		localStorage.setItem("itemDetails", JSON.stringify(itemDetails));
		localStorage.setItem("classDefinitions", JSON.stringify(classDefinitions));
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
			for (let i = 0; i < resPlayerDetails['Response']['destinyMemberships'].length; i++){
				(playerDetails.platformName = playerDetails.platformName || []).push(resPlayerDetails['Response']['destinyMemberships'][i]['displayName']);
				(playerDetails.membershipId = playerDetails.membershipId || []).push(resPlayerDetails['Response']['destinyMemberships'][i]['membershipId']);
				(playerDetails.platformType = playerDetails.platformType || []).push(resPlayerDetails['Response']['destinyMemberships'][i]['membershipType']);
				(playerDetails.bungieName = playerDetails.bungieName || []).push(resPlayerDetails['Response']['destinyMemberships'][i]['bungieGlobalDisplayName'] + "#" +
																				 resPlayerDetails['Response']['destinyMemberships'][i]['bungieGlobalDisplayNameCode']);
			};
		
	// get all details for profile
		// 100 = profile (displayName, characterIds), 102 = profileInventory, 200 = characters (data for characters), 201 = character inventories,
		// 205 = characterEquipment, 800 = profileCollectibles & characterCollectibles, 900 = profileRecords & characterRecords
		rqURL = 'https://www.bungie.net/Platform/Destiny2/' + memberType + '/Profile/' + memberID + '/?components=100,102,200,201,205,800,900';
		const resProfile = await getData(rqURL);
		// store info in obj playerDetails 
			playerDetails.charIDs = resProfile['Response']['profile']['data']['characterIds'];
			playerDetails.collectibles = resProfile['Response']['profileCollectibles']['data']['collectibles'];
			if(resProfile['Response']['profileInventory']['data']){
				playerDetails.profileInventory = resProfile['Response']['profileInventory']['data']['items'];
			}else{
				playerDetails.profileInventory = false;
			}
			// for every character
			for (let i = 0; i < playerDetails.charIDs.length; i++) {
				(playerDetails.charLight = playerDetails.charLight || []).push(resProfile['Response']['characters']['data'][playerDetails.charIDs[i]]['light']);
				(playerDetails.charClass = playerDetails.charClass || []).push(resProfile['Response']['characters']['data'][playerDetails.charIDs[i]]['classType']);
				(playerDetails.charRace = playerDetails.charRace || []).push(resProfile['Response']['characters']['data'][playerDetails.charIDs[i]]['raceType']);
				(playerDetails.charGender = playerDetails.charGender || []).push(resProfile['Response']['characters']['data'][playerDetails.charIDs[i]]['genderType']);
				(playerDetails.charEmblem = playerDetails.charEmblem || []).push("https://www.bungie.net" + resProfile['Response']['characters']['data'][playerDetails.charIDs[i]]['emblemBackgroundPath']);
				(playerDetails.charStats = playerDetails.charStats || []).push(resProfile['Response']['characters']['data'][playerDetails.charIDs[i]]['stats']); // 7 stats: [hash] -> value
				(playerDetails.charLastPlayed = playerDetails.charLastPlayed || []).push(resProfile['Response']['characters']['data'][playerDetails.charIDs[i]]['dateLastPlayed']); // wollte ich vllt später gebrauchen
				playerDetails.collectibles = {...playerDetails.collectibles,...resProfile['Response']['characterCollectibles']['data'][playerDetails.charIDs[i]]['collectibles']};
				if(playerDetails.profileInventory){
					(playerDetails.charInventory = playerDetails.charInventory || []).push(resProfile['Response']['characterInventories']['data'][playerDetails.charIDs[i]]['items']);
				}else{
					playerDetails.charInventory = false;
				}
				(playerDetails.charEquipment = playerDetails.charEquipment || []).push(resProfile['Response']['characterEquipment']['data'][playerDetails.charIDs[i]]['items']);
			}
			// charOrder gets index of titan, hunter, warlock (0,1,2)
			playerDetails.charOrder = [playerDetails.charClass.indexOf(0),playerDetails.charClass.indexOf(1),playerDetails.charClass.indexOf(2)];
			playerDetails.charOrder = playerDetails.charOrder.filter(no => no >= 0);
			return playerDetails;
}

function addPlayer(cP){	
	// add HTML
	HTML = "<div class='playerMain' id='acc-" + cP.membershipId[0] + "'>" +
				// player header
				"<div class='playerHeaderFrame'>" +
					"<div class='playerHeader'>" +
						"<img src='" + cP.profilePicturePath + "'>"	+
						cP.platformName[0] +
						"<br>" +
						"<div class='playerHeaderSub'>" +
							cP.bungieName[0] +
							"<img class='platformLogo' src='css/images/logo" + cP.platformType[0] + ".svg'>" + // hier muss man noch schauen, platformtype ist nicht immer 0, zb. bei drasuk ist es ja [0,1], da muss man das jeweilige gesuchte nehmen
						"</div>" +
					"</div>" +
				"</div><br>" +
				// emblems
				"<div class='charList'>";
				for (index in cP.charOrder) {
	HTML += 		"<div class='charEmblemImg'>" +
						"<img src='" + cP.charEmblem[cP.charOrder[index]] + "'>" +
						"<div class='charEmblemClass'>" + classDefinitions.name[classDefinitions.no.indexOf(cP.charClass[cP.charOrder[index]])] + "</div>" +
						"<div class='charEmblemLvl'> &#10023;" + cP.charLight[cP.charOrder[index]] + "</div>" +
					"</div>";
				}
	HTML +=		"</div>" +
				// charstats
				"<div class='charList'>";
				for (index in cP.charOrder) {
	HTML +=			"<div class='charStats'>";
					for (let stat in cP.charStats[cP.charOrder[index]]) {
						if(stat != 1935470627){
	HTML +=				"<img src='" + statDefinitions.iconURL[statDefinitions.hash.indexOf(parseInt(stat, 10))] + "' title='" + statDefinitions.info[statDefinitions.hash.indexOf(parseInt(stat, 10))] + "'>" +
						cP.charStats[cP.charOrder[index]][stat] + "&emsp;";
						}
					}
	HTML +=			"</div>";				
					}
	HTML +=		"</div><br><br>" +
				"<div class='item-list'>";
				// exotic weapons
				// for every bucket (2 = kinetic, 3 = energy, 4 = power)
				for (let b = 2; b < 5; b++) {
					var hb = 0; // counter for bucket headline
	HTML +=			"<div class='exo-weapons'>";
					// every item...
					for (let i = 0; i < itemDetails.type.length; i++) {
						// ... that matches bucket
						if(itemDetails.bucketOrder[i] === b) {
						// make headline for first found item
						if (hb < 1) {
	HTML +=					"<div class='headline-weapon-bucket'>" + itemDetails.bucket[i] + "</div>";
							hb++;
						}
						// check if weapon is achieved and overlay a check mark or cross over the image
							var checkState = cP.collectibles[itemDetails.collectibleID[i]].state;
							var marker = "";
                            // states: https://bungie-net.github.io/multi/schema_Destiny-DestinyCollectibleState.html#schema_Destiny-DestinyCollectibleState
                            // 0 = none, 1 = not acquired, 2 = obscured, 4 = invisible, 8 = cannot afford material, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                            // states can be added! --> all odd numbers = not obtained, all even numbers = obtained
                            if (checkState % 2 == 0) {
                                marker="check";
                                }
                            else {
                                marker="cross";
                            }
	HTML +=				"<div class='itemIconContainer'>" +
							'<img class="' + marker + '" src="' + itemDetails.iconURL[i] + '" title="' + itemDetails.name[i] + ' (' + itemDetails.type[i] + ')">' +
							"<div class='itemIconStatus'>" + 
                                    "<img src='css/images/" + marker + ".png'>" +
                            "</div>" +
						"</div>";
						}
					}
	HTML +=			"</div><br><br>";
				}
	HTML +=		"</div>" +
				"<div class='item-list'>";
				// exotic armor
				// for every bucket (5 = head, 6 = arm, 7 = chest, 8 = leg)
				for (let b = 5; b < 9; b++) {
	HTML +=			"<div class='exo-armor-bucket'>";
					// for every class type (22 = titan, 23 = hunter, 21 = warlock)
					catHsh = [22,23,21];
					for (let c = 0; c < 3; c++) {
						var hb = 0; // counter for bucket headline
						var hc = 0; // counter for class headline
	HTML +=				"<div class='exo-armor-class'>";
						// every item...
						for (let i = 0; i < itemDetails.type.length; i++) {
							// ... that matches bucket & class
							if(itemDetails.bucketOrder[i] === b && itemDetails.categoryHash[i] === catHsh[c]) {
							// make headline for first found item	
								if (hc < 1 && b === 5) {
	HTML +=							"<div class='headline-armor-class'>" + itemDetails.category[i] + "</div>";
									hc++;
								}
								if (hb < 1) {
									if (c === 0) {
	HTML +=							"<div class='headline-armor-bucket'>" + itemDetails.bucket[i] + "</div>";
									} else {
	HTML +=								"<div class='headline-armor-bucket'>&emsp;</div>";	
									}
									hb++;
								}
							// check if weapon is achieved and overlay a check mark or cross over the image
								var checkState = cP.collectibles[itemDetails.collectibleID[i]].state;
								var marker = "";
								// states: https://bungie-net.github.io/multi/schema_Destiny-DestinyCollectibleState.html#schema_Destiny-DestinyCollectibleState
								// 0 = none, 1 = not acquired, 2 = obscured, 4 = invisible, 8 = cannot afford material, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
								// states can be added! --> all odd numbers = not obtained, all even numbers = obtained
								if (checkState % 2 == 0) {
									marker="check";
									}
								else {
									marker="cross";
								}
	HTML +=					"<div class='itemIconContainer'>" +
								'<img class=' + marker + ' src="' + itemDetails.iconURL[i] + '" title="' + itemDetails.name[i] + ' (' + itemDetails.type[i] + ')">' +
								"<div class='itemIconStatus'>" + 
                                    "<img src='css/images/" + marker + ".png'>" +
								"</div>" +
							"</div>";
							}
						}
	HTML +=				"</div>";
					}
	HTML +=			"</div>";
				}
	HTML +=		"</div>" +
				"<br>" +
			"</div><br><br>";
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
	document.getElementById("acc-" + membershipId).parentNode.removeChild(document.getElementById("acc-" + membershipId));
	HTML = document.getElementsByClassName("acc-" + membershipId);
	while (HTML[0]){
		HTML[0].remove(); //has to be index0 because element also gets deleted from array for whatever reason
	}
	let storageTmp = JSON.parse(localStorage.getItem("loadedPlayers"));
	let index = storageTmp.findIndex(function(toBeDeleted) {
		return toBeDeleted.membershipId[0] == membershipId;
	});
	storageTmp.splice(index, 1);
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
        if (!playerDetails.profileInventory) {
        HTML =	"<div class='acc-" + cP.membershipId + "'><br><h1>'" . $playerDetails.playerName . "_vaultItems'>Tresor Items (ohne Exotics)</h1>" +
				"<h3>HINWEIS: Das sonstige Inventar des Spielers ist nicht öffentlich sichtbar (einstellbar <a href='https://www.bungie.net/7/de/User/Account/Privacy'" +
				"style='text-decoration: underline;' target='_blank'>unter diesem Link</a><i class='bx bx-info-circle'></i>).</h3></div>";
        } else {
		HTML =	"<div class='acc-" + cP.membershipId + "'><br><h1>Tresor Items (ohne Exotics)</h1>" +
				"<table>";
                for (j = 0; j <= 7; j++) {
        HTML +=		"<tr><td>";
					let itemcounter = 1;
					for (vaultitems in cP.["vaultItemsGrouped"][$j]) {
						if ($itemcounter == 1){
        HTML +=			   "<h2>" + vaultitems["bucketName"] + "</h2>";
						}
		HTML +=			"<div class='itemIconContainer'>" +
						"<img src='" + vaultitems["iconURL"] + "'  title='" + vaultitems["name"] + " (" + vaultitems["category"] + ")' id='no" + firstitem + "'></div>";
						itemcounter++;
					}
					unset($vaultitems); // delete reference to last item
		HTML +=		"</td></tr>";
				}
		HTML +=	"</table></div>";
        }
*/
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