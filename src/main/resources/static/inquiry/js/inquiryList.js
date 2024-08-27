const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const formattedToday = `${year}-${month}-${day}`;
const formattedLastYear = year < 0 ? `${0}-${month}-${day}` : `${year - 1}-${month}-${day}`;

$("#today-btn").click(() => {
	$("#start-date").val(formattedToday);
	$("#end-date").val(formattedToday);
});

$("#one-week-btn").click(() => {
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');
	
	const formattedLastWeek = `${year}-${month}-${day}`;
	
	$("#start-date").val(formattedDate);
	$("#end-date").val(formattedDate);
});

$("#one-month-btn").click(() => {
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');
	
	const formattedDate = `${year}-${month}-${day}`;
	
	$("#start-date").val(formattedDate);
	$("#end-date").val(formattedDate);
});

$("#one-year-btn").click(() => {
	$("#start-date").val(formattedLastYear);
	$("#end-date").val(formattedToday);
});

