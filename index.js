let pills = document.getElementsByClassName('pill');
console.log(pills);
console.log(pills.length);

for(i = 0; i < pills.length; i++){
	attach(pills.item(i));
}

function attach(item){
	item.addEventListener('click', (e) => {
		console.log(e);
		e.target.classList.toggle('toggled');

	});
}
