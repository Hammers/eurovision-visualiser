<template>
  <div class="small">
    {{value}}
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
    }
  };
</script>

<style>

</style>
