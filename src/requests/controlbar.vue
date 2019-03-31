<template>
  <div class="controlbar">

    <div class="account">
      <p class="account__first_name">
        {{account.first_name}} {{account.last_name}}
      </p>
    </div>

    <div>
      <el-button size="mini" type="warning" plain @click="GetListRequsetProcessed()">Обращения в очереди и обработке</el-button>
      <span style="margin-left: 30px">Завершенные обращения:</span>
      <el-date-picker
        size="mini"
        v-model="date"
        :change="ChandeDate()"
        format="yyyy-MM-dd"
        value-format="yyyy_MM_dd"
        type="date"
        placeholder="Выберите дату"
        :picker-options="pickerOptions1">
      </el-date-picker>
    </div>

    <div class="exit">
      <el-button size="mini" plain @click="logOut()">Выйти</el-button>
    </div>

  </div>
</template>


<script>

  export default {
    computed: {
      account() {
        return this.$store.state.account;
      },
    },
    data(){
      return {
        date: '',
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        }
      }
    },
    methods: {
      ChandeDate(){
        if(this.date){ // change on datapiker постоянно обновляет дату !
          console.log(this.date)
          this.$store.commit('GetListRequsetClosed', this.date)
        }
      },
      logOut () {
        this.$store.commit('LogOut')
      },
      GetListRequsetProcessed () {
        this.date = '' // !
        this.$store.commit('GetListRequsetProcessed')
      }
    }
  }

</script>


<style lang="scss">
  .controlbar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
    width: 100%;
    height: 50px;
    position: fixed;
    z-index: 999;
    border-bottom: 1px solid #eee;
  }
  .controlbar .account {
    line-height: 100%;
    padding: 0 20px;
    //border-right: 1px solid #ccc;
  }
  .controlbar .exit {
    padding: 0 20px;
  }

  .controlbar .account__first_name {
    font-family: "Segoe UI";
    font-size: 14pt;
    height: 100%;
    line-height: 100%;
  }

</style>
