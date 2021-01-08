// $(document).ready(function () {
//     $('.item').removeClass('active')
//     $().addClass('active')
// })

$(document).ready(function () {
    $('.hamburger').on('click', function() {
        $('.hamburger').css({'transform': 'Rotate(90deg)'}).fadeOut();
        $('.ham-close').fadeIn().css({'transform': 'Rotate(-90deg)'});
        $('.nav-mobile').show();
        $('.nav-mobile').animate({height: "300vh"});
    })
    $('.ham-close').on('click', function() {
        $('.ham-close').css({'transform': 'Rotate(90deg)'}).fadeOut();
        $('.hamburger').fadeIn().css({'transform': 'Rotate(180deg)'});
        $('.nav-mobile').animate({height: "0%"})
        $('.nav-mobile').hide();
    })
})