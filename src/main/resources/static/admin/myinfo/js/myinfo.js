window.onload = function() {
           document.getElementById("address_kakao").addEventListener("click", function() {
               new daum.Postcode({
                   oncomplete: function(data) {
                       document.getElementById("address_kakao").value = data.address;
                       document.getElementById("manager_detail_addr").focus();
                   }
               }).open();
           });
       }
	
	   
	   
	   document.getElementById("userPart1").addEventListener("input", function() {
	       limitLength(this, 4);
	   });

	   document.getElementById("userPart2").addEventListener("input", function() {
	       limitLength(this, 4); 
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
		  
		  
       function validateForm() {
           let isValid = true;
		   // 비밀번호 검증
		   const inputPw = document.getElementById("input-pw").value.trim();
		   const inputPwCheck = document.getElementById("input-pw-check").value.trim();
		   const pwError = document.getElementById("pwError");
		   
		   if (!(inputPw === inputPwCheck)) {
		   		pwError.textContent = "비밀번호가 일치하지 않습니다.";
			 	isValid = false;
				
				return isValid;
		   }
		   
		   if (inputPwCheck && !validatePassword(inputPwCheck)) {
				pwError.textContent = "비밀번호 양식에 맞춰 작성해주세요"
				
				isValid = false;
				
				return isValid;
		   }
		   
		   
		   
           // 이메일 검증
           const emailUser = document.getElementById("emailUser").value.trim();
           const emailDomainSelect = document.getElementById("emailDomain").value;
           const customEmailDomain = document.getElementById("customEmailDomain").value.trim();
           const emailError = document.getElementById("emailError");
		  
		   if (!validateEmail(emailUser)) {
				emailError.style.display = "block";
				emailError.textContent = "영문자와 숫자만 입력하세요"
				isValid = false;
				
				return isValid;
		   }
		   
		   if ((emailUser !== "" && !emailUser)) {
				if ((emailDomainSelect === "" && !emailDomainSelect) || (customEmailDomain === "" && !customEmailDomain)) {
	               emailError.style.display = "block";
	               emailError.textContent = "이메일을 모두 입력해 주세요.";
	               isValid = false;
			
				   return isValid;		
				}
		   }
		   

           // 전화번호 검증
           const countryNum = document.getElementById("countryNum").value;
           const userPart1 = document.getElementById("userPart1").value.trim();
           const userPart2 = document.getElementById("userPart2").value.trim();
           const phoneError = document.getElementById("phoneError");

           if ((countryNum && (!userPart1 || !userPart2)) || ((!countryNum || countryNum === "") && (userPart1 || userPart2)) || (userPart1.length !== 4 || userPart2.length !== 4)) {
               phoneError.style.display = "block";
               phoneError.textContent = "전화번호를 모두 입력해 주세요.";
               isValid = false;
           	   
			   
			   return isValid;
			   
		   }
		    
           return isValid; // 폼 제출을 허용하거나 중지
       }

       function toggleCustomDomain() {
           var emailDomainSelect = document.getElementById("emailDomain");
           var customDomainInput = document.getElementById("customEmailDomain");

           if (emailDomainSelect.value === "custom") {
               customDomainInput.style.display = "inline-block"; 
               customDomainInput.name = "emailDomain"; 
               emailDomainSelect.name = "";  
           } else {
               customDomainInput.style.display = "none";  
               emailDomainSelect.name = "emailDomain";  
               customDomainInput.name = "customEmailDomain";  
           }
       }

       function prepareSubmit() {
           // 이메일 조합
           const emailUser = document.getElementById("emailUser").value.trim();
           const emailDomainSelect = document.getElementById("emailDomain").value;
           let emailDomain = emailDomainSelect === "custom" ? document.getElementById("customEmailDomain").value.trim() : emailDomainSelect;
           const fullEmail = emailUser && emailDomain ? emailUser + "@" + emailDomain : "";
           document.getElementById("fullEmail").value = fullEmail;

           // 전화번호 조합
           const countryNum = document.getElementById("countryNum").value;
           const userPart1 = document.getElementById("userPart1").value.trim();
           const userPart2 = document.getElementById("userPart2").value.trim();
           const fullPhone = countryNum && userPart1 && userPart2 ? `${countryNum}-${userPart1}-${userPart2}` : "";
           document.getElementById("fullPhone").value = fullPhone;

           // 폼 유효성 검사
           return validateForm();
       }

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
