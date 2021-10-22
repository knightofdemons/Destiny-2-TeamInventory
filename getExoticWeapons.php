<?php
// get API key
$apiKey = 'xxx';
// options for curl sessions
    $options = array(	CURLOPT_HTTPGET => true,
    					CURLOPT_HTTPHEADER => array('X-API-Key: ' . $apiKey),
    					CURLOPT_RETURNTRANSFER => true
    				);

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
                    if (array_key_exists("loreHash", $responseExoticWeapon[$item])) {
                                $weaponID = $item;
                                $weaponName = $responseExoticWeapon[$item]["displayProperties"]["name"];
                                $exoticWeapons[$weaponID] = $weaponName;
                        }
                }
            }
        unset($item); // delete reference to last item
        // sort Weapons by name
        asort($exoticWeapons);

echo '<pre>'; print_r($exoticWeapons); echo '</pre>';
?>