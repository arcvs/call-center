import Vue from 'vue/dist/vue.js'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Administration from './index.vue'
import io from 'socket.io-client'
import axios from 'axios'
import VueScroll from 'vuescroll/dist/vuescroll-native';

import Element from 'element-ui';
Vue.use(Element);

//import 'vuescroll/dist/vuescroll.css';

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueScroll);

var socket = io.connect('http://10.10.10.234:80');

import moment from 'moment'
moment.updateLocale('ru', {});

const store = new Vuex.Store({
  state: {
    questions: {}
  },
  mutations: {

    InitializationSession (state) {
      axios.get('/account', {})
      .then(function (response) {
        state.account = response.data.account;

        store.commit('AddMemberOfQueue', 'SIP/'+state.account.number_phone)
        console.log(state.account)
      })
      .catch(function (error) {
        console.log(error);
      });      
    },

    updateDataTask (state) {
      //updateCalculateData(state.task)
    },
    updateDataMessage (state) {
      //updateCalculateData(state.message)
    }
  }
})

store.commit('InitializationSession');

const routes = [
  {
    path: '/dashboard/administration',
    component: Administration
  },
  //{
  //  path: '/ass',
  //  component: Ass
  //}
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

new Vue({
    el: "#app",
    store,
    template: "<router-view><Administration/></router-view>",
    router,
    components: {
      Administration: Administration
    }
})
