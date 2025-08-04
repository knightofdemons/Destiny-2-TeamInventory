/*********************************************************************************/
/* Request/Fetch Functions													   */
/*********************************************************************************/
async function getData(url, useApiKey = true) {
		//fetch json response for getRequests | use false as option to generate a request without using the apikey
		let tmpHead = new Headers();
		if(useApiKey){tmpHead.set('X-API-Key', akey);}
		
		// Add OAuth token if available
		try {
			const oauthToken = await window.dbOperations.getOAuthToken();
			if (oauthToken && oauthToken.access_token) {
				tmpHead.set('Authorization', `Bearer ${oauthToken.access_token}`);
			}
		} catch (error) {
			console.warn('Could not retrieve OAuth token:', error);
		}
		
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
	
	// Add OAuth token if available
	try {
		const oauthToken = await window.dbOperations.getOAuthToken();
		if (oauthToken && oauthToken.access_token) {
			tmpHead.set('Authorization', `Bearer ${oauthToken.access_token}`);
		}
	} catch (error) {
		console.warn('Could not retrieve OAuth token:', error);
	}
	
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
								// Add archetype information for ARMOR items only (not weapons)
		const itemType = resItemDefinitions[resItemDef]['itemTypeDisplayName'];
		const isArmor = ['Helmet', 'Gauntlets', 'Chest Armor', 'Leg Armor', 'Class Armor'].includes(itemType);
		
		if (isArmor) {
			// Only process archetypes for armor items
			if (resItemDefinitions[resItemDef]['equippingBlock'] !== undefined && resItemDefinitions[resItemDef]['equippingBlock']['uniqueLabel'] !== undefined) {
				// Check if this is new armor with archetype system
				const uniqueLabel = resItemDefinitions[resItemDef]['equippingBlock']['uniqueLabel'];
				const itemName = resItemDefinitions[resItemDef]['displayProperties']['name'];
				

				
				// For now, mark as old armor until we find the correct archetype property
				(itemDefinitionsTmp.archetype = itemDefinitionsTmp.archetype || []).push("old_armor");
			} else {
				// Old armor system - no uniqueLabel
				(itemDefinitionsTmp.archetype = itemDefinitionsTmp.archetype || []).push("old_armor");
			}
		} else {
			// Not armor - no archetype
			(itemDefinitionsTmp.archetype = itemDefinitionsTmp.archetype || []).push("");
		}
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
		let archetype = itemDefinitionsTmp.archetype;
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
		itemDefinitions = sortArrays({type,name,id,iconURL,archetype,collectibleID,bucketHash,bucket,bucketOrder,categoryHash,category,subcategoryHash,subcategory,exo,catHash});

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
/* Helper Functions															   */
/*********************************************************************************/

// Calculate catalyst progression percentage
function calculateCatalystProgression(recordData) {
	if (!recordData) {
		return 0;
	}
	
	// Check if record is already completed
	if (recordData.completed) {
		return 100;
	}
	
	// Check for direct progress property
	if (recordData.progress !== undefined && recordData.completionValue !== undefined && recordData.completionValue > 0) {
		const progressPercentage = (recordData.progress / recordData.completionValue) * 100;
		return Math.min(progressPercentage, 100);
	}
	
	// Check objectives array
	if (recordData.objectives && recordData.objectives.length > 0) {
		let totalProgress = 0;
		let totalCompletionValue = 0;
		let hasProgressObjectives = false;
		let completedSteps = 0;
		let totalSteps = 0;
		
		for (let i = 0; i < recordData.objectives.length; i++) {
			const objective = recordData.objectives[i];
			
			// If objective has progress property, add to total
			if (objective.progress !== undefined && objective.completionValue !== undefined && objective.completionValue > 0) {
				// Check if the objective is already completed
				if (objective.complete || objective.progress >= objective.completionValue) {
					// This objective is completed, treat it as a step
					completedSteps++;
					totalSteps++;
				} else {
					// This is an ongoing progress objective (like kill counts)
					totalProgress += objective.progress;
					totalCompletionValue += objective.completionValue;
					hasProgressObjectives = true;
				}
			}
		}
		
		// If we found progress objectives, calculate percentage from those
		if (hasProgressObjectives && totalCompletionValue > 0) {
			const progressPercentage = (totalProgress / totalCompletionValue) * 100;
			return Math.min(progressPercentage, 100);
		}
		
		// If no progress objectives but we have steps, calculate step completion
		if (totalSteps > 0) {
			const stepPercentage = (completedSteps / totalSteps) * 100;
			return stepPercentage;
		}
		
		// Second pass: Look for completed objectives with completion values
		for (let i = 0; i < recordData.objectives.length; i++) {
			const objective = recordData.objectives[i];
			if (objective.complete && objective.completionValue !== undefined && objective.completionValue > 0) {
				return 100;
			}
		}
		
		// Third pass: Count completed objectives
		let completedObjectives = 0;
		let totalObjectives = recordData.objectives.length;
		
		for (let i = 0; i < recordData.objectives.length; i++) {
			const objective = recordData.objectives[i];
			if (objective.complete) {
				completedObjectives++;
			}
		}
		
		if (totalObjectives > 0) {
			const result = (completedObjectives / totalObjectives) * 100;
			return result;
		}
	}
	
	// Check state property as fallback
	if (recordData.state !== undefined) {
		if (recordData.state % 2 === 1) {
			return 100;
		} else {
			return 0;
		}
	}
	
	return 0;
}

// Get catalyst CSS classes and progression data
function getCatalystClasses(recordData) {
	if (!recordData) {
		return { classes: "", progression: 0 };
	}
	
	const progression = calculateCatalystProgression(recordData);
	
	if (progression === 0) {
		return { classes: "", progression: 0 };
	} else if (progression === 100) {
		return { classes: " catalyst-progress completed", progression: 100 };
	} else {
		return { classes: " catalyst-progress", progression: progression };
	}
}

// Get equipped mods for old armor
function getEquippedMods(itemDetails) {
	const mods = [];
	
	if (!itemDetails || !itemDetails.sockets) {
		console.log('getEquippedMods: No itemDetails or sockets found');
		return mods;
	}
	
	console.log('getEquippedMods: Processing sockets for item');
	console.log('getEquippedMods: Full sockets object:', itemDetails.sockets);
	
	// The socket data structure from the API has socketEntries array
	if (itemDetails.sockets.socketEntries && Array.isArray(itemDetails.sockets.socketEntries)) {
		console.log('getEquippedMods: Sockets has socketEntries, length:', itemDetails.sockets.socketEntries.length);
		// Only process the first socket (general armor mod slot)
		const firstSocket = itemDetails.sockets.socketEntries[0];
		if (firstSocket && firstSocket.plugHash && firstSocket.plugHash !== 0) {
			console.log(`getEquippedMods: Found plug in first socket:`, firstSocket.plugHash);
			
			// Store plugHash for image loading - we'll use this to get actual mod images
			mods.push({
				name: "General Mod",
				icon: "🔧", // Temporary icon until we load the actual image
				plugHash: firstSocket.plugHash
			});
		}
	} else if (Array.isArray(itemDetails.sockets)) {
		console.log('getEquippedMods: Sockets is array, length:', itemDetails.sockets.length);
		// Only process the first socket (general armor mod slot)
		const firstSocket = itemDetails.sockets[0];
		if (firstSocket && firstSocket.plugHash && firstSocket.plugHash !== 0) {
			console.log(`getEquippedMods: Found plug in first socket:`, firstSocket.plugHash);
			
			// Store plugHash for image loading - we'll use this to get actual mod images
			mods.push({
				name: "General Mod",
				icon: "🔧", // Temporary icon until we load the actual image
				plugHash: firstSocket.plugHash
			});
		}
	} else {
		console.log('getEquippedMods: No socketEntries found in sockets object');
		console.log('getEquippedMods: Sockets object keys:', Object.keys(itemDetails.sockets));
	}
	
	console.log('getEquippedMods: Returning mods:', mods);
	return mods;
}

// Get mod icon based on socket type
function getModIcon(socketTypeHash) {
	// Common socket type hashes for armor mods
	const socketIcons = {
		1468238225: "⚡", // General mod socket
		1480404414: "🛡️", // Armor mod socket
		1480404415: "⚔️", // Combat mod socket
		1480404416: "💎", // Seasonal mod socket
		1480404417: "🌟", // Artifact mod socket
	};
	
	return socketIcons[socketTypeHash] || "🔧";
}



// Get archetype CSS class based on archetype name
function getArchetypeClass(archetype, itemInstanceId = null) {
	// First check if we have a detected archetype for this specific item
	if (itemInstanceId && userDB.currentPlayer && userDB.currentPlayer.itemDetails && userDB.currentPlayer.itemDetails[itemInstanceId]) {
		const detectedArchetype = userDB.currentPlayer.itemDetails[itemInstanceId].detectedArchetype;
		if (detectedArchetype) {
			console.log('getArchetypeClass: Using detected archetype:', detectedArchetype, 'for item:', itemInstanceId);
			archetype = detectedArchetype;
		}
	}
	
	if (!archetype || archetype === "" || archetype === "undefined" || archetype === undefined) {
		return "";
	}
	
	// Map archetype names to CSS classes
	const archetypeClasses = {
		// New armor system archetypes
		"gunner": "archetype-gunner",
		"brawler": "archetype-brawler", 
		"specialist": "archetype-specialist",
		"tank": "archetype-tank",
		"support": "archetype-support",
		"scout": "archetype-scout",
		// Exotic items
		"exotic_weapon": "archetype-gunner",
		"exotic_armor": "archetype-support",
		// Old armor system
		"old_armor": "archetype-old-armor"
	};
	
	return archetypeClasses[archetype.toLowerCase()] || "";
}

// Check if armor is old armor based on item details (fallback for when archetype is not set)
function isOldArmor(itemDetails) {
	if (!itemDetails || !itemDetails.sockets) {
		console.log('isOldArmor: No itemDetails or sockets found');
		return false;
	}
	
	console.log('isOldArmor: Checking sockets structure:', itemDetails.sockets);
	
	// Old armor typically has socketEntries array with mod sockets
	if (itemDetails.sockets.socketEntries && Array.isArray(itemDetails.sockets.socketEntries)) {
		console.log('isOldArmor: Found socketEntries array with length:', itemDetails.sockets.socketEntries.length);
		// Check if there are socket entries (indicating this is old armor with mod sockets)
		// Don't require plugHash to be non-zero, as empty sockets are still mod sockets
		const isOld = itemDetails.sockets.socketEntries.length > 0;
		console.log('isOldArmor: Returning', isOld, 'for socketEntries structure');
		return isOld;
	}
	
	// Also check if sockets is a direct array (alternative structure)
	if (Array.isArray(itemDetails.sockets)) {
		console.log('isOldArmor: Found direct sockets array with length:', itemDetails.sockets.length);
		const isOld = itemDetails.sockets.length > 0;
		console.log('isOldArmor: Returning', isOld, 'for direct array structure');
		return isOld;
	}
	
	console.log('isOldArmor: No recognized socket structure found, returning false');
	return false;
}

// Calculate armor progress percentage
function calculateArmorProgress(itemDetails) {
	return 75; // Placeholder 75% progress
}

// Get armor progress CSS classes and progression data
function getArmorProgressClasses(itemDetails) {
	if (!itemDetails) {
		return { classes: "", progression: 0 };
	}
	
	const progression = calculateArmorProgress(itemDetails);
	
	if (progression === 0) {
		return { classes: "", progression: 0 };
	} else if (progression === 100) {
		return { classes: " completed", progression: 100 };
	} else {
		return { classes: "", progression: progression };
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
        
        // Apply translations immediately to ensure loading screen text is translated
        if (typeof applyTranslations === 'function') {
            applyTranslations();
        }
        
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
            
            // Apply translations to UI
            if (typeof applyTranslations === 'function') {
                applyTranslations();
            }
            
            // Initialize sidebar state for mainframe adjustment
            const sidebar = document.querySelector('.sidebar');
            const mainElement = document.getElementById('Main');
            const mainContent = document.querySelector('.main-content');
            
            if (sidebar && mainElement && mainContent) {
                if (sidebar.classList.contains("open")) {
                    mainElement.classList.add("sidebar-open");
                    mainContent.classList.add("sidebar-open");
                } else {
                    mainElement.classList.remove("sidebar-open");
                    mainContent.classList.remove("sidebar-open");
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
        
        // Check OAuth token and update login state
        await updateLoginState();
        
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
                
                // Store current player data for archetype detection
                userDB.currentPlayer = firstPlayer;
                
                viewMain.innerHTML = generatePlayerHTML(firstPlayer);
                
                // Load mod images after HTML is generated
                await loadModImages();
                
                // Detect and update archetypes for all armor items
                await detectAndUpdateArchetypes(firstPlayer);
            }
        }
        
        window.loadingManager.setState(4);
        await window.loadingManager.animateProgress(80);
        
        // Verify definitions are loaded
        if (!userDB.Definitions || !userDB.Definitions.item) {
            console.warn('Item definitions not loaded, attempting to reload...');
            await getDefinitions();
        }
        
        await window.loadingManager.animateProgress(100);
        
        // Hide loading screen immediately (removed delay)
            window.loadingManager.hide();
        // Show welcome notification
        showNotification('Destiny 2 Team Inventory loaded successfully!', 'success', 3000);
        
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
		rqURL = 'https://www.bungie.net/Platform/Destiny2/' + memberType + '/Profile/' + memberID + '/?components=100,102,200,201,205,300,302,304,305,307,800,900';
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
				
				// Add socket data to item details
				if (resProfile['Response'].itemComponents.sockets && resProfile['Response'].itemComponents.sockets.data) {
					for (let itemId in resProfile['Response'].itemComponents.sockets.data) {
						if (playerDetails.itemDetails[itemId]) {
							playerDetails.itemDetails[itemId] = {
								...playerDetails.itemDetails[itemId],
								...resProfile['Response'].itemComponents.sockets.data[itemId]
							};
						}
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
						// ... that is exo & matches bucket & has valid catalyst hash (if it has one)
						if(userDB['Definitions']['item'].exo[i] === 1 && userDB['Definitions']['item'].bucketHash[i] === buckets[b] && 
						   (userDB['Definitions']['item'].catHash[i] === 0 || userDB['Definitions']['item'].catHash[i] > 1000)) {
						// make headline for first found item
						if (hb < 1) {
	HTML +=					"<div class='headline-weapon-bucket'>" + userDB['Definitions']['item'].bucket[i] + "</div>";
							hb++;
						}
													// check if weapon is achieved and determine availability
							var unavailable = "";
							// Use the old approach: directly access collectible state without safety checks
							var checkState = 0; // Default to 0 (not acquired)
							if (userDB['Definitions']['item'].collectibleID[i] > 0 && cP.collectibles && cP.collectibles[userDB['Definitions']['item'].collectibleID[i]]) {
								checkState = cP.collectibles[userDB['Definitions']['item'].collectibleID[i]].state;
							} else {
							}
							// states: https://bungie-net.github.io/multi/schema_Destiny-DestinyCollectibleState.html#schema_Destiny-DestinyCollectibleState
							// 0 = none, 1 = not acquired, 2 = obscured, 4 = invisible, 8 = cannot afford material, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
							// states can be added! --> all odd numbers = not obtained, all even numbers = obtained
							// Use the old approach: even numbers = obtained, odd numbers = not obtained
							if (checkState % 2 == 0) {
								unavailable = ""; // Even = obtained, so not unavailable
							} else {
								unavailable = " unavailable"; // Odd = not obtained, so unavailable
							}
							

							// check Catalyst progression
							var catalystData = { classes: "", progression: 0 };
							
							if (userDB['Definitions']['item'].catHash[i] > 0 && cP.records[userDB['Definitions']['item'].catHash[i]] !== undefined) {
								catalystData = getCatalystClasses(cP.records[userDB['Definitions']['item'].catHash[i]]);
							}
	HTML +=				"<div class='itemIconContainer" + unavailable + catalystData.classes + "' data-catalyst-progress='" + catalystData.progression + "' style='" + (catalystData.progression > 0 && catalystData.progression < 100 ? '--progression-deg: ' + (catalystData.progression * 3.6) + 'deg;' : '') + "'>" +
							'<img src="' + userDB['Definitions']['item'].iconURL[i] + '" onerror="this.src=\'css/images/placeholder.png\'" onload="this.style.opacity=\'1\'; this.parentElement.querySelector(\'.catalyst-border\').style.display=\'block\';" style="opacity: 0;">' +
							'<div class="itemIconContainerInfo" title="' + userDB['Definitions']['item'].name[i] + ' (' + userDB['Definitions']['item'].type[i] + ')"></div>' +
							                                    '<div class="catalyst-border"></div>' +
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
							// check if armor is achieved and determine availability
								var unavailable = "";
								// Use the old approach: directly access collectible state without safety checks
								var checkState = 0; // Default to 0 (not acquired)
								if (userDB['Definitions']['item'].collectibleID[i] > 0 && cP.collectibles && cP.collectibles[userDB['Definitions']['item'].collectibleID[i]]) {
									checkState = cP.collectibles[userDB['Definitions']['item'].collectibleID[i]].state;
								} else {
								}
								// states: https://bungie-net.github.io/multi/schema_Destiny-DestinyCollectibleState.html#schema_Destiny-DestinyCollectibleState
								// 0 = none, 1 = not acquired, 2 = obscured, 4 = invisible, 8 = cannot afford material, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
								// states can be added! --> all odd numbers = not obtained, all even numbers = obtained
								// Use the old approach: even numbers = obtained, odd numbers = not obtained
								if (checkState % 2 == 0) {
									unavailable = ""; // Even = obtained, so not unavailable
								} else {
									unavailable = " unavailable"; // Odd = not obtained, so unavailable
								}
	HTML +=					"<div class='itemIconContainer" + unavailable + "'>" +
								'<img src="' + userDB['Definitions']['item'].iconURL[i] + '" onerror="this.src=\'css/images/placeholder.png\'" onload="this.style.opacity=\'1\'" style="opacity: 0;">' +
								'<div class="itemIconContainerInfo" title="' + userDB['Definitions']['item'].name[i] + ' (' + userDB['Definitions']['item'].type[i] + ')"></div>' +
								"<div class='itemIconContainerLvl'>";
								// Exotic collection - show placeholder (no archetypes here)
	HTML +=							'<img class="itemIconContainerEnergy" src="css/images/placeholder.png">';
	HTML +=							"</div>" +
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
									// Check if this is armor with mods to determine tooltip behavior
									const itemType = userDB['Definitions']['item'].type[indexItem];
									const isArmor = ['Helmet', 'Gauntlets', 'Chest Armor', 'Leg Armor', 'Class Armor'].includes(itemType);
									let hasMods = false;
									
									if (isArmor) {
										const archetypeClass = getArchetypeClass(userDB['Definitions']['item'].archetype[indexItem]);
										if (archetypeClass === "archetype-old-armor") {
											const equippedMods = getEquippedMods(cP.itemDetails[cEquip[item].itemInstanceId]);
											hasMods = equippedMods.length > 0;
										}
									}
									
									// Only add tooltip to armor image if there are no mods
									const armorTooltip = hasMods ? '' : ' title="' + userDB['Definitions']['item'].name[indexItem] + ' (' + userDB['Definitions']['item'].type[indexItem] + ')"';
									
	HTML +=						"<div class='itemIconContainer equipped'>" +
									'<img src="' + userDB['Definitions']['item'].iconURL[indexItem] + '"' + armorTooltip + ' onerror="this.src=\'css/images/placeholder.png\'" onload="this.style.opacity=\'1\'" style="opacity: 0;">';
									
									// Get item details for archetype icon
									const equippedItemDetails = cP.itemDetails[cEquip[item].itemInstanceId];
									
									// Add archetype icon if detected
									if (isArmor && equippedItemDetails && equippedItemDetails.detectedArchetypeIcon) {
										console.log('Adding archetype icon for item:', cEquip[item].itemInstanceId, 'Icon:', equippedItemDetails.detectedArchetypeIcon, 'Name:', equippedItemDetails.detectedArchetype);
										HTML += '<img class="archetype-icon" src="' + equippedItemDetails.detectedArchetypeIcon + '" title="' + equippedItemDetails.detectedArchetype + '">';
									} else if (isArmor) {
										console.log('No archetype icon for item:', cEquip[item].itemInstanceId, 'Details:', equippedItemDetails);
									}
									
	HTML +=							"<div class='itemIconContainerLvl'>";
									// Check if this is armor or weapon (using existing variables)
									
									if (isArmor) {
										// Debug logging for equipped armor items only
										console.log('=== EQUIPPED ARMOR ITEM DEBUG ===');
										console.log('Item Name:', userDB['Definitions']['item'].name[indexItem]);
										console.log('Item Type:', itemType);
										console.log('Item Instance ID:', cEquip[item].itemInstanceId);
										console.log('Item Details:', cP.itemDetails[cEquip[item].itemInstanceId]);
										
										// Check socket data specifically
										const itemDetails = cP.itemDetails[cEquip[item].itemInstanceId];
										if (itemDetails && itemDetails.sockets) {
											console.log('Socket data found:', itemDetails.sockets);
											console.log('Socket data type:', typeof itemDetails.sockets);
											console.log('Socket data keys:', Object.keys(itemDetails.sockets));
											
											if (Array.isArray(itemDetails.sockets)) {
												console.log('Sockets is array, length:', itemDetails.sockets.length);
												itemDetails.sockets.forEach((socket, index) => {
													console.log(`Socket ${index}:`, socket);
													if (socket.plugHash && socket.plugHash !== 0) {
														console.log(`  - Plug Hash: ${socket.plugHash}`);
														console.log(`  - Socket Type Hash: ${socket.socketTypeHash}`);
														console.log(`  - Is Enabled: ${socket.isEnabled}`);
													}
												});
											} else if (itemDetails.sockets.socketEntries) {
												console.log('Sockets has socketEntries, length:', itemDetails.sockets.socketEntries.length);
												itemDetails.sockets.socketEntries.forEach((socket, index) => {
													console.log(`Socket ${index}:`, socket);
													if (socket.plugHash && socket.plugHash !== 0) {
														console.log(`  - Plug Hash: ${socket.plugHash}`);
														console.log(`  - Socket Type Hash: ${socket.socketTypeHash}`);
														console.log(`  - Is Enabled: ${socket.isEnabled}`);
													}
												});
											}
										} else {
											console.log('No socket data found for this item');
										}
										console.log('=====================================');
										
										// Armor - show general mod slot and archetype icon
										// Get general mod (first socket)
										const generalMod = getGeneralMod(equippedItemDetails);
										if (generalMod && generalMod.plugHash) {
											HTML += '<div class="itemIconContainerEnergy mod-icon" title="' + generalMod.name + '" data-plug-hash="' + generalMod.plugHash + '">' + generalMod.icon + '</div>';
										} else {
											HTML += '<div class="itemIconContainerEnergy mod-icon" title="No mod equipped">⚪</div>';
										}
										
										// Show energy type if no archetype detected
										const archetypeClass = getArchetypeClass(userDB['Definitions']['item'].archetype[indexItem], cEquip[item].itemInstanceId);
										if (archetypeClass === "") {
											if (cP.itemDetails[cEquip[item].itemInstanceId].energy !== undefined) {
												HTML += '<img class="itemIconContainerEnergy" src="' + userDB['Definitions']['energy'].iconURL[userDB['Definitions']['energy'].no.indexOf(cP.itemDetails[cEquip[item].itemInstanceId].energy.energyType)] + '">';
											} else {
												HTML += '<img class="itemIconContainerEnergy" src="css/images/placeholder.png">';
											}
										}
									} else {
										// Weapon - show energy type or damage type
									if (cP.itemDetails[cEquip[item].itemInstanceId].energy !== undefined) {
	HTML +=								'<img class="itemIconContainerEnergy" src="' + userDB['Definitions']['energy'].iconURL[userDB['Definitions']['energy'].no.indexOf(cP.itemDetails[cEquip[item].itemInstanceId].energy.energyType)] + '">' +
										" ";								
									} else if (cP.itemDetails[cEquip[item].itemInstanceId].damageType !== undefined && cP.itemDetails[cEquip[item].itemInstanceId].damageType !== 0) {
	HTML +=								'<img class="itemIconContainerEnergy" data-damage-type="' + cP.itemDetails[cEquip[item].itemInstanceId].damageType + '" src="' + userDB['Definitions']['damageType'].iconURL[userDB['Definitions']['damageType'].no.indexOf(cP.itemDetails[cEquip[item].itemInstanceId].damageType)] + '">' +
										" ";								
										} else {
	HTML +=							'<img class="itemIconContainerEnergy" src="css/images/placeholder.png">';									
										}
									}
									if (cP.itemDetails[cEquip[item].itemInstanceId].primaryStat !== undefined) {
	HTML +=								(cP.itemDetails[cEquip[item].itemInstanceId].primaryStat.value);
									} else {
	HTML +=								(cP.itemDetails[cEquip[item].itemInstanceId].itemLevel * 10 + cP.itemDetails[cEquip[item].itemInstanceId].quality);
									}
	HTML +=							"</div>" +
									'<div class="itemIconContainerInfo" title="' + userDB['Definitions']['item'].name[indexItem] + " (" + userDB['Definitions']['item'].type[indexItem] + ')"></div>' +
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
									// Check if this is armor with mods to determine tooltip behavior
									const itemType = userDB['Definitions']['item'].type[indexItem];
									const isArmor = ['Helmet', 'Gauntlets', 'Chest Armor', 'Leg Armor', 'Class Armor'].includes(itemType);
									let hasMods = false;
									
									if (isArmor) {
										const archetypeClass = getArchetypeClass(userDB['Definitions']['item'].archetype[indexItem]);
										const inventoryItemDetails = cP.itemDetails[cInv[item].itemInstanceId];
										if (archetypeClass === "archetype-old-armor" || isOldArmor(inventoryItemDetails)) {
											const equippedMods = getEquippedMods(inventoryItemDetails);
											hasMods = equippedMods.length > 0;
										}
									}
									
									// Only add tooltip to armor image if there are no mods
									const armorTooltip = hasMods ? '' : ' title="' + userDB['Definitions']['item'].name[indexItem] + ' (' + userDB['Definitions']['item'].type[indexItem] + ')"';
									
	HTML +=						"<div class='itemIconContainer'>" +
									'<img src="' + userDB['Definitions']['item'].iconURL[indexItem] + '"' + armorTooltip + ' onerror="this.src=\'css/images/placeholder.png\'" onload="this.style.opacity=\'1\'" style="opacity: 0;">' +
									"<div class='itemIconContainerLvl'>";
									// Check if this is armor or weapon (using existing variables)
									
									if (isArmor) {
										// Armor - show general mod slot and archetype icon
										const inventoryItemDetails = cP.itemDetails[cInv[item].itemInstanceId];
										
										// Get general mod (first socket)
										const generalMod = getGeneralMod(inventoryItemDetails);
										if (generalMod && generalMod.plugHash) {
											HTML += '<div class="itemIconContainerEnergy mod-icon" title="' + generalMod.name + '" data-plug-hash="' + generalMod.plugHash + '">' + generalMod.icon + '</div>';
										} else {
											HTML += '<div class="itemIconContainerEnergy mod-icon" title="No mod equipped">⚪</div>';
										}
										
										// Show energy type if no archetype detected
										const archetypeClass = getArchetypeClass(userDB['Definitions']['item'].archetype[indexItem], cInv[item].itemInstanceId);
										if (archetypeClass === "") {
											if (cP.itemDetails[cInv[item].itemInstanceId].energy !== undefined) {
												HTML += '<img class="itemIconContainerEnergy" src="' + userDB['Definitions']['energy'].iconURL[userDB['Definitions']['energy'].no.indexOf(cP.itemDetails[cInv[item].itemInstanceId].energy.energyType)] + '">';
											} else {
												HTML += '<img class="itemIconContainerEnergy" src="css/images/placeholder.png">';
											}
										}
									} else {
										// Weapon - show energy type or damage type
									if (cP.itemDetails[cInv[item].itemInstanceId].energy !== undefined) {
	HTML +=								'<img class="itemIconContainerEnergy" src="' + userDB['Definitions']['energy'].iconURL[userDB['Definitions']['energy'].no.indexOf(cP.itemDetails[cInv[item].itemInstanceId].energy.energyType)] + '">' +
										" ";								
									} else if (cP.itemDetails[cInv[item].itemInstanceId].damageType !== undefined && cP.itemDetails[cInv[item].itemInstanceId].damageType !== 0) {
	HTML +=								'<img class="itemIconContainerEnergy" data-damage-type="' + cP.itemDetails[cInv[item].itemInstanceId].damageType + '" src="' + userDB['Definitions']['damageType'].iconURL[userDB['Definitions']['damageType'].no.indexOf(cP.itemDetails[cInv[item].itemInstanceId].damageType)] + '">' +
										" ";								
										} else {
	HTML +=							'<img class="itemIconContainerEnergy" src="css/images/placeholder.png">';									
										}
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
									// Check if this is armor with mods to determine tooltip behavior
									const itemType = userDB['Definitions']['item'].type[indexItem];
									const isArmor = ['Helmet', 'Gauntlets', 'Chest Armor', 'Leg Armor', 'Class Armor'].includes(itemType);
									let hasMods = false;
									
									if (isArmor) {
										const archetypeClass = getArchetypeClass(userDB['Definitions']['item'].archetype[indexItem]);
										const vaultItemDetails = cP.itemDetails[cP.profileInventory[item].itemInstanceId];
										if (archetypeClass === "archetype-old-armor" || isOldArmor(vaultItemDetails)) {
											const equippedMods = getEquippedMods(vaultItemDetails);
											hasMods = equippedMods.length > 0;
										}
									}
									
									// Only add tooltip to armor image if there are no mods
									const armorTooltip = hasMods ? '' : ' title="' + userDB['Definitions']['item'].name[indexItem] + ' (' + userDB['Definitions']['item'].type[indexItem] + ')"';
									
	HTML +=						"<div class='itemIconContainer'>" +
									'<img src="' + userDB['Definitions']['item'].iconURL[indexItem] + '"' + armorTooltip + ' onerror="this.src=\'css/images/placeholder.png\'" onload="this.style.opacity=\'1\'" style="opacity: 0;">' +
									"<div class='itemIconContainerLvl'>";
									// Check if this is armor or weapon (using existing variables)
									
									if (isArmor) {
										// Armor - check for archetype or mods
										const archetypeClass = getArchetypeClass(userDB['Definitions']['item'].archetype[indexItem], cP.profileInventory[item].itemInstanceId);
										const vaultItemDetails = cP.itemDetails[cP.profileInventory[item].itemInstanceId];
										
										// Check if this is old armor (either by archetype or by socket structure)
										if (archetypeClass === "archetype-old-armor" || isOldArmor(vaultItemDetails)) {
											// Old armor - show equipped mods instead of energy type
											const equippedMods = getEquippedMods(vaultItemDetails);
											if (equippedMods.length > 0) {
												equippedMods.forEach(mod => {
													if (mod.plugHash) {
														// Store plugHash as data attribute for future image loading
														HTML += '<div class="itemIconContainerEnergy mod-icon" title="' + mod.name + '" data-plug-hash="' + mod.plugHash + '">' + mod.icon + '</div>';
													} else {
														HTML += '<div class="itemIconContainerEnergy mod-icon" title="' + mod.name + '">' + mod.icon + '</div>';
													}
												});
											} else {
												HTML += '<div class="itemIconContainerEnergy mod-icon" title="No mod equipped">⚪</div>';
											}
										} else if (archetypeClass !== "") {
	HTML +=										'<div class="itemIconContainerEnergy ' + archetypeClass + '"></div>' +
												" ";								
										} else if (cP.itemDetails[cP.profileInventory[item].itemInstanceId].energy !== undefined) {
	HTML +=										'<img class="itemIconContainerEnergy" src="' + userDB['Definitions']['energy'].iconURL[userDB['Definitions']['energy'].no.indexOf(cP.itemDetails[cP.profileInventory[item].itemInstanceId].energy.energyType)] + '">' +
												" ";								
										} else {
	HTML +=									'<img class="itemIconContainerEnergy" src="css/images/placeholder.png">';									
										}
									} else {
										// Weapon - show energy type or damage type
									if (cP.itemDetails[cP.profileInventory[item].itemInstanceId].energy !== undefined) {
	HTML +=								'<img class="itemIconContainerEnergy" src="' + userDB['Definitions']['energy'].iconURL[userDB['Definitions']['energy'].no.indexOf(cP.itemDetails[cP.profileInventory[item].itemInstanceId].energy.energyType)] + '">' +
										" ";								
									} else if (cP.itemDetails[cP.profileInventory[item].itemInstanceId].damageType !== undefined && cP.itemDetails[cP.profileInventory[item].itemInstanceId].damageType !== 0) {
	HTML +=								'<img class="itemIconContainerEnergy" data-damage-type="' + cP.itemDetails[cP.profileInventory[item].itemInstanceId].damageType + '" src="' + userDB['Definitions']['damageType'].iconURL[userDB['Definitions']['damageType'].no.indexOf(cP.itemDetails[cP.profileInventory[item].itemInstanceId].damageType)] + '">' +
										" ";								
										} else {
	HTML +=							'<img class="itemIconContainerEnergy" src="css/images/placeholder.png">';									
										}
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
	
	// Get OAuth token from IndexedDB instead of localStorage
	const oauthToken = await window.dbOperations.getOAuthToken();
	if(!oauthToken || !oauthToken.membership_id){
		fireteamCounter = -1;
		contentFireteam.innerHTML = "<div class='warning'><a>You are not logged in! Please reload the page and sign in with the app</a></div>";
		return;
	}
	
	try {
		// Get user's linked profiles
		let rqURL = 'https://www.bungie.net/Platform/Destiny2/254/Profile/' + oauthToken.membership_id + '/LinkedProfiles/?getAllMemberships=true';
		let temp = await getData(rqURL);
		
		if (!temp.Response || !temp.Response.profiles || temp.Response.profiles.length === 0) {
			fireteamCounter = -1;
			contentFireteam.innerHTML = "<div class='warning'><a>Could not retrieve user profile data</a></div>";
			return;
		}
		
		const memberID = temp.Response.profiles[0].membershipId;
		const memberType = temp.Response.profiles[0].applicableMembershipTypes[0];
		
		// Get profile transitory data (fireteam info)
			rqURL = 'https://www.bungie.net/Platform/Destiny2/' + memberType + '/Profile/' + memberID + '/?components=1000';
			temp = await getData(rqURL);
		
		if (!temp.Response || !temp.Response.profileTransitoryData || !temp.Response.profileTransitoryData.data) {
					fireteamCounter = 0;
					contentFireteam.innerHTML = "<div class='warning'><a>Your Destiny-Account shows that you are offline!</a></div>";
			return;
		}
		
		const partyMembers = temp.Response.profileTransitoryData.data.partyMembers;
		if (!partyMembers || partyMembers.length === 0) {
			fireteamCounter = 0;
			contentFireteam.innerHTML = "<div class='warning'><a>No fireteam members found</a></div>";
			return;
		}
		
					contentFireteam.innerHTML = "";
		fireteamCounter = partyMembers.length;
		
		// Process each fireteam member
		for (let i = 0; i < partyMembers.length; i++) {
			try {
				const memberId = partyMembers[i].membershipId;
				
				// Get member's linked profiles
				rqURL = 'https://www.bungie.net/Platform/Destiny2/254/Profile/' + memberId + '/LinkedProfiles/?getAllMemberships=true';
						let tmpProf = await getData(rqURL);
				
				if (tmpProf.Response && tmpProf.Response.profiles && tmpProf.Response.profiles.length > 0) {
					const memberType = tmpProf.Response.profiles[0].applicableMembershipTypes[0];
					
					// Get player data
					const currentPlayer = await getPlayer(memberId, memberType);
					
					if (currentPlayer) {
						// Store fireteam player data
						userDB['fireteamPlayers'] = {
										currentPlayer: currentPlayer.membershipId[0]
						};
						
						// Generate and display player HTML
						contentFireteam.innerHTML += generatePlayerHTML(currentPlayer);
					}
				}		
			} catch (error) {
				console.warn(`Failed to load fireteam member ${i}:`, error);
			}
		}
		
		// Save fireteam data to IndexedDB
		await window.dbOperations.saveFireteamData({
			members: partyMembers,
			timestamp: Date.now()
		});
		
	} catch (error) {
		console.error("Error loading fireteam data:", error);
		fireteamCounter = -1;
		contentFireteam.innerHTML = "<div class='warning'><a>Error loading fireteam data. Please try again.</a></div>";
	}
}

// Manifest cache for mod images to prevent excessive API calls
let manifestCache = {
	data: null,
	timestamp: 0,
	expiry: 5 * 60 * 1000 // 5 minutes
};

// Cache for archetype hashes
let archetypeHashes = null;

// Find all archetype hashes from the manifest
async function findArchetypeHashes() {
	if (archetypeHashes) {
		console.log('findArchetypeHashes: Using cached archetype hashes');
		return archetypeHashes;
	}
	
	console.log('findArchetypeHashes: Finding archetype hashes from manifest...');
	
	try {
		const itemDefinitions = await getCachedManifestData();
		if (!itemDefinitions) {
			console.log('findArchetypeHashes: No manifest data available');
			return [];
		}
		
		const hashes = [];
		
		// Search through all item definitions for archetype plugs
		for (const [hash, definition] of Object.entries(itemDefinitions)) {
			if (definition.plug && definition.plug.plugCategoryIdentifier === 'armor_archetypes') {
				hashes.push(parseInt(hash));
				console.log('findArchetypeHashes: Found archetype hash:', hash, 'Name:', definition.displayProperties?.name);
			}
		}
		
		archetypeHashes = hashes;
			console.log('findArchetypeHashes: Found', hashes.length, 'archetype hashes:', hashes);
	return hashes;
	
} catch (error) {
	console.error('findArchetypeHashes: Error finding archetype hashes:', error);
	return [];
}
}



// Detect archetype from socket data
async function detectArchetypeFromSockets(socketData, membershipId, itemInstanceId) {
	try {
		console.log('detectArchetypeFromSockets: Detecting archetype for item:', itemInstanceId);
		
		// Get archetype hashes
		const archetypeHashes = await findArchetypeHashes();
		if (archetypeHashes.length === 0) {
			console.log('detectArchetypeFromSockets: No archetype hashes found');
			return null;
		}
		
		// Use provided socket data (no API call needed)
		const sockets = socketData;
		if (!sockets) {
			console.log('detectArchetypeFromSockets: No socket data provided');
			return null;
		}
		
		// Check socket entries for archetype plugs
		console.log('detectArchetypeFromSockets: Checking socket entries:', sockets.socketEntries?.length || 0);
		if (sockets.socketEntries && Array.isArray(sockets.socketEntries)) {
			for (let i = 0; i < sockets.socketEntries.length; i++) {
				const socket = sockets.socketEntries[i];
				console.log('detectArchetypeFromSockets: Socket', i, ':', socket);
				
				if (socket.data && socket.data.sockets && Array.isArray(socket.data.sockets)) {
					console.log('detectArchetypeFromSockets: Socket', i, 'has', socket.data.sockets.length, 'plugs');
					for (const plug of socket.data.sockets) {
						console.log('detectArchetypeFromSockets: Checking plug:', plug.plugHash, 'isEnabled:', plug.isEnabled, 'isArchetype:', archetypeHashes.includes(plug.plugHash));
						if (archetypeHashes.includes(plug.plugHash) && plug.isEnabled === true) {
							console.log('detectArchetypeFromSockets: Found enabled archetype plug:', plug.plugHash, 'for item:', itemInstanceId);
							
							// Get the archetype name and icon from manifest
							const itemDefinitions = await getCachedManifestData();
							if (itemDefinitions && itemDefinitions[plug.plugHash]) {
								const archetypeName = itemDefinitions[plug.plugHash].displayProperties?.name;
								const archetypeIcon = itemDefinitions[plug.plugHash].displayProperties?.icon;
								const iconUrl = archetypeIcon ? 'https://www.bungie.net' + archetypeIcon : null;
								console.log('detectArchetypeFromSockets: Archetype name:', archetypeName, 'icon:', iconUrl);
								return {
									name: archetypeName,
									icon: iconUrl
								};
							}
						}
					}
				}
			}
		}
		
		console.log('detectArchetypeFromSockets: No archetype found for item:', itemInstanceId);
		return null;
		
	} catch (error) {
		console.error('detectArchetypeFromSockets: Error detecting archetype:', error);
		return null;
	}
}

// Get cached manifest data or fetch it if needed
async function getCachedManifestData() {
	const now = Date.now();
	
	// Check if cache is still valid
	if (manifestCache.data && (now - manifestCache.timestamp) < manifestCache.expiry) {
		console.log('getCachedManifestData: Using cached manifest data');
		return manifestCache.data;
	}
	
	// Cache expired or doesn't exist, fetch fresh data
	console.log('getCachedManifestData: Fetching fresh manifest data');
	if (!userDB.manifestPaths || !userDB.manifestPaths.item) {
		console.log('getCachedManifestData: Manifest paths not available');
		return null;
	}
	
	try {
		const itemDefinitions = await getData(userDB.manifestPaths.item, false);
		manifestCache.data = itemDefinitions;
		manifestCache.timestamp = now;
		console.log('getCachedManifestData: Manifest data cached successfully');
		return itemDefinitions;
	} catch (error) {
		console.error('getCachedManifestData: Error fetching manifest data:', error);
		return null;
	}
}

// Get mod image URL and stat description from plug hash (like DIM does)
async function getModImageUrl(plugHash) {
	try {
		// Get cached manifest data
		const itemDefinitions = await getCachedManifestData();
		if (!itemDefinitions) {
			console.log('getModImageUrl: No manifest data available');
			return null;
		}
		
		const modDefinition = itemDefinitions[plugHash];
		
		if (modDefinition && modDefinition.displayProperties && modDefinition.displayProperties.icon) {
			const iconUrl = 'https://www.bungie.net' + modDefinition.displayProperties.icon;
			const modName = modDefinition.displayProperties.name || 'Unknown Mod';
			
			// Extract stat description from mod definition
			let statDescription = modName; // Default to mod name
			
			// Check if mod has stat information
			if (modDefinition.investmentStats && modDefinition.investmentStats.length > 0) {
				const stats = modDefinition.investmentStats;
				const statNames = {
					2996146975: 'Mobility',
					392767087: 'Resilience', 
					1943323491: 'Recovery',
					1735777505: 'Discipline',
					144602215: 'Intellect',
					424456721: 'Strength'
				};
				
				// Build stat description from investment stats
				const statStrings = stats.map(stat => {
					const statName = statNames[stat.statTypeHash];
					// Only include known stats (skip unknown ones)
					if (statName) {
						const value = stat.value > 0 ? `+${stat.value}` : `${stat.value}`;
						return `${value} ${statName}`;
					}
					return null;
				}).filter(stat => stat !== null); // Remove null entries
				
				if (statStrings.length > 0) {
					statDescription = statStrings.join(', ');
				}
			}
			
			console.log('getModImageUrl: Found mod image URL:', iconUrl, 'Name:', modName, 'Stat Description:', statDescription);
			return {
				url: iconUrl,
				name: modName,
				statDescription: statDescription
			};
		} else {
			console.log('getModImageUrl: No mod definition found for plugHash:', plugHash);
			return null;
		}
	} catch (error) {
		console.error('getModImageUrl: Error fetching mod image:', error);
		return null;
	}
}

// Load mod images for all mod icons with data-plug-hash attributes
async function loadModImages() {
	try {
		console.log('loadModImages: Starting to load mod images...');
		
		// Find all mod icons with data-plug-hash attributes
		const modIcons = document.querySelectorAll('.mod-icon[data-plug-hash]');
		console.log('loadModImages: Found', modIcons.length, 'mod icons to process');
		
		// Debug: Log all mod icons found
		modIcons.forEach((icon, index) => {
			console.log(`loadModImages: Mod icon ${index}:`, {
				plugHash: icon.getAttribute('data-plug-hash'),
				currentTitle: icon.title,
				className: icon.className
			});
		});
		
		for (const modIcon of modIcons) {
			const plugHash = modIcon.getAttribute('data-plug-hash');
			if (plugHash && plugHash !== '0') {
				console.log('loadModImages: Loading image for plugHash:', plugHash);
				
				try {
					const modData = await getModImageUrl(plugHash);
					if (modData && modData.url) {
						// Create an image element
						const img = document.createElement('img');
						img.src = modData.url;
						img.style.width = '100%';
						img.style.height = '100%';
						img.style.objectFit = 'contain';
						
						// Update the mod icon's title attribute with the stat description
						const oldTitle = modIcon.title;
						modIcon.title = modData.statDescription || modData.name || 'Mod';
						console.log('loadModImages: Updated tooltip for plugHash:', plugHash, 'from:', oldTitle, 'to:', modData.statDescription);
						
						// Clear the existing content and add the image
						modIcon.innerHTML = '';
						modIcon.appendChild(img);
						
						console.log('loadModImages: Successfully loaded image for plugHash:', plugHash, 'Name:', modData.name);
					} else {
						console.log('loadModImages: No image URL found for plugHash:', plugHash);
					}
				} catch (error) {
					console.error('loadModImages: Error loading image for plugHash:', plugHash, error);
				}
			}
		}
		
			console.log('loadModImages: Finished loading mod images');
} catch (error) {
	console.error('loadModImages: Error in loadModImages:', error);
}
}

// Detect and update archetypes for all armor items
async function detectAndUpdateArchetypes(cP) {
	try {
		console.log('detectAndUpdateArchetypes: Starting archetype detection...');
		
		// Get archetype hashes first
		const archetypeHashes = await findArchetypeHashes();
		if (archetypeHashes.length === 0) {
			console.log('detectAndUpdateArchetypes: No archetype hashes found');
			return;
		}
		
		// Collect all armor items from equipped, inventory, and vault
		const armorItems = [];
		
		// Add equipped items
		if (cP.charEquipped) {
			for (const charKey in cP.charEquipped) {
				const charEquipped = cP.charEquipped[charKey];
				for (const item of charEquipped) {
					if (cP.itemDetails[item.itemInstanceId]) {
						const itemDetails = cP.itemDetails[item.itemInstanceId];
						const itemType = getItemType(item.itemHash);
						if (isArmorType(itemType)) {
							armorItems.push({
								itemInstanceId: item.itemInstanceId,
								itemHash: item.itemHash,
								membershipId: cP.membershipId,
								location: 'equipped',
								charKey: charKey
							});
						}
					}
				}
			}
		}
		
		// Add inventory items
		if (cP.charInventory) {
			for (const charKey in cP.charInventory) {
				const charInventory = cP.charInventory[charKey];
				for (const item of charInventory) {
					if (cP.itemDetails[item.itemInstanceId]) {
						const itemDetails = cP.itemDetails[item.itemInstanceId];
						const itemType = getItemType(item.itemHash);
						if (isArmorType(itemType)) {
							armorItems.push({
								itemInstanceId: item.itemInstanceId,
								itemHash: item.itemHash,
								membershipId: cP.membershipId,
								location: 'inventory',
								charKey: charKey
							});
						}
					}
				}
			}
		}
		
		// Add vault items
		if (cP.vaultItems) {
			for (const item of cP.vaultItems) {
				if (cP.itemDetails[item.itemInstanceId]) {
					const itemDetails = cP.itemDetails[item.itemInstanceId];
					const itemType = getItemType(item.itemHash);
					if (isArmorType(itemType)) {
						armorItems.push({
							itemInstanceId: item.itemInstanceId,
							itemHash: item.itemHash,
							membershipId: cP.membershipId,
							location: 'vault'
						});
					}
				}
			}
		}
		
		console.log('detectAndUpdateArchetypes: Found', armorItems.length, 'armor items to check');
		
		// Process each armor item using existing socket data
		for (const armorItem of armorItems) {
			try {
				// Get socket data from existing itemDetails
				const itemDetails = cP.itemDetails[armorItem.itemInstanceId];
				console.log('detectAndUpdateArchetypes: Processing item', armorItem.itemInstanceId, 'has sockets:', !!itemDetails?.sockets);
				
				if (itemDetails && itemDetails.sockets) {
					console.log('detectAndUpdateArchetypes: Socket data for item', armorItem.itemInstanceId, ':', itemDetails.sockets);
					const archetypeData = await detectArchetypeFromSockets(itemDetails.sockets, armorItem.membershipId, armorItem.itemInstanceId);
					if (archetypeData) {
						console.log('detectAndUpdateArchetypes: Found archetype', archetypeData.name, 'for item', armorItem.itemInstanceId);
						
						// Update the archetype in the item details
						cP.itemDetails[armorItem.itemInstanceId].detectedArchetype = archetypeData.name;
						cP.itemDetails[armorItem.itemInstanceId].detectedArchetypeIcon = archetypeData.icon;
					}
				} else {
					console.log('detectAndUpdateArchetypes: No socket data found for item', armorItem.itemInstanceId);
				}
			} catch (error) {
				console.error('detectAndUpdateArchetypes: Error processing item', armorItem.itemInstanceId, error);
			}
		}
		
		console.log('detectAndUpdateArchetypes: Finished archetype detection');
		
	} catch (error) {
		console.error('detectAndUpdateArchetypes: Error in archetype detection:', error);
	}
}

// Helper function to get item type
function getItemType(itemHash) {
	const indexItem = userDB['Definitions']['item'].id.indexOf(itemHash.toString());
	if (indexItem !== -1) {
		return userDB['Definitions']['item'].type[indexItem];
	}
	return '';
}

// Helper function to check if item is armor
function isArmorType(itemType) {
	return ['Helmet', 'Gauntlets', 'Chest Armor', 'Leg Armor', 'Class Armor'].includes(itemType);
}

// Get general mod for any armor (first socket)
function getGeneralMod(itemDetails) {
	if (!itemDetails || !itemDetails.sockets) {
		return null;
	}
	
	// Check socketEntries structure
	if (itemDetails.sockets.socketEntries && Array.isArray(itemDetails.sockets.socketEntries)) {
		const firstSocket = itemDetails.sockets.socketEntries[0];
		if (firstSocket && firstSocket.plugHash && firstSocket.plugHash !== 0) {
			return {
				name: "General Mod",
				icon: "🔧",
				plugHash: firstSocket.plugHash
			};
		}
	}
	
	// Check direct sockets array structure
	if (Array.isArray(itemDetails.sockets)) {
		const firstSocket = itemDetails.sockets[0];
		if (firstSocket && firstSocket.plugHash && firstSocket.plugHash !== 0) {
			return {
				name: "General Mod",
				icon: "🔧",
				plugHash: firstSocket.plugHash
			};
		}
	}
	
	return null;
}