<!DOCTYPE HTML>
<html>
<head>
    <title>D2 TeamInv</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- font -->
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap" rel="stylesheet" type="text/css">
    <!-- favicon -->
        <link rel="apple-touch-icon" sizes="180x180" href="css/images/ico/favicon180.png">
        <link rel="icon" type="image/png" sizes="32x32" href="css/images/ico/favicon32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="css/images/ico/favicon16.png">
    <!-- java script -->
    <!-- css -->
        <link rel="stylesheet" href="css/style.css">
    	<link rel="stylesheet" href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css"/>
</head>

<body>
<?php
     include("incSidebar.html");
?>
<div id="main">
<?php
// get API key from file (as $apiKey)
    require_once ('config.php');
// set options for curl sessions
    $options = array(	CURLOPT_HTTPGET => true,
    					CURLOPT_HTTPHEADER => array('X-API-Key: ' . $apiKey),
    					CURLOPT_RETURNTRANSFER => true
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
    $responseAccDetail = json_decode($response_jsonAccDetail, true);
    // save relevant info
    $playerName = $responseAccDetail["Response"]["searchResults"]["0"]["destinyMemberships"][0]["displayName"];
    $playerID = $responseAccDetail["Response"]["searchResults"]["0"]["destinyMemberships"][0]["membershipId"];
    $playerMembershipType = $responseAccDetail["Response"]["searchResults"]["0"]["destinyMemberships"][0]["membershipType"];

// get details for collectibles
    // url for api request
    $urlProfile = 'https://www.bungie.net/Platform/Destiny2/' . $playerMembershipType . '/Profile/' . $playerID . '/?components=900'; // 900 = records (triumphs)
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
    $responseProfile = json_decode($response_jsonProfile, true); 
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
                    $responseChar = json_decode($response_jsonChar, true);
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
    $responseExotics = json_decode($response_jsonExotics, true);
    
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
                                    // translate item category hashes to names 
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
                        return strcmp($item1['weaponSubtype'], $item2['weaponSubtype']);
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
    $responseCollectibles = json_decode($response_jsonCollectibles, true);

// MAIN OUTPUT
echo "<h1>" . $playerName . "</h1>";
echo "<br>";
echo "<table style='width:100%; text-align:center'>";
echo "<tr>";
        // character emblems
        echo ($characterID1!=0? "<td><div style='width: 474px; height: 96px; position: relative; display: flex; justify-content: end'><img src='" . $charBannerURL1 . "'><div style='position: absolute; top: 10%; left: 30%; font-weight: 400; font-size: 1.5rem; text-shadow: 0.05rem 0.05rem #11101d''>" . $charClass1 . "</div><div style='position: absolute; top: 10%; right: 10%; font-weight: 400; font-size: 2rem; color: #FFFF97; text-shadow: 0.05rem 0.05rem #11101d'> &#10023; " . $charLightLvl1 . "</div></div></td>":"");
        echo ($characterID2!=0? "<td><div style='width: 474px; height: 96px; position: relative; display: flex; justify-content: end'><img src='" . $charBannerURL2 . "'><div style='position: absolute; top: 10%; left: 30%; font-weight: 400; font-size: 1.5rem; text-shadow: 0.05rem 0.05rem #11101d''>" . $charClass2 . "</div><div style='position: absolute; top: 10%; right: 10%; font-weight: 400; font-size: 2rem; color: #FFFF97; text-shadow: 0.05rem 0.05rem #11101d'> &#10023; " . $charLightLvl2 . "</div></div></td>":"");
        echo ($characterID3!=0? "<td><div style='width: 474px; height: 96px; position: relative; display: flex; justify-content: end'><img src='" . $charBannerURL3 . "'><div style='position: absolute; top: 10%; left: 30%; font-weight: 400; font-size: 1.5rem; text-shadow: 0.05rem 0.05rem #11101d''>" . $charClass3 . "</div><div style='position: absolute; top: 10%; right: 10%; font-weight: 400; font-size: 2rem; color: #FFFF97; text-shadow: 0.05rem 0.05rem #11101d'> &#10023; " . $charLightLvl3 . "</div></div></td>":"");
    echo "</tr>";
echo "</table>";
echo "<br>";
echo "<h1>Erlangte exotische Waffen</h1>";
echo "<table style='width:100%; text-align:center'>";
    // Kinetic
    echo "<tr><td><h2>Kinetik</h2></td></tr>";
    echo "<tr>";
        echo"<td>";
        foreach ($exoticWeaponsKinetic as $exoticWeapon) {
                    echo "<div style='float: left; z-index: 0 height: 80px; width: 80px; position: relative'><img src='" . $exoticWeapon["iconURL"] . "'  title='" . $exoticWeapon["name"] . " (" . $exoticWeapon["weaponSubtype"] . ")' width='70px', height='70px', style='vertical-align: middle; margin: 5px 5px; border-radius: 10%'><div style='position:absolute; z-index: 1; top: 0; right: 0'>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState = $responseCollectibles["Response"]["profileCollectibles"]["data"]["collectibles"][$exoticWeapon["collectionID"]]["state"];
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if ($checkState==0 || $checkState == 16 || $checkState == 32 || $checkState == 64) {
                            echo "<img src='img/check.png' width='20px', height='20px'>";
                        }
                        else {
                            echo "<img src='img/cross.png' width='20px', height='20px'>";
                        }
                    echo "</div></div>";
            }
        unset($exoticWeapon); // delete reference to last item
        echo"</td>";
    echo "</tr>";
    // Energy
    echo "<tr><td><h2>Energie</h2></td></tr>";
    echo "<tr>";
        echo"<td>";
        foreach ($exoticWeaponsEnergy as $exoticWeapon) {
                    echo "<div style='float: left; z-index: 0 height: 80px; width: 80px; position: relative'><img src='" . $exoticWeapon["iconURL"] . "' title='" . $exoticWeapon["name"] . " (" . $exoticWeapon["weaponSubtype"] . ")' width='70px', height='70px', style='vertical-align: middle; margin: 5px 5px; border-radius: 10%'><div style='position:absolute; z-index: 1; top: 0; right: 0'>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState = $responseCollectibles["Response"]["profileCollectibles"]["data"]["collectibles"][$exoticWeapon["collectionID"]]["state"];
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if ($checkState==0 || $checkState == 16 || $checkState == 32 || $checkState == 64) {
                            echo "<img src='img/check.png' width='20px', height='20px'>";
                        }
                        else {
                            echo "<img src='img/cross.png' width='20px', height='20px'>";
                        }
                    echo "</div></div>";
            }
        unset($exoticWeapon); // delete reference to last item
        echo"</td>";
    echo "</tr>";
    // Power
    echo "<tr><td><h2>Power</h2></td></tr>";
    echo "<tr>";
        echo"<td>";
        foreach ($exoticWeaponsPower as $exoticWeapon) {
                    echo "<div style='float: left; z-index: 0 height: 80px; width: 80px; position: relative'><img src='" . $exoticWeapon["iconURL"] . "' title='" . $exoticWeapon["name"] . " (" . $exoticWeapon["weaponSubtype"] . ")' width='70px', height='70px', style='vertical-align: middle; margin: 5px 5px; border-radius: 10%'><div style='position:absolute; z-index: 1; top: 0; right: 0'>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState = $responseCollectibles["Response"]["profileCollectibles"]["data"]["collectibles"][$exoticWeapon["collectionID"]]["state"];
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if ($checkState==0 || $checkState == 16 || $checkState == 32 || $checkState == 64) {
                            echo "<img src='img/check.png' width='20px', height='20px'>";
                        }
                        else {
                            echo "<img src='img/cross.png' width='20px', height='20px'>";
                        }
                    echo "</div></div>";
            }
        unset($exoticWeapon); // delete reference to last item
        echo"</td>";
    echo "</tr>";
echo "</table>";
echo "<br>";
echo "<h1>Erlangte exotische Ausr&uuml;stung</h1>";
echo "<table style='width:100%; text-align:center'>";
    echo "<tr><th><h2>Titan</h2></th><th><h2>J&auml;ger</h2></th><th><h2>Warlock</h2></th></tr>";
    // Helm
    echo "<tr>";
        // Titan
        echo"<td>";
        foreach ($exoticArmorTitan["Helm"] as $exoticArmorItems) {
                    echo "<div style='float: left; z-index: 0 height: 80px; width: 80px; position: relative'><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "' width='70px', height='70px', style='vertical-align: middle; margin: 5px 5px; border-radius: 10%'><div style='position:absolute; z-index: 1; top: 0; right: 0'>";
                    // check if armor is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img src='img/check.png' width='20px', height='20px'>";
                        }
                        else {
                            echo "<img src='img/cross.png' width='20px', height='20px'>";
                        }
                    echo "</div></div>";
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
        // Jäger
        echo"<td>";
        foreach ($exoticArmorHunter["Helm"] as $exoticArmorItems) {
                    echo "<div style='float: left; z-index: 0 height: 80px; width: 80px; position: relative'><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "' width='70px', height='70px', style='vertical-align: middle; margin: 5px 5px; border-radius: 10%'><div style='position:absolute; z-index: 1; top: 0; right: 0'>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img src='img/check.png' width='20px', height='20px'>";
                        }
                        else {
                            echo "<img src='img/cross.png' width='20px', height='20px'>";
                        }
                    echo "</div></div>";
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
        // Warlock
        echo"<td>";
        foreach ($exoticArmorWarlock["Helm"] as $exoticArmorItems) {
                    echo "<div style='float: left; z-index: 0 height: 80px; width: 80px; position: relative'><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "' width='70px', height='70px', style='vertical-align: middle; margin: 5px 5px; border-radius: 10%'><div style='position:absolute; z-index: 1; top: 0; right: 0'>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img src='img/check.png' width='20px', height='20px'>";
                        }
                        else {
                            echo "<img src='img/cross.png' width='20px', height='20px'>";
                        }
                    echo "</div></div>";
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
    echo "</tr>";
    // Panzerhandschuhe
    echo "<tr>";
        // Titan
        echo"<td>";
        foreach ($exoticArmorTitan["Panzerhandschuhe"] as $exoticArmorItems) {
                    echo "<div style='float: left; z-index: 0 height: 80px; width: 80px; position: relative'><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "' width='70px', height='70px', style='vertical-align: middle; margin: 5px 5px; border-radius: 10%'><div style='position:absolute; z-index: 1; top: 0; right: 0'>";
                    // check if armor is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img src='img/check.png' width='20px', height='20px'>";
                        }
                        else {
                            echo "<img src='img/cross.png' width='20px', height='20px'>";
                        }
                    echo "</div></div>";
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
        // Jäger
        echo"<td>";
        foreach ($exoticArmorHunter["Panzerhandschuhe"] as $exoticArmorItems) {
                    echo "<div style='float: left; z-index: 0 height: 80px; width: 80px; position: relative'><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "' width='70px', height='70px', style='vertical-align: middle; margin: 5px 5px; border-radius: 10%'><div style='position:absolute; z-index: 1; top: 0; right: 0'>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img src='img/check.png' width='20px', height='20px'>";
                        }
                        else {
                            echo "<img src='img/cross.png' width='20px', height='20px'>";
                        }
                    echo "</div></div>";
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
        // Warlock
        echo"<td>";
        foreach ($exoticArmorWarlock["Panzerhandschuhe"] as $exoticArmorItems) {
                    echo "<div style='float: left; z-index: 0 height: 80px; width: 80px; position: relative'><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "' width='70px', height='70px', style='vertical-align: middle; margin: 5px 5px; border-radius: 10%'><div style='position:absolute; z-index: 1; top: 0; right: 0'>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img src='img/check.png' width='20px', height='20px'>";
                        }
                        else {
                            echo "<img src='img/cross.png' width='20px', height='20px'>";
                        }
                    echo "</div></div>";
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
    echo "</tr>";
    // Brustschutz
    echo "<tr>";
        // Titan
        echo"<td>";
        foreach ($exoticArmorTitan["Brustschutz"] as $exoticArmorItems) {
                    echo "<div style='float: left; z-index: 0 height: 80px; width: 80px; position: relative'><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "' width='70px', height='70px', style='vertical-align: middle; margin: 5px 5px; border-radius: 10%'><div style='position:absolute; z-index: 1; top: 0; right: 0'>";
                    // check if armor is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img src='img/check.png' width='20px', height='20px'>";
                        }
                        else {
                            echo "<img src='img/cross.png' width='20px', height='20px'>";
                        }
                    echo "</div></div>";
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
        // Jäger
        echo"<td>";
        foreach ($exoticArmorHunter["Brustschutz"] as $exoticArmorItems) {
                    echo "<div style='float: left; z-index: 0 height: 80px; width: 80px; position: relative'><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "' width='70px', height='70px', style='vertical-align: middle; margin: 5px 5px; border-radius: 10%'><div style='position:absolute; z-index: 1; top: 0; right: 0'>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img src='img/check.png' width='20px', height='20px'>";
                        }
                        else {
                            echo "<img src='img/cross.png' width='20px', height='20px'>";
                        }
                    echo "</div></div>";
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
        // Warlock
        echo"<td>";
        foreach ($exoticArmorWarlock["Brustschutz"] as $exoticArmorItems) {
                    echo "<div style='float: left; z-index: 0 height: 80px; width: 80px; position: relative'><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "' width='70px', height='70px', style='vertical-align: middle; margin: 5px 5px; border-radius: 10%'><div style='position:absolute; z-index: 1; top: 0; right: 0'>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img src='img/check.png' width='20px', height='20px'>";
                        }
                        else {
                            echo "<img src='img/cross.png' width='20px', height='20px'>";
                        }
                    echo "</div></div>";
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
    echo "</tr>";
    // Beinschutz
    echo "<tr>";
        // Titan
        echo"<td>";
        foreach ($exoticArmorTitan["Beinschutz"] as $exoticArmorItems) {
                    echo "<div style='float: left; z-index: 0 height: 80px; width: 80px; position: relative'><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "' width='70px', height='70px', style='vertical-align: middle; margin: 5px 5px; border-radius: 10%'><div style='position:absolute; z-index: 1; top: 0; right: 0'>";
                    // check if armor is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img src='img/check.png' width='20px', height='20px'>";
                        }
                        else {
                            echo "<img src='img/cross.png' width='20px', height='20px'>";
                        }
                    echo "</div></div>";
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
        // Jäger
        echo"<td>";
        foreach ($exoticArmorHunter["Beinschutz"] as $exoticArmorItems) {
                    echo "<div style='float: left; z-index: 0 height: 80px; width: 80px; position: relative'><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "' width='70px', height='70px', style='vertical-align: middle; margin: 5px 5px; border-radius: 10%'><div style='position:absolute; z-index: 1; top: 0; right: 0'>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img src='img/check.png' width='20px', height='20px'>";
                        }
                        else {
                            echo "<img src='img/cross.png' width='20px', height='20px'>";
                        }
                    echo "</div></div>";
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
        // Warlock
        echo"<td>";
        foreach ($exoticArmorWarlock["Beinschutz"] as $exoticArmorItems) {
                    echo "<div style='float: left; z-index: 0 height: 80px; width: 80px; position: relative'><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "' width='70px', height='70px', style='vertical-align: middle; margin: 5px 5px; border-radius: 10%'><div style='position:absolute; z-index: 1; top: 0; right: 0'>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img src='img/check.png' width='20px', height='20px'>";
                        }
                        else {
                            echo "<img src='img/cross.png' width='20px', height='20px'>";
                        }
                    echo "</div></div>";
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
    echo "</tr>";
echo "</table>";
?>
</div>
</body>
</html>