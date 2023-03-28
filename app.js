var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var db = require('./db');
var tenantConfig = require('./tenantConfig');
var DBQuery = require('./db_query');
//var hbs = require('express-handlebars');
var path = require('path');
var mysql = require('mysql');
var async = require('async');

var admin = require('./routes/admin');
var app = express();

//configuration
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.engine('hbs', hbs({defaultLayout: 'main'}));

//app.set('view engine', 'hbs');
//use middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(expressSession({
  secret: 'ATP3',
  saveUninitialized: false,
  resave: false
}));


app.use(express.static('./public'));



// typeahead

var connection = mysql.createConnection(DBQuery.connectionObj);

connection.connect();


app.get('/search', function (req, res) {
  db.execute(DBQuery.joins.medicine_information_batch).then(values=>{
    var data = [];
    values.forEach(element => {
      data.push(`${element.Medicine_Name}(${element.Total_Quantity})`);
    });
    res.end(JSON.stringify(data));
  })

  // connection.query('SELECT Medicine_Name from medicine_information where Medicine_Name like "%' + req.query.key + '%"', function (err, rows, fields) {
  //   if (err) throw err;
  //   var data = [];
  //   for (i = 0; i < rows.length; i++) {
  //     data.push(rows[i].Medicine_Name);
  //   }
  //   res.end(JSON.stringify(data));
  // });
});


// Routes
app.get('/', function (req, res) {
  res.render('view_login', {
    title: 'Login Panel',
    message: '',
    message_type: '',
    errors: ''
  });
});

app.post('/', function (req, res) {


  //login validations
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();

  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      res.render('view_login', {
        title: 'Login Panel',
        message: '',
        message_type: '',
        errors: result.array(),
        user: req.session.loggedUser,
      });

    } else {
      var user = {
        username: req.body.username,
        password: req.body.password,
        UserType: '',
        Tenant_ID:'',
      }

      var query = DBQuery.user_access.login;
      db.getData(query, [user.username, user.password], function (rows) {
        console.log(rows[0]);
        if (!rows[0]) {
          res.render('view_login', {
            title: 'User Login',
            message: 'Login Failed! Enter Correct Infromatins.',
            message_type: 'alert-danger',
            errors: ''
          });
        } else {
          user.tenant = tenantConfig[rows[0].Tenant_ID] || "Pharmacy Inventory"
          if (rows[0].Usertype == 'Admin') {

            user.UserType = 'Admin';
            req.session.Tenant_ID = rows[0].Tenant_ID;
            req.session.loggedUser = user;

            res.redirect('/admin');

          } else if (rows[0].Usertype == 'Staff') {

            user.UserType = 'Staff';
            req.session.Tenant_ID = rows[0].Tenant_ID;
            req.session.loggedUser = user;

            res.redirect('/admin');

          }
        }
      });

    } // validation end

  });

});



app.get('/admin', function (req, res) {

  if (!req.session.loggedUser) {
    res.redirect('/');
    return;
  }


  // IMPORTANT ROUTING NOTE ******************************
  // add the below code in admin.js => router.get('/')  **
  // exectly same code needs there to work properly     **
  // *****************************************************

  var connection = mysql.createConnection(DBQuery.connectionObj);

async.parallel([
    function (callback) {
        connection.query(DBQuery.dashboard.totalSell, callback)
    },
    function (callback) {
        connection.query(DBQuery.dashboard.todaySell, callback)
    },
    function (callback) {
        connection.query(DBQuery.dashboard.totalUser, callback)
    },
    function (callback) {
        connection.query(DBQuery.dashboard.totalBatch, callback)
    },
    function (callback) {
        connection.query(DBQuery.dashboard.totalMedicine, callback)
    },
    function (callback) {
        connection.query(DBQuery.dashboard.totalSupplier, callback)
    },
    function (callback) {
        connection.query(DBQuery.dashboard.totalCategory, callback)
    },
    function (callback) {
        connection.query(DBQuery.dashboard.totalGeneric, callback)
    },
    function (callback) {
        connection.query(DBQuery.dashboard.totalManufac, callback)
    }
], function (err, rows) {


    console.log(rows[0][0]);
    console.log(rows[1][0]);
    console.log(rows[2][0]);


    // those data needs to be shown on view_admin.ejs
    // Dashboard page requires those data
    // NOT WORKING PROPERLY

    res.render('view_admin', {
        'totalSell': rows[0][0],
        'todaySell': rows[1][0],
        'totalUser': rows[2][0],
        'totalBatch': rows[3][0],
        'totalMedicine': rows[4][0],
        'totalSupplier': rows[5][0],
        'totalCategory': rows[6][0],
        'totalGeneric': rows[7][0],
        'totalManufac': rows[8][0],
        'user': req.session.loggedUser
    });
});



});



// routes
app.use('/admin', admin);


//start the server
app.listen(5000, function () {
  console.log('server started at port 5000');
});

module.exports = app;