import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Calculator from "../views/Calculator";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Symbol List',
        component: Home
    },
    {
        path: '/calculator/:symbol',
        name: 'Coin Calculator',
        component: Calculator
    },
]

const router = new VueRouter({
    routes
})

export default router
