<template>
  <div class="container ">
    <div class="jumbotron justify-content-center">
      <h1 class="display-1 text-center">Eurovisualiser</h1>
      <div class="d-flex justify-content-around">
      <button class="btn btn-primary btn-lg">View</button>
      <button class="btn btn-warning btn-lg" @click="testEmit">Input</button>
      </div>
    </div>
  </div>
</template>

<script>
  import io from "socket.io-client";
  var socket = io.connect("http://localhost:3000");

  export default {
    data() {
      return {
        value: 0
      };
    },
    created() {
      this.getRealtimeData()
    },
    methods: {
      getRealtimeData() {
        socket.on("newdata", fetchedData => {
          console.log("data received");
          this.value = fetchedData;
        })
      },
      testEmit() {
        socket.emit("sendMessage",'I sent this message');
      }
    }
  };
</script>

<style>

</style>
