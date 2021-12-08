async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: data // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function openOauthPopup(){
	const apiclientid = '38180';
	rqURL = "https://www.bungie.net/en/OAuth/Authorize?client_id=" + apiclientid + "&response_type=code";
	let popOauth = window.open(rqURL, "TeamInv: Bungie App-Authorization", "popup, left=200px,top=200px,width=580px,height=700px");
	window.addEventListener('message', function(e) {
		localStorage.setItem('oauthToken', JSON.stringify(e.data));
		popOauth.close();
		loginFr = document.getElementById("loginFrame");
		loginFr.parentNode.removeChild(loginFr);
		InitData();
	}, false);
}

if(localStorage.getItem('oauthToken')){
	openOauthPopup();
	}