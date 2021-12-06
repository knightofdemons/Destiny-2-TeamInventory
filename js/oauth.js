var popOauth;


function openOauthPopup() {
	openOauthPopupSub();
}

function cleanOauthPopup(popOauth) {
	loginFr = document.getElementById("loginFrame");
	loginFr.parentNode.removeChild(loginFr);
	localStorage.removeItem('oauthWatcher');
	InitData();
	popOauth.close();
}

async function openOauthPopupSub(){
	localStorage.setItem('oauthWatcher', false);
	let prom = await callOauthPopup();
	console.log(popOauth);
	cleanOauthPopup(popOauth);
}

function callOauthPopup(){
	const apiclientid = '38180';
	rqURL = "https://www.bungie.net/en/OAuth/Authorize?client_id=" + apiclientid + "&response_type=code";
	popOauth = window.open(rqURL, "TeamInv: Bungie App-Authorization", "popup, left=200px,top=200px,width=580px,height=700px");
	popOauth.addEventListener('storage', function(e) {
		if(localStorage.getItem('oauthWatcher') && localStorage.getItem('oauthCode')) {
			// Reload authorization code from LocalStorage
			localStorage.removeItem('oauthWatcher');
		}else{
			const queryString = popOauth.location.search;
			const urlParams = new URLSearchParams(queryString);
			const code = urlParams.get('code');
			console.log("code: " + queryString);
		}
			console.log(popOauth);
	return popOauth;
});

	// Authorize/Redirect Window
	while (localStorage.getItem('oauthCode') !== null) {
	}
}

if(localStorage.getItem('oauthCode')){
	openOauthPopupSub();
	}