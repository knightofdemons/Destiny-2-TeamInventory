function openOauthPopup(){
	const apiclientid = '38180';
	rqURL = "https://www.bungie.net/en/OAuth/Authorize?client_id=" + apiclientid + "&response_type=code";
	let popOauth = window.open(rqURL, "TeamInv: Bungie App-Authorization", "popup, left=200px,top=200px,width=580px,height=700px");
	window.addEventListener('message', function(e) {
		localStorage.setItem('oauthToken', JSON.stringify(e.data));
		popOauth.close();
		loginFr = document.getElementById("loginFrame");
		loginFr.parentNode.removeChild(loginFr);
		settingsLogout.classList.toggle("closed");
		InitData();
	}, false);
}


if(localStorage.getItem('oauthToken')){
		loginFr = document.getElementById("loginFrame");
		loginFr.parentNode.removeChild(loginFr);
		settingsLogout.classList.toggle("closed");
		InitData();
	}
