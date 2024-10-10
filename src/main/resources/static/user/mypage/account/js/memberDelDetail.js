document.addEventListener("DOMContentLoaded", function() {
	const checkBtn1 = document.getElementById('check-btn1');
	const checkBtn2 = document.getElementById('check-btn2');
	const deleteBtn = document.getElementById('delete-btn');

	// 체크박스 상태가 변경될 때마다 호출
	function toggleDeleteButton() {
		// 두 개의 체크박스가 모두 체크되었을 때만 버튼 활성화
		if (checkBtn1.checked && checkBtn2.checked) {
			deleteBtn.disabled = false;
			$(deleteBtn).removeClass("delete-btn-on");
			$(deleteBtn).addClass("default-btn");
		} else {
			deleteBtn.disabled = true;
			$(deleteBtn).addClass("delete-btn-on");
			$(deleteBtn).removeClass("default-btn");
		}
	}

	deleteBtn.addEventListener('click', function() {
		getConfirmModal('정말로 탈퇴하시겠습니까?','', function() {
			// 탈퇴 요청
			fetch('/user/mypage/delete', {
				method: 'POST'
			})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					showSuccessModal('회원 탈퇴가 완료되었습니다.');
					return;
				} else {
					getErrorModal('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
					return;
				}
			})
			.catch(error => {
				getErrorModal('오류가 발생했습니다. 다시 시도해주세요.');
				return;
			});
		});

	});

	// 각 체크박스에 change 이벤트 리스너 추가
	checkBtn1.addEventListener('change', toggleDeleteButton);
	checkBtn2.addEventListener('change', toggleDeleteButton);

	function showSuccessModal(msg) {
		getCheckModal(msg);

		$(document).on('click', '#confirm-delete', function() {
			window.location.href = '/user/login';
		});
	}
});