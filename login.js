document.getElementById('submit').addEventListener('click', (e) => {
	submit();
});

function submit(){
	const usernameObject = document.getElementById('username');
	const passwordObject = document.getElementById('password');
	const errorInfo = document.getElementById('login-error');
	if(usernameObject.value == "" || passwordObject.value == ""){
		errorInfo.classList.add('error-shown');
		errorInfo.innerHTML = "Username and Password fields must be filled!";
		return;
	}
	if(usernameObject.value != localStorage.Username){
		errorInfo.classList.add('error-shown');
		errorInfo.innerHTML = "No user found by that username";
		return;
	}
	if(passwordObject.value != localStorage.Password){
		errorInfo.classList.add('error-shown');
		errorInfo.innerHTML = "Incorrect Password!";
		return;
	}
	errorInfo.classList.remove('error-shown');

	const successInfo = document.getElementById('success-message');
	successInfo.classList.add('success-shown');

	localStorage.loggedIn = true;
	setTimeout(function(){
		window.location.href = "./index.html";
	}, 3000);
}
