var popOauth;

function openOauthPopup() {
	localStorage.setItem('oauth', false);
	rqURL = "https://www.bungie.net/en/OAuth/Authorize?client_id=38180&response_type=code";
	popOauth = window.open(rqURL, "winOauth", "popup, left=200px,top=200px,width=580px,height=700px");
	popOauth.addEventListener('storage', function(e) {
		if(localStorage.getItem('oauth') && localStorage.getItem('oauth')) {
			// Reload authorization code from LocalStorage
			console.log("call");
			localStorage.removeItem('oauth');
		}
	});

	// Authorize/Redirect Window
	if (localStorage.getItem('oauth')) {
			console.log(popOauth);
		// Save authorization code to LocalStorage and close the tab
		// popOauth.close();
	}
}

async function searchPlayer(inputData){

}

