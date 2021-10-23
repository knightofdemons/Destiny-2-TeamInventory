<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="de" lang="de">

<head>
    <title>Stats</title>

    <meta http-equiv="content-type" content="text/html; charset=ISO-8859-1" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <meta name="keywords" content="" />

</head>

<body>
<?php
// get API key
    if (isset($_GET["plt"])) {
        $plattform = $_GET["plt"];
    } else {
        $plattform = "0";
    }
    echo "plattform: " . $olattform;
$apiKey = $_GET["apikey"];
// set options for curl sessions
    $options = array(	CURLOPT_HTTPGET => true,
    					CURLOPT_HTTPHEADER => array('X-API-Key: ' . $apiKey),
    					CURLOPT_RETURNTRANSFER => true
    				);

// get details for player name
    // get player name
    $account = $_GET["account"];
    // url for api request
    $urlAccDetail = 'https://www.bungie.net/Platform/User/Search/Prefix/' . $account . '/'. $plattform .'/';
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

// get details for characters
    // url for api request
    $urlProfile = 'https://www.bungie.net/Platform/Destiny2/' . $playerMembershipType . '/Profile/' . $playerID . '/?components=900'; // 900 = records (triumphs)components=800 for Collectibles
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
    $activeTriumphScore = $responseProfile["Response"]["profileRecords"]["data"]["activeScore"];
    $legacyTriumphScore = $responseProfile["Response"]["profileRecords"]["data"]["legacyScore"];
    $characterID1 = (array_key_exists(0, array_keys($responseProfile["Response"]["characterRecords"]["data"]))?array_keys($responseProfile["Response"]["characterRecords"]["data"])[0]:0); // set character ID = 0, if character not existant
    $characterID2 = (array_key_exists(1, array_keys($responseProfile["Response"]["characterRecords"]["data"]))?array_keys($responseProfile["Response"]["characterRecords"]["data"])[1]:0); // set character ID = 0, if character not existant
    $characterID3 = (array_key_exists(2, array_keys($responseProfile["Response"]["characterRecords"]["data"]))?array_keys($responseProfile["Response"]["characterRecords"]["data"])[2]:0); // set character ID = 0, if character not existant

// get all exotic weapons
    // url for api request
    $urlExoticWeapon = 'https://www.bungie.net/common/destiny2_content/json/de/DestinyInventoryItemLiteDefinition-c8cb3f30-f991-44b8-9f1d-8a25e863bb0e.json';
    // new curl session
    $chExoticWeapon = curl_init($urlExoticWeapon);
    // set options for curl session
    curl_setopt_array(
    					$chExoticWeapon,
    					$options
    				);
    // perform curl session
    $response_jsonExoticWeapon = curl_exec($chExoticWeapon);
    // close curl session
    curl_close($chExoticWeapon);
    // decode json to php array
    $responseExoticWeapon = json_decode($response_jsonExoticWeapon, true);
    // save relevant info
        $exoticType = "exotic_weapon";
        // get all Keys
        $allItemKeys = array_keys($responseExoticWeapon);
        // iterate over all keys (items)
        foreach ($allItemKeys as $item) {
            // filter only exotic weapons
            if ($responseExoticWeapon[$item]["equippingBlock"]["uniqueLabel"]==$exoticType) {
                    // filter each weapon only once (has loreHash field)
                    if (array_key_exists("collectibleHash", $responseExoticWeapon[$item])) {
                                $weaponID = $item;
                                $collectibleID = $responseExoticWeapon[$item]["collectibleHash"];
                                $weaponName = $responseExoticWeapon[$item]["displayProperties"]["name"];
                                $exoticWeapons[] = [
                                                            "name" => $weaponName,
                                                            "collectionID" => $collectibleID,
                                                            "weaponID" => $weaponID
                                                            ];
                        }
                }
            }
        unset($item); // delete reference to last item
        // sort Weapons by name
        sort($exoticWeapons);
        // count exotics
        $exoticWeaponsNo = count($exoticWeapons);

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
    // check collection state (0 = collected, other = not collected) & count collected
    $collectedNo=0;
    foreach ($exoticWeapons as $exoticWeapon) {
                    $checkState = $responseCollectibles["Response"]["profileCollectibles"]["data"]["collectibles"][$exoticWeapon["collectionID"]]["state"];
                    if ($checkState==0 || $checkState == 16 || $checkState == 32 || $checkState == 64) {
                        $collectedNo++;
                    }
            }
    unset($exoticWeapon); // delete reference to last item
    

echo "Name: " . $playerName;
echo "<br>";
echo "Membership-ID: " . $playerID;
echo "<br>";
echo "Active Triumph Score: " . $activeTriumphScore;
echo "<br>";
echo "Legacy Triumph Score: " . $legacyTriumphScore;
echo "<br>";
echo "Character-ID 1: " . $characterID1;
echo "<br>";
echo "Character-ID 2: " . $characterID2;
echo "<br>";
echo "Character-ID 3: " . $characterID3;
echo "<br>";
echo "<table style='width:30%'>";
    echo "<tr>";
        echo "<th> Exotische Waffe </th>";
        echo "<th> Erlangt (" . $collectedNo . "/" . $exoticWeaponsNo . ")</th>";
    echo "</tr>";
        foreach ($exoticWeapons as $exoticWeapon) {
                echo "<tr>";
                    echo "<td>" . $exoticWeapon["name"] . "</td>";
                    $checkState = $responseCollectibles["Response"]["profileCollectibles"]["data"]["collectibles"][$exoticWeapon["collectionID"]]["state"];
                    // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                    if ($checkState==0 || $checkState == 16 || $checkState == 32 || $checkState == 64) {
                        echo "<td>" . "ja" . "</td>";
                    }
                    else {
                        echo "<td>" . "nein" . "</td>";
                    }
                echo "</tr>";
            }
    unset($exoticWeapon); // delete reference to last item
echo "</table>";
echo "<br>";
?>
</body>
</html>
