let pills = document.getElementsByClassName('pill');
let items = document.getElementsByClassName('item');

for(i = 0; i < pills.length; i++){
	attachPill(pills.item(i));
}
for(i = 0; i < items.length; i++){
	attachItem(items.item(i));
}

function attachPill(item){
	item.addEventListener('click', (e) => {
		console.log(e);
		e.target.classList.toggle('toggled');

	});
}
function attachItem(item){
	item.addEventListener('click', (e) => {
		console.log(e);

	});
}
