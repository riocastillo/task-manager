module.exports = function(app, passport, db, mongodb) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    // app.get('/profile', isLoggedIn, function(req, res) {
    //     db.collection('messages').find().toArray((err, result) => {
    //       if (err) return console.log(err)
    //       res.render('profile.ejs', {
    //         user : req.user,
    //         messages: result
    //       })
    //     })
    // });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// // message board routes ===============================================================
//
//     app.post('/messages', (req, res) => {
//       db.collection('messages').save({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
//         if (err) return console.log(err)
//         console.log('saved to database')
//         res.redirect('/profile')
//       })
//     })
//
//     app.put('/messages', (req, res) => {
//       db.collection('messages')
//       .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
//         $set: {
//           thumbUp:req.body.thumbUp + 1
//         }
//       }, {
//         sort: {_id: -1},
//         upsert: true
//       }, (err, result) => {
//         if (err) return res.send(err)
//         res.send(result)
//       })
//     })
//
//     app.put('/messagesminus', (req, res) => {
//       db.collection('messages')
//       .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
//         $set: {
//           thumbUp:req.body.thumbUp - 1
//         }
//       }, {
//         sort: {_id: -1},
//         upsert: true
//       }, (err, result) => {
//         if (err) return res.send(err)
//         res.send(result)
//       })
//     })
//
//
//     app.delete('/messages', (req, res) => {
//       db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
//         if (err) return res.send(500, err)
//         res.send('Message deleted!')
//       })
//     })
// app.post("/test", ()=>{
//   db.collection('tester').insertOne({'abc':'1234'}, (err, res)=>{console.log(err)})
// })
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/tasks', // redirect to the tasks list
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
          console.log(db)
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/tasks', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // function(req,res){
        //   db.collection('tasks').insertOne({taskInfo: req.body.newTasks, name: req.body.name}, (err, result) => {
        //     if (err) return console.log(err)
        //     console.log('saved to database')
        //     res.send(result)
        //     console.log(result)
        //   res.redirect('/tasks')
        // });

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });


app.get('/tasks', isLoggedIn,  (req, res) => {
  db.collection('tasks').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('tasks.ejs', {tasks: result})
  })

})

app.post('/tasks', isLoggedIn, (req, res) => {
  db.collection('tasks').insertOne({taskInfo: req.body.newTasks, name: req.body.name}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.send(result)
    console.log(result)
  })
})

app.put('/tasks', isLoggedIn, (req, res) => {
  db.collection('tasks')
  .findOneAndUpdate({tasks: req.body.task}, {
    $set: {
    // tasks:req.body.input
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/tasks', isLoggedIn, (req, res) => {
  console.log('route is accessed')
  console.log(req.body.taskIdToDelete)
  db.collection('tasks').findOneAndDelete({_id: mongodb.ObjectId(req.body.taskIdToDelete)}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

};
