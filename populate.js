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

console.log(data);
var filter = "";
data.map(populate)

console.log(document.getElementById('search'));
document.getElementById('search').addEventListener('input', (e) => {
	console.log(e);
	filter = e.target.value;
	repopulate();
})

function repopulate(){
	const content = document.getElementById('content');
	content.innerHTML = `
		<div class="item-row" data-populated="0">
		</div>
	`
	data.map(populate);
}
function populate(item){
	console.log(item);
	if(filter != ""){
		if(!item.title.includes(filter)){
			return;
		}
	}
	const content = document.getElementById('content');
	let taglist = "";
	for(i = 0; i < item.tags.length; i++){
		taglist += item.tags[i] + ", ";
	}
	let row = document.getElementsByClassName('item-row');
	let lastRow = row.item(row.length - 1);

	if(lastRow.dataset.populated == 3){
		content.insertAdjacentHTML('beforeend', `
			<div class="item-row" data-populated=0>
			</div>
		`);
		row = document.getElementsByClassName('item-row');
		lastRow = row.item(row.length - 1);
	}
	lastRow.insertAdjacentHTML('beforeend', `
	<div class="item">
		<span class="item-title">${item.title}</span>
		<div class="item-tags">Tags: ${taglist}</div>
		<div class="item-description">${item.description}</div>
	</div>`
	);
	lastRow.dataset.populated++;
}

