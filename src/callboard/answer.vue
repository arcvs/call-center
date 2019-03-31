<template>
  <div class="answer">
    
    <vue-scroll>

      <div class="wrap">
        <FormRequest/>

        <p></p>

        <div v-html="active">

        </div>
      </div>

    </vue-scroll>

  </div>
</template>


<script>

  import formRequest from './formRequest.vue'

  export default {
		components: {
			FormRequest: formRequest
		},
    computed: {
      active() {
        if (Object.keys(this.$store.state.activeQuestion).length != 0) {
          var groupQuestID = this.$store.state.activeQuestion.groupQuestID;
          var questID = this.$store.state.activeQuestion.questID;
          //console.log(this.$store.state.questions[groupQuestID])

          var nameDepartment = this.$store.state.questions[groupQuestID].questions[questID].nameDepartment
          var nameGroup = this.$store.state.questions[groupQuestID].questions[questID].nameGroup
          var answer = this.$store.state.questions[groupQuestID].questions[questID].answer

          return '<p class="header_name">' + nameGroup + ' - ' + nameDepartment + '</p>' + answer;
        }
      },
      timelines() {
        return this.$store.state.timelines;
      }
    },    
    mounted() {
    },
    methods: {
      increment () {
      },
      decrement () {
        this.$store.commit('decrement')
      }
    }
  }

</script>


<style lang="scss">
  .answer {
    height: 100%;
    width: 750px;
    border-left: 1px solid #ffffff;
    font-size: 14pt;
    line-height: 25pt;
    padding: 0 30px;
  }
  .answer .wrap {
    height: 100%;
    width: 98%;
  }
  .answer .wrap p {
    text-indent: 25px;
    padding: 5px 0;
  }
  .answer .wrap .header_name {
    text-indent: 25px;
    font-weight: 500;
    padding: 5px 0;
  }
  .answer .scroll {
    height: 100%;
    width: 100%;
  }
</style>
