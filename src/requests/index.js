import Vue from 'vue/dist/vue.js'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Requests from './index.vue'
import io from 'socket.io-client'
import axios from 'axios'
import VueScroll from 'vuescroll/dist/vuescroll-native';

import Element from 'element-ui';
//Vue.use(Element);

//import 'vuescroll/dist/vuescroll.css';

import locale from 'element-ui/lib/locale/lang/ru-RU'

Vue.use(Element, { locale })


Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueScroll);

var socket = io.connect('http://10.10.10.234:80');

import moment from 'moment'
moment.updateLocale('ru', {});

const textStatus = {
  0: 'Удалено',
  1: 'В очереди',
  2: 'В обработке',
  3: 'Выполнено',
}

const store = new Vuex.Store({
  state: {
    requests: [],
    account: {},
    callStatusOn: false,
    inervalUpdateRequstsId: null,
    urlForUpdateListRequests: '',
    numRowActiveDescriptionRequest: -1,
  },
  mutations: {

    SetNumRowActiveDescriptionRequest (state, numRow) {
      state.numRowActiveDescriptionRequest = numRow
    },

    GetListRequestsQueue (state) {

      console.log(state.urlForUpdateListRequests)

      axios.get('/dashboard/requests/' + state.urlForUpdateListRequests, {})
      .then(function (response) {
        response.data.map(function(item, i){
          item.date_format = moment(item.date_start).format('D-MM-YYYY / HH:mm:ss')
          item.date_formatNow = moment(item.date_start).fromNow();

          item.date_processed_format = moment(item.date_processed_request).format('D-MM-YYYY / HH:mm:ss')

          item.number_callback = item.number_phone_consumer || item.call_from_number_phone
          item.text_status = textStatus[item.status_request]
        })
        state.requests = response.data;
      })
      .catch(function (error) {
        console.log(error);
      })       
    },


    InitializationSession (state) {

      state.urlForUpdateListRequests = 'list_queue_processed';
      store.commit('GetListRequestsQueue')

      setInterval(function(){store.commit('GetListRequestsQueue')}, 14000)

      axios.get('/account', {})
      .then(function (response) {
        state.account = response.data.account;
      })
      .catch(function (error) {
        console.log(error);
      });
    },


    LogOut () {
      axios.get('/logout', {})
      .then(function (response) {
        if (response.data.logout) {
          document.location.href = '/login';
        }
      })
      .catch(function (error) {
        console.log(error);
      });   
    },


    SetStatusRequest (state, data_request) {
      axios.post('/dashboard/request/status', data_request)
      .then(function (response) {
        store.commit('GetListRequestsQueue')
      })
      .catch(function (error) {
        console.log(error);
      });   
    },

    CreateNoteToRequest (state, data_request) {
      axios.put('/dashboard/request/note', data_request)
      .then(function (response) {
        store.commit('GetListRequestsQueue')
      })
      .catch(function (error) {
        console.log(error);
      });   
    },

    GetListRequsetProcessed (state) {
      state.urlForUpdateListRequests = 'list_queue_processed';
      store.commit('GetListRequestsQueue')

    },

    GetListRequsetClosed (state, date) {
      state.urlForUpdateListRequests = 'list_deleted_closed/'+date;
      store.commit('GetListRequestsQueue')
    }
  }
})

store.commit('InitializationSession');

const routes = [
  {
    path: '/dashboard/requests',
    component: Requests
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
    template: "<router-view><Requests/></router-view>",
    router,
    components: {
      Requests: Requests
    }
})
