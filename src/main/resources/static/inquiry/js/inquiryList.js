$("#today-btn").click(() => {
	const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
	
	$("#start-date").val(formattedDate);
	$("#end-date").val(formattedDate);
});

$("#one-week-btn").click(() => {	
	const today = new Date();

	const oneWeekAgo = new Date(today);
	oneWeekAgo.setDate(today.getDate() - 7);

	const year = oneWeekAgo.getFullYear();
	const month = String(oneWeekAgo.getMonth() + 1).padStart(2, '0');
	const day = String(oneWeekAgo.getDate()).padStart(2, '0');

	const formattedDate = `${year}-${month}-${day}`;
	
	$("#start-date").val(formattedDate);
	$("#end-date").val(formattedDate);
});

$("#one-month-btn").click(() => {
	const today = new Date();

	const oneMonthAgo = new Date(today);
	oneMonthAgo.setMonth(today.getMonth() - 1);

	const year = oneMonthAgo.getFullYear();
	const month = String(oneMonthAgo.getMonth() + 1).padStart(2, '0');
	const day = String(oneMonthAgo.getDate()).padStart(2, '0');

	const formattedDate = `${year}-${month}-${day}`;

	$("#start-date").val(formattedDate);
	$("#end-date").val(formattedDate);
});

$("#one-year-btn").click(() => {
	const today = new Date();
	
	const oneYearAgo = new Date(today);
	oneYearAgo.setFullYear(today.getFullYear() - 1);

	const year = oneYearAgo.getFullYear();
	const month = String(oneYearAgo.getMonth() + 1).padStart(2, '0');
	const day = String(oneYearAgo.getDate()).padStart(2, '0');

	const formattedDate = `${year}-${month}-${day}`;
	
	$("#start-date").val(formattedDate);
	$("#end-date").val(formattedDate);
});