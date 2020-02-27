import Viewer from "./components/Viewer";
import DataInput from "./components/DataInput";
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    { path: '/', component: Viewer },
    { path: '/input', component: DataInput},
];

export default new VueRouter({
    mode: 'history',
    routes
});