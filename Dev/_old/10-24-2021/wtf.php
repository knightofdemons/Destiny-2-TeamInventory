<?php
		require ('../config.php');
    $options = array(	CURLOPT_HTTPGET => true,
    					CURLOPT_HTTPHEADER => array('X-API-Key: ' . $apiKey),
    					CURLOPT_RETURNTRANSFER => true
    				);
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
?>