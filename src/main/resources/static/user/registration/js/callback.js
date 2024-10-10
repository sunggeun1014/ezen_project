window.onload = function() {
    // URL의 # 이후 부분에서 access_token을 추출
    const fragment = window.location.hash.substring(1); // # 이후의 값을 가져옴
    const params = new URLSearchParams(fragment);

    const accessToken = params.get('access_token');
    
    if (accessToken) {
        // access_token이 존재하는 경우, 서버로 POST 요청
        sendTokenToServer(accessToken);
    } else {
		
    }
};
// 서버로부터 토큰에서 추출한 아이디를 받아오는 역할
function sendTokenToServer(accessToken) {
    fetch('/user/members/naver/callback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ access_token: accessToken })
    })
    .then(response => response.json())
    .then(data => {

        // 서버로부터 받은 네이버 ID를 hidden input 필드에 저장
        if (data.naverId) {            
            checkNaverIdAvailability(data.naverId);

        } else {
			
        }
    })
    .catch(error => {
		
    });
}

// 네이버 ID 중복 체크 함수
function checkNaverIdAvailability(naverId) {
    fetch('/user/members/check-naverId', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ naver_login_cd: naverId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.isAvailable) {
            window.close();
            if (window.opener) {
                window.opener.document.getElementById('naver_login_cd').value = naverId; // 부모창에 값 설정
                let naverCheckbox = window.opener.document.querySelector('.check-box.naver');
                let naverInfoModifyCheckbox = window.opener.document.querySelector('#naverLogin');

                if (naverCheckbox) {
                    naverCheckbox.checked = true; // 부모 창의 체크박스 체크
                }
                
                // #naverLogin 처리
				if (naverInfoModifyCheckbox) {
				    naverInfoModifyCheckbox.checked = true;  // 체크박스를 체크 상태로 변경
				}
                window.opener.getCheckModal("연동이 완료되었습니다.");

            }
            
        } else {
            window.close(); // 버튼 클릭 시 창 닫기
            
        	window.opener.getCheckModal("이미 등록되어있는 계정입니다.");
        }
    })
    .catch(error => {
		
    });
}

