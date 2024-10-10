$(document).ready(function() {
	
    $('#id, #password').on('input', function() {
        let id = $('#id').val().trim(); 
        let password = $('#password').val().trim();

        // id, pw 입력 여부 확인
        if (id.length > 0 && password.length > 0) {
            $('#loginBtn').prop("disabled", false);  // 로그인 버튼 활성화
        } else {
            $('#loginBtn').prop("disabled", true);   // 로그인 버튼 비활성화
        }
    });

    // 로그인 성공시 작동
    $('.login-form').on('submit', function(event) {
        let id = $('#id').val().trim();

        // 체크박스가 체크되어 있으면 아이디를 로컬 스토리지에 저장
        if ($('#saveIdCheckbox').is(':checked') && id.length > 0) {
            localStorage.setItem('savedUserId', id);
        } else {
            // 체크박스가 체크 해제되면 로컬 스토리지에서 아이디 삭제
            localStorage.removeItem('savedUserId');
        }
    });
	
	const urlParams = new URLSearchParams(window.location.search);
	const accountNotLinkedError = urlParams.get('accountNotLinkedError');
   
	if (accountNotLinkedError) {
		getCheckModal(decodeURIComponent(accountNotLinkedError)); 
	}
	
    let savedId = localStorage.getItem('savedUserId');
    if (savedId) {
        $('#id').val(savedId);  
        $('#saveIdCheckbox').prop('checked', true);
    }

    let id = $('#id').val().trim();
    let password = $('#password').val().trim();
    if (id.length > 0 && password.length > 0) {
        $('#loginBtn').prop("disabled", false); 
    } else {
        $('#loginBtn').prop("disabled", true);
    }
    
    
    if (window.location.search) {
        const urlWithoutParams = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, urlWithoutParams);
    }
});
