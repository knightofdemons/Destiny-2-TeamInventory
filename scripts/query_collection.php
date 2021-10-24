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
$exoticArmorArray[] = $exoticArmorHunter["Helm"];
$exoticArmorArray[] = $exoticArmorTitan["Helm"];
$exoticArmorArray[] = $exoticArmorWarlock["Helm"];
	
$exoticArmorArray[] = $exoticArmorHunter["Panzerhandschuhe"];
$exoticArmorArray[] = $exoticArmorTitan["Panzerhandschuhe"];
$exoticArmorArray[] = $exoticArmorWarlock["Panzerhandschuhe"];
	
$exoticArmorArray[] = $exoticArmorHunter["Brustschutz"];
$exoticArmorArray[] = $exoticArmorTitan["Brustschutz"];
$exoticArmorArray[] = $exoticArmorWarlock["Brustschutz"];
	
$exoticArmorArray[] = $exoticArmorHunter["Beinschutz"];
$exoticArmorArray[] = $exoticArmorTitan["Beinschutz"];
$exoticArmorArray[] = $exoticArmorWarlock["Beinschutz"];



echo "<ul>";
echo "<li class='list-header-playername'>" . $playerName . "</li>";
echo "<li>";
        // character emblems
        echo ($characterID1!=0? "<div class='list-header-char'><img src='" . $charBannerURL[1] . "'>" . $charClass[1] . "</div> &#10023; " . $charLightLvl[1] . "</div>":"");
        echo ($characterID2!=0? "<div class='list-header-char'><img src='" . $charBannerURL[2] . "'>" . $charClass[2] . "</div> &#10023; " . $charLightLvl[2] . "</div>":"");
        echo ($characterID3!=0? "<div class='list-header-char'><img src='" . $charBannerURL[3] . "'>" . $charClass[3] . "</div> &#10023; " . $charLightLvl[3] . "</div>":"");
echo "</li>";

//Weapons
foreach ($exoticWeaponArray as $i => $value) {
	echo "<li class='list-header-catergory'>" . $i . "</li>";
	echo "<li class='itemFrame'>";
		foreach ($exoticWeaponArray[$i] as $exoticWeapon) {
					echo "<img src='" . $exoticWeapon["iconURL"] . "'  title='" . $exoticWeapon["name"] . " (" . $exoticWeapon["weaponSubtype"] . ")'></img>";
					// check if weapon is achieved and overlay a check mark or cross over the image
						$checkState = $profileData[2]["Response"]["profileCollectibles"]["data"]["collectibles"][$exoticWeapon["collectionID"]]["state"];
						// state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
						if ($checkState==0 || $checkState == 16 || $checkState == 32 || $checkState == 64) {
							echo "<img class='checkmark' src='../img/check.png'></img>";
						}
						else {
							echo "<img class='checkmark' src='../img/cross.png'></img>";
						}
		}
		unset($exoticWeapon); // delete reference to last item
	echo "</li>";
}

//Armor
foreach ($exoticArmorArray as $i => $value) {
	echo "<li class='list-header-catergory'>" . $i . "</li>";
	echo "<li class='list-header-catergory'>KLASSE</li>";
		echo "<li>";
			foreach ($exoticArmorArray[$i] as $exoticArmorItems) {
						echo "<img src='" . $exoticArmorItems["iconURL"] . "'  title='" . $exoticArmorItems["name"] . "'>";
						// check if armor is achieved and overlay a check mark or cross over the image
							$checkState1 = ($characterID1!=0?$profileData[2]["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
							$checkState2 = ($characterID2!=0?$profileData[2]["Response"]["characterCollectibles"]["data"][$characterID2]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
							$checkState3 = ($characterID3!=0?$profileData[2]["Response"]["characterCollectibles"]["data"][$characterID3]["collectibles"][$exoticArmorItems["collectionID"]]["state"]:1); // if character doesn't exist: checkState=1 (= not achieved)
							// state 0 = none, 16 = no room left in inventory, 32 = can't have a second one, 64 = purchase disabled
							if (array_key_exists($exoticArmorItems["collectionID"], $profileData[2]["Response"]["characterCollectibles"]["data"][$characterID1]["collectibles"]) && ($checkState1==0 || $checkState1 == 16 || $checkState1 == 32 || $checkState1 == 64 || $checkState2==0 || $checkState2 == 16 || $checkState2 == 32 || $checkState2 == 64 || $checkState3==0 || $checkState3 == 16 || $checkState3 == 32 || $checkState3 == 64)) {
								echo "<img class='checkmark' src='../img/check.png'></img>";
							}
							else {
								echo "<img class='checkmark' src='../img/cross.png'></img>";
							}
				}
			unset($exoticArmorItems); // delete reference to last item
}
echo "</ul>";
?>