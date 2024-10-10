function validatePassword(password) {
    let pwPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return pwPattern.test(password);
}

$(document).ready(function() {
    $('#pw, #confirm-pw').on('input', function() {  
        let pw = $.trim($('#pw').val()); 
        let confirmPw = $.trim($('#confirm-pw').val());

        if (pw === confirmPw && pw.length > 0 && confirmPw.length > 0 && validatePassword(pw)) {
            $('#submitBtn').prop("disabled", false);          } else {
            $('#submitBtn').prop("disabled", true);   
        }
    });
    
    $('#modifyPwForm').submit(function(event) {
        event.preventDefault(); 

        let formData = {
            member_pw: $('#pw').val(),
            member_id: $('#id').val()
        };

        $.ajax({
            type: "POST",
            url: "/user/members/modifyPw",
            data: JSON.stringify(formData),
            contentType: "application/json; charset=UTF-8",
            success: function(response) {
                if (response.status === "success") {
					getCheckModal("비밀번호 변경이 완료되었습니다.<br>로그인 창으로 이동합니다.");
					$("#confirm-delete").on('click', function(event) {
						event.preventDefault();
						window.location.href = '/user/login';			        
				    });

                } else {
					getCheckModal("비밀번호 변경에 실패했습니다. 다시 시도해 주세요.");
                }
            },
            error: function() {
				getCheckModal("서버 요청 중 오류가 발생했습니다.");
                
            }
        });
    });
});
