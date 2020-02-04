const express = require("express");
const app = express();
const port = 3000;

const server = app.listen(`${port}`, function() {
    console.log(`Server started on port ${port}`);
});

const io = require("socket.io")(server);



function getRandomValue(){
    return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
}

io.on("connection", socket => {
    console.log("User connected");
    setInterval(() => {
        socket.broadcast.emit("newdata", getRandomValue())
    }, 5000);
    socket.on('sendMessage', function(msg){
        console.log('message: ' + msg);
    });
});