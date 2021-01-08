// $(document).ready(function () {
//     $('.item').removeClass('active')
//     $().addClass('active')
// })

$(document).ready(function () {
    $('.nav-items').hide()
    $('.hamburger').on('click', function() {
        $('.hamburger').css({'transform': 'Rotate(90deg)'}).fadeOut();
        $('.ham-close').fadeIn().css({'transform': 'Rotate(-90deg)'});
        $('.nav-items').show()
        $('.nav-mobile').show();
        $('.nav-mobile').animate({height: "100%"});
    })
    $('.ham-close').on('click', function() {
        $('.ham-close').css({'transform': 'Rotate(90deg)'}).fadeOut();
        $('.hamburger').fadeIn().css({'transform': 'Rotate(180deg)'});
        $('.nav-items').hide();
        $('.nav-mobile').animate({height: "0%"});

    })
})