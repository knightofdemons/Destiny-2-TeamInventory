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
	const prom = await callOauthPopup();
}

async function callOauthPopup(){
	const apiclientid = '38180';
	rqURL = "https://www.bungie.net/en/OAuth/Authorize?client_id=" + apiclientid + "&response_type=code";
	popOauth = window.open(rqURL, "TeamInv: Bungie App-Authorization", "popup, left=200px,top=200px,width=580px,height=700px");
	popOauth.addEventListener('storage', function(e) {
		if(popOauth.localStorage.getItem('oauthCode') && popOauth.localStorage.getItem('oauthCode')) {
		localStorage.setItem('oauthCode', popOauth.localStorage.getItem('oauthCode'));
			// Reload authorization code from LocalStorage
		localStorage.removeItem('oauthWatcher');
		console.log(popOauth.localStorage.getItem('oauthCode'));
		}
	});

	// Authorize/Redirect Window
	while (localStorage.getItem('oauthCode') !== null) {
		cleanOauthPopup(popOauth);
	}
}

if(localStorage.getItem('oauthCode')){
	openOauthPopupSub();
	}