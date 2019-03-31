<template>
  <div class="requests">

      <el-table
        cell-class-name="cell"
        :data="tableData"
        ref="tableRequests"
        :row-key="getRowId"
        height="90%"
        @row-click="aaa"
        :default-sort = "{prop: 'request_id', order: 'ascending'}">

        <el-table-column 
          type="expand"
        >
          <template slot-scope="props">
            <div class="info_request">

              <div style="width: 50%;">
                <p class="description_request"><b>Описание:</b> <br> {{ props.row.description_request }}</p>

                <p><b>Обратный звонок:</b> {{ (props.row.is_call_back)?' обязательно':' нет' }} </p>
                <p><b>Номер для обратного вызова:</b> {{ props.row.number_callback }}</p>
                <p><b>Департамент принявший обращение:</b> {{ props.row.created_of_department_name }}</p>
                <p><b>Отдел принявший обращение:</b> {{ props.row.created_of_group_name }}</p>
                <p><b>Принято оператором:</b> {{ props.row.created_of_first_name }} {{ props.row.created_of_last_name }}</p>
                <p><b>Время создания обращения:</b> {{ formatedDate(props.row.date_start) }}</p>
                <p><b>Время завершения обработки обращения:</b> {{ formatedDate(props.row.date_end) }}</p>
                <br>
                <p><el-button
                  size="mini"
                  type="danger"
                  plain
                  @click="SetStatusRequest(props.row.request_id, 0)">Удалить обращение</el-button></p>
              </div>
              <div style="width: 50%;" class="chat">
                <el-input
                  class="marginTextArea"
                  type="textarea"
                  :autosize="{minRows: 2}"
                  placeholder="Примечание к обращению"
                  v-model="noteToRequest[props.row.request_id]">
                </el-input>
                <el-button plain size="mini" type="primary" v-on:click="CreateNoteToRequest(props.row.request_id)">Сохранить примечание</el-button>
                <div v-for="item in props.row.chat_for_note_to_request" v-bind:key=item.date>
                  <p class="chat_date_note"> {{ formatedDate(item.date) }} - {{ item.autor }} </p>
                  <p class="chat_mess_note"> {{ item.message }} </p>
                </div>
                <p>{{ props.row.note_to_request }}</p>
              </div>

            </div>

          </template>
        </el-table-column>

        <el-table-column
          width="150px"
          prop="request_id"
          label="№ обращения"
          sortable>
        </el-table-column>

        <el-table-column
          width="190px"
          label="Время обращения">
          <template slot-scope="scope">
            <p style="font-size: 9pt">{{ scope.row.date_format }}</p>
            <p style="font-style: italic; font-size: 8pt; color: #999"><i class="el-icon-time"></i> {{ scope.row.date_formatNow }}</p>
          </template>
        </el-table-column>

        <el-table-column
          prop="topic_request"
          label="Тема">
        </el-table-column>

        <el-table-column
          width="150px"
          prop="first_name_consumer"
          label="Имя абонента">
        </el-table-column>

        <el-table-column
          width="140px"
          prop="number_callback"
          label="Номер телефона">
        </el-table-column>

        <el-table-column
          width="120px"
          prop="email_consumer"
          label="Email">
        </el-table-column>

        <el-table-column
          prop="name_department"
          label="Отдел/Департамент">
          <template slot-scope="scope">
            <p style="font-size: 9pt">{{ scope.row.name_group }}</p>
            <p style="font-style: italic; font-size: 8pt; color: #999">{{ scope.row.name_department }}</p>
          </template>
        </el-table-column>

        <el-table-column
          width="160px"
          prop="text_status"
          label="Статус">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p v-show="scope.row.status_request != 1">Диспетчер: {{ scope.row.processed_of_first_name }} {{ scope.row.processed_of_last_name }}</p>
                <p v-show="scope.row.status_request != 1">Время: {{ scope.row.date_processed_format }}</p>
                <div slot="reference" class="name-wrapper">

                  <el-tag size="small"
                    :type="(scope.row.status_request != 1 ) ? (scope.row.status_request == 2 ? 'warning': (scope.row.status_request == 0 ? 'danger': 'success')) : 'danger'">
                    {{ scope.row.text_status }}
                  </el-tag>

                </div>
              </el-popover>
            </template>
        </el-table-column>

        <el-table-column
          width="250px"
          label="Операции">
            <template slot-scope="scope">
              <el-button
                v-show="scope.row.status_request == 1"
                size="mini"
                type="primary"
                @click="SetStatusRequest(scope.row.request_id, 2)">Принять</el-button>
              <el-button
                v-show="scope.row.status_request == 2"
                size="mini"
                type="success"
                @click="SetStatusRequest(scope.row.request_id, 3)">Завершить</el-button>
              <el-button
                v-show="scope.row.status_request == 2"
                size="mini"
                type="danger"
                plain
                @click="SetStatusRequest(scope.row.request_id, 1)">В очередь</el-button>
          </template>
        </el-table-column>

      </el-table>

  </div>
</template>


<script>

  import moment from 'moment'

  export default {

    components: {
    },

    computed: {
      tableData: function () {
        return this.$store.state.requests
      }
    },
    data() { //this.$store.state.requests
      return {
        noteToRequest: {}
      }
    },
    beforeUpdate() {
      //this.$watch('noteToRequest', function (newValue, oldValue) {
      //  console.log(newValue, oldValue)
      //  // Этот коллбэк будет вызван, когда изменится `vm.a`
      //})
      //console.log(moment('2018-12-27T03:01:44.876Z').format('Do MMMM YYYY, h:mm:ss a'))
    },

    methods: {
      getRowId(row){
        return row.request_id
      },
      aaa(row){
        //console.log(this)
        //this.$refs.tableRequests.toggleRowExpansion(row, true);
      },
      //row(){
      //  console.log('3')
      //  return 3
      //},
      formatedDate(date){
        if (date != null) {
          return moment(date).format('DD-MM-YYYY / HH:mm:ss')
        }
      },
      SetStatusRequest(request_id, status_request){
        this.$store.commit('SetStatusRequest', {request_id: request_id, status_request: status_request})
      },
      CreateNoteToRequest(request_id){
        console.log(this.noteToRequest[request_id])
        this.$store.commit('CreateNoteToRequest', {request_id: request_id, note_to_request: {message: this.noteToRequest[request_id]}})
        this.noteToRequest[request_id] = ''
      },

      formatter(row, column) {
        return row.address;
      },
      increment () {
        
        //this.tableData = this.$store.state.requests
        //console.log(this.$store.state.requests)
      },
      decrement () {
        //this.$store.commit('decrement')
      }
    }
  }

</script>


<style lang="scss">
  .requests {
    height: 100%;
    padding-top: 54px;
    width: 100%;
    position: fixed;
  }
  .requests .cell {
    word-break: keep-all;
  }
  .requests .info_request {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
  }
  .requests .info_request p {
    padding-bottom: 7px;
    margin-left: 20px;
  }
  .requests .info_request .marginTextArea {
    width: 100%;
    margin-top: 20px;
    margin-left: 0px;
  }
  .requests .cell p {
    line-height: 14pt;
  }
  .requests .cell .el-button {
    margin-left: 0;
    margin-right: 10px;
  }
  .requests .info_request .description_request {
    font-size: 12pt;
    padding: 20px;
    background-color: rgb(244, 250, 253);
    margin: 0 20px 20px 0px;
  }
  .requests .info_request .chat div {
    border-top: 1px solid #eee;
    margin: 10px 0;
  }
  .requests .info_request .chat .chat_date_note {
    font-size: 8pt;
    font-style: italic;
    color: #CCC;
    margin-top:5px;
  }
  .requests .info_request .chat .chat_mess_note {
    padding: 0;
  }
</style>
