const root = document.getElementById('content');

generateProfile();

function attachButton(){
	const button = document.getElementById('create-button');
	const message = document.getElementById('message');

	button.addEventListener('click', (e) => {
		localStorage.UserType = "Coordinator";
		message.classList.add('message-success');
		message.innerHTML = '<div class="message-text">You Successfully Became a Coordinator!</div>';
		message.style.opacity = 1;
		generateProfile();
		setTimeout(function(){
			message.style.opacity = 0;
			setTimeout(function() {
				message.classList.remove('message-success');
				message.innerHTML = '';
			}, 400);
		}, 3000);
	});
}

function generateProfile(){
	if(localStorage.loggedIn){
		const docTop = document.getElementById('right-top');
		docTop.innerHTML = `<div class="sign-in">Welcome, ${localStorage.Username}</div>`

		root.innerHTML = `
		<div class="item-title">Hello, ${localStorage.Username}</div>
		<div class="item-description">User Type: ${localStorage.UserType}</div>
		<div class="item-description">Email: ${localStorage.Email}</div>
	`
		if(localStorage.UserType == "Participant"){
			document.body.insertAdjacentHTML('beforeend', `
			<button class="create-button" id="create-button">Want to contribute? Become a coordinator!</div>
			`);
		}
		attachButton();
	} else {		
		root.innerHTML = `<div class="error">You aren't logged in! Please login before proceeding.</div>`
	}

}




