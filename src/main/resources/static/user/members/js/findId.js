$(document).ready(function() {
	// 이메일 유효성 검사 함수
    function validateEmail(email) {
        let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|mil|co\.kr|ac\.kr|biz|info)$/;
        return emailPattern.test(email);
    }
    
    // 아이디와 비밀번호 입력 필드에 이벤트 리스너 추가
    $('#name, #email').on('input', function() {
        let name = $('#name').val().trim();          // 아이디 필드 값 가져오기
        let email = $('#email').val().trim();  // 비밀번호 필드 값 가져오기

        // 아이디와 비밀번호가 모두 입력되었는지 확인
        if (name.length > 0 && email.length > 0 && validateEmail(email)) {
            $('#findIdBtn').prop("disabled", false);  // 로그인 버튼 활성화
        } else {
            $('#findIdBtn').prop("disabled", true);   // 로그인 버튼 비활성화
        }
     
    });
  
	
});
