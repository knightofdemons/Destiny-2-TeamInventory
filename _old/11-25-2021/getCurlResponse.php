<?php
function getCurlResponse($apiKey,$url) {
        // set options for curl sessions
        $options = array(	CURLOPT_HTTPGET => true,
        					CURLOPT_HTTPHEADER => array('X-API-Key: ' . $apiKey),
        					CURLOPT_RETURNTRANSFER => true
        				);
        // new curl session
        $curlSession = curl_init($url);
        // set options for curl session
        curl_setopt_array(
        					$curlSession,
        					$options
        				);
        // perform curl session
        $response_json = curl_exec($curlSession);
        // close curl session
        curl_close($curlSession);
        // decode json to php array
        $response = json_decode($response_json, true);
        return $response;
    }  
?>