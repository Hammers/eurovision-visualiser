import Viewer from "./components/Viewer";
import DataInput from "./components/DataInput";
import Voting from "./components/Voting";
import Home from "./components/Home";
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path: '/reset', component: Home, beforeEnter: (to,from,next) => {
            delete localStorage.vote2024;
            next({path: "/"});
        }
    },
    { path: '/vote', component: Voting, beforeEnter: (to,from,next) => {
            if (localStorage.vote2024) {
                next({path: "/"});
            } else {
                 next();
            }
        }},
    { path: '/admin', component: DataInput},
    { path: '/results', component: Viewer },
    { path: '/', component: Home },   
];

export default new VueRouter({
    mode: 'history',
    routes
});