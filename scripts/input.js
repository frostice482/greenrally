const startTitle = document.getElementById('input-start-title');
const endTitle = document.getElementById('input-end-title');
const startTime = document.getElementById('input-start-time');
const endTime = document.getElementById('input-end-time');

document.getElementById('input-modal-tags').addEventListener('change', (e) => {
	let rawTags = e.target.value.split(',');
	let tags = rawTags.map(item => item.trim())
	console.log(tags);
	if(tags[0] == "" && tags.length == 1){
		e.target.value = "Event";
	}
	if(tags.includes("Activity")){
			startTitle.classList.add("hidden");
			endTitle.classList.add("hidden");
			startTime.classList.add("hidden");
			endTime.classList.add("hidden");
	} else {
		if(!tags.includes("Event")) {
			e.target.value += ', Event'
			tags.push("Event");
		}
			startTitle.classList.remove("hidden");
			endTitle.classList.remove("hidden");
			startTime.classList.remove("hidden");
			endTime.classList.remove("hidden");
	}

	let uniqueTags = new Set();

	for(let i = 0; i < tags.length; i++){
		if(tags[i] == ""){
			break;
		}
		if(uniqueTags.has(tags[i])){
			break;
		}
		uniqueTags.add(tags[i]);
	}
	tags = Array.from(uniqueTags);
	if(tags[0] == "" && tags.length == 1){
		e.target.value = "Event";
		tags = e.target.value.split(',');
	}
	e.target.value = tags.toString().replaceAll(',', ', ');
})

document.getElementById('input-button').addEventListener('click', (e) =>{
	rawTags = document.getElementById('input-modal-tags').value.split(',');
	let tags = rawTags.map(item => item.trim())
	let isEvent = true;
	if(tags.includes('Activity')) isEvent = false;
	console.log(tags);
	console.log(tags.includes("Event"));
	console.log(tags.includes("Activity"));
	if(tags.includes('Event') && tags.includes('Activity')){
		error("Item can't be an event and activity!");
		return;
	}

	if(validate(isEvent)) generateItem(tags, isEvent);
})

function error(text){
	button = document.getElementById('input-button');
	button.innerHTML = text;
	button.style.backgroundColor = "#BF5B53";

	setTimeout(function(){
		button.innerHTML = "Publish Event!";
		button.style.backgroundColor = "";
	}, 700);
}

function validate(isEvent){
	const title = document.getElementById("input-modal-title").value;
	const description = document.getElementById("input-modal-description").value;
	if(typeof(title) == 'undefined' || title.length < 1){
		error("Title can't be empty!");	
		return false;
	}
	if(typeof(description) == 'undefined' || description.length < 1){
		error("Description can't be empty!");	
		return false;
	}

	if(isEvent){
		const start = document.getElementById("input-start-time").value;
		const end = document.getElementById("input-end-time").value;

		if(start == "") error("Start can't be empty!");
		if(end == "") error("End can't be empty!");
		if(start == "" || end == "") return false; 
	}

	return true;
}

function generateItem(tags, isEvent){
	if(typeof(localStorage.count) == 'undefined'){
		localStorage.count = 1;
	}

	const item = {};
	item.uid = 196000 + localStorage.count;
	item.title = document.getElementById('input-modal-title').value;
	item.tags = tags;
	item.description = document.getElementById('input-modal-description').value;
	item.author = document.getElementById('input-author').innerHTML;
	
	if(isEvent){
		item.start = document.getElementById('input-start-time').value;
		item.end = document.getElementById('input-end-time').value;
	}

	document.getElementById('input-modal').classList.remove('modal');
	document.body.style.overflow = 'auto';
	const createButton = document.getElementById("create-button");
	createButton.classList.remove('hidden');

	if(typeof(localStorage.items) == 'undefined'){
		localStorage.items = JSON.stringify([item]);
	} else {
		let old = JSON.parse(localStorage.items);
		old.push(item);
		localStorage.items = JSON.stringify(old);
	}
	localStorage.count++;
	document.getElementById('input').reset();
	repopulate();
	attachItems();
}
