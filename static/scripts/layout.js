// $(document).ready(function () {
//     $('.item').removeClass('active')
//     $().addClass('active')
// })

$(document).ready(function () {
    $('.hamburger').on('click', function() {
        $('.hamburger').css({'transform': 'Rotate(90deg)'}).fadeOut();
        $('.ham-close').fadeIn().css({'transform': 'Rotate(-90deg)'});
        $('.nav-mobile').show();
        $('.nav-mobile').animate({height: "100%"});
    })
    $('.ham-close').on('click', function() {
        $('.ham-close').css({'transform': 'Rotate(90deg)'}).fadeOut();
        $('.nav-mobile').hide().animate({height: "0%"})
        $('.hamburger').fadeIn().css({'transform': 'Rotate(180deg)'});

    })
})