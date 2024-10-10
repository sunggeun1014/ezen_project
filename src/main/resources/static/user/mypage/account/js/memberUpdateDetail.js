document.addEventListener("DOMContentLoaded", function() {
    // address_kakao 요소에 포커스 이벤트를 추가
    document.getElementById("address_kakao").addEventListener("click", function() {

        new daum.Postcode({
            oncomplete: function(data) {
                document.getElementById("address_kakao").value = data.address;
                document.getElementById("address_detail").focus();  // 주소 입력 후 상세 주소로 포커스 이동
            }
        }).open();
    });
});
	
	   
document.getElementById("userPart1").addEventListener("input", function() {
	limitLength(this, 4); // userPart1 필드는 최대 4자리 숫자
});

document.getElementById("userPart2").addEventListener("input", function() {
	limitLength(this, 4); // userPart2 필드는 최대 4자리 숫자
});
	   
	   
function limitLength(input, maxLength) {
	if (input.value.length > maxLength) {
		input.value = input.value.slice(0, maxLength);
	}
}

document.querySelectorAll('.input-box input').forEach(function(input) {
	input.addEventListener('focus', function() {
		this.value = '';
	});
});
	
   
// 비밀번호 유효성 검사 함수
function validatePassword(password) {
	var pwPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;  // 특수문자, 영문자, 숫자 포함, 최소 8자
	return pwPattern.test(password);
}

// 이메일 유효성 검사 함수 (특수문자 포함 불가)
function validateEmail(email) {
	var emailPattern = /^[a-zA-Z0-9]+$/;  // 영문자와 숫자만 허용
	return emailPattern.test(email);
}

document.getElementById("input-pw").addEventListener('input', function() {
	this.value = this.value.replace(/\s/g, "");
});


document.getElementById("input-pw-check").addEventListener('input', function() {
	this.value = this.value.replace(/\s/g, "");
	
	const errorElement = document.getElementById("pwError");
	const inputPw = document.getElementById("input-pw");
	
	if (inputPw.value === this.value) {
		errorElement.textContent = "비밀번호가 일치합니다.";
		errorElement.style.color = "#10A142";
	} else {
		errorElement.textContent = "비밀번호가 일치하지 않습니다.";
		errorElement.style.color = "red";
	}
});	  

document.getElementById("emailUser").addEventListener('input', function(){
	this.value = this.value.replace(/\s/g, "");	
});

document.getElementById("input-pw-check").addEventListener('focus', function() {
	const errorElement = document.getElementById("pwError");
	if (errorElement.innerText !== "※ 특수문자, 영문자, 숫자 포함, 최소 8자" && errorElement.innerText !== "※ 비밀번호가 일치합니다.") {
		errorElement.style.color = "red";
		errorElement.textContent = "※ 특수문자, 영문자, 숫자 포함, 최소 8자";
	}
});

document.getElementById("userPart1").addEventListener('focus', function() {
	const errorElement = document.getElementById("phoneError");
	errorElement.style.display = "none";  // 에러 메시지를 숨김
});

document.getElementById("emailUser").addEventListener('focus', function() {
	const errorElement = document.getElementById("emailError");
	errorElement.style.display = "none";  // 에러 메시지를 숨김
});

document.getElementById("address_detail").addEventListener('focus', function() {
	const errorElement = document.getElementById("addressError");
	errorElement.style.display = "none";
});

$(document).ready(function () {
	
    initKakao();

    $('#kakaoLogin').on('click', function (e) {
        e.preventDefault(); 

        if ($(this).is(':checked')) {
			
            getConfirmModal("카카오 연동을 실행하시겠습니까?", "", kakaoLogin);
        } else {
			
            getConfirmModal("카카오 연동을 해지하시겠습니까?", "", kakaoUnlink); 
        }
    });
});


function openCustomNaverLoginPopup() {
	let redirectUri = encodeURIComponent('http://43.203.118.120:9080/user/members/naver/callback');
    let naverLoginUrl = `https://nid.naver.com/nidlogin.login?oauth_token=kBgIZWFGAnrdUqdN1Z&consumer_key=sutMcxM8vDfiUuQgTc15&logintp=oauth2&nurl=https%3A%2F%2Fnid.naver.com%2Foauth2.0%2Fauthorize%3Fresponse_type%3Dtoken%26state%3Db20a2119-9c4e-41c0-b1ac-d184f6b3dfd2%26client_id%3DsutMcxM8vDfiUuQgTc15%26redirect_uri=${redirectUri}&locale=ko_KR&inapp_view=&svctype=`;

    // 팝업 창 열기
    window.open(naverLoginUrl, 'NaverLoginPopup', 'width=500,height=600');
}

$(document).ready(function () {
	
    $('#naverLogin').on('click', function (e) {
        e.preventDefault(); 

        if ($(this).is(':checked')) {			
            getConfirmModal("네이버 연동을 실행하시겠습니까?", "", openCustomNaverLoginPopup);
            
        } else {
			
            getConfirmModal("네이버 연동을 해지하시겠습니까?", "", naverUnlink); 
        }
    });
});








function validateForm() {
	let isValid = true;
	// 비밀번호 검증
	const inputPw = document.getElementById("input-pw").value;
	const inputPwCheck = document.getElementById("input-pw-check").value;
	const pwError = document.getElementById("pwError");
			   
	if (!(inputPw === inputPwCheck)) {
		pwError.style.color = "red";
		pwError.textContent = "※ 비밀번호가 일치하지 않습니다.";
		isValid = false;
			
		return isValid;
	} 
	   
	if (inputPwCheck && !validatePassword(inputPwCheck)) {
		pwError.style.color = "red";
		pwError.textContent = "※ 비밀번호 양식에 맞춰 작성해주세요"
			
		isValid = false;
			
		return isValid;
	}
	   
	   
	   
   // 이메일 검증
   const emailUser = document.getElementById("emailUser").value;
   const emailDomainSelect = document.getElementById("emailDomain").value;
   const emailError = document.getElementById("emailError");
  
   if (!validateEmail(emailUser)) {
		emailError.style.display = "block";
		emailError.textContent = "※ 영문자와 숫자만 입력하세요"
		isValid = false;
		
		return isValid;
   }
   
   if ((emailUser !== "" && !emailUser)) {
		if (emailDomainSelect === "" && !emailDomainSelect) {
           emailError.style.display = "block";
           emailError.textContent = "※ 이메일을 모두 입력해 주세요.";
           isValid = false;
	
		   return isValid;		
		}
   }
   

   // 전화번호 검증
   const countryNum = document.getElementById("countryNum").value;
   const userPart1 = document.getElementById("userPart1").value.trim();
   const userPart2 = document.getElementById("userPart2").value.trim();
   const phoneError = document.getElementById("phoneError");

   // userPart1과 userPart2가 각각 4자리인지 확인
   if ((userPart1.length !== 4 || userPart2.length !== 4)) {
       phoneError.style.display = "block";
       phoneError.textContent = "※ 전화번호는 각 4자리 숫자를 입력해 주세요.";
       isValid = false;
       return isValid;
   }

   // 국가번호가 입력되었을 때만 userPart1과 userPart2를 검사하고, 그 외의 경우는 정상 처리
   if ((countryNum && (!userPart1 || !userPart2)) || (!countryNum && (userPart1 || userPart2))) {
       phoneError.style.display = "block";
       phoneError.textContent = "※ 전화번호를 올바르게 입력해 주세요.";
       isValid = false;
       return isValid;
   }

   const addressDetail = document.getElementById("address_detail").value.trim();
   const addressError = document.getElementById("addressError");
   const consonantPattern = /[ㄱ-ㅎ]/;
   
   if (consonantPattern.test(addressDetail)) {
	   addressError.style.display = "block";
	   addressError.textContent = "※ 상세 주소에 자음만 입력할 수 없습니다.";
	   isValid = false;
	   return isValid;
   }
   		
   return isValid; // 폼 제출을 허용하거나 중지
}



function showSuccessModal(msg) {
	getCheckModal(msg);

	$(document).on('click', '#confirm-delete', function() {
		window.location.href = '/user/mypage/update-page';
	});
}
	   

function prepareSubmit() {
   // 이메일 조합
   const emailUser = document.getElementById("emailUser").value.trim();
   const emailDomainSelect = document.getElementById("emailDomain").value;
   const fullEmail = emailUser && emailDomainSelect ? `${emailUser}@${emailDomainSelect}` : "";

   // 주소와 상세주소 처리
   const address = document.getElementById("address_kakao").value.trim();
   
   // addressDetail이 빈 값일 경우 공백을 넣기 위한 처리
   let addressDetail = document.getElementById("address_detail").value.trim();
   addressDetail = addressDetail === "" ? " " : addressDetail;

   // 전화번호 조합
   const countryNum = document.getElementById("countryNum").value;
   const userPart1 = document.getElementById("userPart1").value.trim();
   const userPart2 = document.getElementById("userPart2").value.trim();
   const fullPhone = countryNum && userPart1 && userPart2 ? `${countryNum}-${userPart1}-${userPart2}` : ""; 

   // 폼 유효성 검사 실행
   if (!validateForm()) {
       return false;
   }

   // 서버로 AJAX 요청 전송
   const data = {
       member_email: fullEmail,
       member_phoneNo: fullPhone,
       member_pw: document.getElementById("input-pw").value,
       member_addr: address,
       member_detail_addr: addressDetail,
       kakao_login_cd: document.getElementById("kakao_login_cd").value,
       naver_login_cd: document.getElementById("naver_login_cd").value,
   };

   fetch('/user/mypage/updatedata', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
       },
       body: JSON.stringify(data)
   })
   .then(response => response.json())
   .then(result => {
       if (result.success) {
	   	   showSuccessModal('회원 정보가 수정되었습니다.');
		   return;
       } else {
		   getErrorModal('수정에 실패했습니다 : ' + result.message);
		   return;
	   }
   })
   .catch(error => {
       getErrorModal('오류가 발생했습니다.');
	   return;
   });

   return false; // 페이지 새로고침 방지
}
