/*********************************************************************************/
/* Request/Fetch Functions													   */
/*********************************************************************************/
async function getData(url, useApiKey = true) {
		//fetch json response for getRequests | use false as option to generate a request without using the apikey
		let tmpHead = new Headers();
		if(useApiKey){tmpHead.set('X-API-Key', akey);}
		const fetchOptions = {method:'GET', mode:'cors', cache:'default', credentials:'omit',redirect:'follow', referrerPolicy:'no-referrer', headers:tmpHead,};
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
	credentials: 'omit', // include, *same-origin, omit
	headers: tmpHead,
	redirect: 'follow', // manual, *follow, error
	referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	body: tmpData // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}


/*********************************************************************************/
/* Manifest & Miscellaneous												         */
/*********************************************************************************/
async function checkManifestVersion(language) {
    try {
        let manifestPaths = await window.dbOperations.getManifestPaths();
        
        if (!manifestPaths) {
            manifestPaths = { stat: '/oops' };
        }
        
        const check = await fetch(manifestPaths.stat, {
            method: 'GET', 
            mode: 'cors', 
            cache: 'default', 
            credentials: 'omit',
            redirect: 'follow', 
            referrerPolicy: 'no-referrer'
        });
        
        if (check.status == 404) {
            // Get new manifests
            const rqURL = 'https://www.bungie.net/Platform/Destiny2/Manifest/';
            const resManifest = await getData(rqURL, false);
            
            // Ensure language is defined, default to 'en' if not
            const currentLanguage = language || 'en';
            
            const newManifestPaths = {
                stat: 'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][currentLanguage]['DestinyStatDefinition'],
                item: 'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][currentLanguage]['DestinyInventoryItemDefinition'],
                itemCategoryDetails: 'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][currentLanguage]['DestinyItemCategoryDefinition'],
                itemBucketDetails: 'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][currentLanguage]['DestinyInventoryBucketDefinition'],
                classDef: 'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][currentLanguage]['DestinyClassDefinition'],
                energy: 'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][currentLanguage]['DestinyEnergyTypeDefinition'],
                damageType: 'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][currentLanguage]['DestinyDamageTypeDefinition'],
                vendor: 'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][currentLanguage]['DestinyVendorDefinition'],
                record: 'https://www.bungie.net' + resManifest['Response']['jsonWorldComponentContentPaths'][currentLanguage]['DestinyRecordDefinition']
            };
            
            await window.dbOperations.setManifestPaths(newManifestPaths);
            userDB.manifestPaths = newManifestPaths;
            return true;
        } else if (check.status == 501) {
            window.alert("Errorcode: " + check.status + " - Reloading Page");
            location.reload();
        } else {
            userDB.manifestPaths = manifestPaths;
            return false;
        }
    } catch (error) {
        console.error("Error checking manifest version:", error);
        return false;
    }
}

async function getDefinitions(){
	// Check if manifestPaths exist
	if (!userDB.manifestPaths) {
		console.error('Manifest paths not available');
		return;
	}
	
	let statDefinitions = new Object();
	let itemDefinitions = new Object();
	let classDefinitions = new Object();
	let energyDefinitions = new Object();
	let damageTypeDefinitions = new Object();
	let vendorDefinitions = new Object();
	let recordDefinitions = new Object();

	const resStatDefinitions = await getData(userDB['manifestPaths']['stat'], false);
	const resClassDefinitions = await getData(userDB['manifestPaths']['classDef'], false);
	const resEnergyDefinitions = await getData(userDB['manifestPaths']['energy'], false);
	const resDamageTypeDefinitions = await getData(userDB['manifestPaths']['damageType'], false);
	const resVendorDefinitions = await getData(userDB['manifestPaths']['vendor'], false);
	const resRecordDefinitions = await getData(userDB['manifestPaths']['record'], false);
	const resItemDefinitions = await getData(userDB['manifestPaths']['item'], false);
	const resItemBucketDetails = await getData(userDB['manifestPaths']['itemBucketDetails'], false);
	const resItemCategoryDetails = await getData(userDB['manifestPaths']['itemCategoryDetails'], false);
		
		// get details for stats from manifest for every item
				for (let resStatDef in resStatDefinitions) {
					(statDefinitions.name = statDefinitions.name || []).push(resStatDefinitions[resStatDef]['displayProperties']['name']);
					(statDefinitions.info = statDefinitions.info || []).push(resStatDefinitions[resStatDef]['displayProperties']['description']);
					(statDefinitions.hash = statDefinitions.hash || []).push(resStatDefinitions[resStatDef]['hash']);
					(statDefinitions.iconURL = statDefinitions.iconURL || []).push('https://www.bungie.net' + resStatDefinitions[resStatDef]['displayProperties']['icon']);
				};
		
		// get details for classes from manifest for every item
				for (let resClassDef in resClassDefinitions) {
					(classDefinitions.name = classDefinitions.name || []).push(resClassDefinitions[resClassDef]['displayProperties']['name']);
					(classDefinitions.no = classDefinitions.no || []).push(resClassDefinitions[resClassDef]['classType']);
				};
				
		// get details for energy types from manifest for every item
				for (let resEnergyDef in resEnergyDefinitions) {
					(energyDefinitions.name = energyDefinitions.name || []).push(resEnergyDefinitions[resEnergyDef]['displayProperties']['name']);
					(energyDefinitions.iconURL = energyDefinitions.iconURL || []).push('https://www.bungie.net' + resEnergyDefinitions[resEnergyDef]['transparentIconPath']);
					(energyDefinitions.no = energyDefinitions.no || []).push(resEnergyDefinitions[resEnergyDef]['enumValue']);
				};
				
		// get details for damage types from manifest for every item
				for (let resDamageTypeDef in resDamageTypeDefinitions) {
					(damageTypeDefinitions.name = damageTypeDefinitions.name || []).push(resDamageTypeDefinitions[resDamageTypeDef]['displayProperties']['name']);
					(damageTypeDefinitions.iconURL = damageTypeDefinitions.iconURL || []).push('https://www.bungie.net' + resDamageTypeDefinitions[resDamageTypeDef]['transparentIconPath']);
					(damageTypeDefinitions.no = damageTypeDefinitions.no || []).push(resDamageTypeDefinitions[resDamageTypeDef]['enumValue']);
				};
		
		// get details for vendors from manifest (only vault, exotic armor, exotic weapon for icons) for every item
				for (i = 0; i < 3; i++) {
					(vendorDefinitions.name = vendorDefinitions.name || []).push(resVendorDefinitions[vendorHashList[i]]['displayProperties']['name']);
					if (resVendorDefinitions[vendorHashList[i]]['displayProperties']['smallTransparentIcon'] !== undefined) {
						(vendorDefinitions.iconURL = vendorDefinitions.iconURL || []).push('https://www.bungie.net' + resVendorDefinitions[vendorHashList[i]]['displayProperties']['smallTransparentIcon']);
					} else {
						(vendorDefinitions.iconURL = vendorDefinitions.iconURL || []).push('https://www.bungie.net' + resVendorDefinitions[vendorHashList[i]]['displayProperties']['icon']);
					}
					(vendorDefinitions.hash = vendorDefinitions.hash || []).push(resVendorDefinitions[vendorHashList[i]]['hash']);
				};
				
		// get details for records from manifest (only objectiveHashes) for every item
				for (let resRecordDef in resRecordDefinitions) {
					if (resRecordDefinitions[resRecordDef]['objectiveHashes'] !== undefined && resRecordDefinitions[resRecordDef]['objectiveHashes'][0] !== undefined) {
						for (let i=0; i<resRecordDefinitions[resRecordDef]['objectiveHashes'].length; i++) {
						(recordDefinitions.hash = recordDefinitions.hash || []).push(resRecordDefinitions[resRecordDef]['hash']);
						(recordDefinitions.objectiveHash = recordDefinitions.objectiveHash || []).push(resRecordDefinitions[resRecordDef]['objectiveHashes'][i]);
						}
					}
				};
		
			// get details for catalysts
			for (let resItemDef in resItemDefinitions) {
				if (resItemDefinitions[resItemDef]['inventory']['bucketTypeHash'] === 2422292810 && resItemDefinitions[resItemDef]['inventory']['recoveryBucketTypeHash'] === 215593132 && resItemDefinitions[resItemDef]['inventory']['tierTypeName'] === "Exotic" && resItemDefinitions[resItemDef]['perks'][0] !== undefined && resItemDefinitions[resItemDef]['perks'][0]['perkHash'] !== undefined && resItemDefinitions[resItemDef]['itemType'] === 19) {
					(catDefinitions.name = catDefinitions.name || []).push(resItemDefinitions[resItemDef]['displayProperties']['name']);
					(catDefinitions.id = catDefinitions.id || []).push(resItemDef);
				}
			}
			var tmpObjectiveNo = 0;
		// get details for items from manifest for every item
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
							// for exo weapons
							if ([buckets[0], buckets[1], buckets[2]].includes(resItemDefinitions[resItemDef]['inventory']['bucketTypeHash'])) {
								// if len socketEntries = 10 -> last one is Masterwork objective
								if (resItemDefinitions[resItemDef]['sockets']['socketEntries'].length-1 == 10) {
									tmpSocket = 10;
								} else {
									// 9 -> 7
									if (resItemDefinitions[resItemDef]['sockets']['socketEntries'].length-1 < 10) {
										tmpSocket = resItemDefinitions[resItemDef]['sockets']['socketEntries'].length-3;
									} else {
										tmpSocket = resItemDefinitions[resItemDef]['sockets']['socketEntries'].length-1;
									}
								}
								if (resItemDefinitions[resItemDef]['sockets']['socketEntries'].length-1 <= 10) {
										// check if socket has reusablePlugItems
										if (resItemDefinitions[resItemDef]['sockets']['socketEntries'][tmpSocket]['reusablePlugItems'].length > 0) {
											// check cat for every plugItemHash of every record of exotic Item
											tmpObjectiveNo = resItemDefinitions[//get plugItemHash (if last object in socketEntires in sockets of item contains something -> has cat)
																				resItemDefinitions[resItemDef]['sockets']['socketEntries'][tmpSocket]['reusablePlugItems'][
																							// get last reusablePlugItem of this socketEntry
																							resItemDefinitions[resItemDef]['sockets']['socketEntries'][tmpSocket]['reusablePlugItems'].length-1
																							]['plugItemHash'] // get plugItemHash (object id of cat)
																				]['objectives']['objectiveHashes']; // .length-1?
											if (recordDefinitions.objectiveHash.indexOf(tmpObjectiveNo[tmpObjectiveNo.length-1]) > 0) {								
												(itemDefinitionsTmp.catHash = itemDefinitionsTmp.catHash || []).push(recordDefinitions.hash[recordDefinitions.objectiveHash.indexOf(tmpObjectiveNo[tmpObjectiveNo.length-1])]);
											} else {
												(itemDefinitionsTmp.catHash = itemDefinitionsTmp.catHash || []).push(0);
											}
										} else {
											(itemDefinitionsTmp.catHash = itemDefinitionsTmp.catHash || []).push(222);
										}									
								} else {
									(itemDefinitionsTmp.catHash = itemDefinitionsTmp.catHash || []).push(444);
								}
							} else {
								(itemDefinitionsTmp.catHash = itemDefinitionsTmp.catHash || []).push(888);
							}							
						} else {
							(itemDefinitionsTmp.exo = itemDefinitionsTmp.exo || []).push(0);
							(itemDefinitionsTmp.catHash = itemDefinitionsTmp.catHash || []).push(0);
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
		let catHash = itemDefinitionsTmp.catHash;
		itemDefinitions = sortArrays({type,name,id,iconURL,collectibleID,bucketHash,bucket,bucketOrder,categoryHash,category,subcategoryHash,subcategory,exo,catHash});

	// Save all definitions to IndexedDB
	const definitions = {
		stat: statDefinitions,
		item: itemDefinitions,
		classDef: classDefinitions,
		energy: energyDefinitions,
		damageType: damageTypeDefinitions,
		vendor: vendorDefinitions,
		record: recordDefinitions,
	};
	
	// Save each definition type to IndexedDB
	for (const [type, data] of Object.entries(definitions)) {
		await window.dbOperations.setDefinitions(type, data);
	}
	
	// Update local userDB
	userDB.Definitions = definitions;
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
/* Get initial data															  */
/*********************************************************************************/
// Global flag to prevent multiple InitData calls
let isInitDataRunning = false;
let hasInitDataCompleted = false;

async function InitData(){
    // Prevent multiple simultaneous calls or completed calls
    if (isInitDataRunning || hasInitDataCompleted) {
        return;
    }
    
    isInitDataRunning = true;
    try {
        // Show loading screen
        window.loadingManager.show();
        window.loadingManager.setState(1);
        await window.loadingManager.animateProgress(20);
        
        // Initialize database
        await window.dbOperations.initDatabase();
        
        // Load settings from IndexedDB
        const settings = await window.dbOperations.getAllSettings();
        if (settings && Object.keys(settings).length > 0) {
            userDB.siteSettings = settings;
            
            // Apply settings to UI
            if (settings.lang) {
                document.querySelector("#lang-btn").classList.replace(
                    document.querySelector("#lang-btn").classList.item(1), 
                    "flag-icon-" + settings.lang
                );
            }
            if (settings.sizeMultiplier) {
                document.documentElement.style.setProperty('--sizeMultiplier', settings.sizeMultiplier);
            }
            if (settings.ThemeGrad0) {
                document.documentElement.style.setProperty('--grad0', settings.ThemeGrad0);
            }
            if (settings.ThemeGrad1) {
                document.documentElement.style.setProperty('--grad1', settings.ThemeGrad1);
            }
            
            // Set active theme class based on saved colors
            if (settings.ThemeGrad0 && settings.ThemeGrad1) {
                const themeColors = {
                    'red': { a: getComputedStyle(document.documentElement).getPropertyValue('--themeRedA'), b: getComputedStyle(document.documentElement).getPropertyValue('--themeRedB') },
                    'blue': { a: getComputedStyle(document.documentElement).getPropertyValue('--themeBlueA'), b: getComputedStyle(document.documentElement).getPropertyValue('--themeBlueB') },
                    'green': { a: getComputedStyle(document.documentElement).getPropertyValue('--themeGreenA'), b: getComputedStyle(document.documentElement).getPropertyValue('--themeGreenB') },
                    'yellow': { a: getComputedStyle(document.documentElement).getPropertyValue('--themeYellowA'), b: getComputedStyle(document.documentElement).getPropertyValue('--themeYellowB') },
                    'orange': { a: getComputedStyle(document.documentElement).getPropertyValue('--themeOrangeA'), b: getComputedStyle(document.documentElement).getPropertyValue('--themeOrangeB') },
                    'purple': { a: getComputedStyle(document.documentElement).getPropertyValue('--themePurpleA'), b: getComputedStyle(document.documentElement).getPropertyValue('--themePurpleB') },
                    'black': { a: getComputedStyle(document.documentElement).getPropertyValue('--themeBlackA'), b: getComputedStyle(document.documentElement).getPropertyValue('--themeBlackB') },
                    'white': { a: getComputedStyle(document.documentElement).getPropertyValue('--themeWhiteA'), b: getComputedStyle(document.documentElement).getPropertyValue('--themeWhiteB') }
                };
                
                // Find matching theme
                for (const [themeName, colors] of Object.entries(themeColors)) {
                    if (colors.a.trim() === settings.ThemeGrad0.trim() && colors.b.trim() === settings.ThemeGrad1.trim()) {
                        // Remove active class from all themes
                        document.querySelectorAll('.theme-opt').forEach(opt => opt.classList.remove('act'));
                        // Add active class to matching theme
                        const themeElement = document.getElementById(themeName);
                        if (themeElement) {
                            themeElement.classList.add('act');
                        }
                        break;
                    }
                }
            }
        } else {
            // Default settings
            userDB.siteSettings = {
                lang: 'en',
                sizeMultiplier: 1,
                playerCursor: 0,
                ThemeGrad0: getComputedStyle(document.documentElement).getPropertyValue('--grad0'),
                ThemeGrad1: getComputedStyle(document.documentElement).getPropertyValue('--grad1')
            };
            
            // Save default settings
            for (const [key, value] of Object.entries(userDB.siteSettings)) {
                await window.dbOperations.setSetting(key, value);
            }
        }
        
        // Check OAuth token
        const oauthToken = await window.dbOperations.getOAuthToken();
        if (oauthToken) {
            document.querySelector("#settingsLogin").classList.add('closed');
            document.querySelector("#settingsLogout").classList.remove('closed');
        } else {
            document.querySelector("#settingsLogin").classList.remove('closed');
            document.querySelector("#settingsLogout").classList.add('closed');
        }
        
        // Load manifest data
        window.loadingManager.setState(2);
        await window.loadingManager.animateProgress(40);
        let tmpManifestCheck = await checkManifestVersion(userDB.siteSettings.lang);
        if (tmpManifestCheck) {
            await getDefinitions();
        } else {
            // Load existing definitions from IndexedDB
            const definitions = await window.dbOperations.getAllDefinitions();
            if (definitions && Object.keys(definitions).length > 0) {
                userDB.Definitions = definitions;
            }
        }
        
        // Load players from IndexedDB
        window.loadingManager.setState(3);
        await window.loadingManager.animateProgress(60);
        const players = await window.dbOperations.getAllPlayers();
        if (players && Object.keys(players).length > 0) {
            userDB.loadedPlayers = players;
            
            // Populate sidebar with loaded players
            if (typeof populatePlayerBucket === 'function') {
                populatePlayerBucket();
            }
            
            // Display first player if available
            const playerKeys = Object.keys(players);
            if (playerKeys.length > 0) {
                const firstPlayer = players[playerKeys[0]];
                viewMain.innerHTML = generatePlayerHTML(firstPlayer);
            }
        }
        
        window.loadingManager.setState(4);
        await window.loadingManager.animateProgress(80);
        
        // Verify definitions are loaded
        if (!userDB.Definitions || !userDB.Definitions.item) {
            console.warn('Item definitions not loaded, attempting to reload...');
            await getDefinitions();
        }
        
        window.loadingManager.setState(5);
        await window.loadingManager.animateProgress(100);
        
        // Hide loading screen after a short delay
        setTimeout(() => {
            window.loadingManager.hide();
        }, 1000);
        
        hasInitDataCompleted = true;
        
    } catch (error) {
        console.error("Error initializing data:", error);
        window.loadingManager.showError("Failed to initialize application");
    } finally {
        isInitDataRunning = false;
    }
}


/*********************************************************************************/
/* getPlayer Function (create PlayerObject with details from fetch results)	  */
/*********************************************************************************/
async function getPlayer(memberID, memberType){
	
	let rqURL = 'https://www.bungie.net/Platform/Destiny2/254/Profile/' + memberID + '/LinkedProfiles/?getAllMemberships=true';
	let temp = await getData(rqURL);
		memberID = temp["Response"]["profiles"][0]["membershipId"];
		memberType = temp["Response"]["profiles"][0]["membershipType"];
	
	
	// get player details from memberID & memberType (platform)
		rqURL = 'https://www.bungie.net/Platform/User/GetMembershipsById/' + memberID + '/All/';
		const resPlayerDetails = await getData(rqURL, true);
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
			playerDetails.records = resProfile['Response']['profileRecords']['data']['records'];
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
				playerDetails.records = {...playerDetails.records,...resProfile['Response']['characterRecords']['data'][playerDetails.charIDs[i]]['records']};
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

/*********************************************************************************/
/* generatePlayerHTML Function												   */
/*********************************************************************************/
function generatePlayerHTML(cP){
	// add HTML
	HTML = "<div class='playerMain'>" +
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
				"<div id='anch-exos' class='heading'>" + 
				// heading
				userDB['Definitions']['vendor'].name[userDB['Definitions']['vendor'].hash.indexOf(vendorHashList[2])] +
				"</div>" +
				"<div class='item-list'>";
				// exotic weapons
				// for every bucket (kinetic, energy, power)
				for (let b = 0; b < 3; b++) {
					var hb = 0; // counter for bucket headline
	HTML +=			"<div class='exo-weapons'>";
					// every item...
					for (let i = 0; i < userDB['Definitions']['item'].type.length; i++) {
						// ... that is exo & matches bucket
						if(userDB['Definitions']['item'].exo[i] === 1 && userDB['Definitions']['item'].bucketHash[i] === buckets[b]) {
						// make headline for first found item
						if (hb < 1) {
	HTML +=					"<div class='headline-weapon-bucket'>" + userDB['Definitions']['item'].bucket[i] + "</div>";
							hb++;
						}
						// check if weapon is achieved and overlay a check mark or cross over the image
							var checkState = cP.collectibles[userDB['Definitions']['item'].collectibleID[i]].state;
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
							// check Masterwork
							if (userDB['Definitions']['item'].catHash[i] > 0 && cP.records[userDB['Definitions']['item'].catHash[i]] !== undefined) {
								var checkMaster = cP.records[userDB['Definitions']['item'].catHash[i]].state;
							} else {
								var checkMaster = 2;
							}
							var master = "";
						// states: https://bungie-net.github.io/multi/schema_Destiny-DestinyRecordState.html#schema_Destiny-DestinyRecordState
						// states can be added! --> all odd numbers = achieved, all even numbers = not achieved
							if (checkMaster % 2 == 1) {
								master=" master";
								}
							else {
								master="";
							}
	HTML +=				"<div class='itemIconContainer" + master + "'>" +
							'<img class="' + marker + '" src="' + userDB['Definitions']['item'].iconURL[i] + '" onerror="this.src=\'css/images/placeholder.png\'" onload="this.style.opacity=\'1\'" style="opacity: 0;">' +
							"<div class='itemIconStatus'>" + 
									"<img src='css/images/" + marker + ".png'>" +
							"</div>" +
							'<div class="itemIconContainerInfo" title="' + userDB['Definitions']['item'].name[i] + ' (' + userDB['Definitions']['item'].type[i] + ')"></div>' +
						"</div>";
						}
					}
	HTML +=			"</div>";
				}
	HTML +=		"</div>" +
				"<div class='item-list'>" +
				"<div class='heading'>" + 
					userDB['Definitions']['vendor'].name[userDB['Definitions']['vendor'].hash.indexOf(vendorHashList[1])] +
				"</div>";
				// exotic armor
				// for every bucket (head, arm, chest, leg)
				for (let b = 3; b < 7; b++) {
	HTML +=			"<div class='exo-armor-bucket'>";
					// for every class type (22 = titan, 23 = hunter, 21 = warlock)
					charClassHash = [22,23,21];
					for (let c = 0; c < 3; c++) {
						var hb = 0; // counter for bucket headline
						var hc = 0; // counter for class headline
	HTML +=				"<div class='exo-armor-class'>";
						// every item...
						for (let i = 0; i < userDB['Definitions']['item'].type.length; i++) {
							// ... that is exo, matches bucket & class
							if(userDB['Definitions']['item'].exo[i] === 1 && userDB['Definitions']['item'].bucketHash[i] === buckets[b] && userDB['Definitions']['item'].categoryHash[i] === charClassHash[c]) {
							// make headline for first found item	
								if (hc < 1 && b === 3) {
	HTML +=							"<div class='headline-armor-class'>" + userDB['Definitions']['item'].category[i] + "</div>";
									hc++;
								}
								if (hb < 1) {
									if (c === 0) {
	HTML +=							"<div class='headline-armor-bucket'>" + userDB['Definitions']['item'].bucket[i] + "</div>";
									} else {
	HTML +=								"<div class='headline-armor-bucket'>&emsp;</div>";	
									}
									hb++;
								}
							// check if armor is achieved and overlay a check mark or cross over the image
								var checkState = cP.collectibles[userDB['Definitions']['item'].collectibleID[i]].state;
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
								'<img class=' + marker + ' src="' + userDB['Definitions']['item'].iconURL[i] + '" onerror="this.src=\'css/images/placeholder.png\'" onload="this.style.opacity=\'1\'" style="opacity: 0;">' +
								"<div class='itemIconStatus'>" + 
									"<img src='css/images/" + marker + ".png'>" +
								"</div>" +
								'<div class="itemIconContainerInfo" title="' + userDB['Definitions']['item'].name[i] + ' (' + userDB['Definitions']['item'].type[i] + ')"></div>' +
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
				"<div id='anch-equip' class='charList'>";
				for (index in cP.charOrder) {
	HTML += 		"<div class='charEmblemImg'>" +
						"<img src='" + cP.charEmblem[cP.charOrder[index]] + "'>" +
						"<div class='charEmblemClass'>" + userDB['Definitions']['classDef'].name[userDB['Definitions']['classDef'].no.indexOf(cP.charClass[cP.charOrder[index]])] + "</div>" +
						"<div class='charEmblemLvl'> &#10023;" + cP.charLight[cP.charOrder[index]] + "</div>" +
							// charstats
							"<div class='charStats'>";
								for (let i = 0; i < 6; i++) {
	HTML +=							'<div class="charStatsItem" title="' + userDB['Definitions']['stat'].info[userDB['Definitions']['stat'].hash.indexOf(charStatOrder[i])] + '">' +
										"<img src='" + userDB['Definitions']['stat'].iconURL[userDB['Definitions']['stat'].hash.indexOf(charStatOrder[i])] + "'>" +
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
								indexItem = userDB['Definitions']['item'].id.indexOf(cEquip[item].itemHash.toString());
								if (cEquip[item].bucketHash === buckets[b]) {
	HTML +=						"<div class='itemIconContainer'>" +
									'<img src="' + userDB['Definitions']['item'].iconURL[indexItem] + '" title="' + userDB['Definitions']['item'].name[indexItem] + ' (' + userDB['Definitions']['item'].type[indexItem] + ')" onerror="this.src=\'css/images/placeholder.png\'" onload="this.style.opacity=\'1\'" style="opacity: 0;">' +
									"<div class='itemIconContainerLvl'>";
									if (cP.itemDetails[cEquip[item].itemInstanceId].energy !== undefined) {
	HTML +=								'<img class="itemIconContainerEnergy" src="' + userDB['Definitions']['energy'].iconURL[userDB['Definitions']['energy'].no.indexOf(cP.itemDetails[cEquip[item].itemInstanceId].energy.energyType)] + '">' +
										" ";								
									} else if (cP.itemDetails[cEquip[item].itemInstanceId].damageType !== undefined && cP.itemDetails[cEquip[item].itemInstanceId].damageType !== 0) {
	HTML +=								'<img class="itemIconContainerEnergy" src="' + userDB['Definitions']['damageType'].iconURL[userDB['Definitions']['damageType'].no.indexOf(cP.itemDetails[cEquip[item].itemInstanceId].damageType)] + '">' +
										" ";								
									}
									else {
	HTML +=							'<img class="itemIconContainerEnergy" src="css/images/placeholder.png">';									
									}
									if (cP.itemDetails[cEquip[item].itemInstanceId].primaryStat !== undefined) {
	HTML +=								(cP.itemDetails[cEquip[item].itemInstanceId].primaryStat.value);
									} else {
	HTML +=								(cP.itemDetails[cEquip[item].itemInstanceId].itemLevel * 10 + cP.itemDetails[cEquip[item].itemInstanceId].quality);
									}
	HTML +=							"</div>" +
									'<div class="itemIconContainerInfo equipped" title="' + userDB['Definitions']['item'].name[indexItem] + " (" + userDB['Definitions']['item'].type[indexItem] + ')"></div>' +
								"</div>";
								}
							}
	HTML +=					"</div>" +
							"<div class='charItemsInv'>";
							// get inventory items
							var cInv = cP.charInventory[cP.charOrder[index]];
							// for every item
							for (item in cInv) {
								indexItem = userDB['Definitions']['item'].id.indexOf(cInv[item].itemHash.toString());
								if (cInv[item].bucketHash === buckets[b]) {
	HTML +=						"<div class='itemIconContainer'>" +
									'<img src="' + userDB['Definitions']['item'].iconURL[indexItem] + '" title="' + userDB['Definitions']['item'].name[indexItem] + ' (' + userDB['Definitions']['item'].type[indexItem] + ')" onerror="this.src=\'css/images/placeholder.png\'" onload="this.style.opacity=\'1\'" style="opacity: 0;">' +
									"<div class='itemIconContainerLvl'>";
									if (cP.itemDetails[cInv[item].itemInstanceId].energy !== undefined) {
	HTML +=								'<img class="itemIconContainerEnergy" src="' + userDB['Definitions']['energy'].iconURL[userDB['Definitions']['energy'].no.indexOf(cP.itemDetails[cInv[item].itemInstanceId].energy.energyType)] + '">' +
										" ";								
									} else if (cP.itemDetails[cInv[item].itemInstanceId].damageType !== undefined && cP.itemDetails[cInv[item].itemInstanceId].damageType !== 0) {
	HTML +=								'<img class="itemIconContainerEnergy" src="' + userDB['Definitions']['damageType'].iconURL[userDB['Definitions']['damageType'].no.indexOf(cP.itemDetails[cInv[item].itemInstanceId].damageType)] + '">' +
										" ";								
									}
									else {
	HTML +=							'<img class="itemIconContainerEnergy" src="css/images/placeholder.png">';									
									}
									if (cP.itemDetails[cInv[item].itemInstanceId].primaryStat !== undefined) {
	HTML +=								(cP.itemDetails[cInv[item].itemInstanceId].primaryStat.value);
									} else {
	HTML +=								(cP.itemDetails[cInv[item].itemInstanceId].itemLevel * 10 + cP.itemDetails[cInv[item].itemInstanceId].quality);
									}
	HTML +=							"</div>" +
									'<div class="itemIconContainerInfo" title="' + userDB['Definitions']['item'].name[indexItem] + " (" + userDB['Definitions']['item'].type[indexItem] + ')"></div>' +
								"</div>";
								}
							}
	HTML +=					"</div>" +
						"</div>";
					}
	HTML +=			"</div>";
						
				}
	HTML +=		"<br style='clear:left'><br>" + 
				"<div id='anch-vault' class='heading'>" + 
					userDB['Definitions']['vendor'].name[userDB['Definitions']['vendor'].hash.indexOf(vendorHashList[0])] +
				"</div>";
				// vault items
				// for buckets 2 - 9 (all weapons & armor slots)
				for (let b = 0; b < 8; b++) {
	HTML +=			"<div class='vaultItems'>";
						// for every item in vault
						for (item in cP.profileInventory) {
							if (cP.profileInventory[item] !== undefined) {
								indexItem = userDB['Definitions']['item'].id.indexOf(cP.profileInventory[item].itemHash.toString());
								if (userDB['Definitions']['item'].bucketHash[indexItem] === buckets[b]) {
	HTML +=						"<div class='itemIconContainer'>" +
									'<img src="' + userDB['Definitions']['item'].iconURL[indexItem] + '" title="' + userDB['Definitions']['item'].name[indexItem] + ' (' + userDB['Definitions']['item'].type[indexItem] + ')" onerror="this.src=\'css/images/placeholder.png\'" onload="this.style.opacity=\'1\'" style="opacity: 0;">' +
									"<div class='itemIconContainerLvl'>";
									if (cP.itemDetails[cP.profileInventory[item].itemInstanceId].energy !== undefined) {
	HTML +=								'<img class="itemIconContainerEnergy" src="' + userDB['Definitions']['energy'].iconURL[userDB['Definitions']['energy'].no.indexOf(cP.itemDetails[cP.profileInventory[item].itemInstanceId].energy.energyType)] + '">' +
										" ";								
									} else if (cP.itemDetails[cP.profileInventory[item].itemInstanceId].damageType !== undefined && cP.itemDetails[cP.profileInventory[item].itemInstanceId].damageType !== 0) {
	HTML +=								'<img class="itemIconContainerEnergy" src="' + userDB['Definitions']['damageType'].iconURL[userDB['Definitions']['damageType'].no.indexOf(cP.itemDetails[cP.profileInventory[item].itemInstanceId].damageType)] + '">' +
										" ";								
									}
									else {
	HTML +=							'<img class="itemIconContainerEnergy" src="css/images/placeholder.png">';									
									}
									if (cP.itemDetails[cP.profileInventory[item].itemInstanceId].primaryStat !== undefined) {
	HTML +=								(cP.itemDetails[cP.profileInventory[item].itemInstanceId].primaryStat.value);
									} else {
	HTML +=								(cP.itemDetails[cP.profileInventory[item].itemInstanceId].itemLevel * 10 + cP.itemDetails[cP.profileInventory[item].itemInstanceId].quality);
									}
	HTML +=							"</div>" +
									'<div class="itemIconContainerInfo" title="' + userDB['Definitions']['item'].name[indexItem] + " (" + userDB['Definitions']['item'].type[indexItem] + ')"></div>' +
								"</div>";
								}
							}
						}
	HTML +=			"</div>";
					}
	HTML +=			"</div>" +			
			"</div><br><br>";
	return HTML;
}


/*********************************************************************************/
/* view Fireteam 																 */
/*********************************************************************************/
async function getFireteam(){
	getDefinitions();
	contentFireteam.innerHTML = "<div class='warning'><a>Loading data from Bungie...</a></div>";
	let temp = JSON.parse(localStorage.getItem("oauthToken"));
	if(!temp){
		fireteamCounter = -1;
		contentFireteam.innerHTML = "<div class='warning'><a>You are not logged in! Please reload the page and sign in with the app</a></div>";
	}else{
		let rqURL = 'https://www.bungie.net/Platform/Destiny2/254/Profile/' + temp["membership_id"] + '/LinkedProfiles/?getAllMemberships=true';
		temp = await getData(rqURL);
			memberID = temp["Response"]["profiles"][0]["membershipId"];
			memberType = temp["Response"]["profiles"][0]["applicableMembershipTypes"][0];
			rqURL = 'https://www.bungie.net/Platform/Destiny2/' + memberType + '/Profile/' + memberID + '/?components=1000';
			temp = await getData(rqURL);
				if (!temp["Response"]["profileTransitoryData"]["data"]){
					fireteamCounter = 0;
					contentFireteam.innerHTML = "<div class='warning'><a>Your Destiny-Account shows that you are offline!</a></div>";
				}else{
					contentFireteam.innerHTML = "";
					fireteamCounter = temp["Response"]["profileTransitoryData"]["data"]["partyMembers"].length;
					for (let i = 0; i < temp["Response"]["profileTransitoryData"]["data"]["partyMembers"].length; i++){
						rqURL = 'https://www.bungie.net/Platform/Destiny2/254/Profile/' + temp["Response"]["profileTransitoryData"]["data"]["partyMembers"][i]["membershipId"] + '/LinkedProfiles/?getAllMemberships=true';
						let tmpProf = await getData(rqURL);
						currentPlayer = await getPlayer(temp["Response"]["profileTransitoryData"]["data"]["partyMembers"][i]["membershipId"], tmpProf["Response"]["profiles"][0]["applicableMembershipTypes"][0], "contentFireteam");
						let tmpAdd = generatePlayerHTML(currentPlayer);
						userDB['fireteamPlayers'] =	{
										currentPlayer: currentPlayer.membershipId[0]
						};
						contentFireteam.innerHTML += generatePlayerHTML(currentPlayer);
					}
				}		
	}
}