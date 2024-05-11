<template>
  <div class="w-100 app">
    <!--
    <div class="justify-content-center h-50" v-if="!component">
      <div class="d-flex justify-content-around">
        <button class="btn btn-primary btn-lg" @click="goViewer">View</button>
        <button class="btn btn-warning btn-lg" @click="goInput">Input</button>
      </div>
    </div>
    -->
    <router-view v-bind="currentProperties" @submit-votes="submit" @next="next" @reset="reset" @bottom-seven="bottomSeven" @top="top" @audience="audience" @toggle-voting="toggleVoting" @toggle-results="toggleResults"></router-view>
  </div>
</template>

<script>
  import io from "socket.io-client";
  var socket;

  export default {
    data() {
      return {
        totals: {},
        votes: {},
        current: [],
        component: null,
        votingEnabled: false,
        resultsEnabled: false,
        audienceMode: false,
        nextAudienceVote: null,
        totalVotes: 0,
        votesDisplayed: 0,
      };
    },
    created() {
      this.getRealtimeData()
    },
    computed: {
      currentProperties: function() {
        if(this.$route.path === '/admin') {
          return { votes: this.votes, votingEnabled: this.votingEnabled, resultsEnabled: this.resultsEnabled, nextAudienceVote: this.nextAudienceVote }
        } else {
          return { totals: this.totals, current: this.current, audienceMode: this.audienceMode, votingEnabled: this.votingEnabled, resultsEnabled: this.resultsEnabled, votesDisplayed: this.votesDisplayed, totalVotes: this.totalVotes }
        }
      }
    },
    methods: {
      getRealtimeData() {
        console.log(this.$route);
        if(this.$route.path === '/admin') {
          socket = io.connect('/admin')
        }
        else {
          socket = io.connect()
        }
        socket.on("newdata", fetchedData => {
          console.log("data received");
          console.log(fetchedData);
          this.totals = fetchedData.totals;
          this.current = fetchedData.current;
          this.audienceMode = fetchedData.audienceMode;
          this.votingEnabled = fetchedData.votingEnabled;
          this.resultsEnabled = fetchedData.resultsEnabled;
          this.totalVotes = fetchedData.totalVotes;
          this.votesDisplayed = fetchedData.votesDisplayed;
        });
        socket.on("admindata", fetchedData => {
          console.log("data received");
          console.log(fetchedData);
          this.votes = fetchedData.votes;
          this.votingEnabled = fetchedData.votingEnabled;
          this.resultsEnabled = fetchedData.resultsEnabled;
          this.nextAudienceVote = fetchedData.nextAudienceVote;
        })
      },
      submit(votes) {
        votes.selected.reverse();
        socket.emit("submitVotes",votes)
      },
      bottomSeven(id) {
        socket.emit("bottomSeven",{id})
      },
      top(id) {
        socket.emit("top",{id})
      },
      next() {
        socket.emit("next")
      },
      reset() {
        socket.emit("reset")
      },
      audience() {
        socket.emit("audience")
      },
      toggleVoting() {
        socket.emit("toggleVoting")
      },
      toggleResults() {
        socket.emit("toggleResults")
      }
    }
  };
</script>

<style>

@font-face {
  font-family: 'OPTIAuvantGothic';
  src: 
  url('../public/OPTIAuvantGothic-Medium.woff2') format('woff2'),
  url('../public/OPTIAuvantGothic-Medium.woff') format('woff');
  font-weight: normal;
  font-style: normal;

}

  html {
    background-color: #2B0E50;
    height: 100%;
  }
  
  #app {
    font-family: 'OPTIAuvantGothic';
    text-transform: uppercase;
    color: #000000;
    background-color: #2B0E50;
  }
  
  .app {
  font-family: 'OPTIAuvantGothic';
  color: #000000;
  background-color: #2B0E50;
    text-transform: uppercase;
  }
  
</style>
