//const session = require('session');
const path = require('path');
var owasp = require('owasp-password-strength-test');


// invoke test() to test the strength of a password

const express = require('express');
//const SerpApi = require('google-search-results-nodejs');
//const search = new SerpApi.GoogleSearch("c5338af102d4fa8d44e32589754bf920ef75bbb6054dd9b92ac72e97a503a87c");
const app = express();
const ejs = require('ejs');
const mysql = require('mysql');
app.use(express.urlencoded({ extended: true }));
const bcrypt = require('bcrypt');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.static('public'));
var islogged = false;
app.listen(3000, () => {
  console.log("serving");
})
var con = mysql.createConnection({
  host: "kuladeep.c5rlvnugwvna.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "Visionaries4",
  database: "dbms"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
// app.get('/secret', (req, res) => {
//   res.send('secret');

// })
app.get('/', (req, res) => {
  res.render('homepg1.ejs');

})
app.get('/log', (req, res) => {
  const text = '';
  res.render('loginnew.ejs', { para: text })
})
app.get('/regist', (req, res) => {
  const text = '';
  res.render('registration.ejs', { para1: text });
})
// app.get('/login', (req,res)=>{
//     res.render('login.ejs');
// })
app.post('/register', async (req, res) => {
  console.log(req.body.reg);
  if (req.body.reg === "regist") {

    const userInfo = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      isverified: 'false'
    }
    con.query('select * from user where email=?', userInfo.email, async (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        if (result.length === 0) {
          var result5 = owasp.test(userInfo.password);
          if (result5.errors.length === 0) {
            console.log('pppp');
            const hash = await bcrypt.hash(userInfo.password, 12);
            const newuserInfo = {
              username: req.body.username,
              email: req.body.email,
              password: hash,
              isverified: 'false'
            }

            const sql = "INSERT INTO user SET ?";

            con.query(sql, newuserInfo, (err, rows, fields) => {
              if (!err) {
                // res.send(rows);
                // console.log(rows);
                console.log(req.body.email);
                res.render('login.ejs', { email2: req.body.email });
              } else {
                console.log(err.message);
                res.send(err);
              }
            })
          }
          else {
            const note = result5.errors[0];
            res.render('registration.ejs', { para1: note });

          }


        }
        else {
         const note='email already exist';
          res.render('registration.ejs', { para1: note });

        }
      }
    })


  }
  else if (req.body.reg === "logi") {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    con.query("select * from user where email=?", email, async (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log(result[0]);

        if (result[0] === undefined) {

          const note = "email not found";
          const mt = ''
          res.render('loginnew.ejs', { para: note, para1: mt });
          console.log("email not found");
        }
        else {
          const email2 = result[0].email;
          const list = result[0].username;
          const valid = await bcrypt.compare(password, result[0].password);
          console.log(valid, 'valid');
          if (valid && result[0].isverified === '1') {
            islogged = true;
            con.query("select name from pondi", (err, result) => {
              // var array2=[];
              if (err) {
                console.log(err);
              }
              else {
                var array = result;
                console.log(array);
                res.render('search1.ejs', { name: list, emailid: email2, placelist: array });
              }
            });
          }
          else if (result[0].isverified === 'false') {
            const note = "email not found";
            const mt = '';
            res.render('loginnew.ejs', { para: note, para1: mt });
            console.log('email is not verified');
          }
          else {
            const note = "password incorrect";
            const mt = '';
            res.render('loginnew.ejs', { para: note, para1: mt });
            console.log("password incorrect");

          }
        }

      }

    })
  }

  else {
    console.log("hi");
  }
});



// app.get('/login', (req, res) => {
//   const list = '';
//   if (islogged === true) {
//     console.log('1');
//     res.render('dash.ejs', { name: list, emailid: list, placelist: list });
//   }
//   else {
//     console.log('2');
//     res.redirect('/');
//   }
// })
app.post('/login', (req, res) => {
  const email2 = req.body.email1;
  const otp = req.body.otp;
  console.log(email2);
  console.log(otp);
  con.query("update user set isverified=true where email=?", [email2], (err, rows, fields) => {
    if (err) {
      console.log(err);
    }
    else {
      islogged = true;
      console.log(rows);
    }

  })
  var list;
  con.query("select username from user where email=?", [email2], (err, result) => {

    if (err) {
      console.log(err);
    }
    else {
      list = result[0].username;
    }

  })

  con.query("select name from pondi", (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      const array = result;
      console.log('array', array);
      res.render('search1.ejs', { name: list, emailid: email2, placelist: array });
    }
  });

});

var lis1 = [];
var a = [];
app.post('/result', (req, res) => {

  var hat;

  if (req.body.car === 'sear') {
    hat = req.body.bat;
    console.log("hi", hat);
    const que = req.body.autosearch;
    con.query("select * from pondi where name like '%" + que + "%'", (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        lis1 = result;
        console.log("pondi", result);
        const msg1 = ''
        res.render('result.ejs', { array: lis1, hat1: hat, array2: msg1, name2: msg1 });
      }
    })

    // res.render('result.ejs', { array: result, hat1: hat });





  }
  var mail;

  if (req.body.car === 'add') {
    const name1 = req.body.place1;
    console.log("hello", name1);
    mail = req.body.pat;
    console.log(mail);
    con.query("select * from pondi where name=?", name1, (err, result) => {
      if (err) { console.log(err); }
      else {
        console.log(result);
        let li = result;
        console.log(li);
        con.query('select * from cart where name=? and emailid=?', [name1, mail], (err, result) => {
          if (result.length === 0) {
            con.query("insert into cart (emailid,name,description,timings,location,image) values(?,?,?,?,?,?)", [mail, li[0].name, li[0].description, li[0].timings, li[0].location, li[0].img], (err, result) => {
              if (err) {
                console.log(err);
              }
              else {
                console.log(result);
                const msg3 = 'Added to favourites';
                res.render('result.ejs', { array: lis1, hat1: mail, array2: msg3, name2: name1 });
              }
            })
          }
          else {
            const msg4 = 'Already in favourites'
            res.render('result.ejs', { array: lis1, hat1: mail, array2: msg4, name2: name1 });
          }
        })


      }
    })
  }
})

var lis2 = []
var ll = []
app.post('/personal', (req, res) => {

  const id = req.body.rain;
  console.log("hi");
  console.log(id);

  con.query("select * from user where email=?", id, (err, result) => {
    if (err) throw err;
    else {
      console.log(result);
      const list = result[0];
      lis2 = result[0];
      console.log(list);
      con.query("select distinct * from cart where emailid=?", id, (err, result) => {
        if (err) {
          console.log(err);
        }
        else {
          ll = result;
          console.log(result, 'hiiiii');
          // res.render('cart.ejs', { locations: result });
          res.render('mypage.ejs', { array: list, array1: ll });
        }
      })

    }
  })

})



// app.post('/cart', (req, res) => {
//   const email = req.body.rack;
//   con.query("select distinct * from cart where emailid=?", email, (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//     else {
//      // res.render('cart.ejs', { locations: result });
//     }
//   })

// });
app.post('/logout', (req, res) => {
  islogged = false;
  res.redirect('/');
})

app.post('/changes', (req, res) => {
  console.log(req.body);
  const id = req.body.sai;
  console.log(id);
  if (req.body.pranav !== req.body.sai1[0]) {
    con.query("update user set username=? where email=?", [req.body.pranav, id], (err, rows, fields) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log(rows);
        con.query('select * from user where email=?', req.body.sai, (err, result) => {
          if (err) {
            console.log(err);
          }
          else {
            const lis3 = result;
            console.log(lis3, 'lis2');
            res.render('mypage.ejs', { array: lis3[0], array1: ll });
          }
        })
        // console.log(rows);
        // res.render('mypage.ejs', { array: lis2, array1: ll });
      }
    })
  }
  else {
    console.log('perfect');
    con.query('select * from user where email=?', req.body.sai, (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        const lis3 = result;
        console.log(lis3, 'lis2');
        res.render('mypage.ejs', { array: lis3[0], array1: ll });
      }
    })
  }

})
app.post('/remove', (req, res) => {
  con.query('delete from cart where emailid=? and name=?', [req.body.kul, req.body.kula], (err, rows, fields) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(rows);
      con.query('select * from user where email=?', req.body.kul, (err, result) => {
        if (err) {
          console.log(err);

        }
        else {
          console.log(result);
          const lis4 = result;
          con.query('select distinct * from cart where emailid=?', req.body.kul, (err, result) => {
            const lis5 = result;
            res.render('mypage.ejs', { array: lis4[0], array1: lis5 });

          })
        }
      })

    }
  })
})

app.post('/sear', (req, res) => {
  var name1='';
  con.query('select username from user where email=?',req.body.jay,(err,result)=>{
    if(err){
      console.log(err);
    }
    else{
     name1=result[0].username;
    }
  })
   
  const mail = req.body.jay;
  console.log(name1,mail,'name1,mail');
  con.query('select name from pondi', (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(result);
      res.render('search1.ejs', { name: name1, emailid: mail, placelist: result });
    }
  })



})

app.post('/searc', (req, res) => {
  const mail = req.body.jay;
  console.log(mail,'mail');
  con.query('select username from user where email=?', mail, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      const name1 = result[0].username;
      console.log(name1,'name1')
      con.query('select name from pondi', (err, result) => {
        if (err) {
          console.log(err);
        }
        else {
          console.log(result);
          res.render('search1.ejs', { name: name1, emailid: mail, placelist: result });
        }
      })

    }
  })
})

