let a = [];

$(".col-sm-2 .list-group a").each((i) => {
	a.push($(".col-sm-2 .list-group a")[i].innerText);
});

a;
//