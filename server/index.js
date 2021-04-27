const   express = require("express"),
        app = express(),
        port = process.env.PORT || 3000,
        mongoose = require("mongoose");

const fs = require('fs');

let rawdata = fs.readFileSync('json/countries.json');
let countries = JSON.parse(rawdata);
let points = [1,2,3,4,5,6,7,8,10,12];
let votingEnabled = false;
let resultsEnabled = false;
let votes = [];
let audiencePoints = {
    "sw": 344,
    "fi": 302,
    "it": 253,
    "ab": 230,
    "no": 158,
    "de": 149,
    "ur": 118,
    "ro": 113,
    "li": 98,
    "cr": 92,
    "is": 82,
    "pt": 62,
    "po": 51,
    "es": 47,
    "cz": 44,
    "se": 42,
    "sm": 40,
    "au": 24,
    "la": 9,
    "ic": 4,
    "sl": 0,
    "ar": 0
};
let audienceVotes = [];
let juryTotal = 0;
let audienceTotal = 2262;
let nextAudienceIndex = 0;
let nextAudienceVote = null;
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
const admin = io.of('/admin');
var nextVoteId = 0;

io.on("connection", socket => {
    console.log("User connected");
    sendData();
    
    
    socket.on('submitVotes',function(data){
        data.id = Number(nextVoteId);
        nextVoteId++;
        console.log(data);
        votes.push(data);
        sendData();
    })
});


admin.on('connection', socket => {
    console.log('admin connected');
    sendData();
    socket.on('enableVoting',function(data){
        votingEnabled = data.enable;
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
    socket.on('reset',() => {
        for (var i = 0; i < countries.length; i++) {
            totals[countries[i].id] = 0;
        }
        current = [];
        votes = [];
        sendData();
    });
    socket.on('bottomSeven', function(data){
        current = [];
        let currentVotes = votes.find(x => x.id === Number(data.id));
        for (var i = 0; i < 7; i++) {
            let value = points[current.length];
            current.unshift({id: currentVotes.selected[i], value});
            totals[currentVotes.selected[i]] += value;
            juryTotal += value;
        }
        currentVotes.indexDisplayed = 6;
        sendData();
    });
    socket.on('top', function(data){
        let currentVotes = votes.find(x => x.id === Number(data.id));
        let value = points[current.length];
        currentVotes.indexDisplayed++;
        current.unshift({id: currentVotes.selected[currentVotes.indexDisplayed], value});
        totals[currentVotes.selected[currentVotes.indexDisplayed]] += value;
        juryTotal += value;
        sendData();
    });
    socket.on('audience', function(data){
        if(audienceVotes.length === 0) {
            current = [];
            for (var juryVote in totals) {
                audienceVotes.push([juryVote, totals[juryVote]]);
            }
            audienceVotes.reverse();
            audienceVotes.sort(function(a, b) {
                return a[1] - b[1];
            });
            let mult = juryTotal / audienceTotal;
            for(let i = 0; i < audienceVotes.length; i++) {
                audienceVotes[i][1] = Math.round(audiencePoints[audienceVotes[i][0]] * mult);
            }
            
        }
        else {
            current.unshift({id: audienceVotes[nextAudienceIndex][0], value: audienceVotes[nextAudienceIndex][1]});
            totals[audienceVotes[nextAudienceIndex][0]] += audienceVotes[nextAudienceIndex][1];
            nextAudienceIndex++;
        }
        if(nextAudienceIndex < audienceVotes.length) {
            nextAudienceVote = {id:audienceVotes[nextAudienceIndex][0],score:audienceVotes[nextAudienceIndex][1]};
        }
        sendData();
    });
    socket.on('toggleVoting', function()
    {
        votingEnabled = !votingEnabled;
        sendData();
    });
    socket.on('toggleResults', function()
    {
        resultsEnabled = !resultsEnabled;
        sendData();
    });
});

function sendData(){
    let votesDisplayed = votes.filter(x => x.indexDisplayed > 0).length;
    let totalVotes = votes.length;
    io.emit("newdata", {totals,current,audienceMode: audienceVotes.length > 0,votingEnabled,resultsEnabled,votesDisplayed,totalVotes});
    admin.emit("admindata",{votes,votingEnabled,resultsEnabled,nextAudienceVote})
}