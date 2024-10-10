let table = null;

$(document).ready(function() {
	table = $('#supplier-orders-table').DataTable({
		ajax: {
			url: '/admin/supplierOrdersRest/supplierOrders',
			dataSrc: function(json) {
				$("#data-count").text(`총 ${json.recordsTotal}건`);
				return json.data;
			}
		},
		order: [[5, 'desc']],
		columns: [
			{ 
				data: null,
				orderable: false
			},
			{ 
				data: 'order_num',
				render: function(data, type, row) {
					return `<a href="/admin/supplierOrders/detail?order_num=${data}" data-menu-link="supplierOrders" class="order-detail-link">${data}</a>`;
				}
			},
			{ 
				data: 'order_status',
				createdCell: function(td, cellData) {
				    if (cellData === "입고완료") {
				        $(td).addClass('text-color-blue');
				    }
				}
			},
			{ 
				data: 'order_total_qty',
				render: function(data) {
					return `${data}개`
				}
			},
			{ 
				data: 'order_total_price', 
				render: function (data) {
					return numberFormatter(data);
				}
			},
			{ 
				data: 'order_date', 
				render: function(data, type, row) {
			        if (type === 'display' || type === 'filter') {
			            return getFormatDate(data);
			        }
					
		        	return data;
		    	}
			},
			{ data: 'manager_id' }
		],
		columnDefs: [
			{
				targets:"_all" ,
				className:"dt_data_text_center"
			},
			{
			   targets:[0],
			   render: function(data, type, row, meta) {
			       if (type === 'display') {
			           var start = meta.settings._iDisplayStart;
			           return start + meta.row + 1;
			       }
			       return data;
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
            var api = this.api();
            api.column(0, { page: 'current' }).nodes().each(function(cell, i) {
                var pageStart = api.settings()[0]._iDisplayStart;
                $(cell).html(pageStart + i + 1);
            });
        }
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
	
	datepicker("startDate", "endDate");
});

function filter() {
	const input = Number($("#word").val());
	
	if(Number.isInteger(input)) {
		table.ajax.url("/admin/supplierOrdersRest/dataFilter");
		
		table.settings()[0].ajax.data = function(d) {
			d.start_date = $("#startDate").val();
			d.end_date = $("#endDate").val();
			d.order_status = $("input[name='order_status']:checked").val();
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
	
	$("#startDate").val("");
	$("#endDate").val("");
	$("#order-status-all").prop("checked", true);
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
