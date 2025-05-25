const startTitle = document.getElementById('input-start-title');
const endTitle = document.getElementById('input-end-title');
const startTime = document.getElementById('input-start-time');
const endTime = document.getElementById('input-end-time');

document.getElementById('input-modal-tags').addEventListener('change', (e) => {
	tags = e.target.value.split(',');
	console.log(tags);
	if(tags.includes("Activity")){
			startTitle.classList.add("hidden");
			endTitle.classList.add("hidden");
			startTime.classList.add("hidden");
			endTime.classList.add("hidden");
	} else {
			if(!tags.includes("Event")) e.target.value += ', Event';
			startTitle.classList.remove("hidden");
			endTitle.classList.remove("hidden");
			startTime.classList.remove("hidden");
			endTime.classList.remove("hidden");
			startTime.innerHTML = item.start.toDateString();
			endTime.innerHTML = item.end.toDateString();
	}
})

