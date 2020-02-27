const   express = require("express"),
        app = express(),
        port = process.env.PORT || 3000,
        mongoose = require("mongoose");

const fs = require('fs');

let rawdata = fs.readFileSync('json/countries.json');
let countries = JSON.parse(rawdata);
let points = [1,2,3,4,5,6,7,8,10,12];

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/eurovision");

let totals = {};
for (var i = 0; i < countries.length; i++) {
    totals[countries[i].id] = 0;
}

let current = [];

// Handle production
if (process.env.NODE_ENV === 'production') {
    // Static folder
    app.use(express.static(__dirname + '/public/'));

    // Handle SPA
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

const server = app.listen(`${port}`, function() {
    console.log(`Server started on port ${port}`);
});

const io = require("socket.io")(server);

io.on("connection", socket => {
    console.log("User connected");
    sendData();
    socket.on('sendMessage', function(data){
        let value = points[current.length];
        current.unshift({id:data.id,value});
        totals[data.id] += value;
        sendData();
    });
    socket.on('next',() => {
        current = [];
        sendData();
    });
    socket.on('undo',() => {
        let country = current.splice(0,1);
        let value = points[current.length];
        totals[country[0].id] -= value;
        sendData();
    });
});

function sendData(){
    io.emit("newdata", {totals,current});
}