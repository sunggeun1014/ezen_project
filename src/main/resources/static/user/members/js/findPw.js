$(document).ready(function() {
    // 이메일 유효성 검사 함수
    function validateEmail(email) {
        let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|mil|co\.kr|ac\.kr|biz|info)$/;
        return emailPattern.test(email);
    }
    
    // 폼 입력에 따라 버튼 활성화
    $('#id, #name, #member_email').on('input', function() {
        let id = $('#id').val().trim();
        let name = $('#name').val().trim();         
        let email = $('#member_email').val().trim();  

        // 입력된 값들이 모두 유효한 경우에만 버튼 활성화
        if (name.length > 0 && email.length > 0 && id.length > 0 && validateEmail(email)) {
            $('#sendAuthNum').prop("disabled", false); 
        } else {
            $('#sendAuthNum').prop("disabled", true);  
        }
    });

    // 인증번호 발송 버튼 클릭
    $('#sendAuthNum, #resendAuthNum').on('click', function(event) {
        event.preventDefault(); // 폼 전송을 막고 AJAX 요청으로 처리

        // 폼 데이터를 직렬화하여 서버에 전송
        let formData = $('#findPwForm').serialize();

        // AJAX 요청을 통해 서버로 폼 데이터 전송
        $.ajax({
            type: 'POST',
            url: '/user/members/verification', // 서버의 엔드포인트
            data: formData,
            success: function(response) {
                if (response.status === 'true') {
					$('.default-btn.short').show();	
					$('.default-btn.long.send').hide();
           			$('.default-btn.long.confirm').show().prop('disabled',false); 
                    sendNumber();	// 인증번호 발송 요청 함수 호출
                } else {
                    getCheckModal('정보가 일치하지 않습니다');
                }
            },
            error: function() {
                getCheckModal('서버에서 오류가 발생했습니다.');
            }
        });
    });
    
    // 인증번호 발송 버튼 클릭
    $('#confirmAuthNum').on('click', function(event) {
        event.preventDefault(); // 폼 전송을 막고 AJAX 요청으로 처리
		
		confirmNumber();
        
    });
});

// 인증번호 발송 요청 함수
function sendNumber() {	
    const email = $('#member_email').val();

    // 인증번호 입력창 표시
    $("#divConfirmEmail").css({
        "display": "flex",
        "flex-direction": "row"
    });

    // AJAX로 인증번호 발송 요청
    $.ajax({
        url: "/user/members/verify",  // 인증번호 발송 요청
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({"to": email}),
        success: function(data) {
            getCheckModal("인증번호가 발송되었습니다.");
            
        },
        error: function(xhr, status, error) {
            getCheckModal("인증번호 발송에 실패하였습니다.");
        }
    });
}

// 인증번호 확인 요청 함수
function confirmNumber() {
    const email = $('#member_email').val();
    const number = $("#number").val();

    $.ajax({
        url: "/user/members/verify/check", 
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({"to": email, "verifyCode": number}),
        success: function(data, status, xhr) {
            $("#emailVerificationStatus").val("success");
            getCheckModal('인증이 완료되었습니다.');
			$(document).ready(function() {
				
			    $("#confirm-delete").on('click', function(event) {
					event.preventDefault(); 
					window.location.href = '/user/members/modifyPwScreen';			        
			    });
			});            
        },
        error: function(xhr, status, error) {
            $("#emailVerificationStatus").val("");
            getCheckModal('인증에 실패하였습니다.');

        }
    });
}
