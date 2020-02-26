<template>
  <div class="d-flex h-100 align-content-center">
    <div class="jumbotron justify-content-center" v-if="!component">
      <h1 class="display-1 text-center">Eurovisualiser</h1>
      <div class="d-flex justify-content-around">
      <button class="btn btn-primary btn-lg" @click="goViewer">View</button>
      <button class="btn btn-warning btn-lg" @click="goInput">Input</button>
      </div>
    </div>
    <component :is="component" v-bind="currentProperties" @add-one="addOne" @next="next" @undo="undo"></component>
  </div>
</template>

<script>
  import io from "socket.io-client";
  import Viewer from "./components/Viewer";
  import DataInput from "./components/DataInput";
  var socket = io.connect("http://localhost:3000");

  export default {
    components: {
      Viewer,
      DataInput
    },
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
        if (this.component === 'Viewer') {
          return { totals: this.totals, current: this.current }
        }
        if (this.component === 'DataInput') {
          return { current: this.current }
        }
        return {}
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
      goViewer() {
        this.component = "Viewer";
      },
      goInput() {
        this.component = "DataInput";
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
  background-image: url(../public/wil-stewart-RpDA3uYkJWM-unsplash.jpg)
}
</style>
