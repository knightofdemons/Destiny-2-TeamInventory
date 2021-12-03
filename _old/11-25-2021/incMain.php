<?php
// decodes js escape() to utf8
function to_utf8($string) {
            if ( preg_match('%^(?:
                  [\x09\x0A\x0D\x20-\x7E]            # ASCII
                | [\xC2-\xDF][\x80-\xBF]             # non-overlong 2-byte
                | \xE0[\xA0-\xBF][\x80-\xBF]         # excluding overlongs
                | [\xE1-\xEC\xEE\xEF][\x80-\xBF]{2}  # straight 3-byte
                | \xED[\x80-\x9F][\x80-\xBF]         # excluding surrogates
                | \xF0[\x90-\xBF][\x80-\xBF]{2}      # planes 1-3
                | [\xF1-\xF3][\x80-\xBF]{3}          # planes 4-15
                | \xF4[\x80-\x8F][\x80-\xBF]{2}      # plane 16
                )*$%xs', $string) ) {
                        return $string;
                    } else {
                        return iconv( 'CP1252', 'UTF-8', $string);
                    }
                }
                
// QUERIES
if(isset($_GET["account"])) {
    
        if(isset($_POST['playerDetails']))
        {
             // get data from ajax post
            $playerDetails = json_decode(to_utf8($_POST['playerDetails']), true);
            $playerCounter = $_POST['playerCounter'];
        }
    
    // make queries if account is set in url
    include("incQueries.php");
    
    // accumulate all infos
    if (!isset($playerCounter)) {$playerCounter = 0;}
    $playerDetails[$playerCounter] = [
                "playerName" => $playerName,
                "playerPlatform" => $playerMembershipType,
                "charOrder" => $charOrderNo,
                "characterID1" => $characterID1,
                "characterID2" => $characterID2,
                "characterID3" => $characterID3,
                "charBannerURL1" => $charBannerURL1,
                "charBannerURL2" => $charBannerURL2,
                "charBannerURL3" => $charBannerURL3,
                "charClass1" => $charClass1,
                "charClass2" => $charClass2,
                "charClass3" => $charClass3,
                "charLightLvl1" => $charLightLvl1,
                "charLightLvl2" => $charLightLvl2,
                "charLightLvl3" => $charLightLvl3,
                "charLightLvl1" => $charLightLvl1,
                "charStats1" => $charStats1,
                "charStats2" => $charStats2,
                "charStats3" => $charStats3,
                "exoticWeaponsSorted" => $exoticWeaponsSorted,
                "exoticArmorSorted" => $exoticArmorSorted,
                "allItemsGrouped" => $allItemsGrouped,
                "vaultItemsGrouped" => $vaultItemsGrouped,
                "noCharacters" => $noCharacters,
                "itemPrivacy" => $itemPrivacy,
                ];
                
    // check if player name is valid
    if (isset($playerDetails[$playerCounter]["playerName"])) {
        echo "<a class='topLink' onclick='jumpTo(\"top\")'><i class='bx bxs-up-arrow-square'></i></a>";
        // OUTPUT
        echo "<div class='playerWrapper' id='" . $playerDetails[$playerCounter]["playerName"] . "'>";
        echo "<span id='" . $playerDetails[$playerCounter]["playerName"] . "_top'></span>";
        echo "<div class='button' id='button' onclick='addPlayer(\"" . $playerDetails[$playerCounter]["playerName"] . "\")'><div id='slide'></div><a><i class='bx bx-heart'></i><span class='links_name'>" . "&ensp;zur Liste" . "</span></a></div>";
        echo "<h4>" . $playerDetails[$playerCounter]["playerName"] . "<img src='img/logo" . ($playerDetails[$playerCounter]["playerPlatform"]==1?"Xbox":($playerDetails[$playerCounter]["playerPlatform"]==2?"Playstation":($playerDetails[$playerCounter]["playerPlatform"]==5?"Stadia":"Steam"))) . ".svg' width='20' height='20'></h4>";
        echo "<br>";
        echo "<table>";
            echo "<tr>";
                // character emblems
                for ($i = 1; $i <= $noCharacters; $i++) {
                    $charNo = array_search ($i, $playerDetails[$playerCounter]["charOrder"]); 
                    echo "<td><div class='charEmblemImg'><img src='" . $playerDetails[$playerCounter]["charBannerURL" . $charNo] . "'><div class='charEmblemClass'>" . $playerDetails[$playerCounter]["charClass" . $charNo] . "</div><div class='charEmblemLvl'> &#10023; " . $playerDetails[$playerCounter]["charLightLvl" . $charNo] . "</div></div><br />";
                    echo "<div class='charStats'>";                    
                    foreach ($playerDetails[$playerCounter]["charStats" . $charNo] as $key => $value) {
                        echo "<img src=" . $allStats[$key]["iconURL"] . " title=" . $allStats[$key]["name"] . " />" . $value;
                    }
                    echo "</div>";
                    echo "</td>";
                }
            echo "</tr>";
        echo "</table>";
        echo "<br>";
        echo "<h1 id='" . $playerDetails[$playerCounter]["playerName"] . "_exoticWeapons'>Erlangte exotische Waffen</h1>";
        echo "<table>";
            foreach ($playerDetails[$playerCounter]["exoticWeaponsSorted"] as $category => &$items){
                    echo "<tr><td><h2>" . $category . "</h2></td></tr>";
                    echo "<tr>";
                        echo"<td>";
                        foreach ($items as &$exoticWeapon) {
                                    echo "<div class='itemIconContainer'>";
                                    // check if weapon is achieved and overlay a check mark or cross over the image
                                        $checkState = $responseCollectibles["Response"]["profileCollectibles"]["data"]["collectibles"][$exoticWeapon["collectionID"]]["state"];
                                        // states: https://bungie-net.github.io/multi/schema_Destiny-DestinyCollectibleState.html#schema_Destiny-DestinyCollectibleState
                                        // 0 = none, 1 = not acquired, 2 = obscured, 4 = invisible, 8 = cannot afford material, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                                        // states can be added! --> all odd numbers = not obtained, all even numbers = obtained
                                            if ($checkState % 2 == 0) {
                                                $check="check";
                                            }
                                            else {
                                                $check="cross";
                                            }
                                    echo "<img src='" . $exoticWeapon["iconURL"] . "'  title='" . $exoticWeapon["name"] . " (" . $exoticWeapon["weaponSubtype"] . ")' class='" . $check . "'>";
                                    echo "<div class='itemIconStatus'>"; 
                                        echo "<img src='img/" . $check . ".png'>";
                                    echo "</div>";
                                    echo "</div>";
                            }
                        unset($exoticWeapon); // delete reference to last item
                        echo"</td>";
                    echo "</tr>";
                }
             unset($items); // delete reference to last item
        echo "</table>";
        echo "<br>";
        echo "<h1 id='" . $playerDetails[$playerCounter]["playerName"] . "_exoticArmor'>Erlangte exotische Ausr&uuml;stung</h1>";
        echo "<table>";
            // Character classes
            echo "<tr><th><h2>" . array_keys($playerDetails[$playerCounter]["exoticArmorSorted"])[0] . "</h2></th><th><h2>" . array_keys($playerDetails[$playerCounter]["exoticArmorSorted"])[1] . "</h2></th><th><h2>" . array_keys($playerDetails[$playerCounter]["exoticArmorSorted"])[2] . "</h2></th></tr>";
            $armorTypes = ["Helm","Panzerhandschuhe","Brustschutz","Beinschutz"]; // !!! aktuell nur de
            // loop for armorTypes
            foreach ($armorTypes as &$type){
                    echo "<tr>";
                        // loop for Titan, Hunter, Warlock
                        foreach ($playerDetails[$playerCounter]["exoticArmorSorted"] as &$items){
                                echo"<td>";
                                // loop for every item
                                foreach ($items[$type] as &$exoticArmorItems) {
                                            echo "<div class='itemIconContainer'>";
                                            // check if armor is achieved and overlay a check mark or cross over the image
                                                $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                                                $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                                                $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                                                // states: https://bungie-net.github.io/multi/schema_Destiny-DestinyCollectibleState.html#schema_Destiny-DestinyCollectibleState
                                                // 0 = none, 1 = not acquired, 2 = obscured, 4 = invisible, 8 = cannot afford material, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                                                // states can be added! --> all odd numbers = not obtained, all even numbers = obtained
                                                if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1 % 2 == 0 || $checkState2 % 2 == 0 || $checkState3 % 2 == 0)) {
                                                    $check="check";
                                                }
                                                else {
                                                    $check="cross";
                                                }
                                            echo "<img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "' class='" . $check . "'>";
                                            echo "<div class='itemIconStatus'>";
                                                echo "<img src='img/" . $check . ".png'>";
                                            echo "</div>";
                                            echo "</div>";
                                    }
                                unset($exoticArmorItems); // delete reference to last item
                                echo"</td>";
                            }
                         unset($items); // delete reference to last item
                    echo "</tr>";
                }
            unset($type); // delete reference to last item
        echo "</table>";
        echo "<br>";
        echo "<h1 id='" . $playerDetails[$playerCounter]["playerName"] . "_characterItems'>Charakter Items</h1>";
        echo "<table>";
                // Characters classes
                echo "<tr>";
                    // character emblems
                    for ($i = 1; $i <= $noCharacters; $i++) {
                        $charNo = array_search ($i, $playerDetails[$playerCounter]["charOrder"]);
                        echo "<td><div class='charEmblemImg'><img src='" . $playerDetails[$playerCounter]["charBannerURL" . $charNo] . "'><div class='charEmblemClass'>" . $playerDetails[$playerCounter]["charClass" . $charNo] . "</div><div class='charEmblemLvl'> &#10023; " . $playerDetails[$playerCounter]["charLightLvl" . $charNo] . "</div></div></td>";
                    }
                echo "</tr>";
                for ($j = 0; $j <= 7; $j++) {
                        echo "<tr>";
                        // loop for three characters
                            for ($i = 1; $i <= $noCharacters; $i++){
                                    $charNo = array_search ($i, $playerDetails[$playerCounter]["charOrder"]);
                                    echo"<td>";
                                    $itemcounter = 1;
                                    $firstitem = 1;
                                    // loop for every item
                                    foreach ($playerDetails[$playerCounter]["allItemsGrouped"][$j] as &$charitems) {
                                        if ($itemcounter == 1){
                                            echo "<h2>" . $charitems["bucketName"] . "</h2>";
                                        }
                                        // only items for character no..
                                        if ($charitems["charNo"]==$charNo){ 
                                            echo "<div class='itemIconContainer'>";
                                            echo "<img src='" . $charitems["iconURL"] . "'  title='" . $charitems["name"] . " (" . $charitems["category"] . ")' id='no" . $firstitem . "'>";
                                            echo "</div>";
                                            $firstitem++;
                                        }
                                        $itemcounter++;  
                                    }
                                    unset($charitems); // delete reference to last item
                                    echo"</td>";
                            }
                        echo "</tr>";
                }        
        echo "</table>";
        if ($playerDetails[$playerCounter]["itemPrivacy"] == 0) {
            echo "<br>";
            echo "<h1 id='" . $playerDetails[$playerCounter]["playerName"] . "_vaultItems'>Tresor Items (ohne Exotics)</h1>";
            echo '<h3 style="text-align: center;"><span style="font-weight: 600;">HINWEIS: </span>Das sonstige Inventar des Spielers ist nicht &ouml;ffentlich sichtbar (einstellbar <a href="https://www.bungie.net/7/de/User/Account/Privacy" style="text-decoration: underline;" target="_blank">unter diesem Link</a> <i class="bx bx-info-circle"><span class="info"><img src="img/bungie-info.png"></img></span></i>).</h3>';
        } else {
            echo "<br>";
            echo "<h1 id='" . $playerDetails[$playerCounter]["playerName"] . "_vaultItems'>Tresor Items (ohne Exotics)</h1>";
            echo "<table>";
                    for ($j = 0; $j <= 7; $j++) {
                            echo "<tr>";
                                echo"<td>";
                                $itemcounter = 1;
                                // loop for every item
                                foreach ($playerDetails[$playerCounter]["vaultItemsGrouped"][$j] as &$vaultitems) {
                                    if ($itemcounter == 1){
                                        echo "<h2>" . $vaultitems["bucketName"] . "</h2>";
                                    }
                                    echo "<div class='itemIconContainer'>";
                                    echo "<img src='" . $vaultitems["iconURL"] . "'  title='" . $vaultitems["name"] . " (" . $vaultitems["category"] . ")' id='no" . $firstitem . "'>";
                                    echo "</div>";
                                    $itemcounter++;
                                }
                                unset($vaultitems); // delete reference to last item
                                echo"</td>";
                            echo "</tr>";
                    }
            echo "</table>";
        }
        echo "</div>"; // playerWrapper
            // show subnav
            echo "<script type='text/javascript'>showSubNav();</script>";
            // hide last player, if more than one
            if ($playerCounter>0) {
                echo "<script type='text/javascript' defer>hideLastPlayer();</script>";    
            }
            // show first player
            echo "<script type='text/javascript' defer>showFirstPlayer();</script>";
    } else{
        // hide last player, if more than one
        if ($playerCounter>0) {
            echo "<script type='text/javascript' defer>hideLastPlayer();</script>";
        }
        echo "<script type='text/javascript' defer>showFirstPlayer();</script>";
        echo "<div class='playerWrapper'><h1>Spielername ung&uuml;ltig.</h1></div>";
    } // if (isset($playerDetails[$playerCounter]["playerName"]))
    
} else {
    $playerDetails = array();
    $playerCounter = 0;
    echo "<h4>Bitte in der Suchleiste einen g&uuml;ltigen Spielernamen eingeben.</h4>";
} // if isset($_GET["account"])
?>