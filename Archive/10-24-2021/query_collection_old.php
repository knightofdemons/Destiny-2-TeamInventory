<?php
// MAIN OUTPUT
echo "<ul>";
echo "<li class='list-header-playername'>" . $playerName . "</li>";
echo "<li>";
        // character emblems
        echo ($characterID1!=0? "<div class='list-header-char'><img src='" . $charBannerURL1 . "'>" . $charClass1 . "</div> &#10023; " . $charLightLvl1 . "</div>":"");
        echo ($characterID2!=0? "<div class='list-header-char'><img src='" . $charBannerURL2 . "'>" . $charClass2 . "</div> &#10023; " . $charLightLvl2 . "</div>":"");
        echo ($characterID3!=0? "<div class='list-header-char'><img src='" . $charBannerURL3 . "'>" . $charClass3 . "</div> &#10023; " . $charLightLvl3 . "</div>":"");
echo "</li>";
echo "<li class='list-header-catergory'>Erlangte exotische Waffen</li>";
    // Kinetic
    echo "<li class='list-header-catergory'>Kinetik</li>";
    echo "<li class='itemFrame'>";
        foreach ($exoticWeaponsKinetic as $exoticWeapon) {
                    echo "<img src='" . $exoticWeapon["iconURL"] . "'  title='" . $exoticWeapon["name"] . " (" . $exoticWeapon["weaponSubtype"] . ")'></img>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState = $responseCollectibles["Response"]["profileCollectibles"]["data"]["collectibles"][$exoticWeapon["collectionID"]]["state"];
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if ($checkState==0 || $checkState == 16 || $checkState == 32 || $checkState == 64) {
                            echo "<img class='checkmark' src='img/check.png'></img>";
                        }
                        else {
                            echo "<img class='checkmark' src='img/cross.png'></img>";
                        }
            }
			unset($exoticWeapon); // delete reference to last item
    echo "</li>";
    // Energy
    echo "<li class='list-header-catergory'>Energie</li>";
    echo "<li class='itemFrame'>";
        foreach ($exoticWeaponsEnergy as $exoticWeapon) {
                    echo "<img src='" . $exoticWeapon["iconURL"] . "' title='" . $exoticWeapon["name"] . " (" . $exoticWeapon["weaponSubtype"] . ")'></img>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState = $responseCollectibles["Response"]["profileCollectibles"]["data"]["collectibles"][$exoticWeapon["collectionID"]]["state"];
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if ($checkState==0 || $checkState == 16 || $checkState == 32 || $checkState == 64) {
                            echo "<img class='checkmark' src='img/check.png'></img>";
                        }
                        else {
                            echo "<img class='checkmark' src='img/cross.png'></img>";
                        }
            }
			unset($exoticWeapon); // delete reference to last item
    echo "</li>";
    // Power
    echo "<li class='list-header-catergory'>Power</li>";
    echo "<li>";
        foreach ($exoticWeaponsPower as $exoticWeapon) {
                    echo "<img src='" . $exoticWeapon["iconURL"] . "' title='" . $exoticWeapon["name"] . " (" . $exoticWeapon["weaponSubtype"] . ")'></img>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState = $responseCollectibles["Response"]["profileCollectibles"]["data"]["collectibles"][$exoticWeapon["collectionID"]]["state"];
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if ($checkState==0 || $checkState == 16 || $checkState == 32 || $checkState == 64) {
                            echo "<img class='checkmark' src='img/check.png'></img>";
                        }
                        else {
                            echo "<img class='checkmark' src='img/cross.png'></img>";
                        }
            }
			unset($exoticWeapon); // delete reference to last item
    echo "</li>";
echo "</ul>";
echo "<ul>";
echo "<li class='list-header-catergory'>Erlangte exotische Ausr&uuml;stung</li>";
echo "<li class='list-header-catergory'>Warlock</li>";
    // Helm
    echo "<li>";
        // Titan
        echo"<td>";
        foreach ($exoticArmorTitan["Helm"] as $exoticArmorItems) {
                    echo "<div><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "'>";
                    // check if armor is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img class='checkmark' src='img/check.png'></img>";
                        }
                        else {
                            echo "<img class='checkmark' src='img/cross.png'></img>";
                        }
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
        // Jäger
        echo"<td>";
        foreach ($exoticArmorHunter["Helm"] as $exoticArmorItems) {
                    echo "<div><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "'>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img class='checkmark' src='img/check.png'></img>";
                        }
                        else {
                            echo "<img class='checkmark' src='img/cross.png'></img>";
                        }
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
        // Warlock
        echo"<td>";
        foreach ($exoticArmorWarlock["Helm"] as $exoticArmorItems) {
                    echo "<div><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "'>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img class='checkmark' src='img/check.png'></img>";
                        }
                        else {
                            echo "<img class='checkmark' src='img/cross.png'></img>";
                        }
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
    echo "</li>";
    // Panzerhandschuhe
    echo "<li>";
        // Titan
        echo"<td>";
        foreach ($exoticArmorTitan["Panzerhandschuhe"] as $exoticArmorItems) {
                    echo "<div><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "'>";
                    // check if armor is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img class='checkmark' src='img/check.png'></img>";
                        }
                        else {
                            echo "<img class='checkmark' src='img/cross.png'></img>";
                        }
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
        // Jäger
        echo"<td>";
        foreach ($exoticArmorHunter["Panzerhandschuhe"] as $exoticArmorItems) {
                    echo "<div><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "'>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img class='checkmark' src='img/check.png'></img>";
                        }
                        else {
                            echo "<img class='checkmark' src='img/cross.png'></img>";
                        }
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
        // Warlock
        echo"<td>";
        foreach ($exoticArmorWarlock["Panzerhandschuhe"] as $exoticArmorItems) {
                    echo "<div><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "'>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img class='checkmark' src='img/check.png'></img>";
                        }
                        else {
                            echo "<img class='checkmark' src='img/cross.png'></img>";
                        }
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
    echo "</li>";
    // Brustschutz
    echo "<li>";
        // Titan
        echo"<td>";
        foreach ($exoticArmorTitan["Brustschutz"] as $exoticArmorItems) {
                    echo "<div><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "'>";
                    // check if armor is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img class='checkmark' src='img/check.png'></img>";
                        }
                        else {
                            echo "<img class='checkmark' src='img/cross.png'></img>";
                        }
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
        // Jäger
        echo"<td>";
        foreach ($exoticArmorHunter["Brustschutz"] as $exoticArmorItems) {
                    echo "<div><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "'>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img class='checkmark' src='img/check.png'></img>";
                        }
                        else {
                            echo "<img class='checkmark' src='img/cross.png'></img>";
                        }
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
        // Warlock
        echo"<td>";
        foreach ($exoticArmorWarlock["Brustschutz"] as $exoticArmorItems) {
                    echo "<div><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "'>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img class='checkmark' src='img/check.png'></img>";
                        }
                        else {
                            echo "<img class='checkmark' src='img/cross.png'></img>";
                        }
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
    echo "</li>";
    // Beinschutz
    echo "<li>";
        // Titan
        echo"<td>";
        foreach ($exoticArmorTitan["Beinschutz"] as $exoticArmorItems) {
                    echo "<div><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "'>";
                    // check if armor is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img class='checkmark' src='img/check.png'></img>";
                        }
                        else {
                            echo "<img class='checkmark' src='img/cross.png'></img>";
                        }
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
        // Jäger
        echo"<td>";
        foreach ($exoticArmorHunter["Beinschutz"] as $exoticArmorItems) {
                    echo "<div><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "'>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img class='checkmark' src='img/check.png'></img>";
                        }
                        else {
                            echo "<img class='checkmark' src='img/cross.png'></img>";
                        }
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
        // Warlock
        echo"<td>";
        foreach ($exoticArmorWarlock["Beinschutz"] as $exoticArmorItems) {
                    echo "<div><img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "'>";
                    // check if weapon is achieved and overlay a check mark or cross over the image
                        $checkState1 = ($characterID1!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState2 = ($characterID2!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        $checkState3 = ($characterID3!=0?$responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
                        // state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
                        if (array_key_exists($exoticArmorItems["collectionID"], $responseCollectibles["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
                            echo "<img class='checkmark' src='img/check.png'></img>";
                        }
                        else {
                            echo "<img class='checkmark' src='img/cross.png'></img>";
                        }
            }
        unset($exoticArmorItems); // delete reference to last item
        echo"</td>";
    echo "</li>";
echo "</ul>";´
?>