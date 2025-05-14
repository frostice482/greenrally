const data = [
	{
		"title": "Event 1",
		"tags": ["Event", "Conservation"],
		"description": "A Sample Event to Test Parsing Data",
		"author": "Admin",
		"start": new Date('2025-05-12'),
		"end": new Date('2025-05-13')
	},
	{
		"title": "Activity 1",
		"tags": ["Activity", "Conservation"],
		"description": "A Sample Event to Test Parsing Data",
		"author": "Admin",
		"start": new Date('2025-05-12'),
		"end": new Date('2025-05-13')
	},
	{
		"title": "Test 1",
		"tags": ["Event", "Conservation"],
		"description": "A Sample Event to Test Parsing Data",
		"author": "Admin",
		"start": new Date('2025-05-12'),
		"end": new Date('2025-05-13')
	},
	{
		"title": "Event 2",
		"tags": ["Event", "Conservation"],
		"description": "A Sample Event to Test Parsing Data",
		"author": "Admin",
		"start": new Date('2025-05-12'),
		"end": new Date('2025-05-13')
	},
	{
		"title": "Activity 2",
		"tags": ["Activity", "Conservation"],
		"description": "A Sample Event to Test Parsing Data",
		"author": "Admin",
		"start": new Date('2025-05-12'),
		"end": new Date('2025-05-13')
	},
	{
		"title": "Test 2",
		"tags": ["Event", "Conservation"],
		"description": "A Sample Event to Test Parsing Data",
		"author": "Admin",
		"start": new Date('2025-05-12'),
		"end": new Date('2025-05-13')
	},
]

var filter = "";
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
	const content = document.getElementById('content');
	let taglist = "";
	for(i = 0; i < item.tags.length; i++){
		if(i == item.tags.length - 1){
			taglist += item.tags[i];
		} else taglist += item.tags[i] + ", ";
	}
	content.insertAdjacentHTML('beforeend', `
	<div class="item">
		<span class="item-title">${item.title}</span>
		<div class="item-tags">Tags: ${taglist}</div>
		<div class="item-description">${item.description}</div>
	</div>`
	);
}

