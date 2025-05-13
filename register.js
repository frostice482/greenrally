var valid = [false, false, false];
document.getElementById('submit').addEventListener('click', (e) => {
	submit();
});

document.getElementById('email').addEventListener('change', (e) => {
	validateEmail();
});

document.getElementById('username').addEventListener('change', (e) => {
	validateUsername();
});

document.getElementById('password').addEventListener('change', (e) => {
	validatePassword();
});

document.getElementById('confirm').addEventListener('change', (e) => {
	validatePassword();	
});

function validateUsername(){
	const usernameObject = document.getElementById('username');
	const errorInfo = document.getElementById('username-error');
	if(usernameObject.value == ""){
		valid[1] = false;
		errorInfo.classList.add('error-shown');
		errorInfo.innerHTML = "Username can't be empty!";
	} else {
		valid[1] = true;
		errorInfo.classList.remove('error-shown');
		errorInfo.innerHTML = "";
	}
}

function validatePassword(){
	const passwordObject = document.getElementById('password');
	const confirmObject = document.getElementById('confirm');
	const errorInfo = document.getElementById('password-error');
	if(passwordObject.value == ""){
		valid[2] = false;
		errorInfo.classList.add('error-shown');
		errorInfo.innerHTML = "Password can't be empty!";
		return;
	}
	if(passwordObject.value != confirmObject.value){
		valid[2] = false;
		errorInfo.classList.add('error-shown');
		errorInfo.innerHTML = "Passwords don't match!";
	} else {
		valid[2] = true;
		errorInfo.classList.remove('error-shown');
		errorInfo.innerHTML = "";
	}
}

function validateEmail(){
	const emailObject = document.getElementById('email');
	const errorInfo = document.getElementById('email-error');
	if(emailObject.value == ""){
		valid[0] = false;
		errorInfo.classList.add('error-shown');
		errorInfo.innerHTML = "Email can't be empty!";
		return;
	}
	if(!validate(emailObject.value)) {
		valid[0] = false;
		errorInfo.classList.add('error-shown');
		errorInfo.innerHTML = "Email Address is not valid";
	} else {
		valid[0] = true;
		errorInfo.classList.remove('error-shown');
		errorInfo.innerHTML = "";
	
	}
}

function validate(email){
	let regex = /^\S+@\S+\.\S+$/;
	return regex.test(email);
}


