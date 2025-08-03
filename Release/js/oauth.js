async function openOauthPopup(){
	closeLoginFrame(); // Close the login frame first
	const apiclientid = '38180';
	rqURL = "https://www.bungie.net/en/OAuth/Authorize?client_id=" + apiclientid + "&response_type=code";
	let popOauth = window.open(rqURL, "TeamInv: Bungie App-Authorization", "popup, left=200px,top=200px,width=580px,height=700px");
	window.addEventListener('message', async function(e) {
		try {
			await window.dbOperations.saveOAuthToken(e.data);
			popOauth.close();
			
			// Update UI to show logged in state
			await updateLoginState();
			
			// Show success notification
			showNotification('Login successful! Welcome to Destiny 2 Team Inventory.', 'success');
			
			console.log('OAuth authentication successful');
		} catch (error) {
			console.error('Error saving OAuth token:', error);
			showNotification('Login failed. Please try again.', 'error');
		}
	}, false);
}
