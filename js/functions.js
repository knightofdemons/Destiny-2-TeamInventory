/*********************************************************************************/
/* Request/Fetch Functions                                                       */
/*********************************************************************************/
async function getData(url, useApiKey = true) {
		//fetch json response for getRequests | use false as option to generate a request without using the apikey
		let tmpHead = new Headers();
		if(useApiKey){tmpHead.set('X-API-Key', akey);}
		const fetchOptions = {method:'GET', mode:'cors', cache:'default', credentials:'same-origin',redirect:'follow', referrerPolicy:'no-referrer', headers:tmpHead,};
		const response = await fetch(url, fetchOptions);
		return response.json();
}


async function postData(url = '', data = {}, UseJSON = true) {
	var tmpHead = new Headers();
	let tmpData = {};
	if(UseJSON){
		tmpHead.set('Content-Type', 'application/json');
		tmpData = JSON.stringify(data);
	}else{
		tmpHead.set('Content-Type', 'application/x-www-form-urlencoded');
		tmpData = data;
	}
	tmpHead.set('X-API-Key', akey);
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: tmpHead,
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: tmpData // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}


/*********************************************************************************/
/* Manifest & Miscellaneous                                                      */
/*********************************************************************************/
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
				'itemDefinitions':'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][language]['DestinyInventoryItemLiteDefinition'], // like [123] -> xenophage
				'itemCategoryDetails':'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][language]['DestinyItemCategoryDefinition'], // like [234] -> kinetic weapon
				'itemBucketDetails':'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][language]['DestinyInventoryBucketDefinition'], // like [345] -> leg armor
				'classDefinitions':'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][language]['DestinyClassDefinition'], // like [2] -> warlock
				'energyDefinitions':'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][language]['DestinyEnergyTypeDefinition'], // like [6] -> stasis (for armor)
				'damageTypeDefinitions':'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][language]['DestinyDamageTypeDefinition'], // like [6] -> stasis (for weapons)
				'vendorDefinitions':'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][language]['DestinyVendorDefinition'] // like vault
			};
			localStorage.setItem("manifestPaths", JSON.stringify(manifestPaths));
	}
	return manifestPaths;
}


function sortArrays(arrays, comparator = (a, b) => (a < b) ? -1 : (a > b) ? 1 : 0) {
// sorts object with different arrays at the same time
// https://gist.github.com/boukeversteegh/3219ffb912ac6ef7282b1f5ce7a379ad
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


/*********************************************************************************/
/* Get initial data                                                              */
/*********************************************************************************/
async function InitData(){
	if(localStorage.getItem("lang")){
		lang = JSON.parse(localStorage.getItem("lang"));
		document.querySelector("#lang-btn").classList.replace(document.querySelector("#lang-btn").classList.item(1), "flag-icon-"+lang);
	}else{
		lang = 'en';
		localStorage.setItem("lang", JSON.stringify(lang));
	}
	let maniPaths = await checkManifestVersion(lang);

	if(localStorage.getItem("oauthToken")){
		document.querySelector("#settingsLogin").style.display = 'none';
		document.querySelector("#settingsLogout").style.display = 'flex';
	}else{
		document.querySelector("#settingsLogin").style.display = 'flex';
		document.querySelector("#settingsLogout").style.display = 'none';
	}
			
	// load initData from browserstorage
	if(localStorage.getItem("statDefinitions")){
		statDefinitions = JSON.parse(localStorage.getItem("statDefinitions"));
		itemDefinitions = JSON.parse(localStorage.getItem("itemDefinitions"));
		classDefinitions = JSON.parse(localStorage.getItem("classDefinitions"));
		energyDefinitions = JSON.parse(localStorage.getItem("energyDefinitions"));
		damageTypeDefinitions = JSON.parse(localStorage.getItem("damageTypeDefinitions"));
		vendorDefinitions = JSON.parse(localStorage.getItem("vendorDefinitions"));
	}else{
		// delete (for language change)
		statDefinitions = {};
		itemDefinitions = {};
		itemDefinitionsTmp = {};
		classDefinitions = {};
		energyDefinitions = {};
		damageTypeDefinitions = {};
		vendorDefinitions = {};
		
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
				
		// get details for energy types from manifest
			const resEnergyDefinitions = await getData(maniPaths.energyDefinitions, false);
			// for every item
				for (let resEnergyDef in resEnergyDefinitions) {
					(energyDefinitions.name = energyDefinitions.name || []).push(resEnergyDefinitions[resEnergyDef]['displayProperties']['name']);
					(energyDefinitions.iconURL = energyDefinitions.iconURL || []).push('https://www.bungie.net' + resEnergyDefinitions[resEnergyDef]['transparentIconPath']);
					(energyDefinitions.no = energyDefinitions.no || []).push(resEnergyDefinitions[resEnergyDef]['enumValue']);
				};
				
		// get details for damage types from manifest
			const resDamageTypeDefinitions = await getData(maniPaths.damageTypeDefinitions, false);
			// for every item
				for (let resDamageTypeDef in resDamageTypeDefinitions) {
					(damageTypeDefinitions.name = damageTypeDefinitions.name || []).push(resDamageTypeDefinitions[resDamageTypeDef]['displayProperties']['name']);
					(damageTypeDefinitions.iconURL = damageTypeDefinitions.iconURL || []).push('https://www.bungie.net' + resDamageTypeDefinitions[resDamageTypeDef]['transparentIconPath']);
					(damageTypeDefinitions.no = damageTypeDefinitions.no || []).push(resDamageTypeDefinitions[resDamageTypeDef]['enumValue']);
				};
		
		// get details for vendors from manifest (only vault, exotic armor, exotic weapon)
			const resVendorDefinitions = await getData(maniPaths.vendorDefinitions, false);
			// for every item
				for (i = 0; i < 3; i++) {
					(vendorDefinitions.name = vendorDefinitions.name || []).push(resVendorDefinitions[vendorHashList[i]]['displayProperties']['name']);
					if (resVendorDefinitions[vendorHashList[i]]['displayProperties']['smallTransparentIcon'] !== undefined) {
						(vendorDefinitions.iconURL = vendorDefinitions.iconURL || []).push('https://www.bungie.net' + resVendorDefinitions[vendorHashList[i]]['displayProperties']['smallTransparentIcon']);
					} else {
						(vendorDefinitions.iconURL = vendorDefinitions.iconURL || []).push('https://www.bungie.net' + resVendorDefinitions[vendorHashList[i]]['displayProperties']['icon']);
					}
					(vendorDefinitions.hash = vendorDefinitions.hash || []).push(resVendorDefinitions[vendorHashList[i]]['hash']);
				};
		
		// get details for items from manifest
			const resItemDefinitions = await getData(maniPaths.itemDefinitions, false);
			const resItemBucketDetails = await getData(maniPaths.itemBucketDetails, false);
			const resItemCategoryDetails = await getData(maniPaths.itemCategoryDetails, false);
			// for every item
				for (let resItemDef in resItemDefinitions) {
					// filter only exotic weapons & every item once; otherwise, resItemDefinitions[resItemDef].itemCategoryHashes can be undefined
					if (resItemDefinitions[resItemDef]['equippingBlock'] !== undefined) {
						(itemDefinitionsTmp.name = itemDefinitionsTmp.name || []).push(resItemDefinitions[resItemDef]['displayProperties']['name']);
						(itemDefinitionsTmp.id = itemDefinitionsTmp.id || []).push(resItemDef);
						(itemDefinitionsTmp.iconURL = itemDefinitionsTmp.iconURL || []).push('https://www.bungie.net' + resItemDefinitions[resItemDef]['displayProperties']['icon']);
						if (resItemDefinitions[resItemDef]['collectibleHash'] !== undefined) {
							(itemDefinitionsTmp.collectibleID = itemDefinitionsTmp.collectibleID || []).push(resItemDefinitions[resItemDef]['collectibleHash']);
						} else {
							(itemDefinitionsTmp.collectibleID = itemDefinitionsTmp.collectibleID || []).push(0);
						}
						(itemDefinitionsTmp.bucketHash = itemDefinitionsTmp.bucketHash || []).push(resItemDefinitions[resItemDef]['inventory']['bucketTypeHash']);
						(itemDefinitionsTmp.bucket = itemDefinitionsTmp.bucket ||[]).push(resItemBucketDetails[resItemDefinitions[resItemDef]['inventory']['bucketTypeHash']]['displayProperties']['name']);
						(itemDefinitionsTmp.bucketOrder = itemDefinitionsTmp.bucketOrder ||[]).push(resItemBucketDetails[resItemDefinitions[resItemDef]['inventory']['bucketTypeHash']]['bucketOrder']/10);
						(itemDefinitionsTmp.type = itemDefinitionsTmp.type || []).push(resItemDefinitions[resItemDef]['itemTypeDisplayName']);
						if (resItemCategoryDetails[resItemDefinitions[resItemDef]['itemCategoryHashes'][0]] !== undefined) {
							(itemDefinitionsTmp.categoryHash = itemDefinitionsTmp.categoryHash || []).push(resItemDefinitions[resItemDef]['itemCategoryHashes'][0]);
							(itemDefinitionsTmp.category = itemDefinitionsTmp.category || []).push(resItemCategoryDetails[resItemDefinitions[resItemDef]['itemCategoryHashes'][0]]['shortTitle']);
						} else {
							(itemDefinitionsTmp.categoryHash = itemDefinitionsTmp.categoryHash || []).push(0);
							(itemDefinitionsTmp.category = itemDefinitionsTmp.category || []).push("");
						}
						if (resItemCategoryDetails[resItemDefinitions[resItemDef]['itemCategoryHashes'][2]] !== undefined) {
							(itemDefinitionsTmp.subcategoryHash = itemDefinitionsTmp.subcategoryHash || []).push(resItemDefinitions[resItemDef]['itemCategoryHashes'][2]);
							(itemDefinitionsTmp.subcategory = itemDefinitionsTmp.subcategory || []).push(resItemCategoryDetails[resItemDefinitions[resItemDef]['itemCategoryHashes'][2]]['shortTitle']);
						} else {
							(itemDefinitionsTmp.subcategoryHash = itemDefinitionsTmp.subcategoryHash || []).push(0);
							(itemDefinitionsTmp.subcategory = itemDefinitionsTmp.subcategory || []).push("");
						}
						
						if (resItemDefinitions[resItemDef]['equippingBlock']['uniqueLabel'] !== undefined && resItemDefinitions[resItemDef]['collectibleHash'] !== undefined && (resItemDefinitions[resItemDef]['equippingBlock']['uniqueLabel'] == 'exotic_weapon' || resItemDefinitions[resItemDef]['equippingBlock']['uniqueLabel'] == 'exotic_armor')) {
							(itemDefinitionsTmp.exo = itemDefinitionsTmp.exo || []).push(1);
						} else {
							(itemDefinitionsTmp.exo = itemDefinitionsTmp.exo || []).push(0);
						}
					}
				};
		
		// sort itemDefinitionsTmp by .type
			let type = itemDefinitionsTmp.type;
			let name = itemDefinitionsTmp.name;
			let id = itemDefinitionsTmp.id;
			let iconURL = itemDefinitionsTmp.iconURL;
			let collectibleID = itemDefinitionsTmp.collectibleID;
			let bucketHash = itemDefinitionsTmp.bucketHash;
			let bucket = itemDefinitionsTmp.bucket;
			let bucketOrder = itemDefinitionsTmp.bucketOrder;
			let categoryHash = itemDefinitionsTmp.categoryHash;
			let category = itemDefinitionsTmp.category;
			let subcategoryHash = itemDefinitionsTmp.subcategoryHash;
			let subcategory = itemDefinitionsTmp.subcategory;
			let exo = itemDefinitionsTmp.exo;
			itemDefinitions = sortArrays({type,name,id,iconURL,collectibleID,bucketHash,bucket,bucketOrder,categoryHash,category,subcategoryHash,subcategory,exo});
		
		// save all initData to browserstorage
		localStorage.setItem("statDefinitions", JSON.stringify(statDefinitions));
		localStorage.setItem("itemDefinitions", JSON.stringify(itemDefinitions));
		localStorage.setItem("classDefinitions", JSON.stringify(classDefinitions));
		localStorage.setItem("energyDefinitions", JSON.stringify(energyDefinitions));
		localStorage.setItem("damageTypeDefinitions", JSON.stringify(damageTypeDefinitions));
		localStorage.setItem("vendorDefinitions", JSON.stringify(vendorDefinitions));
	}

// load recent players from browserstorage
	if(localStorage.getItem("loadedPlayers")){
		const loadedPlayers = JSON.parse(localStorage.getItem("loadedPlayers"));
		for (let i in loadedPlayers){
			currentPlayer = await getPlayer(loadedPlayers[i].membershipId[0], loadedPlayers[i].platformType[0]);
			addPlayer(currentPlayer, "viewMain");
		}
	}		
}


/*********************************************************************************/
/* view Fireteam 	                                                             */
/*********************************************************************************/
async function getFireteam(){
	let temp = JSON.parse(localStorage.getItem("oauthToken"));
	if(!temp){
		viewFireteam.innerHTML = "<div class='warning'><a>You are not logged in! Please reload the page and sign in with the app</a></div>";
	}else{
		let rqURL = 'https://www.bungie.net/Platform/Destiny2/254/Profile/' + temp["membership_id"] + '/LinkedProfiles/?getAllMemberships=true';
		temp = await getData(rqURL);
			memberID = temp["Response"]["profiles"][0]["membershipId"];
			memberType = temp["Response"]["profiles"][0]["applicableMembershipTypes"][0];
			rqURL = 'https://www.bungie.net/Platform/Destiny2/' + memberType + '/Profile/' + memberID + '/?components=1000';
			temp = await getData(rqURL);
				if (!temp["Response"]["profileTransitoryData"]["data"]){
					viewFireteam.innerHTML = "<div class='warning'><a>Your Destiny-Account shows that you are offline!</a></div>";
				}else{
					viewFireteam.innerHTML = "";
					for (let i = 0; i < temp["Response"]["profileTransitoryData"]["data"]["partyMembers"].length; i++){
						rqURL = 'https://www.bungie.net/Platform/Destiny2/254/Profile/' + temp["Response"]["profileTransitoryData"]["data"]["partyMembers"][i]["membershipId"] + '/LinkedProfiles/?getAllMemberships=true';
						tmpProf = await getData(rqURL);
						console.log(tmpProf);
						currentPlayer = await getPlayer(temp["Response"]["profileTransitoryData"]["data"]["partyMembers"][i]["membershipId"], tmpProf["Response"]["profiles"][0]["applicableMembershipTypes"][0]);
						addPlayer(currentPlayer, "viewFireteam");
					}
				}		
	}
}


/*********************************************************************************/
/* getPlayer Function (create PlayerObject with details from fetch results)      */
/*********************************************************************************/
async function getPlayer(memberID, memberType){
	let HTML = 	"<div id='placeholder'>" +
					"<div class='loader-wrapper'><div class='loader'><div class='loader-inner'></div></div></div>" +
				"</div>";
	document.getElementById("viewMain").innerHTML += HTML;
	
	let rqURL = 'https://www.bungie.net/Platform/Destiny2/254/Profile/' + memberID + '/LinkedProfiles/?getAllMemberships=true';
	let temp = await getData(rqURL);
		memberID = temp["Response"]["profiles"][0]["membershipId"];
		memberType = temp["Response"]["profiles"][0]["applicableMembershipTypes"][0];
	
	
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
		rqURL = 'https://www.bungie.net/Platform/Destiny2/' + memberType + '/Profile/' + memberID + '/?components=100,102,200,201,205,300,302,304,307,800,900';
		const resProfile = await getData(rqURL);
		// store info in obj playerDetails 
			playerDetails.charIDs = resProfile['Response']['profile']['data']['characterIds'];
			playerDetails.collectibles = resProfile['Response']['profileCollectibles']['data']['collectibles'];
			if(resProfile['Response']['profileInventory']['data']){
				playerDetails.profileInventory = resProfile['Response']['profileInventory']['data']['items'];
			}else{
				playerDetails.profileInventory = false;
			}
			// check which of the three itemComponents-parts has most hashes & merge together (with the one with most hashes at first)
				playerDetails.itemDetails = {};
				m = Math.max(Object.keys(resProfile['Response'].itemComponents.instances.data).length, Object.keys(resProfile['Response'].itemComponents.stats.data).length, Object.keys(resProfile['Response'].itemComponents.perks.data).length);
				if (Object.keys(resProfile['Response'].itemComponents.instances.data).length === m) {
					for (stat in resProfile['Response'].itemComponents.instances.data) {
					playerDetails.itemDetails[stat]={... resProfile['Response'].itemComponents.instances.data[stat], ... resProfile['Response'].itemComponents.stats.data[stat], ... resProfile['Response'].itemComponents.perks.data[stat]};
					}
				} else if (Object.keys(resProfile['Response'].itemComponents.stats.data).length === m) {
					for (stat in resProfile['Response'].itemComponents.stats.data) {
					playerDetails.itemDetails[stat]={... resProfile['Response'].itemComponents.stats.data[stat], ... resProfile['Response'].itemComponents.instances.data[stat], ... resProfile['Response'].itemComponents.perks.data[stat]};
					}
				} else {
				  for (stat in resProfile['Response'].itemComponents.perks.data) {
					playerDetails.itemDetails[stat]={... resProfile['Response'].itemComponents.perks.data[stat], ... resProfile['Response'].itemComponents.instances.data[stat], ... resProfile['Response'].itemComponents.stats.data[stat]};
					}
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
			document.getElementById("placeholder").remove();
			return playerDetails;
}


/*********************************************************************************/
/* addPlayer HTML Function                                                       */
/*********************************************************************************/
function addPlayer(cP, htmlTarget){
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
				"<div class='heading'>" + 
					vendorDefinitions.name[vendorDefinitions.hash.indexOf(vendorHashList[2])] +
				"</div>" +
				"<div class='item-list'>";
				// exotic weapons
				// for every bucket (kinetic, energy, power)
				for (let b = 0; b < 3; b++) {
					var hb = 0; // counter for bucket headline
	HTML +=			"<div class='exo-weapons'>";
					// every item...
					for (let i = 0; i < itemDefinitions.type.length; i++) {
						// ... that is exo & matches bucket
						if(itemDefinitions.exo[i] === 1 && itemDefinitions.bucketHash[i] === buckets[b]) {
						// make headline for first found item
						if (hb < 1) {
	HTML +=					"<div class='headline-weapon-bucket'>" + itemDefinitions.bucket[i] + "</div>";
							hb++;
						}
						// check if weapon is achieved and overlay a check mark or cross over the image
							var checkState = cP.collectibles[itemDefinitions.collectibleID[i]].state;
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
							'<img class="' + marker + '" src="' + itemDefinitions.iconURL[i] + '">' +
							"<div class='itemIconStatus'>" + 
									"<img src='css/images/" + marker + ".png'>" +
							"</div>" +
							'<div class="itemIconContainerInfo" data-title="' + itemDefinitions.name[i] + ' (' + itemDefinitions.type[i] + ')"></div>' +
						"</div>";
						}
					}
	HTML +=			"</div><br><br>";
				}
	HTML +=		"</div>" +
				"<div class='heading'>" + 
					vendorDefinitions.name[vendorDefinitions.hash.indexOf(vendorHashList[1])] +
				"</div>" +
				"<div class='item-list'>";
				// exotic armor
				// for every bucket (head, arm, chest, leg)
				for (let b = 3; b < 7; b++) {
	HTML +=			"<div class='exo-armor-bucket'>";
					// for every class type (22 = titan, 23 = hunter, 21 = warlock)
					catHsh = [22,23,21];
					for (let c = 0; c < 3; c++) {
						var hb = 0; // counter for bucket headline
						var hc = 0; // counter for class headline
	HTML +=				"<div class='exo-armor-class'>";
						// every item...
						for (let i = 0; i < itemDefinitions.type.length; i++) {
							// ... that is exo, matches bucket & class
							if(itemDefinitions.exo[i] === 1 && itemDefinitions.bucketHash[i] === buckets[b] && itemDefinitions.categoryHash[i] === catHsh[c]) {
							// make headline for first found item	
								if (hc < 1 && b === 5) {
	HTML +=							"<div class='headline-armor-class'>" + itemDefinitions.category[i] + "</div>";
									hc++;
								}
								if (hb < 1) {
									if (c === 0) {
	HTML +=							"<div class='headline-armor-bucket'>" + itemDefinitions.bucket[i] + "</div>";
									} else {
	HTML +=								"<div class='headline-armor-bucket'>&emsp;</div>";	
									}
									hb++;
								}
							// check if weapon is achieved and overlay a check mark or cross over the image
								var checkState = cP.collectibles[itemDefinitions.collectibleID[i]].state;
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
								'<img class=' + marker + ' src="' + itemDefinitions.iconURL[i] + '">' +
								"<div class='itemIconStatus'>" + 
                                    "<img src='css/images/" + marker + ".png'>" +
								"</div>" +
								'<div class="itemIconContainerInfo" data-title="' + itemDefinitions.name[i] + ' (' + itemDefinitions.type[i] + ')"></div>' +
							"</div>";
							}
						}
	HTML +=				"</div>";
					}
	HTML +=			"</div>";
				}
	HTML +=		"</div>" +
				"<br style='clear:left'><br>" +
				// emblems
				"<div class='charList'>";
				for (index in cP.charOrder) {
	HTML += 		"<div class='charEmblemImg'>" +
						"<img src='" + cP.charEmblem[cP.charOrder[index]] + "'>" +
						"<div class='charEmblemClass'>" + classDefinitions.name[classDefinitions.no.indexOf(cP.charClass[cP.charOrder[index]])] + "</div>" +
						"<div class='charEmblemLvl'> &#10023;" + cP.charLight[cP.charOrder[index]] + "</div>" +
							// charstats
							"<div class='charStats'>";
								for (let i = 0; i < 6; i++) {
	HTML +=							'<div class="charStatsItem" data-title="' + statDefinitions.info[statDefinitions.hash.indexOf(charStatOrder[i])] + '">' +
										"<img src='" + statDefinitions.iconURL[statDefinitions.hash.indexOf(charStatOrder[i])] + "'>" +
										cP.charStats[cP.charOrder[index]][charStatOrder[i]] + "&emsp;" +
									'</div>';
									}	
	HTML +=					"</div>" +	
					"</div>&emsp;";	
				}
	HTML +=		"</div>" +
				"<br style='clear:left'><br>";
				// character items
				// for buckets 2 - 9 (all weapons & armor slots)
				for (let b = 0; b < 8; b++) {
	HTML +=			"<div class='charItemBucket'>";
					// for every character
					for (index in cP.charOrder) {
	HTML +=				"<div class='charItems'>";					
						// get equipped items
						var cEquip = cP.charEquipment[cP.charOrder[index]];
	HTML +=					"<div class='charItemsEquip'>";
							// for every item
							for (item in cEquip) {
								indexItem = itemDefinitions.id.indexOf(cEquip[item].itemHash.toString());
								if (cEquip[item].bucketHash === buckets[b]) {
	HTML +=						"<div class='itemIconContainer'>" +
									'<img src="' + itemDefinitions.iconURL[indexItem] + '" title="' + itemDefinitions.name[indexItem] + ' (' + itemDefinitions.type[indexItem] + ')">' +	
									"<div class='itemIconContainerLvl'>";
										if (cP.itemDetails[cEquip[item].itemInstanceId].energy !== undefined) {
	HTML +=								'<img class="itemIconContainerEnergy" src="' + energyDefinitions.iconURL[energyDefinitions.no.indexOf(cP.itemDetails[cEquip[item].itemInstanceId].energy.energyType)] + '">';
										} else if (cP.itemDetails[cEquip[item].itemInstanceId].damageType !== undefined) {
	HTML +=								'<img class="itemIconContainerEnergy" src="' + damageTypeDefinitions.iconURL[damageTypeDefinitions.no.indexOf(cP.itemDetails[cEquip[item].itemInstanceId].damageType)] + '">';
										}
	HTML +=								" " + (cP.itemDetails[cEquip[item].itemInstanceId].itemLevel * 10 + cP.itemDetails[cEquip[item].itemInstanceId].quality) +
									"</div>" +
									'<div class="itemIconContainerInfo equipped" data-title="' + itemDefinitions.name[indexItem] + " (" + itemDefinitions.type[indexItem] + ')"></div>' +
								"</div>";
								}
							}
	HTML +=					"</div>" +
							"<div class='charItemsInv'>";
							// get inventory items
							var cInv = cP.charInventory[cP.charOrder[index]];
							// for every item
							for (item in cInv) {
								indexItem = itemDefinitions.id.indexOf(cInv[item].itemHash.toString());
								if (cInv[item].bucketHash === buckets[b]) {
	HTML +=						"<div class='itemIconContainer'>" +
									'<img src="' + itemDefinitions.iconURL[indexItem] + '" title="' + itemDefinitions.name[indexItem] + ' (' + itemDefinitions.type[indexItem] + ')">' +
									"<div class='itemIconContainerLvl'>";
									if (cP.itemDetails[cInv[item].itemInstanceId].energy !== undefined) {
	HTML +=								'<img class="itemIconContainerEnergy" src="' + energyDefinitions.iconURL[energyDefinitions.no.indexOf(cP.itemDetails[cInv[item].itemInstanceId].energy.energyType)] + '">';
										} else if (cP.itemDetails[cInv[item].itemInstanceId].damageType !== undefined) {
	HTML +=								'<img class="itemIconContainerEnergy" src="' + damageTypeDefinitions.iconURL[damageTypeDefinitions.no.indexOf(cP.itemDetails[cInv[item].itemInstanceId].damageType)] + '">';
										}
	HTML +=								" " + (cP.itemDetails[cInv[item].itemInstanceId].itemLevel * 10 + cP.itemDetails[cInv[item].itemInstanceId].quality) +
									"</div>" +
									'<div class="itemIconContainerInfo" data-title="' + itemDefinitions.name[indexItem] + " (" + itemDefinitions.type[indexItem] + ')"></div>' +
								"</div>";
								}
							}
	HTML +=					"</div>" +
						"</div>";
					}
	HTML +=			"</div>";
						
				}
	HTML +=		"<br style='clear:left'><br>" + 
				"<div class='heading'>" + 
					vendorDefinitions.name[vendorDefinitions.hash.indexOf(vendorHashList[0])] +
				"</div>";
				// vault items
				// for buckets 2 - 9 (all weapons & armor slots)
				for (let b = 0; b < 8; b++) {
	HTML +=			"<div class='vaultItems'>";
						// for every item in vault
						for (item in cP.profileInventory) {
							if (cP.profileInventory[item] !== undefined) {
								indexItem = itemDefinitions.id.indexOf(cP.profileInventory[item].itemHash.toString());
								if (itemDefinitions.bucketHash[indexItem] === buckets[b]) {
	HTML +=						"<div class='itemIconContainer'>" +
									'<img src="' + itemDefinitions.iconURL[indexItem] + '" title="' + itemDefinitions.name[indexItem] + ' (' + itemDefinitions.type[indexItem] + ')">' +
									"<div class='itemIconContainerLvl'>";
									if (cP.itemDetails[cP.profileInventory[item].itemInstanceId].energy !== undefined) {
	HTML +=								'<img class="itemIconContainerEnergy" src="' + energyDefinitions.iconURL[energyDefinitions.no.indexOf(cP.itemDetails[cP.profileInventory[item].itemInstanceId].energy.energyType)] + '">' +
										" ";								
									} else if (cP.itemDetails[cP.profileInventory[item].itemInstanceId].damageType !== undefined && cP.itemDetails[cP.profileInventory[item].itemInstanceId].damageType !== 0) {
	HTML +=								'<img class="itemIconContainerEnergy" src="' + damageTypeDefinitions.iconURL[damageTypeDefinitions.no.indexOf(cP.itemDetails[cP.profileInventory[item].itemInstanceId].damageType)] + '">' +
										" ";								
									}
									if (cP.itemDetails[cP.profileInventory[item].itemInstanceId].primaryStat !== undefined) {
	HTML +=								(cP.itemDetails[cP.profileInventory[item].itemInstanceId].primaryStat.value);
									} else {
	HTML +=								(cP.itemDetails[cP.profileInventory[item].itemInstanceId].itemLevel * 10 + cP.itemDetails[cP.profileInventory[item].itemInstanceId].quality);
									}
	HTML +=							"</div>" +
									'<div class="itemIconContainerInfo" data-title="' + itemDefinitions.name[indexItem] + " (" + itemDefinitions.type[indexItem] + ')"></div>' +
								"</div>";
								}
							}
						}
	HTML +=			"</div>";
					}
	HTML +=			"</div>" +			
			"</div><br><br>"; // div playerMain
	document.getElementById(htmlTarget).innerHTML += HTML;
	if(htmlTarget == "viewMain"){
		document.getElementById("playerBucket").innerHTML += "<li class='acc-"+ cP.membershipId[0] + "'>" +
																	"<a>" +
																		"<img class='platformLogo' src='css/images/logo" + cP.platformType[0] + ".svg'>" +
																		"<span class='links_name'>" + cP.platformName[0] + "</span>" +
																		"<i class='bx bx-bookmark-minus' onclick=\"deletePlayer('" + cP.membershipId[0] + "')\"></i>" +
																	"</a>";
																"</li>";
	}
}