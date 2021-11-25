<?php
// get API key
    if (isset($_GET["plt"])) {
        $plattform = $_GET["plt"];
    } else {
        $plattform = "0";
    }
$apiKey = $_GET["apikey"];
// set options for curl sessions
    $options = array(	CURLOPT_HTTPGET => true,
    					CURLOPT_HTTPHEADER => array('X-API-Key: ' . $apiKey),
    					CURLOPT_RETURNTRANSFER => true
    				);
// get details for player name
    $account = $_GET["account"];
    $url = 'https://www.bungie.net/Platform/User/Search/Prefix/' . $account . '/'. $plattform .'/';

$ch = curl_init($url);

$options = array(   CURLOPT_HTTPGET => true,
                    CURLOPT_HTTPHEADER => array('X-API-Key: ' . $apiKey),
                    CURLOPT_RETURNTRANSFER => true
                );
                
curl_setopt_array(
                    $ch,
                    $options
                );

$response_json = curl_exec($ch);

curl_close($ch);

$response = json_decode($response_json, true);

echo '<pre>'; print_r($response); echo '</pre>';
?>
