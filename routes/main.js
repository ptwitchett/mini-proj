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
        let sqlquery = "SELECT * FROM hotels WHERE name LIKE '%" + req.query.keyword + "%'"; // query database to get all the hotels
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
                res.send(' This user is added to database, name: '+ req.body.first + ' '+ req.body.last);
                
                });
          })                                                             
    }); 

    app.get('/login', function (req,res) {
        res.render('login.ejs', shopData);                                                                     
    });                     

    app.post('/loggedin', function (req, res) {
        const bcrypt = require('bcrypt');
        let username = req.body.userN;
        let enteredPassword = req.body.password;
    
        let userQuery = "SELECT * FROM users WHERE userN = ?";
    
        // Check if the user exists in the users table
        db.query(userQuery, [username], (err, results) => {
            if (err) {
                return console.error(err.message);
            }
            if (results.length === 0) {
                return res.send('User does not exist');
            }

            let hashedPassword = results[0].password;
    
            // Compare the password supplied with the password in the database
            bcrypt.compare(enteredPassword, hashedPassword, function(compareErr, result) {
                if (compareErr) {
                    return console.error(compareErr.message);
                }
                else if (result == true) {
                    res.send('Welcome ' + results[0].first + ' ' + results[0].last);
                }
                else {
                    res.send('Incorrect password username combination');
                }
            });
        });
    });

    app.get('/bookings', function(req, res) {
        let sqlquery = "SELECT * FROM bookings"; // query database to get all the bookings
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {availablebookings:result});
            console.log(newData) 
            res.render("bookings.ejs", newData)
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
    app.post('/booked', function (req, res) {
        let userCheckQuery = "SELECT * FROM users WHERE userN = ?";
        let hotelCheckQuery = "SELECT * FROM hotels WHERE name = ?";
        let insertBookingQuery = "INSERT INTO bookings (userN, name) VALUES (?, ?)";
        let updateVacancyQuery = "UPDATE hotels SET booked = 'Reserved' WHERE name = ?";
    
        // Check if userN exists in the users table
        db.query(userCheckQuery, req.body.userN, (userErr, userResult) => {
            if (userErr) {
                return console.error(userErr.message);
            }
            if (userResult.length === 0) {
                return console.error('User does not exist');
            }
            // Check if hotels exist in the hotels table
            db.query(hotelCheckQuery, [req.body.hotels], (hotelErr, hotelResult) => {
                if (hotelErr) {
                    return console.error(hotelErr.message);
                }
                if (hotelResult.length === 0) {
                    return console.error('Hotel does not exist');
                }
    
                // Insert booking information into the bookings table
                db.query(insertBookingQuery, [req.body.userN, req.body.hotels], (insertErr, insertResult) => {
                    if (insertErr) {
                        return console.error(insertErr.message);
                    }
    
                    // Update the 'booked' status in the hotels table to 'Reserved'
                    db.query(updateVacancyQuery, [req.body.hotels], (updateErr, updateResult) => {
                        if (updateErr) {
                            return console.error(updateErr.message);
                        }
                        res.send('Thank you ' + req.body.userN + ' for booking a hotel room at ' + req.body.hotels);
                    });
                });
            });
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

    app.get('/weather',function(req,res){
        const request = require('request');
          
        let apiKey = '6c42897ec7f6f25d10afd951e612ae1e';
        let city = 'london';
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
                 
        request(url, function (err, response, body) {
        if(err){
            console.log('error:', error);
        } else {
            var weather = JSON.parse(body)
            var wmsg = 'It is '+ weather.main.temp + 
            ' degrees in '+ weather.name +
            '! <br> The humidity now is: ' + 
            weather.main.humidity;
            res.send (wmsg);

        } 
        });
    });   
}
