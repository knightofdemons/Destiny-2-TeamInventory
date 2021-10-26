<?php
include './scripts/getDataLibrary.php';
$profileData = getProfile($_GET["account"]);
$exoticData = crawlExos();

$playerName = $profileData[0]["Response"]["searchResults"]["0"]["destinyMemberships"][0]["displayName"];
$playerID = $profileData[0]["Response"]["searchResults"]["0"]["destinyMemberships"][0]["membershipId"];
$playerMembershipType = $profileData[0]["Response"]["searchResults"]["0"]["destinyMemberships"][0]["membershipType"];
$characterID1 = (array_key_exists(0, array_keys($profileData[1]["Response"]["characterRecords"]["data"]))?array_keys($profileData[1]["Response"]["characterRecords"]["data"])[0]:0);
$characterID2 = (array_key_exists(1, array_keys($profileData[1]["Response"]["characterRecords"]["data"]))?array_keys($profileData[1]["Response"]["characterRecords"]["data"])[1]:0);
$characterID3 = (array_key_exists(2, array_keys($profileData[1]["Response"]["characterRecords"]["data"]))?array_keys($profileData[1]["Response"]["characterRecords"]["data"])[2]:0);

for ($i = 1; $i <= 3; $i++) {
	// only if character is existant
	if (${"characterID" . $i} != 0) {
		$charData[$i] = getChar(${"characterID" . $i}, $playerMembershipType, $playerID);
		
		$charBannerURL[$i] = 'https://www.bungie.net' . $charData[$i]["Response"]["character"]["data"]["emblemBackgroundPath"];
		$charLightLvl[$i] = $charData[$i]["Response"]["character"]["data"]["light"];
		$charClass[$i] = $charData[$i]["Response"]["character"]["data"]["classType"];
			if ($charClass[$i] == 0) {
					$charClass[$i] = "Titan";
			} elseif($charClass[$i] == 1) {
					$charClass[$i] = "J&auml;ger";
			} elseif ($charClass[$i] == 2) {
					$charClass[$i] = "Warlock";
			}
	}
}

	// split weapons by type
	$exoticWeaponsKinetic = array_filter($exoticData[0], function ($value) { return ($value["weaponType"] == "Kinetik"); });
	$exoticWeaponsEnergy = array_filter($exoticData[0], function ($value) { return ($value["weaponType"] == "Energie"); });
	$exoticWeaponsPower = array_filter($exoticData[0], function ($value) { return ($value["weaponType"] == "Power"); });
	// sort weapons by subtype
	function sortBySubtype($item1, $item2) { return strcmp($item1['weaponSubtype'], $item2['weaponSubtype']); }
	usort($exoticWeaponsKinetic, 'sortBySubtype');
	usort($exoticWeaponsEnergy, 'sortBySubtype');
	usort($exoticWeaponsPower, 'sortBySubtype');
	
	// split armor by class
	$exoticArmorWarlockTemp = array_filter($exoticData[1], function ($value) { return ($value["armorClass"] == 21); });                                        
	$exoticArmorTitanTemp = array_filter($exoticData[1], function ($value) { return ($value["armorClass"] == 22); });
	$exoticArmorHunterTemp = array_filter($exoticData[1], function ($value) { return ($value["armorClass"] == 23); });
	// sort armor by type
	function sortByType($input,$sortkey){ foreach ($input as $key=>$val) $output[$val[$sortkey]][]=$val; return $output; }
	$exoticArmorWarlock = sortByType($exoticArmorWarlockTemp,'armorType');
	$exoticArmorTitan = sortByType($exoticArmorTitanTemp,'armorType');
	$exoticArmorHunter = sortByType($exoticArmorHunterTemp,'armorType');
	

			

$exoticWeaponArray = array();
$exoticWeaponArray[] = $exoticWeaponsKinetic;
$exoticWeaponArray[] = $exoticWeaponsEnergy;
$exoticWeaponArray[] = $exoticWeaponsPower;
	
$exoticArmorArray = array();
$exoticArmorArray[] = $exoticArmorHunter;
$exoticArmorArray[] = $exoticArmorTitan;
$exoticArmorArray[] = $exoticArmorWarlock;



echo "<ul class='list-header'>";
echo "<li class='list-header-playername'>" . $playerName . "</li>";
echo "<li class='list-header-char'>";
        // character emblems
        echo ($characterID1!=0? "<div class='list-char-img'><img src='" . $charBannerURL[1] . "'><div class='list-char-cls'>" . $charClass[1] . "</div><div class='list-char-pwr'> &#10023; " . $charLightLvl[1] . "</div></div>":"");
        echo ($characterID2!=0? "<div class='list-char-img'><img src='" . $charBannerURL[2] . "'><div class='list-char-cls'>" . $charClass[2] . "</div><div class='list-char-pwr'> &#10023; " . $charLightLvl[2] . "</div></div>":"");
        echo ($characterID3!=0? "<div class='list-char-img'><img src='" . $charBannerURL[3] . "'><div class='list-char-cls'>" . $charClass[3] . "</div><div class='list-char-pwr'> &#10023; " . $charLightLvl[3] . "</div></div>":"");
echo "</li>";
echo "</ul>";

//Weapons
echo "<ul class='list-weapons'>";
foreach ($exoticWeaponArray as $i => $value) {
	echo "<li class='list-header-catergory'>" . $exoticWeaponArray[$i][0]["weaponType"] . "</li>";
	echo "<li>";
		foreach ($exoticWeaponArray[$i] as $exoticWeapon) {
					echo "<div class='itemFrame'><img class='itemImage' src='" . $exoticWeapon["iconURL"] . "'  title='" . $exoticWeapon["name"] . " (" . $exoticWeapon["weaponSubtype"] . ")'></img>";
					// check if weapon is achieved and overlay a check mark or cross over the image
						$checkState = $profileData[2]["Response"]["profileCollectibles"]["data"]["collectibles"][$exoticWeapon["collectionID"]]["state"];
						// state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
						if ($checkState==0 || $checkState == 16 || $checkState == 32 || $checkState == 64) {
							echo "<img class='chk_img' src='../img/check.png'></img></div>";
						}
						else {
							echo "<img class='chk_img' src='../img/cross.png'></img></div>";
						}
		}
		unset($exoticWeapon); // delete reference to last item
	echo "</li>";
}
echo "</ul>";
unset($i); // delete reference to last item

//Armor
echo "<ul class='list-armor'>";
foreach ($exoticArmorArray as $exoticArmorArrayClass) {
		foreach ($exoticArmorArray[$exoticArmorArrayClass] as $exoticArmorArrayClassType => $value) {
			echo "<li class='list-header-catergory'>" . var_dump($exoticArmorArrayClassType) . "</li>";
				echo "<li>";
					foreach ($exoticArmorArray[$exoticArmorArrayClass][$exoticArmorArrayClassType] as $exoticArmorItems) {
								echo "<div class='itemFrame'><img class='itemImage' src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "'>";
								// check if armor is achieved and overlay a check mark or cross over the image
									$checkState1 = ($characterID1!=0?$profileData[2]["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
									$checkState2 = ($characterID2!=0?$profileData[2]["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
									$checkState3 = ($characterID3!=0?$profileData[2]["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
									// state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
									if (array_key_exists($exoticArmorItems["collectionID"], $profileData[2]["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
										echo "<img class='chk_img' src='../img/check.png'></img></div>";
									}
									else {
										echo "<img class='chk_img' src='../img/cross.png'></img></div>";
									}
						}
					unset($exoticArmorItems); // delete reference to last item
			}
			echo "</li>";
}
echo "</ul>";
?>