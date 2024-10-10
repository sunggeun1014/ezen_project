$(document).ready(function () {

	let currentPage = 1;
	const pageSize = 10;
	let globalStartDate = '';
	let globalEndDate = '';
	let globalStatus = 'pending';  // 초기 상태는 'pending'으로 설정
	
    loadBooks(globalStatus);

    datepicker('startDate', 'endDate');

    $('#searchBtn').on('click', function () {
        let startDate = $('#startDate').val();
        let endDate = $('#endDate').val();

        if (!startDate && !endDate) {
            getCheckModal('시작일 또는 종료일을 선택해주세요.');
            return;
        }

        if (!endDate) {
            endDate = new Date();
        } else {
            endDate = new Date(endDate);
        }

        if (!startDate) {
            startDate = new Date('1970-01-01');
        } else {
            startDate = new Date(startDate);
        }

        globalStartDate = formatDateForDB(startDate, 'start');
        globalEndDate = formatDateForDB(endDate, 'end');

		currentPage = 1;
		loadBooks(globalStatus, currentPage, pageSize, globalStartDate, globalEndDate);
    });

    $('.tab-btn').on('click', function () {
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');

        if ($(this).text() === '리뷰를 기다리는 도서') {
            globalStatus = 'pending';
        } else if ($(this).text() === '내가 작성한 리뷰') {
            globalStatus = 'written';
        }
		currentPage = 1;  // 상태 변경 시 첫 번째 페이지부터 시작
        loadBooks(globalStatus, currentPage, pageSize, globalStartDate, globalEndDate);
    });

    function loadBooks(type, currentPage = 1, pageSize = 10, startDate = '', endDate = '') {
        $('#book-list').empty();
		let url = '';
        let requestData = {
            page: currentPage,
            pageSize: pageSize
        };

        if (type === 'pending') {
            url = '/user/mypage/my-reviews-page/pending-reviews';
        } else if (type === 'written') {
            url = '/user/mypage/my-reviews-page/written-reviews';
        }

        if (startDate && endDate) {
            requestData.startDate = startDate;
            requestData.endDate = endDate;
        }

        $.ajax({
            url: url,
            method: 'GET',
            data: requestData,
            success: function (response) {
                const data = response.reviews;
                const totalPages = response.totalPages;

                if (data.length === 0) {
                    $('.result-wrap').show();
                    $('#book-list').empty().hide();
					updatePagination(0, 1);
                } else {
                    $('.result-wrap').hide();
                    $('#book-list').empty().show();

                    $.each(data, function (index, book) {
                        let imageUrl = "/images/books/" + book.book_isbn + ".jpg";
                        let purchaseDateFormatted = formatDate(book.order_purchase_date);

                        if (type === 'pending') {
                            let bookHtml = `
                                <div class="book-info">
                                    <div class="book-wrap">
										<a href='/user/products/detail?book_isbn=${book.book_isbn}'>
	                                        <img src="${imageUrl}" alt="책 이미지">
										</a>
                                        <div class="book-details">
											<a href='/user/products/detail?book_isbn=${book.book_isbn}'>
                                            	<span class="book-title">${book.book_name}</span>
											</a>
                                            <span class="book-author">저자: ${book.book_author}</span>
                                            <span class="book-date">구매일: ${purchaseDateFormatted}</span>
                                        </div>
                                    </div>
                                    <button class="default-btn border size-up review-btn" data-order-detail-num="${book.order_detail_num}">리뷰작성</button>
                                </div>`;
                            $('#book-list').append(bookHtml);
                        } else if (type === 'written') {
                            let starsHtml = '<span class="fas fa-star stars"></span>'.repeat(book.review_rating) +
                                '<span class="far fa-star empty-stars"></span>'.repeat(5 - book.review_rating);
                            let reviewDateFormatted = formatDate(book.review_write_date);
                            let reviewHtml = `
                                <div class="review-container">
                                    <div class="book-info-wrapper">
										<a href='/user/products/detail?book_isbn=${book.book_isbn}'>
                                        	<img src="${imageUrl}" alt="책 이미지">
										</a>
										<a href='/user/products/detail?book_isbn=${book.book_isbn}'>
                                        	<div class="book-title">${book.book_name}</div>
										</a>
                                    </div>
                                    <div class="review-box">
                                        <div class="review-stars">${starsHtml}</div>
                                        <div class="review-date">${reviewDateFormatted}</div>
                                        <div class="review-content">${book.review_content}</div>
                                        <div class="review-actions">
                                            <button class="edit-review-btn" data-review-num="${book.review_num}">수정</button>
                                            <span class="btn-spacebetween">|</span>
                                            <button class="delete-review-btn" data-review-num="${book.review_num}">삭제</button>
                                        </div>
                                    </div>
                                </div>`;
                            $('#book-list').append(reviewHtml);
                        }
                    });

                    if (type === 'pending') {
                        $('.review-btn').on('click', function () {
                            let orderDetailNum = $(this).data('order-detail-num');
                            window.location.href = `/user/mypage/write-review?orderDetailNum=${orderDetailNum}`;
                        });
                    }

                    if (type === 'written') {
                        $('.edit-review-btn').on('click', function () {
                            let reviewNum = $(this).data('review-num');
                            editReview(reviewNum);
                        });

                        $('.delete-review-btn').on('click', function () {
                            let reviewNum = $(this).data('review-num');
                            deleteReview(reviewNum);
                        });
                    }

                    updatePagination(totalPages, currentPage);
                }
            },
            error: function () {
                getCheckModal('책 목록을 불러오는 중 오류가 발생했습니다.');
            }
        });
    }

    function updatePagination(totalPages, currentPage) {
        
		const maxPagesToShow = 5;
		
		$('#page-area').empty();
		
		let pageArea = $('#page-area');
		
		let leftIcon = $('<i class="fa-solid fa-angle-left page-arrow"></i>')
		let rightIcon = $('<i class="fa-solid fa-angle-right page-arrow"></i>')
		
		if (currentPage === 1) {
			leftIcon.addClass('arrow-disabled');
		} else {
			leftIcon.on('click', function (){
				currentPage -= 1;
				loadBooks(globalStatus, currentPage, pageSize, globalStartDate, globalEndDate);
				updatePagination(totalPages, currentPage);
			});
		}
		
		pageArea.append(leftIcon);
		
		let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
		let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
		
		if (endPage - startPage < maxPagesToShow - 1) {
	        startPage = Math.max(1, endPage - maxPagesToShow + 1);
	    }
		
		for (let i = 1; i <= totalPages; i++) {
            let pageButton = $('<span class="page-link"></span>').text(i);
            if (i === currentPage) {
                pageButton.addClass('link-on');
            }
            pageButton.on('click', function () {
				currentPage = i;  
                loadBooks(globalStatus, i, pageSize, globalStartDate, globalEndDate);
				updatePagination(totalPages, i);
        	});
			pageArea.append(pageButton);
        }

		if (currentPage === totalPages) {
	        rightIcon.addClass('arrow-disabled');
	    } else {
	        rightIcon.on('click', function () {
	            currentPage += 1;
	            loadBooks(globalStatus, currentPage, pageSize, globalStartDate, globalEndDate);
	            updatePagination(totalPages, currentPage);
	        });
	    }
		
		pageArea.append(rightIcon);
    }

    function formatDateForDB(date, type) {
        let formattedDate = new Date(date).toISOString().split('T')[0];
        return type === 'start' ? formattedDate + ' 00:00:00' : formattedDate + ' 23:59:59';
    }
	
	function getByteLength(str) {
	    let byteLength = 0;
	    for (let i = 0; i < str.length; i++) {
	        let charCode = str.charCodeAt(i);
	        if (charCode <= 0x007F) {
	            byteLength += 1;
	        } else if (charCode <= 0x07FF) {
	            byteLength += 2;
	        } else {
	            byteLength += 3;
	        }
	    }
	    return byteLength;
	}
	
	
    function getReviewEditModal(review, onSave) {
		const maxByteLength  = 1000;
        let modalDiv = $("<div id='myModal' class='modal' style='display: block;'></div>");
        let modalContent = $("<div class='edit-modal-content'></div>");
        let modalItem = $("<div class='edit-modal-item'></div>");
		let modalHead = $("<div class='modal-head'><h3>리뷰 수정</h3></div>")
        let title = $(`<h2>${review.book_name}</h2>`);
        let starRatingArea = $("<div class='modal-stars'></div>");
        let reviewTextArea = $(`<div style="position: relative;">
									<textarea class='modal-textarea' id="review_content">${review.review_content}</textarea>
									<p class="char-count" style="bottom: 0px; right: 22px;">
										<span id="charCount">0</span><span>/1000</span>
									</p>
								</div>`);
        
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= review.review_rating) {
                starsHtml += `<span class='fas fa-star star' data-rating='${i}'></span>`;
            } else {
                starsHtml += `<span class='far fa-star star' data-rating='${i}'></span>`;
            }
        }
        starRatingArea.html(starsHtml);
        
        let modalFooter = $("<div class='modal-footer'></div>");
        let confirmButton = $("<button id='confirm-edit' class='modal-btn confirm'>저장</button>");
        let cancelButton = $("<button id='cancel-edit' class='modal-btn cancel'>취소</button>");
        
        modalFooter.append(confirmButton).append(cancelButton);
		modalContent.append(modalHead);
        modalItem.append(title);
        modalItem.append(starRatingArea);
        modalItem.append(reviewTextArea);
        modalContent.append(modalItem);
        modalContent.append(modalFooter);
        modalDiv.append(modalContent);
        $("body").append(modalDiv);
        
        let selectedRating = review.review_rating; 
        $(".star").on("click", function () {
            selectedRating = $(this).data('rating'); 
            $(".star").each(function () {
                let starValue = $(this).data('rating');
                if (starValue <= selectedRating) {
                    $(this).removeClass('far').addClass('fas');
                } else {
                    $(this).removeClass('fas').addClass('far');
                }
            });
        });
        
        $("#confirm-edit").on("click", function () {
            let newContent = $('#review_content').val();
            onSave(newContent, selectedRating);
            modalDiv.remove(); 
        });
        
        $("#cancel-edit").on("click", function () {
            modalDiv.remove(); 
        });

        $("#confirm-edit").focus();
		
		$("#review_content").on("input", function () {
		    let textarea = $(this);
		    let content = textarea.val();
		    let byteLength = getByteLength(content);
		    if (byteLength > maxByteLength) {
		        while (getByteLength(content) > maxByteLength) {
		            content = content.substring(0, content.length - 1);
		        }
		        textarea.val(content);  
		    }

		    $("#charCount").text(getByteLength(textarea.val()));
		});
    }

    function editReview(reviewNum) {
        $.ajax({
            url: `/user/mypage/my-reviews-page/edit-review/${reviewNum}`,
            method: 'GET',
            success: function (review) {
                getReviewEditModal(review, function (newContent, newRating) {
                    $.ajax({
                        url: `/user/mypage/my-reviews-page/update-review/${reviewNum}`,
                        method: 'POST',
						contentType: 'application/json',						
                        data: JSON.stringify({
                            review_content: newContent,
                            review_rating: newRating
                        }),
                        success: function () {
                            getCheckModal('리뷰가 수정되었습니다.');
                            loadBooks('written'); 
							return;
                        },
                        error: function () {
                            getCheckModal('리뷰 수정에 실패했습니다.');
							return;
                        }
                    });
                });
            },
            error: function () {
                getCheckModal('리뷰 정보를 불러오는 데 실패했습니다.');
				return;
            }
        });
    }

    function deleteReview(reviewNum) {
		getConfirmModal("정말로 이 리뷰를 삭제하시겠습니까?",'', function() {
		       $.ajax({
		           url: `/user/mypage/my-reviews-page/delete-review/${reviewNum}`,
		           method: 'DELETE',
		           success: function () {
		               getCheckModal('리뷰가 삭제되었습니다.');
		               loadBooks('written'); 
		               return;
		           },
		           error: function () {
		               getCheckModal('리뷰 삭제에 실패했습니다.');
		               return;
		           }
		       });
		   });
    }

    function formatDate(timestamp) {
        var date = new Date(timestamp);
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
});
