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

document.getElementById('input-modal').addEventListener('click', (e) => {
	if(e.target.id == 'input-modal'){
		e.target.classList.remove('modal');
		document.body.style.overflow = 'auto';
		if(localStorage.UserType == "Coordinator"){
			const createButton = document.getElementById("create-button");
			createButton.classList.remove('hidden');
		}
	}
})
document.getElementById('modal').addEventListener('click', (e) => {
	if(e.target.id == 'modal'){
		e.target.classList.remove('modal');
		document.body.style.overflow = 'auto';
		if(localStorage.UserType == "Coordinator"){
			const createButton = document.getElementById("create-button");
			createButton.classList.remove('hidden');
		}
	}
})
document.getElementById('modal-button').addEventListener('click', (e) => {
	const button = document.getElementById('modal-button');

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
	updateFilter()
	repopulate();
	attachItems();
});
}
function attachItem(item){
item.addEventListener('click', (e) => {
	var target = e.target;
	while(target.dataset.id == undefined){
		target = target.parentNode;
	}
	id = target.dataset.id.split("-")
	populateModal(id[1])
	const modal = document.getElementById("modal");
	document.body.style.overflow = 'hidden';
	modal.classList.add('modal');
	const createButton = document.getElementById("create-button");
	createButton.classList.add('hidden');
});
}

function populateModal(id){
	const item = data.find(data => data.uid == id);
	console.log(item);

	// Define Items 
	//
	const title = document.getElementById("modal-title");
	const description = document.getElementById("modal-description");
	const tags = document.getElementById("modal-tags");

	const startedTitle = document.getElementById("started-title");
	const startTitle = document.getElementById("start-title");
	const endTitle = document.getElementById("end-title");

	const author = document.getElementById("author");
	const startTime = document.getElementById("start-time");
	const endTime = document.getElementById("end-time");
	if(item.tags.includes("Activity")){
		startTitle.classList.add("hidden");
		endTitle.classList.add("hidden");
		startTime.classList.add("hidden");
		endTime.classList.add("hidden");
	} else {
		startTitle.classList.remove("hidden");
		endTitle.classList.remove("hidden");
		startTime.classList.remove("hidden");
		endTime.classList.remove("hidden");
		startTime.innerHTML = item.start.toLocaleString();
		endTime.innerHTML = item.end.toLocaleString();
	}
	title.innerHTML = item.title;
	description.innerHTML = item.description;
	author.innerHTML = item.author;
	tags.innerHTML = "Tags: " + item.tags.toString().replace(",", ", ");
}
function attachItems(){
	items = document.getElementsByClassName('item');
	for(i = 0; i < items.length; i++){
		attachItem(items.item(i));
	}
}


if(localStorage.loggedIn){
	const docTop = document.getElementById('right-top');
	docTop.innerHTML = `<a href="./pages/profile.html" class="sign-in">Welcome, ${localStorage.Username}</div>`
	
	if(localStorage.UserType == "Coordinator"){
		const createButton = document.getElementById('create-button');

		const author = document.getElementById('input-author');
		author.innerHTML = localStorage.Username;

		createButton.classList.remove("hidden");
		createButton.innerHTML = "Create new Event or Activity!";
		attachCreateButton();
	}
}

function attachCreateButton(){
	const create = document.getElementById("create-button");
	create.addEventListener('click', (e) => {
		const modalInput = document.getElementById('input-modal');
		document.body.style.overflow = 'hidden';
		modalInput.classList.add('modal');
		const createButton = document.getElementById("create-button");
		createButton.classList.add('hidden');
	});
}
function updateFilter(){
	const toggled = document.getElementsByClassName("toggled");
	tagFilter = [];
	for(i = 0; i < toggled.length; i++){
		tagFilter.push(toggled.item(i).innerHTML);
	console.log(tagFilter);
	}
}
