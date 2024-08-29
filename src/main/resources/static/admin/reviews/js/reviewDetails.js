document.addEventListener("DOMContentLoaded", function() {
	// HTML에서 data 속성으로 전달된 값을 JavaScript로 읽어오기
	var reviewRating = document.getElementById('starRating').getAttribute('data-rating');

	// 데이터가 문자열로 들어오므로, 정수형으로 변환
	reviewRating = parseInt(reviewRating, 10);

	var starHtml = '';

	// 채워진 별과 빈 별 아이콘으로 변경
	for (var i = 0; i < reviewRating; i++) {
		starHtml += '<span class="fas fa-star stars"></span>'; // 채워진 별
	}
	for (var i = reviewRating; i < 5; i++) {
		starHtml += '<span class="far fa-star empty-stars"></span>'; // 빈 별
	}

	// 별점 HTML 요소에 출력
	document.getElementById("starRating").innerHTML = starHtml;
});