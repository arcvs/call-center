<template>
  <div class="questions">

    <vue-scroll :ops="ops">
      <div class="wrap">

        <ul>

          <li v-for="item in questions" v-bind:key="item.id">
            <p class="questions_title">{{ item.title }}</p>
            <p class="questions_comment">{{ item.comment }}</p>

            <ul>
              <li v-for="(value, key) in item.questions" v-bind:key="key" v-on:click="doSomething(item.id, value.questionId)" class="questions_text" v-bind:class="{ active: activeQuestion == value.questionId }">
                {{ value.question }}
              </li>
            </ul>

          </li>

        </ul>
        
      </div>
    </vue-scroll>

  </div>
</template>


<script>

  export default {
    data() {
      return {
        ops: {
          vuescroll: {},
          scrollPanel: {},
          rail: {},
          bar: {}
        }
      }
    },
    computed: {
      count() {
        return this.$store.state.count;
      },
      timelines() {
        return this.$store.state.timelines;
      },
      questions() {
        return this.$store.state.questions;
      },
      activeQuestion() {
        return this.$store.state.activeQuestion.questID;
      }
    },
    beforeMount() {
      //getQuestionsAnswers () {
      this.$store.commit('getQuestionsAnswers')
      //}
    },
    methods: {
      doSomething (gqID, qID) {
        //console.log({groupQuestID:gqID, questID:qID})
        this.$store.commit('setQuestion', {groupQuestID:gqID, questID:qID})
      },
    }
  }
</script>


<style lang="scss">
  .questions {
    height: 100%;
    width: 500px;
    background-color: #F9FBFF;
  }
  .questions .wrap {
    height: 100%;
    width: 98%;
  }
  .questions p {
    padding: 0;
    margin: 0;
  }
  .questions ul {
    list-style: none;
    margin: 0;
    padding: 0;
    padding: 7px 0;
  }
  .questions li {
    padding: 10px 0 10px 0;
    padding-left: 30px;
  }
  .questions ul .questions_title {
    font-weight: 500;
    font-family: Bahnschrift;
    font-size: 13pt;
  }
  .questions ul .questions_comment {
    font-style: italic;
    color: rgb(97, 97, 97);
  }
  .questions .questions_text {
    cursor: pointer;
    font-family: "Segoe UI Light", Arial;
    font-size: 14pt;
    line-height: 14pt;
  }
  .questions .questions_text:hover {
    background-color: #cad6e6;
    color: rgb(255, 255, 255);
  }
  .questions .active {
    background-color: #b6c2d1;
    color: rgb(255, 255, 255);
  }
  .questions .active:hover {
    background-color: #b6c2d1;
    color: rgb(255, 255, 255);
  }
</style>
