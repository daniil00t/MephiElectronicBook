testData = {
	name: 'Трифоненков Владимир Петрович', 
	data: [
		[
			{
				time: '10:15 — 11:50', 
				even: 0, 
				type: 'Лек', 
				duration: 'ALL_SEMESTER', 
				place: 'ДОТ', 
				groups: 
					[
						'Б20-503', 
						'Б20-504', 
						'Б20-505', 
						'Б20-513', 
						'Б20-514', 
						'Б20-515', 
						'Б20-523', 
						'Б20-524', 
						'С20-501'
					], 
				name: 'Линейная алгебра', 
				wday: 1
			}, 
			{
				time: '13:35 — 16:05', 
				even: 0, 'type': 'Пр', 
				duration: '(09.02.2021 — 15.06.2021)', 
				place: 'ДОТ', 'groups': ['И20-09'], 
				name: 'Математика', 
				wday: 1
			}
		], 
		[
			{
				time: '14:30 — 17:00', 
				even: 0, 
				type: 'Пр', 
				duration: '(12.02.2021 — 18.06.2021)', 
				place: 'ДОТ', 
				groups: ['И20-09'], 
				name: 'Математика', 
				wday: 4
			}
		], 
		[
			{
				time: '08:30 — 10:05', 
				even: 0, 
				type: 'Пр', 
				duration: 'ALL_SEMESTER', 
				place: '408', 
				groups: ['408', 'Б20-504'], 
				name: 'Линейная алгебра', 
				wday: 5
			}, 
			{
				time: '10:15 — 11:50', 
				even: 0, 
				type: 'Пр', 
				duration: 'ALL_SEMESTER', 
				place: '408', 
				groups: ['408', 'Б20-505'], 
				name: 'Линейная алгебра', 
				wday: 5
			}, 
			{
				time: '12:45 — 14:20', 
				even: 0, 
				type: 'Пр', 
				duration: 'ALL_SEMESTER', 
				place: '408', 
				groups: ['408', 'Б20-513', 'Б20-523'], 
				name: 'Линейная алгебра', 
				wday: 5
			}
		]
	]
}

// Put data to html
let wday = [
	"Понедельник",
	"Вторник",
	"Среда",
	"Четверг",
	"Пятница",
	"Суббота"
]

let dayHTML = (dayData) => {
	let containerStart = '<div class="schedule-day">';
	let container = `<h5 class="schedule-day-name">${wday[dayData[0].wday]}</h5><div class="lessons">`;
	let counter = 1;
	dayData.forEach(el => {
		container += `<div class="lesson" data-order="№${counter}">`;

		container += `<div class="time">${el.time}</div>`;
		container += `<div class="type">${el.type}</div>`;
		container += `<div class="name">${el.name}</div>`;

		groupCounter = 0;
		groupsHTML = '<div class="groups">';
		for (var i = 0; i < el.groups.length; i++) {
			if(groupCounter < 7){
				groupsHTML += `<a href="#" class='link-group'>${el.groups[i]}</a> `
			}
			else{
				groupsHTML += "<a href='#' class='link-group'>...</a>";
				break;
			}
			i == el.groups.length - 1 ? groupsHTML = groupsHTML.slice(0, -1) : groupsHTML += "";
			groupCounter++; 
		}
		container += '</div' + groupsHTML;
		container += `<div class="place">${el.place}</div>`;

		container += "</div>";
		counter++;
	})
	let containerEnd = '</div>';
	return containerStart + container + containerEnd;
};

let tagDays = $(".schedule-days");

// test data is being put
testData.data.forEach(day => {
	tagDays.append(dayHTML(day));
})