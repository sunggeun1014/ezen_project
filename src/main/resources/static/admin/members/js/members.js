var table;
$(document).ready(function() {

	table = $('#member').DataTable({
		ajax: {
			// 값을 받아오는 url, data타입 작성
			url: '/members',
			dataSrc: 'data'
		},
		
		// 모든 컬럼을 가운데 정렬
		columnDefs: [
            { targets: '_all', className: 'dt-center' }
        ],
        
        // html에서 컬럼 순서대로 db에 저장되어있는 컬럼 이름으로 매핑
		columns: [
			{ data: 'member_name' },
			{ 
				data: 'member_id',
				render: function(data, type, row) {
                    return '<a href="#" class="member-id-link" style="color: inherit; text-decoration: underline; cursor: pointer;">' + data + '</a>';
                }
			},
			{ data: 'member_email' },
			{ data: 'member_phoneNo' },
			{
				data: 'member_date',
				render: function(data, type, row) {
					// date값을 받아올때 -> YYYY-MM-DD HH:MM 식으로 포맷해서 출력해준다
					if (type === 'display' || type === 'filter') {
						var date = new Date(data);
						var formattedDate = date.toISOString().split('T')[0];
						var formattedTime = date.toTimeString().split(' ')[0].substring(0, 5); // Extract HH:MM
						return formattedDate + ' ' + formattedTime;
					}
					return data;
				}
			}
		],

		"info": false, // 기본 적용 텍스쳐 숨기기
		lengthChange: false, // 기본 적용 텍스쳐 숨기기
		dom: 'lrtip', // 기본 검색 필드 숨기기 (f를 제거)

	});
	
	$('#member tbody').on('click', '.member-id-link', function(e) {
        e.preventDefault(); // 기본 링크 동작 방지

        // 클릭된 링크의 행 데이터 가져오기
        var data = table.row($(this).parents('tr')).data();

        // 데이터를 POST 방식으로 전송
        postToDetailPage(data);
    });
	
	// 검색 버튼 클릭 이벤트 핸들러
    $('#searchButton').on('click', function() {
        var selectedColumn = $('#searchColumn').val();
        var keyword = $('#searchKeyword').val();
        // 선택된 컬럼과 입력된 키워드로 필터링
        table.column(selectedColumn).search(keyword).draw(); 
    });

    // searchKeyword에서 Enter 키를 누를 때 searchButton 클릭 이벤트 실행
    $('#searchKeyword').on('keypress', function(event) {
        if (event.key === 'Enter') {
            $('#searchButton').click();
        }
    });

	$('#startDate, #endDate').on('change', function() {
		table.draw(); // 날짜 변경 시 테이블 다시 그리기
	});

	// 날짜 필터링 로직 추가
	$.fn.dataTable.ext.search.push(
		function(settings, data, dataIndex) {
			var startDate = $('#startDate').val();
			var endDate = $('#endDate').val();
			var memberDate = data[4];

			// 날짜 형식을 Date 객체로 변환
			var start = startDate ? new Date(startDate) : null;
			var end = endDate ? new Date(endDate) : null;
			var member = new Date(memberDate);

			if ((start === null && end === null) ||
				(start <= member && (end === null || member <= end))) {
				return true;
			}
			return false;
		}
	);
	
	document.querySelectorAll('.input-box input').forEach(function(input) {
		input.addEventListener('focus', function() {
			// Input 박스를 클릭하면 기존 값을 제거
			this.value = '';
		});
	});

	document.querySelector('[onclick="resetFilters()"]').addEventListener('click', resetFilters);
	
	// 모든 date-option 버튼에 클릭 이벤트 리스너 추가
	document.querySelectorAll('.date-option').forEach(function(button) {
		button.addEventListener('click', function() {
			setActive(this);  // 클릭된 버튼에 'active' 클래스 설정
		});
	});

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
	// 검색어 필터 초기화
	$('#searchKeyword').val('');
	// 기본 첫 번째 옵션으로 설정 html쪽 select 첫번째로 초기화 시켜준다
	$('#searchColumn').val('0');

	// 날짜 필터 초기화
	$('#startDate').val('');
	$('#endDate').val('');

	// DataTables 검색 및 필터링 초기화
	table.search('').columns().search('').draw(); // 검색어 및 모든 컬럼 필터 초기화

	table.draw();
}


function setActive(element) {
    // 모든 date-option 버튼에서 'active' 클래스를 제거
    var options = document.querySelectorAll('.date-option');
    options.forEach(function(option) {
        option.classList.remove('active');
    });

    // 클릭된 요소에 'active' 클래스를 추가
    element.classList.add('active');
}

//값 전달하는 곳
function postToDetailPage(data) {
    // 폼 생성
    var form = $('<form>', {
        method: 'POST',
        action: '/members/details'  // 서버의 상세 페이지 URL로 설정
    });

    // 데이터를 숨김 필드로 추가
    form.append($('<input>', { type: 'hidden', name: 'member_id', value: data.member_id }));

    // 폼을 body에 추가하고 제출
    form.appendTo('body').submit();
} 




