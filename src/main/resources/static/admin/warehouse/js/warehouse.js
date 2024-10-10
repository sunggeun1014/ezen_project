var talbe;
$(document).ready(function() {

    table = $('#warehouse').DataTable({
	ajax: {
	    url: '/admin/warehouse/json'
	},
	
	columnDefs: [
	    { targets: '_all', className: 'dt-center' }
	],
		
	
	columns: [
	    {
	        data: null,
	        render: function() {
	            return '';
	        },
	        orderable: false, 
	        searchable: false 
	    },
	    { 
	        data: 'inv_isbn',
	        render: function(data) {
	            return '<a href="#" class="isbn-link" data-menu-link="warehouse" style="color: inherit; text-decoration: underline; cursor: pointer;">' + data + '</a>';
	        }
	    },
	    { 
			data: 'inv_title', 
			render : function(data){
					
				 if (data.length > 10) {
	                    return data.substring(0, 10) + '...';
	             } else {
					
	               return data;
	             }
	
			}
		},
	    
	    { data: 'inv_qty' },
	    {
	        data: 'inv_registration_date',
			render: function(data, type) {
				if (type === 'display' || type === 'filter') {
					var date = new Date(data);
					var year = date.getFullYear();
					var month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
					var day = String(date.getDate()).padStart(2, '0');
					var formattedDate = `${year}-${month}-${day}`;
					return formattedDate;
				}
				return data;
			}
	    },
	  	{ data: 'zone_num' }
	],
	
	drawCallback: function(settings) {
	    let api = this.api();
		let filteredRecords = api.rows({ search: 'applied' }).count();
		
		$('#total-row').text(`총 ${filteredRecords}건`);
	    api.column(0, { page: 'current' }).nodes().each(function(cell, i) {
	        var pageStart = api.settings()[0]._iDisplayStart;
	        $(cell).html(pageStart + i + 1);
	    });
	},
	
	"info": false,
	lengthChange: false,
	dom: 'lrtip',
	language: {
	    searchPanes: {
	        i18n: {
	            emptyMessage: "조회된 정보가 없습니다."
	        }
	    },
	    infoEmpty: "조회된 정보가 없습니다.",
	    zeroRecords: "조회된 정보가 없습니다.",
	    emptyTable: "조회된 정보가 없습니다.",
	}
        
        
    
    });
    
	$.fn.dataTable.ext.search.push(
	    function(settings, data, dataIndex) {
	        var startDate = $('#startDate').val();
	        var endDate = $('#endDate').val();
	        var warehousingDate = new Date(data[4]);  
	
	        var start = startDate ? new Date(startDate + 'T00:00:00') : null;
	        var end = endDate ? new Date(endDate + 'T23:59:59') : null;
	
	        if (isNaN(warehousingDate)) {
	            return false; 
	        }
	
	        if ((start === null && end === null) || 
	            (start === null && warehousingDate <= end) || 
	            (start <= warehousingDate && end === null) || 
	            (start <= warehousingDate && warehousingDate <= end)) {
	            return true;
	        }
	
	        return false; 
	    }
	);


	
    $('#warehouse tbody').on('click', '.isbn-link', function(e) {
        e.preventDefault(); 

        var data = table.row($(this).parents('tr')).data();

        postToDetailPage(data);
    });
    
    $('#searchButton').on('click', function() {
		
		table.search('').columns().search('').draw(); 

        var selectedColumn = $('#searchColumn').val();
        var keyword = $('#searchKeyword').val();
		table.ajax.reload(); 
        table.column(selectedColumn).search(keyword).draw();
    });

    $('#searchKeyword').on('keypress', function(event) {
        if (event.key === 'Enter') {
            $('#searchButton').click();
        }
    });

    document.querySelectorAll('.input-box input').forEach(function(input) {
        input.addEventListener('focus', function() {
            this.value = '';
        });
    });

    document.querySelector('[onclick="resetFilters()"]').addEventListener('click', resetFilters);
    
    document.querySelectorAll('.date-option').forEach(function(button) {
        button.addEventListener('click', function() {
            setActive(this);  
        });
    });

	datepicker("startDate", "endDate");
});

function setToday() {
    var today = new Date().toISOString().split('T')[0];
    $('#startDate').val(today);
    $('#endDate').val(today).trigger('change');
}

function setDateRange(days) {
    var endDate = new Date(); 
    var startDate = new Date(); 
    startDate.setDate(startDate.getDate() - days); 

    endDate.setHours(23, 59, 59, 999); 

    startDate.setHours(0, 0, 0, 0); 

    $('#startDate').val(startDate.toISOString().split('T')[0]);
    $('#endDate').val(endDate.toISOString().split('T')[0]).trigger('change');
}

function resetFilters() {
    $('#searchKeyword').val('');
    $('#searchColumn').val('1');

    $('#startDate').val('');
    $('#endDate').val('');
	$(".date-btn").removeClass("active");
	
    table.search('').columns().search('').draw(); 
	
    table.draw();
}

function setActive(element) {
    var options = document.querySelectorAll('.date-option');
    options.forEach(function(option) {
        option.classList.remove('active');
    });

    element.classList.add('active');
}

function setActive(element) {
    var options = document.querySelectorAll('.date-option');
    options.forEach(function(option) {
        option.classList.remove('active');
    });

    element.classList.add('active');
}

function postToDetailPage(data) {
    var existingForm = $('#postToDetailForm');

    if (existingForm.length) {
        existingForm.remove();
    }
    
    var form = $('<form>', {
        method: 'POST',
        action: '/admin/warehouse/details'  
    });

    form.append($('<input>', { type: 'hidden', name: 'inv_isbn', value: data.inv_isbn }));

    form.appendTo('body').submit();
} 