var valid = [false, false, false];
document.getElementById('submit').addEventListener('click', (e) => {
	submit();
});

document.getElementById('email').addEventListener('change', (e) => {
	validateEmail(false);
});

document.getElementById('username').addEventListener('change', (e) => {
	validateUsername(false);
});

document.getElementById('password').addEventListener('change', (e) => {
	validatePassword(false);
});

document.getElementById('confirm').addEventListener('change', (e) => {
	validatePassword(false);	
});

function submit(){
	validateEmail(true);
	validateUsername(true);
	validatePassword(true);
	if(valid[0] && valid[1] && valid[2]){
		localStorage.Email = document.getElementById('email').value;
		localStorage.Password = document.getElementById('password').value;
		localStorage.Username = document.getElementById('username').value;
		localStorage.UserType = "Participant";
		console.log(localStorage.Username);
		document.getElementById('success-message').classList.add('success-shown');
		setTimeout(function() {
			window.location.href = "./login.html";
		}, 1000);
	}
}

function validateUsername(quiet){
	const usernameObject = document.getElementById('username');
	const errorInfo = document.getElementById('username-error');
	if(usernameObject.value == ""){
		valid[1] = false;
		if(quiet) return;
		errorInfo.classList.add('error-shown');
		errorInfo.innerHTML = "Username can't be empty!";
	} else {
		valid[1] = true;
		if(quiet) return;
		errorInfo.classList.remove('error-shown');
		errorInfo.innerHTML = "";
	}
}

function validatePassword(quiet){
	const passwordObject = document.getElementById('password');
	const confirmObject = document.getElementById('confirm');
	const errorInfo = document.getElementById('password-error');
	if(passwordObject.value == ""){
		valid[2] = false;
		if(quiet) return;
		errorInfo.classList.add('error-shown');
		errorInfo.innerHTML = "Password can't be empty!";
		return;
	}
	if(passwordObject.value != confirmObject.value){
		valid[2] = false;
		if(quiet) return;
		errorInfo.classList.add('error-shown');
		errorInfo.innerHTML = "Passwords don't match!";
	} else {
		valid[2] = true;
		if(quiet) return;
		errorInfo.classList.remove('error-shown');
		errorInfo.innerHTML = "";
	}
}

function validateEmail(quiet){
	const emailObject = document.getElementById('email');
	const errorInfo = document.getElementById('email-error');
	if(emailObject.value == ""){
		valid[0] = false;
		if(quiet) return;
		errorInfo.classList.add('error-shown');
		errorInfo.innerHTML = "Email can't be empty!";
		return;
	}
	if(!validate(emailObject.value)) {
		valid[0] = false;
		if(quiet) return;
		errorInfo.classList.add('error-shown');
		errorInfo.innerHTML = "Email Address is not valid";
	} else {
		valid[0] = true;
		if(quiet) return;
		errorInfo.classList.remove('error-shown');
		errorInfo.innerHTML = "";
	
	}
}

function validate(email){
	let regex = /^\S+@\S+\.\S+$/;
	return regex.test(email);
}


