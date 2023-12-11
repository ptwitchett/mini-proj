module.exports = function(app, shopData) {

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', shopData)
    });
    app.get('/about',function(req,res){
        res.render('about.ejs', shopData);
    });
    app.get('/search',function(req,res){
        res.render("search.ejs", shopData);
    });
    app.get('/search-result', function (req, res) {
        //searching in the database
        //res.send("You searched for: " + req.query.keyword);

        let sqlquery = "SELECT * FROM hotels WHERE name LIKE '%" + req.query.keyword + "%'"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {availablehotels:result});
            console.log(newData)
            res.render("list.ejs", newData)
         });        
    });
    app.get('/register', function (req,res) {
        res.render('register.ejs', shopData);                                                                     
    });                                                                                                 
    app.post('/registered', function (req,res) {
        // saving data in database

     //   let sqlquery = "INSERT INTO users (first, last, userN, password, email) VALUES (?,?,?,?,?)";
     //   let newrecord = [req.body.first, req.body.last, req.body.userN, req.body.password, req.body.email];


        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const plainPassword = req.body.password;
     


        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
            // Store hashed password in your database.
            result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email;
            result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword;

            let sqlquery = "INSERT INTO users (first, last, userN, password, email) VALUES (?,?,?,?,?)";
            let newrecord = [req.body.first, req.body.last, req.body.userN, hashedPassword, req.body.email];

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                  return console.error(err.message);
                }
                else
                res.send(' This user is added to database, name: '+ req.body.first + ' price '+ req.body.last);
                
                });
          })                                                             
    }); 

    app.get('/login', function (req,res) {
        res.render('login.ejs', shopData);                                                                     
    });                                                                                                 
    app.post('/loggedin', function (req,res) {
       

        //const bcrypt = require('bcrypt');
  
        //sqlquery = "SELECT password FROM users WHERE userN="+ req.body.userN;
        //const hashedPassword = 

            // Compare the password supplied with the password in the database
        bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
            if (err) {
                return console.error(err.message);
   
            }
            else if (result == true) {
            res.send('Welcome' + req.body.first + ' ' + req.body.last);
            }
            else {
                res.send('Incorrect password username combination');
            }
      });
  
                                                                             
    }); 

    app.get('/list', function(req, res) {
        let sqlquery = "SELECT * FROM hotels"; // query database to get all the hotels
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {availablehotels:result});
            console.log(newData) 
            res.render("list.ejs", newData)
         });
    });

    app.post('/booked', function (req,res) {
        let sqlquery = "INSERT INTO bookings (userN, name) VALUES (?,?)";

        let newrecord = [req.body.userN, req.body.hotels];

           db.query(sqlquery, newrecord, (err, result) => {
             if (err) {
               return console.error(err.message);
             }
             else
             res.send('Thank you '+ req.body.userN + ' for booking a hotel room '+ req.body.hotels);
             });                                                         
    }); 

    app.get('/listusers', function(req, res) {
        let sqlquery = "SELECT * FROM users"; // query database to get all the users
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {userlist:result});
            console.log(newData)
            res.render("listusers.ejs", newData)
         });
    });

    app.get('/addbook', function (req, res) {
        res.render('addbook.ejs', shopData);
     });
 
     app.post('/bookadded', function (req,res) {
           // saving data in database
           let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
           // execute sql query
           let newrecord = [req.body.name, req.body.price];
           db.query(sqlquery, newrecord, (err, result) => {
             if (err) {
               return console.error(err.message);
             }
             else
             res.send(' This book is added to database, name: '+ req.body.name + ' price '+ req.body.price);


             });
       });    

       app.get('/bargainbooks', function(req, res) {
        let sqlquery = "SELECT * FROM books WHERE price < 20";
        db.query(sqlquery, (err, result) => {
          if (err) {
             res.redirect('./');
          }
          let newData = Object.assign({}, shopData, {availableBooks:result});
          console.log(newData)
          res.render("bargains.ejs", newData)
        });
    });       

}
