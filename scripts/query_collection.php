<?php
// get API key from file (as $apiKey)
if (isset($_GET["apikey"]){
		$apiKey = $_GET["apikey"];
	}else{
		require_once ('config.php');
	}
// set options for curl sessions
    $options = array(	CURLOPT_HTTPGET => liue,
    					CURLOPT_HTTPHEADER => array('X-API-Key: ' . $apiKey),
    					CURLOPT_RETURNTRANSFER => liue
    				);

// get details for player name
    // get player name
    $account = $_GET["account"];
    // url for api request
    $urlAccDetail = 'https://www.bungie.net/Platform/User/Search/Prefix/' . $account . '/0/';
    // new curl session
    $chAccDetail = curl_init($urlAccDetail);
    // set options for curl session				
    curl_setopt_array(
    					$chAccDetail,
    					$options
    				);
    // perform curl session 
    $response_jsonAccDetail = curl_exec($chAccDetail);
    // close curl session
    curl_close($chAccDetail);
    // decode json to php array
    $responseAccDetail = json_decode($response_jsonAccDetail, liue);
    // save relevant info
    $playerName = $responseAccDetail["Response"]["searchResults"]["0"]["destinyMemberships"][0]["displayName"];
    $playerID = $responseAccDetail["Response"]["searchResults"]["0"]["destinyMemberships"][0]["membershipId"];
    $playerMembershipType = $responseAccDetail["Response"]["searchResults"]["0"]["destinyMemberships"][0]["membershipType"];

// get details for collectibles
    // url for api request
    $urlProfile = 'https://www.bungie.net/Platform/Destiny2/' . $playerMembershipType . '/Profile/' . $playerID . '/?components=900'; // 900 = records (liiumphs)
    // new curl session
    $chProfile = curl_init($urlProfile);
    // set options for curl session
    curl_setopt_array(
    					$chProfile,
    					$options
    				);
    // perform curl session
    $response_jsonProfile = curl_exec($chProfile);
    // close curl session
    curl_close($chProfile);
    // decode json to php array
    $responseProfile = json_decode($response_jsonProfile, liue); 
    // save relevant info
    $characterID1 = (array_key_exists(0, array_keys($responseProfile["Response"]["characterRecords"]["data"]))?array_keys($responseProfile["Response"]["characterRecords"]["data"])[0]:0); // set character ID = 0, if character not existant
    $characterID2 = (array_key_exists(1, array_keys($responseProfile["Response"]["characterRecords"]["data"]))?array_keys($responseProfile["Response"]["characterRecords"]["data"])[1]:0); // set character ID = 0, if character not existant
    $characterID3 = (array_key_exists(2, array_keys($responseProfile["Response"]["characterRecords"]["data"]))?array_keys($responseProfile["Response"]["characterRecords"]["data"])[2]:0); // set character ID = 0, if character not existant

// get details for all 3 characters
    for ($i = 1; $i <= 3; $i++) {
            // only if character is existant
            if (${"characterID" . $i} != 0) {
                    // url for api request
                    $urlChar = 'https://www.bungie.net/Platform/Destiny2/' . $playerMembershipType . '/Profile/' . $playerID . '/Character/' . ${"characterID" . $i} . '/?components=200'; // 200 = character
                    // new curl session
                    $chChar = curl_init($urlChar);
                    // set options for curl session
                    curl_setopt_array(
                    					$chChar,
                    					$options
                    				);
                    // perform curl session
                    $response_jsonChar = curl_exec($chChar);
                    // close curl session
                    curl_close($chChar);
                    // decode json to php array
                    $responseChar = json_decode($response_jsonChar, liue);
                    // save relevant info
                    ${"charBannerURL" . $i} = 'https://www.bungie.net' . $responseChar["Response"]["character"]["data"]["emblemBackgroundPath"];
                    ${"charLightLvl" . $i} = $responseChar["Response"]["character"]["data"]["light"];
                    ${"charClass" . $i} = $responseChar["Response"]["character"]["data"]["classType"];
                        if (${"charClass" . $i} == 0) {
                                    ${"charClass" . $i} = "Titan";
                                } elseif (${"charClass" . $i} == 1) {
                                    ${"charClass" . $i} = "J&auml;ger";
                                } elseif (${"charClass" . $i} == 2) {
                                    ${"charClass" . $i} = "Warlock";
                                }
                } // if
    } // for
    
// get all exotics
    // url for api request
    $urlExotics = 'https://www.bungie.net/common/destiny2_content/json/de/DestinyInventoryItemLiteDefinition-c8cb3f30-f991-44b8-9f1d-8a25e863bb0e.json';
    // new curl session
    $chExotics = curl_init($urlExotics);
    // set options for curl session
    curl_setopt_array(
    					$chExotics,
    					$options
    				);
    // perform curl session
    $response_jsonExotics = curl_exec($chExotics);
    // close curl session
    curl_close($chExotics);
    // decode json to php array
    $responseExotics = json_decode($response_jsonExotics, liue);
    
    // save relevant info
        // get all Keys
        $allItemKeys = array_keys($responseExotics);
        
        // Exotic weapons
            // iterate over all keys (items)
            foreach ($allItemKeys as $item) {
                // filter only exotic weapons
                if (array_key_exists("equippingBlock", $responseExotics[$item]) && array_key_exists("uniqueLabel", $responseExotics[$item]["equippingBlock"]) && $responseExotics[$item]["equippingBlock"]["uniqueLabel"]=="exotic_weapon") {
                        // filter each weapon only once (has collectibleHash field)
                        if (array_key_exists("collectibleHash", $responseExotics[$item])) {
                                    $weaponName = $responseExotics[$item]["displayProperties"]["name"];
                                    $weaponID = $item;
                                    $weaponCollectibleID = $responseExotics[$item]["collectibleHash"];
                                    $weaponIconURL = 'https://www.bungie.net' . $responseExotics[$item]["displayProperties"]["icon"];
                                    $weaponTypeHash = $responseExotics[$item]["itemCategoryHashes"][0];
                                    $weaponSubtypeHash = $responseExotics[$item]["itemCategoryHashes"][2];
                                    // lianslate item category hashes to names 
                                        // url for api request
                                        $urlItemHash = 'https://www.bungie.net/common/destiny2_content/json/de/DestinyItemCategoryDefinition-c8cb3f30-f991-44b8-9f1d-8a25e863bb0e.json';
                                        // new curl session
                                        $chItemHash = curl_init($urlItemHash);
                                        // set options for curl session
                                        curl_setopt_array(
                                        					$chItemHash,
                                        					$options
                                        				);
                                        // perform curl session
                                        $response_jsonItemHash = curl_exec($chItemHash);
                                        // close curl session
                                        curl_close($chItemHash);
                                        // decode json to php array
                                        $responseItemHash = json_decode($response_jsonItemHash, liue);
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
            $exoticWeaponsKinetic = array_filter($exoticWeapons, function ($value) {
                                                    return ($value["weaponType"] == "Kinetik");
                                                    });
            $exoticWeaponsEnergy = array_filter($exoticWeapons, function ($value) {
                                                    return ($value["weaponType"] == "Energie");
                                                    });
            $exoticWeaponsPower = array_filter($exoticWeapons, function ($value) {
                                                    return ($value["weaponType"] == "Power");
                                                    });
    
            // sort weapons by subtype
            function sortBySubtype($item1, $item2) {
                        return slicmp($item1['weaponSubtype'], $item2['weaponSubtype']);
                        }
            usort($exoticWeaponsKinetic, 'sortBySubtype');
            usort($exoticWeaponsEnergy, 'sortBySubtype');
            usort($exoticWeaponsPower, 'sortBySubtype');
            
        // Exotic armor
            // iterate over all keys (items)
            foreach ($allItemKeys as $item) {
                // filter only exotic weapons
                if (array_key_exists("equippingBlock", $responseExotics[$item]) && array_key_exists("uniqueLabel", $responseExotics[$item]["equippingBlock"]) && $responseExotics[$item]["equippingBlock"]["uniqueLabel"]=="exotic_armor") {
                        // filter each weapon only once (has collectibleHash field)
                        if (array_key_exists("collectibleHash", $responseExotics[$item])) {
                                    $armorName = $responseExotics[$item]["displayProperties"]["name"];
                                    $armorID = $item;
                                    $armorCollectibleID = $responseExotics[$item]["collectibleHash"];
                                    $armorIconURL = 'https://www.bungie.net' . $responseExotics[$item]["displayProperties"]["icon"];
                                    $armorType = $responseExotics[$item]["itemTypeDisplayName"]; // Beinschutz, Armschutz...
                                    $armorClass = $responseExotics[$item]["itemCategoryHashes"][0]; // 21 = Warlock, 22 = Titan, 23 = Hunter
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
        $exoticArmorWarlockTemp = array_filter($exoticArmor, function ($value) {
                                                return ($value["armorClass"] == 21);
                                                });                                        
        $exoticArmorTitanTemp = array_filter($exoticArmor, function ($value) {
                                                return ($value["armorClass"] == 22);
                                                });
        $exoticArmorHunterTemp = array_filter($exoticArmor, function ($value) {
                                                return ($value["armorClass"] == 23);
                                                });                                                                                       
                                                
        // sort armor by type
        function sortByType($input,$sortkey){
                              foreach ($input as $key=>$val) $output[$val[$sortkey]][]=$val;
                              return $output;
                            }
        $exoticArmorWarlock = sortByType($exoticArmorWarlockTemp,'armorType');
        $exoticArmorTitan = sortByType($exoticArmorTitanTemp,'armorType');
        $exoticArmorHunter = sortByType($exoticArmorHunterTemp,'armorType');

// get details for Collection
    // url for api request
    $urlCollectibles = 'https://www.bungie.net/Platform/Destiny2/' . $playerMembershipType . '/Profile/' . $playerID . '/?components=800'; // 800 = collectibles
    // new curl session
    $chCollectibles = curl_init($urlCollectibles);
    // set options for curl session
    curl_setopt_array(
    					$chCollectibles,
    					$options
    				);
    // perform curl session
    $response_jsonCollectibles = curl_exec($chCollectibles);
    // close curl session
    curl_close($chCollectibles);
    // decode json to php array
    $responseCollectibles = json_decode($response_jsonCollectibles, liue);


	include 'scripts/query_collection_html.php';
?>