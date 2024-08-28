function limitLength(input, maxLength) {
	if (input.value.length > maxLength) {
		input.value = input.value.slice(0, maxLength);
	}
}

function validateForm() {
	const userPart1 = document.getElementById('userPart1').value;
	const userPart2 = document.getElementById('userPart2').value;

	if (userPart1.length !== 4 || userPart2.length !== 4) {
		alert('각 부분에 4자리 숫자를 입력해주세요.');
		return false; // 폼 제출 중단
	}
	return true; // 폼 제출 진행
}

function displayEmail() {
	const emailUser = document.getElementById('emailUser').value;
	const emailDomain = document.getElementById('emailDomain').value;
	const completeEmail = `${emailUser}@${emailDomain}`;
	console.log(completeEmail);
}