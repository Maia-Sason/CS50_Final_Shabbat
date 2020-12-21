document.addEventListener('DOMContentLoaded', ()=> {
    // Connect to socket
    var socket = io.connect('http://' + document.domain + ':' + location.port);

    // When a message is recieved...
    socket.on('message', data => {
        // If message is not user connected...
            // Change background color to whatever is in data
            console.log(data)
    });

    socket.on('button_press', msg => {
        $('#paragraph').html(msg)
        console.log('msg')

    });

    socket.on('start', data => {
        console.log(data.show)
        // document.write(data.show)
        eval(data.show)
        eval(data.wait)
        eval(data.next)
        eval(data.blessShow)

    });

    // On user connect, send data 'connected'
    socket.on('connect', ()=> {
        socket.send("I am connected");
    });

    socket.on('bless', data => {
        console.log(data)
        $('#bless_name').html(data.name)
        $('#english_par').html(data.english)
        $('#hebrew_par').html(data.hebrew)
        $('#eng_heb_par').html(data.eng_heb)
        $('#meaning_par').html(data.meaning)

        $('.toggle').hide()
        $('#hebrew_par').show()
    });

    document.querySelector('#changecolor').onclick = () => {
        let color = ($('#changecolor').html())
        // Send the color as a string message in data
        socket.emit('button_press', color);
        // If html was red set it to blue, else set it to red.
        if ($('#changecolor').html() == "red") {
            $('#changecolor').html('blue')
        } else {
            $('#changecolor').html("red")
        }
    }

    document.querySelector('#start').onclick = () => {
        $('#start').hide()
        socket.emit('start', {'show' : '$("#guest_buttons").show()',
                            'wait' : '$("#wait").toggle()',
                            'next' : '$("#next").show()',
                            'blessShow' : '$("#blessblocks").show()'})
    }

    $('.bless').on('click', function () {
        // send requests to load eng, heb, eng-heb, meaning from server
        data = $(this).val()
        socket.emit('bless', {'id': data})
    });

    document.querySelector('#next').onclick = () => {
        let para = 'this is more info'

        socket.emit('button_press', para)
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