<?php
$apiKey = $_GET["apikey"];
$url = 'https://www.bungie.net/Platform/User/Search/Prefix/Hühnchen/0/';

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
