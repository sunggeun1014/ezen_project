$(document).ready(function() {
	datepicker("startDate", "endDate");

	// 초기값 설정
	const initialValues = {
		bannerNum: $('input[name="banner_num"]').val(),
		bannerTitle: $('input[name="banner_title"]').val(),
		bannerPosition: $('input[name="banner_position"]:checked').val(),
		bannerVisible: $('input[name="banner_visible"]:checked').val(),
		bannerStart: $('#startDate').val(),
		bannerEnd: $('#endDate').val(),
	};

	$("#update-button").on("click", function(event) {
		event.preventDefault();

		// 입력값 불러오기
		const currentValues = {
			bannerNum: $('input[name="banner_num"]').val(),
			bannerTitle: $('input[name="banner_title"]').val(),
			bannerPosition: $('input[name="banner_position"]:checked').val(),
			bannerVisible: $('input[name="banner_visible"]:checked').val(),
			bannerStart: $('#startDate').val(),
			bannerEnd: $('#endDate').val(),
		};

		// 초기값, 입력값의 비교
		const hasChanges = Object.keys(initialValues).some(key =>
			initialValues[key] !== currentValues[key]);

		let form = $('#bannerForm')[0];
		let updatedFormData = new FormData(form);

		// 폼 데이터에서 빈 문자열이나 null 체크
		let hasValidData = true;
		updatedFormData.forEach((value, key) => {
			if (value === "" || value === null) {
				hasValidData = false;
				return;
			}
		});

		if (hasChanges || $('#input-file')[0].files.length > 0) {
			if (hasValidData) {
				getConfirmModal('수정을 진행하시겠습니까?', function() {
					$.ajax({
						url: $(form).attr('action'),
						type: 'POST',
						data: updatedFormData,
						processData: false,
						contentType: false,
						success: function() {
							window.location.href = '/admin/banners/list';
						}
					});
				});
			} else {
				getCheckModal('수정사항이 없습니다.', $('#update-button'));
			}
		} else {
			getCheckModal('수정사항이 없습니다.', $('#update-button'));
		}
	});
});



function previewImage(event) {
	var input = event.target;

	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function(e) {
			var preview = document.getElementById('preview');
			preview.src = e.target.result;
		}

		reader.readAsDataURL(input.files[0]);
	}
}
