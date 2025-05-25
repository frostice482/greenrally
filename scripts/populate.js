const data = [
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
		"title": "Test 1",
		"tags": ["Event", "Conservation"],
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
		"tags": ["Activity", "Conservation"],
		"description": "A Sample Event to Test Parsing Data",
		"author": "Admin",
	},
	{
		"uid": 5,
		"title": "Test 2",
		"tags": ["Event", "Conservation"],
		"description": "A description i must keep writing words to demonstrate that the elipsis might work if i try hard enough this is such a pain AAAA help me PLEASE i don't know what to do lorem ipsum dolor sit amet have you ever had a borgar i reeeeaally want a borgar and now we continue writing about this test event that is TOTALLY real don't you wanna conserve some trees lol ASTAGA MASIH KURANG okay we continue uhhhh trees yea pog",
		"author": "Admin",
		"start": new Date('2025-05-12'),
		"end": new Date('2025-05-13')
	},
]

var filter = "";
var tagFilter = [""];
data.map(populate)

document.getElementById('search').addEventListener('input', (e) => {
	filter = e.target.value;
	repopulate();
	attachItems();
})

function repopulate(){
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
