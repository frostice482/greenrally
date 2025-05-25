const BaseData = [
	{
		"uid": 0,
		"title": "Event 1",
		"tags": ["Event", "Conservation"],
		"description": "A Sample Event to Test Parsing Data",
		"author": "Admin",
		"start": new Date('2025-05-12'),
		"end": new Date('2025-05-13')
	},
	{
		"uid": 1,
		"title": "Activity 1",
		"tags": ["Activity", "Conservation"],
		"description": "A Sample Event to Test Parsing Data",
		"author": "Admin",
	},
	{
		"uid": 2,
		"title": "March for Water",
		"tags": ["Event", "Water"],
		"description": "A Sample Event to Test Parsing Data",
		"author": "Admin",
		"start": new Date('2025-05-12'),
		"end": new Date('2025-05-13')
	},
	{
		"uid": 3,
		"title": "Event 2",
		"tags": ["Event", "Conservation"],
		"description": "A Sample Event to Test Parsing Data",
		"author": "Admin",
		"start": new Date('2025-05-12'),
		"end": new Date('2025-05-13')
	},
	{
		"uid": 4,
		"title": "Activity 2",
		"tags": ["Activity", "Water"],
		"description": "A Sample Event to Test Parsing Data",
		"author": "Admin",
	},
	{
		"uid": 5,
		"title": "Reforstation",
		"tags": ["Event", "Reforestation"],
		"description": "Sample Event",
		"author": "Admin",
		"start": new Date('2025-05-12'),
		"end": new Date('2025-05-13')
	},
]

var data = Array.from(BaseData);

if(typeof(localStorage.items) != 'undefined'){
	items = JSON.parse(localStorage.items);
	console.log(items);
	items.forEach(function(item){
		data.push(item)
	})
}
var filter = "";
var tagFilter = [];
data.map(populate)

document.getElementById('search').addEventListener('input', (e) => {
	filter = e.target.value;
	repopulate();
	attachItems();
})

function repopulate(){
	data = [];
	console.log(data);
	data = Array.from(BaseData);
	console.log(data);
	console.log(BaseData);
	if(typeof(localStorage.items) != 'undefined'){
		items = JSON.parse(localStorage.items);
		console.log(items);
		items.forEach(function(item){
			console.log('pushing');
			data.push(item)
		})
	}
	const content = document.getElementById('content');
	content.innerHTML = ''
	data.map(populate);
}

function populate(item){
	if(filter != ""){
		if(!item.title.toLowerCase().includes(filter.toLowerCase())){
			return;
		}
	}
	if(tagFilter != ""){
		if(tagFilter.every(function(tag) {
			return item.tags.includes(tag);
		}
		) == false){
			return;
		}
	}
	const content = document.getElementById('content');
	let taglist = "";
	for(i = 0; i < item.tags.length; i++){
		if(i == item.tags.length - 1){
			taglist += item.tags[i];
		} else taglist += item.tags[i] + ", ";
	}
	content.insertAdjacentHTML('beforeend', `
	<div class="item" data-id="item-${item.uid}">
		<span class="item-title">${item.title}</span>
		<div class="item-tags">Tags: ${taglist}</div>
		<div class="item-description">${item.description}</div>
	</div>`
	);
}

function filterTags(tag, item){
	if(item.tags.includes(tag)){
		return true;
	} else return false;
}
