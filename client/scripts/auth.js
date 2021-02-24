;!(() => {
	// testing data:
	let listTeachers = [
		// {
		// 	name: "Уткин",
		// 	id: 1
		// },
		// {
		// 	name: "Кепкин",
		// 	id: 2
		// },
		// {
		// 	name: "Журавль",
		// 	id: 3
		// }
	];
	$( document ).ready(function() {

		$.getJSON('/__get_teachers', {
				code: 500
			},
			data => {
				console.log(data);
				data.data.forEach(el => {
					listTeachers.push(el);
				});

				listTeachers.forEach(teacher => {
					$(".teacher_name").append('<option value="'+ teacher.id +'" class="itemOfListTeachers">'+ teacher.name +'</option>');
				});
				$(".plug").remove();

				console.log(listTeachers);
			}
		)
		.fail(err => {
			console.log(err);
		});
		console.log("Get me data please");
	});

	// Visual data

	



	$(".go").click((e) => {
		let valueIdTeacher = $(".teacher_name").val();
		console.log(valueIdTeacher);
		// $(location).attr('href', '/users/' + valueIdTeacher);
	})


})();
