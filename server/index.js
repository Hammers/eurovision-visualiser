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
    "is": 29700,
    "ab": 20092,
    "gr": 25574,
    "sz": 79877,
    "ma": 55896,
    "ru": 58672,
    "as": 10688,
    "bu": 62857,
    "uk": 9362,
    "oz": 35993,
    "az": 53105,
    "no": 62394,
    "ur": 36089,
    "sm": 3278,
    "sw": 42367,
    "fi": 5182,
    "ic": 58915,
    "sp": 12298,
    "ro": 43403,
    "de": 21966,
    "fr": 6788,
    "ge": 52638,
    "ne": 12924,
    "li": 86690,
    "se": 21552,
    "it": 36666
};
let audienceVotes = [];
let juryTotal = 0;
let audienceTotal = 944966;
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