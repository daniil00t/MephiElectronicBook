;!(() => {
	// testing data:
	let listTeachers = [
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
				// Visual data
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

	

	$(".go").click((e) => {
		let valueIdTeacher = $(".teacher_name").val();
		console.log(valueIdTeacher);
		$(location).attr('href', '/users/' + valueIdTeacher);
	})


})();
