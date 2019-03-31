<template>
  <div class="callboard">

    <div>
      <div class="account">
        <p class="account__number_phone">{{account.number_phone}}</p>
        <p class="account__first_name">{{account.first_name}}</p>
        <p class="account__last_name">{{account.last_name}}</p>
      </div>

      <div class="call__block" v-show="callActive">
        <p class="call__calleridnum">{{call.calleridnum}}</p>
      </div>
    </div>

    <div></div>

    <div>
      <div class="exit">
        <el-button size="mini" plain @click="logOut()">Выйти</el-button>
      </div>
    </div>

    

  </div>
</template>


<script>

    //<button v-on:click="addMemberOfQueue" v-show="!callStatusOn">Подключиться</button>
    //<button v-on:click="removeMemberOfQueue" v-show="callStatusOn">Отключиться</button>

export default {
    computed: {
      callActive() {
        return Object.keys(this.$store.state.call).length;
      },
      call() {
        return this.$store.state.call;
      },
      account() {
        return this.$store.state.account;
      },
      callStatusOn() {
        return this.$store.state.callStatusOn;
      }
    },
    methods: {
      logOut () {
        this.$store.commit('LogOut')
      },
      removeMemberOfQueue () {
        this.$store.commit('RemoveMemberOfQueue')
      },
      addMemberOfQueue () {
        this.$store.commit('AddMemberOfQueue')
      }
    }
  }

//cd apps
//npm run build
//nodemon server.js  
//  var JsSIP = require('jssip');
//
//  var socket = new JsSIP.WebSocketInterface('ws://10.10.10.234:8088/ws');
//  var configuration = {
//    sockets  : [ socket ],
//    uri      : 'sip:914@10.10.10.234',
//    password : 'Malta247'
//    //password : 'Phone_Common#777'
//  };
//
//  var ua = new JsSIP.UA(configuration);
//
//  ua.start();
//
//  // Register callbacks to desired call events
//  var eventHandlers = {
//    'progress': function(e) {
//      console.log('call is in progress');
//    },
//    'failed': function(e) {
//      console.log(e);
//      console.log('call failed with cause: '+ e.cause);
//    },
//    'ended': function(e) {
//      console.log('call ended with cause: '+ e.cause);
//    },
//    'confirmed': function(e) {
//      console.log('call confirmed');
//    },
//    //'sdp': function(evt){
//    //  evt.sdp = 'UDP'
//    //}
//  };
//
//  var options = {
//    'eventHandlers'    : eventHandlers,
//    'mediaConstraints' : { 'audio': true, 'video': false }
//  };
//
//  var session = ua.call('sip:999@10.10.10.234', options);

</script>


<style lang="scss">
  .callboard {
    width: 250px;
    height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: stretch;
    //border-right: 1px solid #ccc;
  }
  .callboard .account {
    padding: 20px;
    //border-right: 1px solid #ccc;
  }
  .callboard .call__block {
    margin-top: 20px;
    padding: 15px;
    background-color: rgb(244, 255, 251);
  }
  .callboard .account__number_phone {
    font-family: "Segoe UI Light";
    font-size: 27pt;
    color: #ccc;
  }
  .callboard .account__first_name {
    font-family: "Segoe UI";
    font-size: 14pt;
    color: #777;
    margin-bottom: 10px;
  }
  .callboard .account__last_name {
    font-family: "Segoe UI";
    font-size: 14pt;
    color: #777;
  }
  .callboard .call__calleridnum {
    font-family: "Segoe UI Light";
    font-size: 20pt;
  }
  .callboard .exit {
    font-family: "Segoe UI Light";
    font-size: 20pt;
    padding: 20px;
  }

</style>
