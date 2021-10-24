<?php

echo "<ul>";
$exoticArray = array(
	"Kinetic" => $exoticWeaponsKinetic,
	"Energy" => $exoticWeaponsEnergy,
	"Power" => $exoticWeaponsPower,
	
	"HunterHelm" => $exoticArmorHunter["Helm"],
	"TitanHelm" => $exoticArmorTitan["Helm"],
	"WarlockHelm" => $exoticArmorWarlock["Helm"],
	
	"HunterHands" => $exoticArmorHunter["Panzerhandschuhe"],
	"TitanHands" => $exoticArmorTitan["Panzerhandschuhe"],
	"WarlockHands" => $exoticArmorWarlock["Panzerhandschuhe"],
	
	"HunterChest" => $exoticArmorHunter["Brustschutz"],
	"TitanChest" => $exoticArmorTitan["Brustschutz"],
	"WarlockChest" => $exoticArmorWarlock["Brustschutz"],
	
	"HunterLegs" => $exoticArmorHunter["Beinschutz"],
	"TitanLegs" => $exoticArmorTitan["Beinschutz"],
	"WarlockLegs" => $exoticArmorWarlock["Beinschutz"]
);

foreach ($exoticArray as $j => $value) {
	echo "<li class='list-header-catergory'>" . $j . "</li>";
	echo "<li class='itemFrame'>";
		foreach ($exoticArray[$i] as $exoticWeapon) {
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
}

echo "</ul>";
?>