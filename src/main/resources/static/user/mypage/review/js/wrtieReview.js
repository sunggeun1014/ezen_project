$(document).ready(function () {
    let selectedRating = 0; 
	const maxByteLength  = 1000;
	
	
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
			if (str[i] === '\n') {
				byteLength += 1;
			}
	    }
	    return byteLength;
	}
	
	
	$("textarea[name='review_content']").on("input", function () {
	    let textarea = $(this);
	    let content = textarea.val();
	    let byteLength = getByteLength(content);

        while (byteLength > maxByteLength) {
            content = content.slice(0, -1);
			byteLength = getByteLength(content);
        }
        textarea.val(content);  

	    $("#charCount").text(getByteLength(textarea.val()));
	});
	
	
    $(".star").on("click", function () {
        selectedRating = $(this).data('rating'); 
        $("input[name='review_rating']").val(selectedRating); 

        $(".star").each(function () {
            let starValue = $(this).data('rating');
            if (starValue <= selectedRating) {
                $(this).removeClass('far').addClass('fas');
            } else {
                $(this).removeClass('fas').addClass('far');
            }
        });

        $(".rating-value").text(selectedRating + "/5");
    });
});
