$(document).ready(function() {
	datepicker("startDate", "endDate");

	function validateForm() {
		let isValid = true;

		if ($('input[name="banner_title"]').val().trim() === '') {
			showModal('제목을 입력해주세요.');
			isValid = false;
			return false;
		}

		let startDate = $('#startDate').val().trim();
		let endDate = $('#endDate').val().trim();

		if (startDate === '' && endDate === '') {
			showModal('노출 기간을 입력해주세요.');
			isValid = false;
			return false;
		} else if (startDate === '') {
			showModal('시작 날짜를 입력해주세요.');
			isValid = false;
			return false;
		} else if (endDate === '') {
			showModal('종료 날짜를 입력해주세요.');
			isValid = false;
			return false;
		}

		if ($('#input-file').get(0).files.length === 0) {
			showModal('이미지를 선택해주세요.');
			isValid = false;
			return false;
		}
		return isValid;
	}

	function showModal(message, isSuccess) {
		// 등록 및 유효성 검사 시 모두 확인 버튼만
		getCheckModal(message, $('#insert-button'));
	}

	$('#insert-button').on('click', function(e) {
		e.preventDefault(); // 기본 폼 제출 동작 방지

		if (validateForm()) {
			getConfirmModal('등록하시겠습니까?', function() {
				$('form').off('submit').submit(); // 성공 시 폼 제출
			});
		} 
	});

});

function previewImage(event) {
	var input = event.target;

	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function(e) {
			var preview = document.getElementById('preview');
			var imgIn = document.getElementById('img-in');
			preview.src = e.target.result;
			imgIn.style.display = 'none';
			preview.style.display = 'block';
		}

		reader.readAsDataURL(input.files[0]);
	}
}