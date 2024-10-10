document.addEventListener("DOMContentLoaded", function() {
    const items = document.querySelectorAll('.return-complete-item');
    const title = document.getElementById('returnCompleteTitle');

    if (items.length > 0) {
        title.style.display = 'block';
    } else {
        title.style.display = 'none';
    }
});