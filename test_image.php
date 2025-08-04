<?php
$apiKey = '688335aba0164d2f9a3bfa1db03b7087';

// Test URLs
$testUrls = [
    'https://www.bungie.net/common/destiny2_content/icons/archetypes/gunner.png',
    'https://www.bungie.net/common/destiny2_content/icons/weapons/outlook/icon_weapon_handcannon_adaptiveframe.png',
    'https://www.bungie.net/common/destiny2_content/icons/weapons/outlook/icon_weapon_handcannon_adaptiveframe.png'
];

foreach ($testUrls as $url) {
    echo "Testing: $url\n";
    
    $ch = curl_init($url);
    $options = array(
        CURLOPT_HTTPGET => true,
        CURLOPT_HTTPHEADER => array(
            'X-API-Key: ' . $apiKey,
            'User-Agent: Destiny-2-TeamInventory/1.0'
        ),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_NOBODY => true,  // HEAD request
        CURLOPT_FOLLOWLOCATION => true
    );
    curl_setopt_array($ch, $options);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    curl_close($ch);
    
    echo "HTTP Code: $httpCode\n";
    echo "Content-Type: $contentType\n";
    echo "---\n";
}
?> 