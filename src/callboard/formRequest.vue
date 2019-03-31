<template>
  <div class="form_request">

    <div class="header_bar">
      <div class="header"> Обращение </div>
      <div class="finder_request">
        <el-input size="mini" placeholder="Номер заявки" v-model="number_request" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" v-on:click="FindRequest"></el-button>
        </el-input>
      </div>
    </div>

    <Modal v-if="showModal" @close="showModal = false">
      <h3 slot="header">Заявка № {{tableData.request_id}} 
                  <el-tag size="small"
                    :type="(tableData.status_request != 1 ) ? (tableData.status_request == 2 ? 'warning': (tableData.status_request == 0 ? 'danger': 'success')) : 'danger'">
                    {{ tableData.text_status }}
                  </el-tag>


      </h3>

              <div slot="body" class="info_request">

                <div style="width: 65%;">
                  <p class="description_request"><b>Описание:</b> <br> {{ tableData.description_request }}</p>
                  <p><b>Обратный звонок:</b> {{ (tableData.is_call_back)?' обязательно':' нет' }} </p>
                  <p><b>Номер для обратного вызова:</b> {{ tableData.number_callback }}</p>
                  <p><b>Департамент принявший обращение:</b> {{ tableData.created_of_department_name }}</p>
                  <p><b>Отдел принявший обращение:</b> {{ tableData.created_of_group_name }}</p>
                  <p><b>Принято оператором:</b> {{ tableData.created_of_first_name }} {{ tableData.created_of_last_name }}</p>
                  <p><b>Время создания обращения:</b> {{ formatedDate(tableData.date_start) }}</p>
                  <p><b>Время завершения обработки обращения:</b> {{ formatedDate(tableData.date_end) }}</p>
                </div>
                <div class="chat" style="width: 30%;">
                  <el-input
                    class="marginTextArea"
                    type="textarea"
                    :autosize="{minRows: 2}"
                    placeholder="Примечание к обращению"
                    v-model="noteToRequest[tableData.request_id]">
                  </el-input>
                  <el-button plain size="mini" type="primary" v-on:click="CreateNoteToRequest(tableData.request_id)">Сохранить примечание</el-button>
                  <div v-for="item in tableData.chat_for_note_to_request" v-bind:key=item.date>
                    <p class="chat_date_note"> {{ formatedDate(item.date) }} - {{ item.autor }} </p>
                    <p class="chat_mess_note"> {{ item.message }} </p>
                  </div>
                  <p>{{ tableData.note_to_request }}</p>
                </div>

              </div>
    </Modal>
        
    <el-form :model="ruleForm2" ref="ruleForm2">

        <el-row type="flex" :gutter="0" justify="space-between">

          <el-col :span="5">
            <div class="grid-content bg-purple">
              <el-form-item prop="name_person">
                <el-input size="small" placeholder="Имя" name="sss" v-model="ruleForm2.name_person" autocomplete="off"></el-input>       
              </el-form-item>
            </div>
          </el-col>


          <el-col :span="5">
            <div class="grid-content bg-purple">
              <el-form-item prop="number_phone">
                <el-input size="small" placeholder="Номер телефона" name="sss" v-model="ruleForm2.number_phone"></el-input>       
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="2">
            <div class="grid-content bg-purple">

              <el-checkbox label="Online activities"  v-model="ruleForm2.is_call_back" status-icon inline><i class="el-icon-phone-outline"></i></el-checkbox>

            </div>
          </el-col>

          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-form-item prop="email">
                <el-input size="small" placeholder="Email" name="sss" v-model="ruleForm2.email"></el-input>       
              </el-form-item>
            </div>
          </el-col>

      
          <el-col :span="2"><div class="grid-content bg-purple-light" style="text-align: center"><strong>{{numberRequest}}</strong>  </div></el-col>
          
          <el-col :span="5">
            <div class="grid-content bg-purple" style="text-align: right">
              <el-button size="small" type="primary" v-on:click="createRequest">Создать обращение</el-button>
            </div>
          </el-col>

        </el-row>

        <el-form-item prop="description">
          <el-input
            class="marginTextArea"
            type="textarea"
            :autosize="{minRows: 2}"
            placeholder="Детализация обращение"
            v-model="ruleForm2.description">
          </el-input>
        </el-form-item>

        <el-row type="flex" :gutter="0" justify="space-between">
          <el-col :span="24">
            <div class="grid-content bg-purple" style="text-align: right">
              <el-button size="small" @click="resetForm('ruleForm2')">Очистить</el-button>
            </div>
          </el-col>
        </el-row>
        
    </el-form>
  </div>
</template>


<script>

  import moment from 'moment'

  import finderRequest from './boxFinderRequest.vue'
  import modals from './modal.vue'

  export default {
		components: {
      BoxFinderRequest: finderRequest,
      Modal: modals
		},
    data() {
      return {
        ruleForm2: {
          name_person: '',
          number_phone: '',
          email: '',
          description: '',
          is_call_back: false,
        },
        number_request: '',
        showModal: false,
        dataRequest: {},
        noteToRequest: {},
        //input: this.$store.state.calleridnum
      }
    },
    computed: {
      tableData: function () {
        return this.$store.state.datafinderReqiest
      },
      active() {
        if (Object.keys(this.$store.state.activeQuestion).length != 0) {
          var groupQuestID = this.$store.state.activeQuestion.groupQuestID;
          var questID = this.$store.state.activeQuestion.questID;

          var nameDepartment = this.$store.state.questions[groupQuestID].questions[questID].nameDepartment
          var nameGroup = this.$store.state.questions[groupQuestID].questions[questID].nameGroup

          return nameGroup + ' - ' + nameDepartment;
        }
      },
      numberRequest () {
        if (this.$store.state.numberRequest) {
          this.$message({
            message: 'Обращение №' + this.$store.state.numberRequest + ' создано',
            type: 'success',
            center: true
          });
        }
        return this.$store.state.numberRequest
      },
      self_number_phone() {
        return this.$store.state.call.calleridnum;
      }
    },    
    mounted() {
    },
    methods: {
      formatedDate(date){
        if (date != null) {
          return moment(date).format('D-MM-YYYY / HH:mm:ss')
        }
      },
      createRequest () {

       //console.log(this.$store.state)

        var request = {} //this.$store.state.dataActiveQuestion
        
        if (Object.keys(this.$store.state.activeQuestion).length != 0) {
          var groupQuestID = this.$store.state.activeQuestion.groupQuestID;
          var questID = this.$store.state.activeQuestion.questID;

          request.question = this.$store.state.questions[groupQuestID].questions[questID].question
          request.directionToDepartmentId = this.$store.state.questions[groupQuestID].questions[questID].departmentId
          request.directionToGroupId = this.$store.state.questions[groupQuestID].questions[questID].groupId
        }



        request.descriptionRequest = this.ruleForm2.description
        request.numberPhone = this.ruleForm2.number_phone
        request.namePerson = this.ruleForm2.name_person
        request.email = this.ruleForm2.email
        request.isCallBack = this.ruleForm2.is_call_back

        if (request.directionToDepartmentId == null || request.directionToGroupId == null) {
          this.$alert('Тема обращения', 'Не заполнено поле', {
            confirmButtonText: 'OK',
            type: 'warning',
            callback: action => {}
          });
        } else if (request.namePerson == '') {
          this.$alert('Имя потребителя', 'Не заполнено поле', {
            confirmButtonText: 'OK',
            type: 'warning',
            callback: action => {}
          });
        } else if (request.descriptionRequest == '') {
          this.$alert('Описание обращения', 'Не заполнено поле', {
            confirmButtonText: 'OK',
            type: 'warning',
            callback: action => {}
          });
        } else {
          this.$store.commit('CreateRequest', request)
        }

      },
      resetForm (formName) {

        this.$store.commit('SetNumberRequest');
        this.$store.commit('setQuestion', {groupQuestID: null, questID:null})
        this.$refs[formName].resetFields();
        this.ruleForm2.is_call_back = false;
      },
      FindRequest(){
        if (this.number_request) {
          console.log(this.number_request)
          this.$store.commit('GetRequest', this.number_request);
          this.showModal = true;
        }
      },
      CreateNoteToRequest(request_id){
        console.log(this.noteToRequest[request_id])
        this.$store.commit('CreateNoteToRequest', {request_id: request_id, note_to_request: {message: this.noteToRequest[request_id]}})
        this.noteToRequest[request_id] = ''
      },
    }
  }

</script>


<style lang="scss">
  //.form_request {
  //}
  //.marginTextArea {
    //margin: 20px 0;
  //}

  .form_request .header_bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .form_request .header_bar .header {
    font-family: "Segoe UI Light";
    font-size: 21pt;
    color: #ccc;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .form_request .header_bar .finder_request {
    margin: 10px 0;
    width: 210px;
  }
  .form_request .info_request {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    width: 100%;
    padding: 0;
  }
  .form_request .info_request .description_request {
    font-size: 12pt;
    padding: 15px;
    background-color: rgb(244, 250, 253);
    margin: 0 10px 10px 0px;
  }
  .form_request .info_request .chat div {
    border-top: 1px solid #eee;
    margin: 7px 0 0 0;
  }
  .form_request .info_request .chat .chat_date_note {
    font-size: 8pt;
    font-style: italic;
    color: #CCC;
    margin-top:7px;
    line-height: 10pt;
  }
  .form_request .info_request .chat .chat_mess_note {
    padding: 7px 0;
    line-height: 10pt;
  }
  .form_request .info_request div p {
    text-indent: 5px;
    font-size: 9pt;
    margin: 0;
    padding: 0;
    width: 100%;
  }
</style>
