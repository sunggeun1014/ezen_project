document.querySelectorAll('input:not([readonly])').forEach(function(input) {
    input.addEventListener('focus', function() {
        // readonly 속성이 없는 input 박스를 클릭하면 기존 값을 제거
        this.value = '';
    });
});

$(document).ready(function() {
    
    var checkTitle = false;  // 책제목 검증 플래그
    var checkQTY = false;  // 수량 검증 플래그

    // 등록 버튼 클릭 시 검증
    $('#reg-button').on('click', function(event) {
        event.preventDefault(); // 폼 제출 방지

        var inv_title = $('#inv_title').val();
        var inv_qty = $('#inv_qty').val();
        
        // 책 제목과 수량이 입력되었는지 확인
        if (!inv_title || !inv_qty) {
            getCheckModal('책제목과 수량을 확인해 주세요.');
            checkTitle = false;
            checkQTY = false;
            return;
        } else {
            checkTitle = true;
            checkQTY = true;
            getCheckModal("수정이 완료되었습니다.");  // 수정 완료 메시지 모달 표시
        }
    });

    // 모달에서 확인 버튼 클릭 시 폼 제출
    $(document).on('click', '#confirm-delete', function() {
        if (checkTitle && checkQTY) {
            $('#updateFrom').submit();  // 검증이 완료된 경우 폼 제출
        }
    });
});
