let table = null;
console.log("2024-05-11" > "2024-05-10");
$(document).ready(function() {
	table = $('#customer-orders-table').DataTable({
		ajax: {
			url: '/admin/customerOrdersRest/customerOrders',
			dataSrc: function(json) {
				$("#data-count").text(`총 ${json.recordsTotal}건`);
				return json.data;
			}
		},
		order: [[10, 'DESC']],
		columns: [
			{ 
                data: null, // 데이터 소스가 없으므로 null로 설정
                render: function (data, type, row) {
                    return `<input type="checkbox" id="select-row" name="order_num" class="checkbox row-checkbox" value="${row.order_num}"><label for="select-row"></label>`;
				}
            },
			{ 
				data: null,
				orderable: false
			},
			{ 
				data: 'order_num',
				render: function(data, type, row) {
					return `<a href="/admin/customerOrders/detail?order_num=${data}" data-menu-link="customerOrders" class="order-detail-link">${data}</a>`;
				}
			},
			{ data: 'member_id' },
			{ data: 'member_name' },
			{ 
				data: 'total_order_price', 
				render: function (data) {
					return numberFormatter(data);
				}
			},
			{ 
				data: 'order_purchase_date', 
				render: function (data, type, row) {
					return getFormatDate(data);
				}
			},
			{ 
				data: 'order_delivery_status',
				orderable: false
			},
			{ 
				data: 'order_payment_status',
				orderable: false
			},
			{ data: 'order_status' },
			{
				data: 'order_modify_date',
				render: function(data, type, row) {
			        if (type === 'display' || type === 'filter') {
						if(data === row.order_purchase_date) {
							return "-";
						} else {
				            return getFormatDate(data);
						}
			        }
					
			        return data;
			    }
			}
		],
		columnDefs: [
			{ targets: 0, orderable: false },
			{
				targets:"_all" ,
				className:"dt_data_text_center"
			},
			{
			   targets:[1],
			   render: function(data, type, row, meta) {
			       if (type === 'display') {
			           let start = meta.settings._iDisplayStart;
			           return start + meta.row + 1;
			       }
			       return data;
			   }
			},
			{
				targets:[9],
				createdCell: function(td, cellData) {
				    if (cellData === "변경요청") {
				        $(td).addClass('text-color-red');
				    } else if(cellData === "처리완료") {
				        $(td).addClass('text-color-blue');
					}
				}
			}
		],
		info: false,
		lengthChange: false,
		dom: "lrtip",
		language: {
		    searchPanes: {
		        i18n: {
		            emptyMessage: "조회된 정보가 없습니다."
		        }
		    },
		    infoEmpty: "조회된 정보가 없습니다.",
		    zeroRecords: "조회된 정보가 없습니다.",
		    emptyTable: "조회된 정보가 없습니다.",
		},
		drawCallback: function(settings) {
		    let api = this.api();

		    api.column(1, { page: 'current' }).nodes().each(function(cell, i) {
		        let pageStart = api.settings()[0]._iDisplayStart;
		        $(cell).html(pageStart + i + 1);
		    });
		}
	});

	table.on('draw', function() {
	    $(".checkbox").prop('checked', false);
	});

    $('#searchButton').on('click', function() {
		filter();
        table.draw();
    });

	$("#word").on("keydown", function(e) {
		if(e.key === 'Enter') {
			filter();
		}
	})

	// 체크박스
	$('#select-all').on('click', function() {
		var rows = $('#banners').DataTable().rows({ 'search': 'applied' }).nodes();
		$('input[type="checkbox"]', rows).prop('checked', this.checked);
	});


	// 개별 선택
	$('#customer-orders-table tbody').on('change', '.row-checkbox', function() {
		const $row = $(this).closest('tr'); // 체크박스가 있는 행을 선택

		if (this.checked) {
			$row.addClass('selected-row'); // 배경색을 변경할 클래스 추가
		} else {
			$row.removeClass('selected-row'); // 배경색을 변경할 클래스 제거
		}

		// 전체 체크박스와 개별 체크박스의 선택 상태를 비교하여 '전체 선택' 체크박스 상태를 업데이트
		if ($('.row-checkbox:checked').length === $('.row-checkbox').length) {
			$('#select-all').prop('checked', true);
		} else {
			$('#select-all').prop('checked', false);
		}

	});

	// '전체 선택' 체크박스의 상태 변경 시
	$('#select-all').on('change', function() {
		const isChecked = $(this).prop('checked'); // '전체 선택' 체크박스의 상태

		// 모든 개별 체크박스를 '전체 선택'의 상태에 맞춰 변경
		$('.row-checkbox').prop('checked', isChecked);

		// 각 행에 대해 배경색을 업데이트
		if (isChecked) {
			$('#customer-orders-table tbody tr').addClass('selected-row'); // 모든 행에 배경색 클래스 추가
		} else {
			$('#customer-orders-table tbody tr').removeClass('selected-row'); // 모든 행에서 배경색 클래스 제거
		}
	});

	// 페이지 변경 시 체크박스 초기화
	table.on('draw', function() {
		$('#select-all').prop('checked', false); // 전체 체크박스 초기화
		$('.row-checkbox').prop('checked', false); // 개별 체크박스 초기화
		$('#customer-orders-table tbody tr').removeClass('selected-row'); // 선택된 행의 배경색 초기화
	});
	
	datepicker("startDate", "endDate");
	checkboxHandler();
});

function filter() {
	const input = Number($("#word").val());
	
	
	if(Number.isInteger(input)) {
		table.ajax.url("/admin/customerOrdersRest/dataFilter");
		
		table.settings()[0].ajax.data = function(d) {
			d.date_column = $("#dateColumn").val();
			d.start_date = $("#startDate").val();
			d.end_date = $("#endDate").val();
			d.order_status = $("input[name='order_status']:checked").val();
			d.order_delivery_status = $("input[name='order_delivery_status']:checked").val();
			d.search_conditions = $("#searchColumn").val();
			d.word = $("#word").val();
		}
		table.ajax.reload();
	}
	
}

function delivery_request() {
	let checked_values = $("#table-form input[name='order_num']:checked")
	    .map(function() {
	        return $(this).val();
	    }).get();

	if(checked_values.length > 0) { 
		$.ajax({
			url: "/admin/customerOrdersRest/deliveryRequest",
			method: "POST",
			contentType: 'application/json',
			data: JSON.stringify(checked_values),
			success: function(data) {
				getCheckModal(`${data}건 요청완료`);
			},
			error: function () {
				getCheckModal("ERROR");
			}
		});
	} else {
		getCheckModal("1개 이상의 선택이 필요합니다.");
	}
}

function resetBtn() {
	$(".date-btn").removeClass("active");
	
	$("#select-purchase").prop("selected", true);
	$("#startDate").val("");
	$("#endDate").val("");
	$("#order-status-all").prop("checked", true);
	$("#delivery-status-all").prop("checked", true);
	$("#word").val("");
	
	table.ajax.reload();
}

function numberFormatter(number) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal', // 또는 'currency'로 설정 가능
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    
    return formatter.format(number) + "원";
}

function checkboxHandler() {
    $("#select-all").on("change", function() {
        $(".row-checkbox").prop("checked", $(this).prop("checked"));
	});
}