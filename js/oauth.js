var popOauth;

function openOauthPopup() {
	localStorage.setItem('oauthWatcher', false);
	rqURL = "https://www.bungie.net/en/OAuth/Authorize?client_id=38180&response_type=code";
	popOauth = window.open(rqURL, "winOauth", "popup, left=200px,top=200px,width=580px,height=700px");
	popOauth.addEventListener('storage', function(e) {
		if(localStorage.getItem('oauthWatcher') && localStorage.getItem('oauthCode')) {
			// Reload authorization code from LocalStorage
			localStorage.removeItem('oauthWatcher');
		}
	});

	// Authorize/Redirect Window
	if (localStorage.getItem('oauthWatcher') && localStorage.getItem('oauthCode')) {
		loginFr = document.getElementById("loginFrame");
		loginFr.parentNode.removeChild(loginFr);
		localStorage.removeItem('oauthWatcher');
		popOauth.close();
	}
}

