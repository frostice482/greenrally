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

