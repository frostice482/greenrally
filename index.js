let pills = document.getElementsByClassName('pill');
var items = document.getElementsByClassName('item');
let itemTitles = document.getElementsByClassName('item-title')
let itemNames = [];

for(i = 0; i < pills.length; i++){
	attachPill(pills.item(i));
}
for(i = 0; i < items.length; i++){
	attachItem(items.item(i));
}
for(i = 0; i < itemTitles.length; i++){
	itemNames.push(itemTitles.item(i).innerHTML);
}

document.getElementById('modal').addEventListener('click', (e) => {
	if(e.target.id == 'modal'){
		e.target.classList.remove('modal');
		document.body.style.overflow = 'auto';
		console.log(document.body);
	}
})
document.getElementById('modal-button').addEventListener('click', (e) => {
	const message = document.getElementById('message');
	message.style.opacity = 1;
	if(localStorage.loggedIn){
		message.classList.add('message-success');
		message.innerHTML = '<div class="message-text">You successfully joined the event!</div>';
		setTimeout(function(){
			message.style.opacity = 0;
			setTimeout(function() {
				message.classList.remove('message-success');
				message.innerHTML = '';
			}, 400);
		}, 3000);
	} else {
		message.classList.add('message-failed');
		message.innerHTML = '<div class="message-text">Please log in before joining events!</div>';
		setTimeout(function(){
			message.style.opacity = 0;
			setTimeout(function() {
				message.classList.remove('message-failed');
				message.innerHTML = '';
			}, 400);
		}, 3000);
	}
})

function attachPill(item){
item.addEventListener('click', (e) => {
	e.target.classList.toggle('toggled');
});
}
function attachItem(item){
item.addEventListener('click', (e) => {
	const modal = document.getElementById("modal");
	document.body.style.overflow = 'hidden';
	console.log(document.body);
	modal.classList.add('modal');
});
}

function attachItems(){
	items = document.getElementsByClassName('item');
	for(i = 0; i < items.length; i++){
		attachItem(items.item(i));
	}
}


if(localStorage.loggedIn){
	const docTop = document.getElementById('right-top');
	docTop.innerHTML = `<div class="sign-in">Welcome, ${localStorage.Username}</div>`
}
