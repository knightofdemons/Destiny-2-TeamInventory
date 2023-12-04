<?php
// get API key from file (as $apiKey)
    require_once ('config.php');

// getCurlResponse returns the response of the decoded json array for specified url
    require_once ('getCurlResponse.php');

// get json-urls from manifest
    $responseManifest = getCurlResponse($apiKey,'https://www.bungie.net/Platform/Destiny2/Manifest/');
    // save json-request urls
    $urlItems = 'https://www.bungie.net' . $responseManifest["Response"]["jsonWorldComponentContentPaths"][$language]["DestinyInventoryItemLiteDefinition"];
    $urlItemHash = 'https://www.bungie.net' . $responseManifest["Response"]["jsonWorldComponentContentPaths"][$language]["DestinyItemCategoryDefinition"];
    $urlBuckets = 'https://www.bungie.net' . $responseManifest["Response"]["jsonWorldComponentContentPaths"][$language]["DestinyInventoryBucketDefinition"];
    $urlStatDefinitions = 'https://www.bungie.net' . $responseManifest["Response"]["jsonWorldComponentContentPaths"][$language]["DestinyStatDefinition"];    
        // get stat details from json
        $responseStatDefinitions = getCurlResponse($apiKey,$urlStatDefinitions);
        foreach($responseStatDefinitions as $statDef) {
                if (array_key_exists("icon", $statDef["displayProperties"])){
                    $statName = $statDef["displayProperties"]["name"];
                    $statHash = $statDef["hash"];
                    $statIcon = 'https://www.bungie.net' . $statDef["displayProperties"]["icon"];
                    $allStats[$statHash] = [
                            "name" => $statName,
                            "hash" => $statHash,
                            "iconURL" => $statIcon
                            ];
                    }
            }
            unset($statDef);
            
// get details for player name
    $acc = $_GET["account"];
    $platform = $_GET["platform"];
	
    $responseAccDetail = getCurlResponse($apiKey,'https://www.bungie.net/Platform/User/Search/Prefix/' . $acc . '/0/');
	
    // save relevant info
    $playerName = $responseAccDetail["Response"]["searchResults"]["0"]["destinyMemberships"][0]["displayName"];
    $playerID = $responseAccDetail["Response"]["searchResults"]["0"]["destinyMemberships"][0]["membershipId"];
    $playerMembershipType = $platform;

// get details for collectibles
    $responseProfile = getCurlResponse($apiKey,'https://www.bungie.net/Platform/Destiny2/' . $playerMembershipType . '/Profile/' . $playerID . '/?components=900'); // 900 = records (triumphs)
    // save relevant info
    $characterID1 = (array_key_exists(0, array_keys($responseProfile["Response"]["characterRecords"]["data"]))?array_keys($responseProfile["Response"]["characterRecords"]["data"])[0]:0); // set character ID = 0, if character not existant
    $characterID2 = (array_key_exists(1, array_keys($responseProfile["Response"]["characterRecords"]["data"]))?array_keys($responseProfile["Response"]["characterRecords"]["data"])[1]:0); // set character ID = 0, if character not existant
    $characterID3 = (array_key_exists(2, array_keys($responseProfile["Response"]["characterRecords"]["data"]))?array_keys($responseProfile["Response"]["characterRecords"]["data"])[2]:0); // set character ID = 0, if character not existant
    $noCharacters = count($responseProfile["Response"]["characterRecords"]["data"]);

// get details for all 3 characters
    $responseCharItemsEquipped = getCurlResponse($apiKey,'https://www.bungie.net/Platform/Destiny2/' . $playerMembershipType . '/Profile/' . $playerID . '/?components=205'); // 205 = character equipment
    $responseCharItems = getCurlResponse($apiKey,'https://www.bungie.net/Platform/Destiny2/' . $playerMembershipType . '/Profile/' . $playerID . '/?components=201'); // 201 = character inventory

    for ($i = 1; $i <= $noCharacters; $i++) {
                    // character details
                    $responseChar = getCurlResponse($apiKey,'https://www.bungie.net/Platform/Destiny2/' . $playerMembershipType . '/Profile/' . $playerID . '/Character/' . ${"characterID" . $i} . '/?components=200'); // 200 = character
                        // save relevant info
                        ${"charClass" . $i} = $responseChar["Response"]["character"]["data"]["classType"];
                            if (${"charClass" . $i} == 0) {
                                        $charOrderNo[$i] = 1;
                                        ${"charClass" . $i} = "Titan";
                                    } elseif (${"charClass" . $i} == 1) {
                                        $charOrderNo[$i] = 2;
                                        ${"charClass" . $i} = "J&auml;ger";
                                    } elseif (${"charClass" . $i} == 2) {
                                        $charOrderNo[$i] = 3;
                                        ${"charClass" . $i} = "Warlock";
                                    }
                        ${"charBannerURL" . $i} = 'https://www.bungie.net' . $responseChar["Response"]["character"]["data"]["emblemBackgroundPath"];
                        ${"charLightLvl" . $i} = $responseChar["Response"]["character"]["data"]["light"];
                        ${"charStats" . $i} = $responseChar["Response"]["character"]["data"]["stats"];                        
                        
                    // equipped character item details
                    ${"charItemsEquipped" . $i} = $responseCharItemsEquipped["Response"]["characterEquipment"]["data"][${"characterID" . $i}]["items"];    
                    // inventory character item details
                        // check if items are private
                        $itemPrivacy = 0;
                        if (array_key_exists("data", $responseCharItems["Response"]["characterInventories"])){
                            ${"charItemsInventory" . $i} = $responseCharItems["Response"]["characterInventories"]["data"][${"characterID" . $i}]["items"];
                            $itemPrivacy = 1;
                        } elseif ($itemPrivacy == 0) {
                            ${"charItemsInventory" . $i} = array();
                        }
                    // merge equipped & inventory
                    ${"charItems" . $i} = array_merge(${"charItemsEquipped" . $i},${"charItemsInventory" . $i});       
    } // for characters
    
    // replace charOrderNo if < 3 characters
    if ($noCharacters < 2) {
        $charOrderNo = array_map(function($v) {return min(1, $v);}, $charOrderNo);
    } elseif ($noCharacters < 3) {
        $charOrderNo = array_map(function($v) {return min(2, $v);}, $charOrderNo);
    }

// get details for profile inventory
if ($itemPrivacy == 1) {
    $responseVaultItems = getCurlResponse($apiKey,'https://www.bungie.net/Platform/Destiny2/' . $playerMembershipType . '/Profile/' . $playerID . '/?components=102'); // 102 = profile inventory
    $vaultItems = $responseVaultItems["Response"]["profileInventory"]["data"]["items"];
} else {
    $vaultItems = array();
}


// get all exotics
    $responseItems = getCurlResponse($apiKey,$urlItems);
    // save relevant info
        // get all Keys
        $allItemKeys = array_keys($responseItems);
        // Exotic weapons
            // iterate over all keys (items)
            foreach ($allItemKeys as &$item) {
                // filter only exotic weapons
                if (array_key_exists("equippingBlock", $responseItems[$item]) && array_key_exists("uniqueLabel", $responseItems[$item]["equippingBlock"]) && $responseItems[$item]["equippingBlock"]["uniqueLabel"]=="exotic_weapon") {
                        // filter each weapon only once (has collectibleHash field)
                        if (array_key_exists("collectibleHash", $responseItems[$item])) {
                                    $weaponName = $responseItems[$item]["displayProperties"]["name"];
                                    $weaponID = $item;
                                    $weaponCollectibleID = $responseItems[$item]["collectibleHash"];
                                    $weaponIconURL = 'https://www.bungie.net' . $responseItems[$item]["displayProperties"]["icon"];
                                    $weaponTypeHash = $responseItems[$item]["itemCategoryHashes"][0];
                                    $weaponSubtypeHash = $responseItems[$item]["itemCategoryHashes"][2];
                                    // translate item category hashes to names
                                        $responseItemHash = getCurlResponse($apiKey,$urlItemHash);
                                        // save relevant info
                                        $weaponType = $responseItemHash[$weaponTypeHash]["shortTitle"];
                                        $weaponSubtype = $responseItemHash[$weaponSubtypeHash]["shortTitle"];

                                    $exoticWeapons[] = [
                                                        "name" => $weaponName,
                                                        "collectionID" => $weaponCollectibleID,
                                                        "weaponID" => $weaponID,
                                                        "iconURL" => $weaponIconURL,
                                                        "weaponType" => $weaponType,
                                                        "weaponSubtype" => $weaponSubtype
                                                        ];
                            } // if has collectibleHash
                    } // if exotic weapon
                } // for each item
            unset($item); // delete reference to last item

            // split weapons by type
            $exoticWeaponsKinetic = array_filter($exoticWeapons, function ($value) {return ($value["weaponType"] == "Kinetik");});
            $exoticWeaponsEnergy = array_filter($exoticWeapons, function ($value) {return ($value["weaponType"] == "Energie");});
            $exoticWeaponsPower = array_filter($exoticWeapons, function ($value) {return ($value["weaponType"] == "Power");});

            // sort weapons by subtype
            function sortBySubtype($item1, $item2) {return strcmp($item1['weaponSubtype'], $item2['weaponSubtype']);}
            usort($exoticWeaponsKinetic, 'sortBySubtype');
            usort($exoticWeaponsEnergy, 'sortBySubtype');
            usort($exoticWeaponsPower, 'sortBySubtype');

            $exoticWeaponsSorted = ["Kinetik" => $exoticWeaponsKinetic,
                                    "Energie" => $exoticWeaponsEnergy,
                                    "Power" => $exoticWeaponsPower,
                                    ];

        // Exotic armor
            // iterate over all keys (items)
            foreach ($allItemKeys as &$item) {
                // filter only exotic weapons
                if (array_key_exists("equippingBlock", $responseItems[$item]) && array_key_exists("uniqueLabel", $responseItems[$item]["equippingBlock"]) && $responseItems[$item]["equippingBlock"]["uniqueLabel"]=="exotic_armor") {
                        // filter each weapon only once (has collectibleHash field)
                        if (array_key_exists("collectibleHash", $responseItems[$item])) {
                                    $armorName = $responseItems[$item]["displayProperties"]["name"];
                                    $armorID = $item;
                                    $armorCollectibleID = $responseItems[$item]["collectibleHash"];
                                    $armorIconURL = 'https://www.bungie.net' . $responseItems[$item]["displayProperties"]["icon"];
                                    $armorType = $responseItems[$item]["itemTypeDisplayName"]; // Beinschutz, Armschutz...
                                    $armorClass = $responseItems[$item]["itemCategoryHashes"][0]; // 21 = Warlock, 22 = Titan, 23 = Hunter
                                    $exoticArmor[] = [
                                                        "name" => $armorName,
                                                        "collectionID" => $armorCollectibleID,
                                                        "armorID" => $armorID,
                                                        "iconURL" => $armorIconURL,
                                                        "armorClass" => $armorClass,
                                                        "armorType" => $armorType
                                                        ];
                            } // if has collectibleHash
                    } // if exotic armor
                } // for each item
            unset($item); // delete reference to last item

            // split armor by class
            $exoticArmorWarlockTemp = array_filter($exoticArmor, function ($value) {return ($value["armorClass"] == 21);});
            $exoticArmorTitanTemp = array_filter($exoticArmor, function ($value) {return ($value["armorClass"] == 22);});
            $exoticArmorHunterTemp = array_filter($exoticArmor, function ($value) {return ($value["armorClass"] == 23);});
    
            // sort armor by type
            function sortByType($input,$sortkey){
                                  foreach ($input as $key=>$val) $output[$val[$sortkey]][]=$val;
                                  return $output;
                                }
            $exoticArmorWarlock = sortByType($exoticArmorWarlockTemp,'armorType');
            $exoticArmorTitan = sortByType($exoticArmorTitanTemp,'armorType');
            $exoticArmorHunter = sortByType($exoticArmorHunterTemp,'armorType');
    
            $exoticArmorSorted = ["Titan" => $exoticArmorTitan,
                                  "J&auml;ger" => $exoticArmorHunter,
                                  "Warlock" => $exoticArmorWarlock,
                                  ]; // !!! nur de
        
        // Character & vault items
            // get bucket details
            $responseBuckets = getCurlResponse($apiKey,$urlBuckets);
            foreach($responseBuckets as $bucket) {
                $bucketName = $bucket["displayProperties"]["name"];
                $bucketHash = $bucket["hash"];
                $bucketIndex = $bucket["index"];
                if($bucketIndex<8) {
                    $allBuckets[$bucketHash] = [
                            "name" => $bucketName,
                            "hash" => $bucketHash,
                            "index" => $bucketIndex
                            ];    
                }  
            }
            unset($bucket);
            
            // iterate over all items for all characters
            for ($i = 1; $i <= $noCharacters; $i++) {
                $itemNo = 0;
                foreach(${"charItems" . $i} as $item) {                
                        // only items that are either weapons or armor && only non-exotic items
                        if(in_array($responseItems[$item["itemHash"]]["inventory"]["bucketTypeHash"], array_keys($allBuckets)) && ($responseItems[$item["itemHash"]]["equippingBlock"]["uniqueLabelHash"]==0 || ${"charItems" . $i}[$itemNo]["transferStatus"] == 1)){
                                $itemName = $responseItems[$item["itemHash"]]["displayProperties"]["name"];
                                $itemIconURL = 'https://www.bungie.net' . $responseItems[$item["itemHash"]]["displayProperties"]["icon"];
                                $itemCategory = $responseItems[$item["itemHash"]]["itemTypeDisplayName"];
                                $itemBucket = $responseItems[$item["itemHash"]]["inventory"]["bucketTypeHash"];
                                $itemBucketIndex = $allBuckets[$itemBucket]["index"];
                                $itemBucketName = $allBuckets[$itemBucket]["name"];
                                $itemEquippingStatus = ${"charItems" . $i}[$itemNo]["transferStatus"];
                                $allItems[] = [
                                                "charNo" => $i,
                                                "name" => $itemName,
                                                "iconURL" => $itemIconURL,
                                                "category" => $itemCategory,
                                                "bucket" => $itemBucket,
                                                "bucketIndex" => $itemBucketIndex,
                                                "bucketName" => $itemBucketName,
                                                "EquippingStatus" => $itemEquippingStatus
                                                ];
                        }
                        $itemNo++;
                }
                unset($item);
            }
            // vault items
            foreach($vaultItems as $item) {
                    // only items that are either weapons or armor && only non-exotic items
                    if(in_array($responseItems[$item["itemHash"]]["inventory"]["bucketTypeHash"], array_keys($allBuckets)) && $responseItems[$item["itemHash"]]["equippingBlock"]["uniqueLabelHash"]==0){
                            $itemName = $responseItems[$item["itemHash"]]["displayProperties"]["name"];
                            $itemIconURL = 'https://www.bungie.net' . $responseItems[$item["itemHash"]]["displayProperties"]["icon"];
                            $itemCategory = $responseItems[$item["itemHash"]]["itemTypeDisplayName"];
                            $itemBucket = $responseItems[$item["itemHash"]]["inventory"]["bucketTypeHash"];
                            $itemBucketIndex = $allBuckets[$itemBucket]["index"];
                            $itemBucketName = $allBuckets[$itemBucket]["name"];
                            $allVaultItems[] = [
                                            "name" => $itemName,
                                            "iconURL" => $itemIconURL,
                                            "category" => $itemCategory,
                                            "bucket" => $itemBucket,
                                            "bucketIndex" => $itemBucketIndex,
                                            "bucketName" => $itemBucketName,
                                            ];
                    }
            }
            unset($item);
            
            // group items by bucket
            function _group_by($array, $key) {
                    $return = array();
                    foreach($array as $val) {
                        $return[$val[$key]][] = $val;
                    }
                    return $return;
                }
            $allItemsGrouped = _group_by($allItems,'bucketIndex');
            $vaultItemsGrouped = _group_by($allVaultItems,'bucketIndex');

// get details for Collection
    $responseCollectibles = getCurlResponse($apiKey,'https://www.bungie.net/Platform/Destiny2/' . $playerMembershipType . '/Profile/' . $playerID . '/?components=800'); // 800 = collectibles    
 ?>