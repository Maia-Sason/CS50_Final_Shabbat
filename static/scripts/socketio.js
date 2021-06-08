document.addEventListener('DOMContentLoaded', ()=> {
    // Connect to socket
    const socket = io({
        'reconnection': true,
        'reconnectionDelay': 500,
        'reconnectionAttempts': 10
    });


    let room = $("#display_name").data('id').toString();
    joinRoom(room);

    // const tryReconnect = () => {
    //     setTimeout(() => {
    //         socket.io.open((err) => {
    //         if (err) {
    //             tryReconnect();
    //         }
    //         });
    //     }, 2000);
    // }
      
    // socket.io.on("close", tryReconnect);

    // When a message is recieved...
    socket.on('message', data => {
        // If message is not user connected...
            // Change background color to whatever is in data
            $('#user_connected').delay(100).fadeIn(500).html(data.msg).delay(1500).fadeOut(300)
            console.log(data)
    });

    function joinRoom(room) {
        socket.emit('join', {'room' : room,
                            'displayName' : $('#display_name').data('name')})
    }

    socket.on('button_press', msg => {
        $('#paragraph').html(msg)
        console.log('msg')

    });

    socket.on('start', data => {
        $('#end').show()
        console.log(data.show)
        // document.write(data.show)
        $('#blessblocks').show()

    });

    // On user connect, send data 'connected'
    socket.on('connect', ()=> {
        socket.send("I am connected");
        let name = $('#display_name').data('name');
        socket.emit('joined', {'name' : name,'room': room })
    });

    socket.on('bless', data => {
        if ($("#placeholder").hide()) {
            $("#placeholder").fadeIn()
        }

        $('.guest').removeClass('activated')
        $("#heb").addClass('activated')

        console.log(data)
        $('#wait').hide()
        $('#guest_buttons').show()
        $('#bless_name').html(data.name)
        $('#english_par').html(data.english)
        $('#hebrew_par').html(data.hebrew)
        $('#eng_heb_par').html(data.eng_heb)
        $('#meaning_par').html(data.meaning)

        $('.toggle').hide()
        $('#hebrew_par').show()
    });

    socket.on('ending', data=> {
        $("#session_end").fadeIn();
        $('.columns').fadeOut();
        console.log('ended')

        if ($('#guest_goodies') != undefined) {
            var selectedBless = []

            $('#guest_goodies').show();
            for (let i = 0; i < data.length; i++) {
                $("#bless_guest").append("<li><div id=' " +(data[i].id)+ "' bless-value='" + (data[i].id) + "' class='btn-bless bless bless_normal bless_guest'><marquee class=bless_title>"+ (data[i].name) +"</marquee></div></li")
            }

            $('.bless_guest').on('click', function() {
            
                let blessVal = ($(this).attr('bless-value'));

                if ($(this).hasClass('bless_normal')) {
                    selectedBless.push($(this).attr('bless-value'));
                    console.log(selectedBless);
                    $(this).removeClass('bless_normal').addClass('bless_active');
                } else if ($(this).hasClass('bless_active')) {
                    selectedBless.splice(selectedBless.indexOf(blessVal), 1 );
                    $(this).removeClass('bless_active').addClass('bless_normal');
                }
                if (selectedBless.length > 0) {
                    $("#add_bless").show();
                } else {
                    $("#add_bless").hide();
                }
            })

            $('#add_bless').on('click', function () {

                let json_data = JSON.stringify(selectedBless)

                if (selectedBless.length > 0) {
                    console.log(selectedBless)
                    // send ajax call with bless blocks to keep

                    $.ajax({
                        url : "/_add_bless_guest",
                        type : 'post',
                        contentType : "application/json",
                        dataType : 'json',
                        data: json_data,
                    })
                }
                $(this).slideUp()
                $("#guest_goodies").fadeOut()
            })
        }

    })


    if (document.querySelector('#start') != undefined) {
        document.querySelector('#start').onclick = () => {

            $('#start').slideUp()
            socket.emit('start', {'show' : '$("#guest_buttons").show()',
                                'wait' : '$("#wait").toggle()',
                                'next' : '$("#next").show()',
                                'blessShow' : '$("#blessblocks").show()',
                                'room': room})
        }
    }

    if ($('#end') != undefined) {
        $('#end').on('click', function() {
            $('#end').slideUp()
            socket.emit('ending', {
                'room': room
            })
        })

    }

    $('.bless').on('click', function () {
        // send requests to load eng, heb, eng-heb, meaning from server
        if ($("#placeholder").hide()) {
            $("#placeholder").show()
        }
        data = $(this).attr('bless-value');
        socket.emit('bless', {'id': data, 'room': room});
        $('.bless').addClass('bless_normal').removeClass('bless_active');
        $(this).addClass('bless_active').removeClass('bless_normal');
    });

    $('.guest').on('click', function () {
        $('.guest').removeClass('activated')
        $(this).addClass('activated')
    })

});

$(document).ready( function() {
    
    $('#eng').on('click', ()=> {
        $('.toggle').hide()
        $('#english_par').show()
    })
    $('#heb').on('click', ()=> {
        $('.toggle').hide()
        $('#hebrew_par').show()
    })
    $('#eng-heb').on('click', ()=> {
        $('.toggle').hide()
        $('#eng_heb_par').show()
    })
    $('#meaning').on('click', ()=> {
        $('.toggle').hide()
        $('#meaning_par').show()
    })
})