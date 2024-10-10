$(document).ready(function () {
    // $('#eye').on('click', function() {
    //     const input = $(this).siblings('input');
    //     if (input.attr('type') === 'password') {
    //         input.attr('type', 'text');
    //         $(this).attr('class', 'fa fa-eye fa-lg').css('color', '#666');
    //     } else {
    //         input.attr('type', 'password');
    //         $(this).attr('class', 'fa fa-eye-slash fa-lg');
    //     }
    // });
    const input = $('.input-pw')

    $('.fa-eye-slash').on('click', function () {
        const eye = $('.fa-eye')
        const slash = $('.fa-eye-slash')

        input.attr('type', 'text')

        eye.addClass('active')
        slash.addClass('hidden')
    });

    $('.fa-eye').on('click', function () {
        const eye = $('.fa-eye')
        const slash = $('.fa-eye-slash')

        input.attr('type', 'password')

        eye.removeClass('active')
        slash.removeClass('hidden')
    });

});