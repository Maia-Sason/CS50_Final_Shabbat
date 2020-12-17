document.addEventListener('DOMContentLoaded', ()=> {
    var socket = io.connect('http://' + document.domain + ':' + location.port);

    socket.on('message', data => {
        console.log(data)
        document.body.style.background = data
    });

    socket.on('connect', ()=> {
        socket.send("connected");
    });

    document.querySelector('#changecolor').onclick = () => {
        socket.send("red");
       
    }

    

});