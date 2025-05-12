let pills = document.getElementsByClassName('pill');
let items = document.getElementsByClassName('item');
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
	e.target.classList.remove('modal');
})
document.getElementById('modal-button').addEventListener('click', (e) => {
	console.log("clicked");
	const message = document.getElementById('message');
	console.log(message);
	message.style.opacity = 1;
	message.classList.add('message-success');
	message.innerHTML = '<div class="message-text">You successfully joined the event!</div>';
	setTimeout(function(){
		message.style.opacity = 0;
		setTimeout(function() {
			message.classList.remove('message-success');
			message.innerHTML = '';
		}, 400);
	}, 3000);
	})

	console.log(itemNames);

	function attachPill(item){
		item.addEventListener('click', (e) => {
			console.log(e);
			e.target.classList.toggle('toggled');
		});
	}
	function attachItem(item){
		item.addEventListener('click', (e) => {
			console.log(e);
			const modal = document.getElementById("modal");
			modal.classList.add('modal');
		});
	}

