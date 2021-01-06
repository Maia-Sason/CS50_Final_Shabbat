document.addEventListener('DOMContentLoaded', ()=> {
    // Connect to socket
    var socket = io.connect('http://' + document.domain + ':' + location.port);


    let room = $("#display_name").data('id').toString();
    joinRoom(room);

    // When a message is recieved...
    socket.on('message', data => {
        // If message is not user connected...
            // Change background color to whatever is in data
            $('#user_connected').delay(100).fadeIn(500).html(data.msg).delay(1500).fadeOut(300)
            console.log(data)
    });

    function joinRoom(room) {
        socket.emit('join', {'room' : room,
                            'displayname' : $('#display_name').data('name')})
    }

    socket.on('button_press', msg => {
        $('#paragraph').html(msg)
        console.log('msg')

    });

    socket.on('start', data => {
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

    document.querySelector('#start').onclick = () => {
        $('#start').hide()
        socket.emit('start', {'show' : '$("#guest_buttons").show()',
                            'wait' : '$("#wait").toggle()',
                            'next' : '$("#next").show()',
                            'blessShow' : '$("#blessblocks").show()',
                            'room': room})
    }

    $('.bless').on('click', function () {
        // send requests to load eng, heb, eng-heb, meaning from server
        data = $(this).attr('bless-value');
        socket.emit('bless', {'id': data, 'room': room});
        $('.bless').addClass('bless_normal').removeClass('bless_active');
        $(this).addClass('bless_active').removeClass('bless_normal');
    });

    document.querySelector('#next').onclick = () => {
        let para = 'this is more info'

        socket.emit('button_press', {'para' : para, 'room': room})
    }

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