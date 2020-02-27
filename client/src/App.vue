<template>
  <div class="d-flex align-items-center justify-content-center">
    <!--
    <div class="justify-content-center h-50" v-if="!component">
      <img src="../public/ESC2020_Rotterdam_white.png" alt="" class="h-75">
      <div class="d-flex justify-content-around">
        <button class="btn btn-primary btn-lg" @click="goViewer">View</button>
        <button class="btn btn-warning btn-lg" @click="goInput">Input</button>
      </div>
    </div>
    -->
    <router-view v-bind="currentProperties" @add-one="addOne" @next="next" @undo="undo"></router-view>
  </div>
</template>

<script>
  import io from "socket.io-client";
  var socket = io.connect("https://eurovisualiser.herokuapp.com/");

  export default {
    data() {
      return {
        totals: {},
        current: [],
        component: null
      };
    },
    created() {
      this.getRealtimeData()
    },
    computed: {
      currentProperties: function() {
          return { totals: this.totals, current: this.current }
      }
    },
    methods: {
      getRealtimeData() {
        socket.on("newdata", fetchedData => {
          console.log("data received");
          this.totals = fetchedData.totals;
          this.current = fetchedData.current;
        })
      },
      addOne(countryId) {
        socket.emit("sendMessage",{id:countryId})
      },
      next() {
        socket.emit("next")
      },
      undo() {
        socket.emit("undo")
      }
    }
  };
</script>

<style>
  
  html {
    height: 100%;
  }
  
  body {
    height: 100%;
    background-image: url(../public/wil-stewart-RpDA3uYkJWM-unsplash.jpg);
    font-family: 'Montserrat';
  }
  
</style>
