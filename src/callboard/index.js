import Vue from 'vue/dist/vue.js'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Callboard from './index.vue'
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

const textStatus = {
  0: 'Удалено',
  1: 'В очереди',
  2: 'В обработке',
  3: 'Выполнено',
}

const store = new Vuex.Store({
  state: {
    callStatusOn: false,
    account: {},
    activeQuestion: {},
    dataActiveQuestion: {},
    formQuestion: {},
    call: {},
    numberRequest: null,
    showModal: false,
    timelines: [],
    task: [],
    message: [],
    questions: {},
    datafinderReqiest: {}
  },
  mutations: {
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

    InitializationSession (state) {
      axios.get('/account', {})
      .then(function (response) {
        state.account = response.data.account;

        store.commit('AddMemberOfQueue', 'SIP/'+state.account.number_phone)

        socket.on('AgentCalled', function (data) {
          //console.log(data);

          if (Object.keys(state.call).length == 0) {

            if( 'SIP/'+state.account.number_phone == data.interface.split('-')[0] ){
              store.commit('InComingСall', data);
            }

          } else if (state.call.linkedid == data.linkedid) {

            if( 'SIP/'+state.account.number_phone != data.interface.split('-')[0] ){
              store.commit('InComingCompleteСall', data);
            }
          }

        });
        
        socket.on('AgentComplete', function (data) {
          //console.log(data);

          if( 'SIP/'+state.account.number_phone == data.interface.split('-')[0] ){
            store.commit('InComingCompleteСall', data);
            store.commit('ClearNumberRequest');
          }

        }); 

        console.log(state.account)
      })
      .catch(function (error) {
        console.log(error);
      });      
    },

    updateDataTask (state) {
      updateCalculateData(state.task)
    },
    updateDataMessage (state) {
      updateCalculateData(state.message)
    },
    CreateRequest (state, data_request) {
      //console.log(state.account)

      data_request.callFromNumberPhone = state.call.calleridnum

      axios.post('/create_request', {data_request})
      .then(function (response) {
        store.commit('SetNumberRequest', response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    },

    SetNumberRequest (state, numberRequest){
      state.numberRequest = numberRequest
    },
    ClearNumberRequest (state){
      state.numberRequest = null
    },

    AddMemberOfQueue (state){
      socket.emit('AddMemberOfQueue', 'SIP/'+state.account.number_phone);
      state.callStatusOn = true;
      console.log(state.callStatusOn)
    },
    
    RemoveMemberOfQueue (state){
      socket.emit('RemoveMemberOfQueue', 'SIP/'+state.account.number_phone);
      state.callStatusOn = false;
      console.log(state.callStatusOn)
    },

    PauseMemberOfQueue (state, numSip){
      socket.emit('PauseMemberOfQueue', numSip);
    },

    CallRedirectToNextMemberOfQueue (state, numSip){
      socket.emit('CallRedirectToNextMemberOfQueue', numSip);
    },
    
    InComingСall (state, data) {
      state.call = data
    },
    InComingCompleteСall (state, date) {
      state.call = {}
    },

    GetRequest (state, number_request) {

      state.datafinderReqiest = {}

      axios.get('/dashboard/request/' + number_request, {})
      .then(function (response) {

        var item = response.data;
        
        item.date_format = moment(item.date_start).format('D-MM-YYYY / HH:mm:ss')
        item.date_formatNow = moment(item.date_start).fromNow()

        item.date_processed_format = moment(item.date_processed_request).format('D-MM-YYYY / HH:mm:ss')

        item.number_callback = item.number_phone_consumer || item.call_from_number_phone
        item.text_status = textStatus[item.status_request]

        state.datafinderReqiest = item
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    
    CreateNoteToRequest (state, data_request) {
      axios.put('/dashboard/request/note', data_request)
      .then(function (response) {
        store.commit('GetRequest', data_request.request_id)
      })
      .catch(function (error) {
        console.log(error);
      });   
    },

    setQuestion (state, data) {
      if (data.groupQuestID == null && data.questID == null) {
        state.activeQuestion = {},
        state.dataActiveQuestion = {}
      } else {
        state.activeQuestion = data
        state.dataActiveQuestion = state.questions[data.groupQuestID].questions[data.questID]
      }
      //console.log(state.dataActiveQuestion)
    },
    getQuestionsAnswers (state) {

      axios.get('/dashboard/callboard/qustions', {})
      .then(function (response) {

        var groups = {};

        response.data.forEach(function(item) {
          if (!groups.hasOwnProperty(item.subject_question_id)) {
            groups[item.subject_question_id] = {
              id: item.subject_question_id,
              title : item.title,
              comment: item.comment,
              questions: {}
            };
          }
          groups[item.subject_question_id].questions[item.question_id] = {
            questionId: item.question_id,
            question: item.question,
            answer : item.answer || '',
            groupId: item.group_id,
            nameGroup: item.name_group,
            departmentId: item.department_id,
            nameDepartment: item.name_department
          };
        });
        console.log(groups)
        state.questions = groups;
      })
      .catch(function (error) {
        console.log(error);
      });

    }
  }
})

function updateCalculateData(stateItem){
  stateItem.forEach(function(item,id){
    item['upd'] = moment(item.dt).startOf().fromNow()
    stateItem.splice(id, 1, item)
  })
}

store.commit('InitializationSession');

const routes = [
  {
    path: '/dashboard/callboard',
    component: Callboard
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
    template: "<router-view><Callboard/></router-view>",
    router,
    components: {
      Callboard: Callboard
    }
})
