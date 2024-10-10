$(document).ready(function() {
           
       
	$('#submit-btn').on('click', function(e) {
		e.preventDefault();
		let pw = $('#input-pw').val();
		let pwCheck = $('#input-pw-ch').val();
		let errorMessagePhone = $('#error-phone');
		
		let valid = true;

		if (pwCheck) {
			if (!validatePassword(pw)) {
				valid = false;
			}

			if (pw !== pwCheck) {
				valid = false;
			}
		}

		let phonePart1 = $('#phone-part-1').val();
		let phonePart2 = $('#phone-part-2').val();
		let countryNum = $('#countryNum').val();

		if (!phonePart1 || !phonePart2 || phonePart1.length < 4 || phonePart2.length < 4) {
			errorMessagePhone.show();
			valid = false;
		} else {
			$('#manager_phoneNo').val(countryNum + "-" + phonePart1 + "-" + phonePart2);
		}

		if (valid) {
			$('#my-form').submit();
		}
	});
	   
	$('#phone-part-1, #phone-part-2').on('input', function() {
		limitLength(this, 4);
		restrictToNumbers(this);
	}); 
	
	$('#phone-part-1, #phone-part-2').on('click', function(){
		$('#error-phone').hide();
	});
	
	$('#input-pw, #input-pw-ch').on('click', function(){
		$('#error-pw-val').hide();
		$('#error-pw-ch').hide();
	});
	
	$('#input-pw').on('input', function() {
		let pw = $('#input-pw').val();
		let errorMessageVal = $('#error-pw-val');

		if (!validatePassword(pw)) {
			errorMessageVal.show();
		} else {
			errorMessageVal.hide();
		}
	});
	
	$('#input-pw-ch').on('input', function(){
		let pw = $('#input-pw').val();
		let pwCheck = $('#input-pw-ch').val();
		
		if (pw === pwCheck) {
			$('#error-pw-ch').removeClass('error-message').addClass('success-message').text('비밀번호가 일치합니다.').show();
		} else {
			$('#error-pw-ch').removeClass('success-message').addClass('error-message').text('비밀번호가 일치하지 않습니다.').show();
		}
	});
		   
	function limitLength(input, maxLength) {
		setTimeout(function() {
	       	if (input.value.length > maxLength) {
	         	input.value = input.value.slice(0, maxLength); // 입력값을 잘라서 저장
	       	}
	   	}, 0);
   	}
	
	function restrictToNumbers(input) {
      input.value = input.value.replace(/\D/g, '');
  	}
	
	   
   function validatePassword(password) {
       var pwPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;  // 특수문자, 영문자, 숫자 포함, 최소 8자
   	   return pwPattern.test(password);
   }
		  

})