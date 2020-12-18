document.addEventListener('DOMContentLoaded', ()=> {
    var socket = io.connect('http://' + document.domain + ':' + location.port);

    socket.on('message', data => {
        if (data != 'connected') {
            console.log(data)
            document.body.style.background = data
        }
    });

    socket.on('connect', ()=> {
        socket.send("connected");
    });

    document.querySelector('#changecolor').onclick = () => {
        let color = $('#changecolor').html()
        socket.send(String(color));
        if ($('#changecolor').html() == "red") {
            $('#changecolor').html('blue')
        } else {
            $('#changecolor').html("red")
        }
    }

    

});