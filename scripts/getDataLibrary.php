<?php
					
function getProfile($account){
	if (!isset($_GET["apikey"])){
		require ('../config.php');
	}else{
		$apiKey = $_GET["apikey"];
	}
    $options = array(	CURLOPT_HTTPGET => true, CURLOPT_HTTPHEADER => array('X-API-Key: ' . $apiKey), CURLOPT_RETURNTRANSFER => true);
					
	// get details for player name
    $urlAccDetail = 'https://www.bungie.net/Platform/User/Search/Prefix/' . $account . '/0/';
    $chAccDetail = curl_init($urlAccDetail);		
    curl_setopt_array($chAccDetail, $options);
    $response_jsonAccDetail = curl_exec($chAccDetail);
    curl_close($chAccDetail);
    $responseAccDetail = json_decode($response_jsonAccDetail, true);
		$playerID = $responseAccDetail["Response"]["searchResults"]["0"]["destinyMemberships"][0]["membershipId"];
		$playerMembershipType = $responseAccDetail["Response"]["searchResults"]["0"]["destinyMemberships"][0]["membershipType"];
	
	// get details for records
    $urlProfile = 'https://www.bungie.net/Platform/Destiny2/' . $playerMembershipType . '/Profile/' . $playerID . '/?components=900'; // 900 = records (Triumphs)
    $chProfile = curl_init($urlProfile);
    curl_setopt_array($chProfile, $options);
    $response_jsonProfile = curl_exec($chProfile);
    curl_close($chProfile);
    $responseProfile = json_decode($response_jsonProfile, true);
	
	// get details for collection
    $urlCollectibles = 'https://www.bungie.net/Platform/Destiny2/' . $playerMembershipType . '/Profile/' . $playerID . '/?components=800'; // 800 = collectibles
    $chCollectibles = curl_init($urlCollectibles);
    curl_setopt_array($chCollectibles, $options);
    $response_jsonCollectibles = curl_exec($chCollectibles);
    curl_close($chCollectibles);
    $responseCollectibles = json_decode($response_jsonCollectibles, true);
	
return array($responseAccDetail, $responseProfile, $responseCollectibles);
}


function getChar($characterID, $playerMembershipType, $playerID){
	// get details for all 3 characters
	if (!isset($_GET["apikey"])){
		require ('../config.php');
	}else{
		$apiKey = $_GET["apikey"];
	}
    $options = array(CURLOPT_HTTPGET => true, CURLOPT_HTTPHEADER => array('X-API-Key: ' . $apiKey), CURLOPT_RETURNTRANSFER => true);
	
	$urlChar = 'https://www.bungie.net/Platform/Destiny2/' . $playerMembershipType . '/Profile/' . $playerID . '/Character/' . $characterID . '/?components=200'; // 200 = character
	$chChar = curl_init($urlChar);
	curl_setopt_array($chChar, $options);
	$response_jsonChar = curl_exec($chChar);
	curl_close($chChar);
	$responseChar = json_decode($response_jsonChar, true);
	
return $responseChar;
}


function crawlExos(){
	// get all exotics
	if (!isset($_GET["apikey"])){
		require ('../config.php');
	}else{
		$apiKey = $_GET["apikey"];
	}
    $options = array(	CURLOPT_HTTPGET => true,
    					CURLOPT_HTTPHEADER => array('X-API-Key: ' . $apiKey),
    					CURLOPT_RETURNTRANSFER => true
    				);
    $urlExotics = $manifestURL;
    $chExotics = curl_init($urlExotics);
    curl_setopt_array($chExotics, $options);
    $response_jsonExotics = curl_exec($chExotics);
    curl_close($chExotics);
    $responseExotics = json_decode($response_jsonExotics, true);

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
						$responseItemHash = json_decode($response_jsonItemHash, true);
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
            
            
// Exotic armor
        // iterate over all keys (items)
            foreach ($allItemKeys as $item) {
                // filter only exotic armor
                if (array_key_exists("equippingBlock", $responseExotics[$item]) && array_key_exists("uniqueLabel", $responseExotics[$item]["equippingBlock"]) && $responseExotics[$item]["equippingBlock"]["uniqueLabel"]=="exotic_armor") {
                        // filter each armor only once (has collectibleHash field)
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
                                                                
return array($exoticWeapons, $exoticArmor);
}
?>