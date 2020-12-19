document.addEventListener('DOMContentLoaded', ()=> {
    // Connect to socket
    var socket = io.connect('http://' + document.domain + ':' + location.port);

    // When a message is recieved...
    socket.on('message', data => {
        // If message is not user connected...
        if (data != 'connected') {
            // Change background color to whatever is in data
            console.log(data)
            document.body.style.background = data
        }
    });

    // On user connect, send data 'connected'
    socket.on('connect', ()=> {
        socket.send("connected");
    });

    // On click button 'change color' set color to the button name
    document.querySelector('#changecolor').onclick = () => {
        let color = $('#changecolor').html()
        // Send the color as a string message in data
        socket.send(String(color));
        // If html was red set it to blue, else set it to red.
        if ($('#changecolor').html() == "red") {
            $('#changecolor').html('blue')
        } else {
            $('#changecolor').html("red")
        }
    }

    

});