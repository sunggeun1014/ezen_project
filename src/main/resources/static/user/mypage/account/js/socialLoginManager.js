// Kakao SDK 초기화 함수
function initKakao() {
    if (!Kakao.isInitialized()) {
        Kakao.init('4f23d110021dacd702bf22df50d94c73');
    }
}

// 카카오 로그인 처리 함수
const kakaoLogin = function() {
    // Kakao SDK가 초기화되었는지 확인
    if (!Kakao.isInitialized()) {
        return;
    }

    // Kakao 로그인 실행
    Kakao.Auth.login({
        success: function(authObj) {
			
            Kakao.API.request({
                url: '/v2/user/me',
                success: function(response) {
                    const kakaoId = response.id;

                    checkKakaoIdAvailability(kakaoId);
                },
                fail: function(error) {
					
                }
            });
        },
        fail: function(err) {
			
        }
    });
};

// 카카오 ID중복 여부를 확인하는 함수
function checkKakaoIdAvailability(kakaoId) {
    fetch('/user/members/check-kakaoId', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            kakao_login_cd: kakaoId,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('네트워크 응답에 문제가 있습니다.');
        }
        return response.json();
    })
    .then(data => {
        if (data.isAvailable) {
			
            handleKakaoLoginSuccess(kakaoId);
        } else {
			
            getCheckModal('이미 등록된 카카오 계정입니다.');
        }
    })
    .catch(error => {
		
	});
}

// 카카오 로그인이 성공했을 때 처리하는 함수
function handleKakaoLoginSuccess(kakaoId) {
	
    document.getElementById('kakao_login_cd').value = kakaoId;

    const kakaoCheckbox = document.getElementById('kakaoLogin');
    if (kakaoCheckbox) {
        kakaoCheckbox.checked = true;  
    }
}

const kakaoUnlink = function() {
    // 카카오 로그인 코드 값 초기화 (빈 값으로 만듦)
    document.getElementById('kakao_login_cd').value = "";
    
	const kakaoCheckbox = document.getElementById('kakaoLogin');
	
    if (kakaoCheckbox) {
        kakaoCheckbox.checked = false;  
    }

}

function openNaverLoginPopup() {
    var clientId = 'sutMcxM8vDfiUuQgTc15';  // 네이버에서 발급받은 클라이언트 ID
    var redirectUri = encodeURIComponent('http://43.203.118.120:9080/user/members/naver/callback');  // 콜백 URL
    var state = Math.random().toString(36).substring(7);  // 랜덤한 state 값 생성
    var naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

    // 팝업 창 열기
    window.open(naverLoginUrl, 'NaverLogin', 'width=500,height=600');
}

const naverUnlink = function() {
    // 카카오 로그인 코드 값 초기화 (빈 값으로 만듦)
    document.getElementById('naver_login_cd').value = "";
    
	const naverCheckbox = document.getElementById('naverLogin');
	
    if (naverCheckbox) {
        naverCheckbox.checked = false;  
    }
}




