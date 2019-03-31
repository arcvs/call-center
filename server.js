var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

var pg = require('./pg_pool.js');
var pgsql = pg.query();

pgsql.query('SELECT NOW()', (err, res) => {
  if (err) throw err
  //console.log(res.rows)
  //client.end()
})

var ami = new require('asterisk-manager')('5038','10.10.10.234','app','mysecret', true);
// In case of any connectiviy problems we got you coverd.

ami.keepConnected();
// Listen for specific AMI events.

ami.on('hangup', function(evt) {
    //console.log(evt)
});

// Listen for Action responses.
ami.on('response', function(evt) {
    //console.log(evt)
});


var policy = {
  0: '/dashboard/administration',
  1: '/dashboard/callboard',
  2: '/dashboard/requests'
}

app.use(cookieParser());
app.use(bodyParser.json());

app.use(session({
  saveUninitialized: true,
  store: new (require('connect-pg-simple')(session))({pool: pgsql}),
  secret: 'process.env.FOO_COOKIE_SECRET',
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.post('/login', function(req, res, next) {
  pgsql.query({name: 'auth', text: 'SELECT * FROM public.users WHERE email=$1 AND password=$2',
  values: [req.body.email, req.body.password]}
  )
  .then(function(result) {
    if (result.rowCount) {
      req.session.authorized = true;
      req.session.username = req.body.email;
      req.session.policy = result.rows[0].policy;
      req.session.number_phone = result.rows[0].number_phone;
      req.session.account = result.rows[0];
      req.session.userId = result.rows[0].user_id;
      res.send( policy[ result.rows[0].policy ] )
      next();
    }
  })
  .catch(e => console.error(e.stack));
})

app.use('/', function(req, res, next){
  if (req.session.authorized) {
    //console.log(req)
    //console.log(__dirname + policy[req.session.policy])
    //res.redirect(__dirname + policy[req.session.policy])
    next();
  } else {
    res.sendFile(__dirname + '/dist/login.html');
  }
})

app.get('/logout', function(req, res){
  req.session.destroy(function(err) {
    res.send(200, {logout:true})
  })
})

app.get('/', function(req, res){
  if (req.path == '/') {
    res.redirect( policy[req.session.policy] )
  }
})

app.get('/dashboard/administration', function (req, res) {
  if (req.session.policy == 0) {
    res.sendFile(__dirname + '/dist/administration.html');
  } else {
    res.send('403');
  }
});

app.get('/dashboard/callboard', function (req, res) {
  if (req.session.policy == 1) {
    res.sendFile(__dirname + '/dist/callboard.html');
  } else {
    res.send('403');
  }
});

app.get('/dashboard/requests', function (req, res) {
  if (req.session.policy == 2) {
    res.sendFile(__dirname + '/dist/requests.html');
  } else {
    res.send('403');
  }
});

app.get('/account', function (req, res) {
  res.send(req.session)
});





app.post('/create_request', function (req, res) {
  var r = req.body.data_request
  //console.log(r)

  pgsql.query({name: 'create_request', text: "INSERT INTO public.requests (created_of_user_id, created_of_group_id, created_of_department_id, direction_to_group_id, direction_to_department_id, first_name_consumer, email_consumer, number_phone_consumer, call_from_number_phone, description_request, topic_request, is_call_back, date_start) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12, NOW()) RETURNING request_id",
    values: [
      req.session.userId, 
      req.session.account.group_id, 
      req.session.account.department_id, 
      r.directionToGroupId, 
      r.directionToDepartmentId, 
      r.namePerson, 
      r.email, 
      r.numberPhone, 
      r.callFromNumberPhone,
      r.descriptionRequest,
      r.question,
      r.isCallBack
    ]}
  )
  .then(function(result) {
    //console.log(result)
    if (result.rowCount) {
      res.send(200, result.rows[0].request_id)
    }
  })
  .catch(e => console.error(e.stack));
});





app.get('/dashboard/requests/list_queue_processed', function (req, res) {
  pgsql.query({name: 'get_list_queue_processed', text: 'SELECT *, u_created.first_name AS created_of_first_name, u_created.last_name AS created_of_last_name, u_processed.first_name AS processed_of_first_name, u_processed.last_name AS processed_of_last_name, d_created.name_department AS created_of_department_name, g_created.name_group AS created_of_group_name FROM public.requests AS r LEFT JOIN groups AS g ON g.group_id = r.direction_to_group_id LEFT JOIN groups AS g_created ON g_created.group_id = r.direction_to_group_id LEFT JOIN departments AS d ON d.department_id = r.direction_to_department_id LEFT JOIN departments AS d_created ON d_created.department_id = r.direction_to_department_id LEFT JOIN users AS u_created ON u_created.user_id = r.created_of_user_id LEFT JOIN users AS u_processed ON u_processed.user_id = r.processed_of_user_id WHERE status_request != 3 AND status_request != 0 ORDER BY request_id DESC',
    values: []}
  )
  .then(function(result) {
    res.send(200, result.rows)
  })
  .catch(e => console.error(e.stack));
});

app.get('/dashboard/requests/list_deleted_closed/:date', function (req, res) {

  console.log(req.params.date)

  pgsql.query({
    name: 'get_list_deleted_closed_for_date', 
    text: 'SELECT *, u_created.first_name AS created_of_first_name, u_created.last_name AS created_of_last_name, u_processed.first_name AS processed_of_first_name, u_processed.last_name AS processed_of_last_name, d_created.name_department AS created_of_department_name, g_created.name_group AS created_of_group_name FROM public.requests AS r LEFT JOIN groups AS g ON g.group_id = r.direction_to_group_id LEFT JOIN groups AS g_created ON g_created.group_id = r.direction_to_group_id LEFT JOIN departments AS d ON d.department_id = r.direction_to_department_id LEFT JOIN departments AS d_created ON d_created.department_id = r.direction_to_department_id LEFT JOIN users AS u_created ON u_created.user_id = r.created_of_user_id LEFT JOIN users AS u_processed ON u_processed.user_id = r.processed_of_user_id WHERE $1::timestamp <= date_start AND date_start <= $1::timestamp + \'1 day\'::interval AND (status_request = 3 OR status_request = 0) ORDER BY request_id DESC',
    values: [req.params.date]
  })
  .then(function(result) {
    res.send(200, result.rows)
  })
  .catch(e => console.error(e.stack));
});

//app.get('/dashboard/requests/list_deleted_closed', function (req, res) {
//  pgsql.query({name: 'get_list_deleted_closed', text: 'SELECT *, u_created.first_name AS created_of_first_name, u_created.last_name AS created_of_last_name, u_processed.first_name AS processed_of_first_name, u_processed.last_name AS processed_of_last_name, d_created.name_department AS created_of_department_name, g_created.name_group AS created_of_group_name FROM public.requests AS r LEFT JOIN groups AS g ON g.group_id = r.direction_to_group_id LEFT JOIN groups AS g_created ON g_created.group_id = r.direction_to_group_id LEFT JOIN departments AS d ON d.department_id = r.direction_to_department_id LEFT JOIN departments AS d_created ON d_created.department_id = r.direction_to_department_id LEFT JOIN users AS u_created ON u_created.user_id = r.created_of_user_id LEFT JOIN users AS u_processed ON u_processed.user_id = r.processed_of_user_id WHERE status_request = 3 OR status_request = 0',
//    values: []}
//  )
//  .then(function(result) {
//    res.send(200, result.rows)
//  })
//  .catch(e => console.error(e.stack));
//});

app.post('/dashboard/request/status', function (req, res) {

  pgsql.query({name: 'set_status_request', text: 'UPDATE public.requests SET status_request = $2, processed_of_user_id = $3, date_processed_request = NOW() WHERE request_id = $1',
    values: [
      req.body.request_id,
      req.body.status_request,
      req.session.userId
    ]}
  )
  .then(function(result) {
    res.send(200, result.rows)
  })
  .catch(e => console.error(e.stack));
});

app.get('/dashboard/request/:request_id', function (req, res) {

  pgsql.query({name: 'get_request', text: 'SELECT *, u_created.first_name AS created_of_first_name, u_created.last_name AS created_of_last_name, u_processed.first_name AS processed_of_first_name, u_processed.last_name AS processed_of_last_name, d_created.name_department AS created_of_department_name, g_created.name_group AS created_of_group_name FROM public.requests AS r LEFT JOIN groups AS g ON g.group_id = r.direction_to_group_id LEFT JOIN groups AS g_created ON g_created.group_id = r.direction_to_group_id LEFT JOIN departments AS d ON d.department_id = r.direction_to_department_id LEFT JOIN departments AS d_created ON d_created.department_id = r.direction_to_department_id LEFT JOIN users AS u_created ON u_created.user_id = r.created_of_user_id LEFT JOIN users AS u_processed ON u_processed.user_id = r.processed_of_user_id WHERE request_id = $1',
    values: [
      req.params.request_id
    ]}
  )
  .then(function(result) {
    res.send(200, result.rows[0])
  })
  .catch(e => console.error(e.stack));
});


app.put('/dashboard/request/note', function (req, res) {

  pgsql.query({name: 'get_chat_for_note_to_request', text: 'SELECT chat_for_note_to_request FROM public.requests WHERE request_id = $1',
    values: [req.body.request_id]}
  )
  .then(function(result) {
    var chat = result.rows[0].chat_for_note_to_request;

    //console.log(result)

    if (!chat) {
      chat = []
    }

    req.body.note_to_request.date = new Date().toISOString()
    req.body.note_to_request.autor = req.session.account.first_name + ' ' + req.session.account.last_name

    chat.unshift(req.body.note_to_request)

    pgsql.query({name: 'update_note_to_request', text: 'UPDATE public.requests SET chat_for_note_to_request = $2 WHERE request_id = $1',
      values: [
        req.body.request_id,
        chat
      ]}
    )
    .then(function(result1) {
      res.send(200, result1.rows)
    })
    .catch(e => console.error(e.stack));

  })
  .catch(e => console.error(e.stack));

});






app.get('/dashboard/callboard/qustions', function (req, res) {
  pgsql.query({name: 'get_subject_questions', text: 'SELECT * FROM questions AS q FULL JOIN subject_questions AS sq ON sq.subject_question_id = q.subject_question_id FULL JOIN groups AS g ON g.group_id = q.group_id FULL JOIN departments AS d ON d.department_id = g.department_id',
    values: []}
  )
  .then(function(result) {
    res.send(200, result.rows)
  })
  .catch(e => console.error(e.stack));
});

io.on('connection', function (socket) {
  amiEvent(socket)

  socket.on('AddMemberOfQueue', function(data){
    //console.log(data)
    ami.action({
      'action':'QueueAdd',
      'Queue':'call_center',
      'Interface': data
    }, function(err, res) {
        //console.log(res)
    });
  })
  socket.on('RemoveMemberOfQueue', function(data){
    //console.log(data)
    ami.action({
      'action':'QueueRemove',
      'Queue':'call_center',
      'Interface': data
    }, function(err, res) {
        //console.log(res)
    });
  })
  socket.on('PauseMemberOfQueue', function(data){
    ami.action({
      'action':'QueuePause',
      'Queue':'call_center',
      'Interface': data
    }, function(err, res) {
        //console.log(res)
    });
  })
  socket.on('CallRedirectToNextMemberOfQueue', function(data){
    ami.action({
      'action':'Redirect',
      'Queue':'call_center',
      'Interface': data
    }, function(err, res) {
        //console.log(res)
    });
  })
});

function amiEvent(socket){
  ami.on('managerevent', function(evt) {
    if (evt.queue == 'call_center') {
      //console.log(evt)
    }
    if (evt.queue == 'call_center' && evt.event == 'AgentComplete') {
      //console.log(evt)
      socket.emit('AgentComplete', evt);
    }
    if (evt.queue == 'call_center' && evt.event == 'AgentCalled') {
      //console.log(evt)
      socket.emit('AgentCalled', evt);
    }
  });
}


//app.get('/', function(req, res){
//  //console.log(req.params)
//  res.sendFile(__dirname + '/index.html');
//});
  
app.get('/dist/*', function(req, res){
  res.sendFile(__dirname + '/dist/' + req.params[0]);
});

//app.use('/static', express.static(__dirname + '/dist'));