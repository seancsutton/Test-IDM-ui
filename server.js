const express = require('express')
const app = express()
const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
const sql = require('mssql')
var users = []
 


// establishing connection with database


  
   
var general = "select u.user_id, u.ed_id,u.email_addr, u.setup_date_time,u.last_login_time,m.model_name, ISNULL((select us.user_status from idm_user_status us where us.user_id = u.user_id and us.model_id = umi.model_id), 'ACTIVE') user_status from idm_user u, idm_user_model_info umi, idm_sys_tp_model m where u.user_id = umi.user_id and umi.model_id = m.model_id order by u.email_addr, m.model_name;"
var part1 = "select a.email_addr,a.model_name,a.role_name, ISNULL(us.user_status,'ACTIVE') from (select distinct u.email_addr, u.user_id, m.model_id, m.model_name as model_name,r.role_name from idm_user u, IDM_USER_ROLE ur, IDM_ROLES r, idm_user_model_info umi,idm_sys_tp_model m where u.user_id =umi.user_id and m.model_name = "
var part2 = "and u.user_id =ur.user_id and ur.model_id=umi.model_id and umi.model_id = m.model_id and ur.role_id =r.role_id and ur.role_status <> 'DELETED')a left outer join idm_user_status us on a.user_id = us.user_id and a.model_id =us.model_id;"
// query function for database 

  
 
  
 
 



/* rendering the splash page */
app.get('/', function (req, res) {
    res.render('home');
    console.log("home")
  })




// rendering access control page//
  app.get('/acess', function (req, res) {
    res.render('acess');
    console.log("acess control")
  })


// rendering jboss page //
app.get('/jboss', function (req, res) {
  res.render('jboss');
  console.log("acess control")
})





// rendering file check page //
app.get('/filecheck', function (req, res) {
  res.render('filecheck');
  console.log("acess control")
})




//rendering defragmentation page//

app.get('/defragmentation', function (req, res) {
  res.render('defragmentation');
  console.log("acess control")
})






/* sending post request to the database */
app.post('/db', async function (req, res) {
  console.log(req.body.accesslevel)
  var query;
  if(req.body.accesslevel === 'General'){
    query = general
  }else {
    query = part1 + "'" + req.body.accesslevel + "'" + part2;
  }
  console.log(query)
  new sql.ConnectionPool(config).connect().then(pool => {
    return pool.query(query)
}).then(result => {
    
    users = result.recordset;
    return users;
}).then((data) =>{
  console.log(data)
  users = []
})
})
// app.post('/db', async function (req, res) {
//   let temp = "hello";
//   var conn = new sql.ConnectionPool(config)
//   conn.connect().then(function(){
//     var req = new sql.Request(conn);
//     return req.query(query).then(function(data){    
//       temp = data; 
//       conn.close();
//     })
//     .catch(function(err){
//       console.log(err);
//       conn.close();
//     });
//     return temp
//   }).then((data)=>{
//       console.log(data)
//   })
//   })   




// sending post to IDAC server //
  app.post('/ws', function (req, res) {
    console.log(rows)
    res.render('acess');
    console.log("ws", req.body);
  
  })





/* setting port */
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})