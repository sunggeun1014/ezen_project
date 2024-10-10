document.addEventListener("DOMContentLoaded", function() {
    const items = document.querySelectorAll('.cancel-complete-item');
    const title = document.getElementById('cancelCompleteTitle');

    if (items.length > 0) {
        title.style.display = 'block';
    } else {
        title.style.display = 'none';
    }
});