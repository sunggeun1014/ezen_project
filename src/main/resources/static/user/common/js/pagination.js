$(document).ready(function() {
	let pathName = location.pathname;
	let currentParams = new URLSearchParams(location.search);
	
	const leftArrowElment = $("#page-arrow-left");
	const rightArrowElment = $("#page-arrow-right"); 
	let currentPage = parseInt($("#page-area").attr("data-current-page"));
	let totalPage = parseInt($("#page-area").attr("data-total-page"));
	
	$(".page-link").removeClass("link-on");
	$(`#page-link-${currentPage}`).addClass("link-on"); 

	$(".page-link").on("click", function() {
		$(".page-link").removeClass("link-on");
		$(this).addClass("link-on");
		
		currentParams.set("currentPage", $(this).text());
		location.href = `${pathName}?${currentParams.toString()}`;
	});

	$(leftArrowElment).on("click", function() {
		getNextPage(1);		
	});

	$(rightArrowElment).on("click", function() {
		getNextPage(-1);		
	});

	if(currentPage <= 1) {
		$(leftArrowElment).addClass("arrow-disabled");
		$(leftArrowElment).off("click");
	}
	
	if(currentPage >= totalPage) {
		$(rightArrowElment).addClass("arrow-disabled");
		$(rightArrowElment).off("click");
	}
	
	
	function getNextPage(num) {
		currentParams.set("currentPage", currentPage - num);
		
		location.href = `${pathName}?${currentParams.toString()}`;
	}
});