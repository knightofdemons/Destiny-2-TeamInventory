async function openOauthPopup(){
	closeLoginFrame(); // Close the login frame first
	const apiclientid = '38180';
	rqURL = "https://www.bungie.net/en/OAuth/Authorize?client_id=" + apiclientid + "&response_type=code";
	let popOauth = window.open(rqURL, "TeamInv: Bungie App-Authorization", "popup, left=200px,top=200px,width=580px,height=700px");
	window.addEventListener('message', async function(e) {
		await window.dbOperations.saveOAuthToken(e.data);
		popOauth.close();
		// Remove the problematic DOM removal line - login frame is already hidden by closeLoginFrame()
		// loginFr = document.getElementById("loginFrame");
		// loginFr.parentNode.removeChild(loginFr);
		settingsLogout.classList.toggle("closed");
	}, false);
}
