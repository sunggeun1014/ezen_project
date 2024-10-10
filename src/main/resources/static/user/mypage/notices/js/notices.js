$(document).ready(function () {
    let currentPage = 0; 
    const pageSize = 10; 
    let totalPages = 1;  

    
    function getSearchKeywordFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('keyword') || '';
    }

    function loadNotices(page, size, searchKeyword = '') {
        $.ajax({
            url: '/user/mypage/notices-page/get-notices-list',
            method: 'GET',
            data: { 
                page: page, 
                size: size,
                keyword: searchKeyword  
            },
            success: function (response) {
                let $noticeList = $('#notices-list');
                $noticeList.empty();  

                let notices = response.notices; 
                let totalCount = response.totalCount; 
                
                let newUrl = `/user/mypage/notices-page?page=${page}`;
                if (searchKeyword) {
                    newUrl += `&keyword=${encodeURIComponent(searchKeyword)}`;
                }
                history.pushState(null, '', newUrl);

                if (notices.length === 0) {  
	                let noNoticesHtml = `
	                    <div class="result-wrap">
	                    	<p>!</p>
	                        <span>검색결과가 없습니다.</span>
	                    </div>`;
	                $noticeList.append(noNoticesHtml);
	            } else {
	                let startNo = page * size + 1; 
	                $.each(notices, function (index, notice) {
	                    let noticeNo = startNo + index; 
	                    let noticeHtml = `
	                        <li class="notice-li">
	                            <span class="notice-no">${noticeNo}</span>
	                            <span class="notice-title">${notice.notice_title}</span>
	                            <input type="hidden" name="noticeNum" value="${notice.notice_num}" />
	                            <span class="notice-date">${notice.notice_write_date}</span>
	                        </li>`;
	                    $noticeList.append(noticeHtml);
	                });
	            }

                $('#notice-qty').html('<span class="qty-number">' + totalCount + '</span>건');

                $('.notice-title').on('click', function () {
                    let clickedIndex = $(this).parent().index();
                    let noticeNum = $(this).siblings('input[name="noticeNum"]').val();

                    let prevNotice = notices[clickedIndex - 1] ? notices[clickedIndex - 1] : null;
                    let nextNotice = notices[clickedIndex + 1] ? notices[clickedIndex + 1] : null;

                    let prevNoticeNum = prevNotice ? prevNotice.notice_num : '';
                    let nextNoticeNum = nextNotice ? nextNotice.notice_num : '';

                    let detailUrl = `/user/mypage/notices-detail?noticeNum=${noticeNum}&prevNoticeNum=${prevNoticeNum}&nextNoticeNum=${nextNoticeNum}`;

                    if (searchKeyword) {
						
                        detailUrl += `&keyword=${encodeURIComponent(searchKeyword)}`;
                    }

                    window.location.href = detailUrl;
                });

                totalPages = Math.ceil(totalCount / pageSize); 
                updatePaginationButtons(totalPages, searchKeyword);
            },
            error: function () {
                alert('공지사항을 불러오는 중 오류가 발생했습니다.');
            }
        });
    }

    function updatePaginationButtons(totalPages, searchKeyword = '') {
        let $pagination = $('#page-area');
        $pagination.empty();  

        let leftIcon = $('<i class="fa-solid fa-angle-left page-arrow"></i>');
        if (currentPage === 0) {
            leftIcon.addClass('disabled');  
        }
        $pagination.append(leftIcon);

        for (let i = 0; i < totalPages; i++) {
            let activeClass = (i === currentPage) ? 'link-on' : '';
            let pageButton = `<button class="page-link ${activeClass}" data-page="${i}">${i + 1}</button>`;
            $pagination.append(pageButton);
        }

        let rightIcon = $('<i class="fa-solid fa-angle-right page-arrow"></i>');
        if (currentPage === totalPages - 1) {
            rightIcon.addClass('disabled');  
        }
        $pagination.append(rightIcon);

        $('.page-link').on('click', function () {
            let page = $(this).data('page');
            if (currentPage !== page) {  
                currentPage = page;
                loadNotices(currentPage, pageSize, searchKeyword); 
            }
        });

        $('.fa-angle-left').on('click', function () {
            if (currentPage > 0) {
                currentPage--;
                loadNotices(currentPage, pageSize, searchKeyword);
            }
        });

        $('.fa-angle-right').on('click', function () {
            if (currentPage < totalPages - 1) {
                currentPage++;
                loadNotices(currentPage, pageSize, searchKeyword);
            }
        });
    }

    $('.default-btn').on('click', function () {
        let searchKeyword = $('.input-long').val(); 
        currentPage = 0; 
        loadNotices(currentPage, pageSize, searchKeyword);  
    });

    $('.input-long').on('keypress', function (e) {
        if (e.which === 13) {  
            $('.default-btn').click();  
        }
    });

    let initialKeyword = getSearchKeywordFromUrl();  
    loadNotices(currentPage, pageSize, initialKeyword);
});