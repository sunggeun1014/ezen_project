let table = null;

$(document).ready(function() {
	table = $('#inventoryLog-orders-table').DataTable({
		ajax: {
			url: '/admin/inventoryLogRest/list',
			dataSrc: function(json) {
				$("#data-count").text(`총 ${json.recordsTotal}건`);
				return json.data;
			}
		},
		order: [[3, 'desc']],
		columns: [
			{ 
				data: null,
				orderable: false
			},
			{ 
				data: 'log_transaction_num',
				render: function(data, type, row) {
					return `<a href="/admin/inventoryLog/detail?log_transaction_num=${data}" data-menu-link="inventoryLog" class="order-detail-link">${data}</a>`;
				}
			},
			{ 
				data: 'log_transaction_status',
				createdCell: function(td, cellData) {
				    if (cellData === "반품입고" || cellData === "입고") {
				        $(td).addClass('text-color-blue');
				    } else {
						$(td).addClass('text-color-green');
					}
				}
			},
			{ 
				data: 'log_operation_date', 
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
		table.ajax.url("/admin/inventoryLogRest/dataFilter");
		
		table.settings()[0].ajax.data = function(d) {
			d.start_date = $("#startDate").val();
			d.end_date = $("#endDate").val();
			d.search_conditions = $("#searchColumn").val();
			d.word = $("#word").val();
		}
		table.ajax.reload();
	}
	
}

function resetBtn() {
	$(".date-btn").removeClass("active");
	
	$("#startDate").val("");
	$("#endDate").val("");
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
