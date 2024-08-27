$(document).ready(function() {

  var table = $('#example').DataTable({
    ajax: {
      url: '/table',
      dataSrc: 'data'
    },
    columns: [
      { data: 'member_id' },
      { data: 'member_pw' },
      { data: 'member_email' },
      { data: 'member_addr' },
      { data: 'member_detail_addr' },
      { data: 'member_date' }
    ],
    "info": false,
    lengthChange: false,
    dom: 'lrtip' // 기본 검색 필드 숨기기 (f를 제거)
  });

  // 검색 버튼 클릭 이벤트 핸들러
  $('#searchButton').on('click', function() {
    var selectedColumn = $('#searchColumn').val();
    var keyword = $('#searchKeyword').val();
    table.column(selectedColumn).search(keyword).draw(); // 선택된 컬럼과 입력된 키워드로 필터링
  });

  $('#startDate, #endDate').on('change', function() {
    table.draw(); // 날짜 변경 시 테이블 다시 그리기
  });

  // 날짜 필터링 로직 추가
  $.fn.dataTable.ext.search.push(
    function(settings, data, dataIndex) {
      var startDate = $('#startDate').val();
      var endDate = $('#endDate').val();
      var memberDate = data[5]; // 가입날짜 데이터 (6번째 컬럼)

      // 날짜 형식을 Date 객체로 변환
      var start = startDate ? new Date(startDate) : null;
      var end = endDate ? new Date(endDate) : null;
      var member = new Date(memberDate);

      if ((start === null && end === null) || // 날짜가 설정되지 않았거나
        (start <= member && (end === null || member <= end))) {
        return true;
      }
      return false;
    }
  );
  
});

function setToday() {
  var today = new Date().toISOString().split('T')[0];
  $('#startDate').val(today);
  $('#endDate').val(today).trigger('change');
}

function setDateRange(days) {
  var startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  $('#startDate').val(startDate.toISOString().split('T')[0]);
  $('#endDate').val(new Date().toISOString().split('T')[0]).trigger('change');
}

function resetFilters() {
  $('#searchKeyword').val('');
  $('#startDate').val('');
  $('#endDate').val('').trigger('change');
}
