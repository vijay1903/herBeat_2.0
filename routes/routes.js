// require('server.js');
var bcrypt = require('bcrypt-nodejs');
// var io = require('socket.io')(server);



module.exports = function(app, conn) {

    app.get('/api/getusergoals', function(req, res) {
        conn.query('select user_walk_target as walk, user_readiness_level as readiness, user_current_energy as energy, activity_time as goal_date from set_goals where username = ? and DATE(activity_time) BETWEEN ? AND ? order by activity_time desc;'
        , [req.query.username, req.query.start_date, req.query.end_date], function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                // console.log(result);
                // console.log('Fetched goals from DB.');
            }
        });
    });

    app.get('/api/getperformance', function(req, res) {
        conn.query('select TIME_TO_SEC(max(user_sitting_duration)) as sitting, TIME_TO_SEC(max(user_walking_duration)) as walking, max(user_step_count) as step, max(distance_covered_in_miles) as distance, avg(user_heart_rate) as hr, DATE(activity_time) as acts_date from physical_activity where username = ? and DATE(activity_time) BETWEEN ? AND ? group by DATE(activity_time) order by DATE(activity_time) desc;'
        , [req.query.username, req.query.start_date, req.query.end_date], function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                // console.log(result);
                // console.log('Fetched performance from DB.');
            }
        });
    });

    app.get('/api/gettotalemas', function(req, res) {
        conn.query('select distinct count(*) as count from ematime_notification_fired where username=? and DATE(notification_fired_time) BETWEEN ? AND ? order by DATE(notification_fired_time) desc;'
        , [req.query.username, req.query.start_date, req.query.end_date], function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                // console.log(result);
                // console.log('Fetched total emas from DB.');
            }
        });
    });

    app.get('/api/getemaresponse', function(req, res) {
        conn.query('select user_selected_activity as activity, user_company as company, user_curr_location as location, user_food_habit as food, user_feelings as feel, activity_time as response_date, motivation_screen as motivation from ema_response where username = ? and DATE(activity_time) BETWEEN ? AND ? order by activity_time desc;'
        , [req.query.username, req.query.start_date, req.query.end_date], function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                // console.log(result);
                // console.log('Fetched ema response count from DB.');
            }
        });
    });

    app.get('/api/getmessages', function(req, res) {
        conn.query('select message, activity_time as msg_time from feedback where username=? and DATE(activity_time) BETWEEN ? AND ? order by activity_time desc ;'
        , [req.query.username, req.query.start_date, req.query.end_date], function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                // console.log(result);
                // console.log('Fetched message count from DB.');
            }
        });
    });

    app.get('/api/getheartrate', function(req, res) {
        conn.query('select user_heart_rate as hr, activity_time as act_time from physical_activity where username = ? and DATE(activity_time) BETWEEN ? AND ? order by activity_time asc;'
        , [req.query.username, req.query.start_date, req.query.end_date], function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                // console.log(result);
                // console.log('Fetched heartrate from DB.');
            }
        });
    });



    // app.get('/api/getuseractivities', function(req, res) {
    //     conn.query('select user_selected_activity as activity, count(*) as count from ema_response where username = ? and DATE(activity_time) BETWEEN ? AND ? group by user_selected_activity;'
    //     , [req.query.username, req.query.start_date, req.query.end_date], function (error, result) {
    //         if (error)
    //         {
    //             console.log(error);
    //         }
    //         else
    //         {
    //             res.json(result);
                // console.log(result);
    //             console.log('Fetched ema user activity from DB.');
    //         }
    //     });
    // });

    // app.get('/api/getuserfeelings', function(req, res) {
    //     conn.query('select user_feelings as feeling, count(*) as count from ema_response where username = ? and DATE(activity_time) BETWEEN ? AND ? group by user_feelings;'
    //     , [req.query.username, req.query.start_date, req.query.end_date], function (error, result) {
    //         if (error)
    //         {
    //             console.log(error);
    //         }
    //         else
    //         {
    //             res.json(result);
                // console.log(result);
    //             console.log('Fetched feelings from DB.');
    //         }
    //     });
    // });

    // app.get('/api/getuserlocations', function(req, res) {
    //     conn.query('select user_curr_location as location, count(*) as count from ema_response where username = ? and DATE(activity_time) BETWEEN ? AND ? group by user_curr_location;'
    //     , [req.query.username, req.query.start_date, req.query.end_date], function (error, result) {
    //         if (error)
    //         {
    //             console.log(error);
    //         }
    //         else
    //         {
    //             res.json(result);
                // console.log(result);
    //             console.log('Fetched location from DB.');
    //         }
    //     });
    // });

    // app.get('/api/getusercompany', function(req, res) {
    //     conn.query('select user_company as company, count(*) as count from ema_response where username = ? and DATE(activity_time) BETWEEN ? AND ? group by user_company;'
    //     , [req.query.username, req.query.start_date, req.query.end_date], function (error, result) {
    //         if (error)
    //         {
    //             console.log(error);
    //         }
    //         else
    //         {
    //             res.json(result);
                // console.log(result);
    //             console.log('Fetched company from DB.');
    //         }
    //     });
    // });

    app.get('/api/getallsetgoals', function(req, res) {
        conn.query('select sum(user_walk_target) as set_goal, avg(user_current_energy) as energy, avg(user_readiness_level) as readiness, DATE(activity_time) as set_date from set_goals where  username = ? and DATE(activity_time) BETWEEN ? AND ? group by DATE(activity_time);'
        , [req.query.username, req.query.start_date, req.query.end_date], function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                console.log(result);
                // console.log('Fetched walking set goals from DB.');
            }
        });
    });


    app.get('/api/getallgetgoals', function(req, res) {
        conn.query('select round((TIME_TO_SEC(max(user_walking_duration))/60),2) as get_goal, DATE(activity_time) as get_date from physical_activity where username = ? and DATE(activity_time) BETWEEN ? AND ? group by DATE(activity_time);'
        , [req.query.username, req.query.start_date, req.query.end_date], function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                // console.log(result);
                // console.log('Fetched walking get goals from DB.');
            }
        });
    });

    app.get('/api/searchusername', function(req, res) {
        conn.query('select * from users where username = ? OR email = ?',[req.query.username, req.query.email]
        , function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                // console.log(result);
                // console.log('Searched username from users table.');
            }
        });
    });

    app.post('/api/setpassword', function(req, res) {
        conn.query('UPDATE users SET password = ? WHERE username = ? OR email = ?;',
        [bcrypt.hashSync(req.query.password, null, null),req.query.username,req.query.email]
        , function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                // console.log(result);
                // console.log('Searched username from users table.');
            }
        });
    });

    app.get('/api/checkpassword', function(req, res) {
        conn.query('select * from users where username = ?',[req.query.username]
        , function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {   
                if(result.length){
                    if(bcrypt.compareSync(req.query.password, result[0].password)) {
                        var answer = true;
                        // console.log('Password matched.');
                    } 
                } else {
                    var answer = false;
                    // console.log('Password no match.');
                }
                
                res.send(answer);
                // console.log(answer);
                // console.log('Searched username from users table.');
            }
        });
    });

    app.post('/api/changename', function(req, res) {
        conn.query('UPDATE users SET full_name = ? WHERE username = ?',
        [req.query.fullname, req.query.username]
        , function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                // console.log(result);
                // console.log('Searched username from users table.');
            }
        });
    });

    app.post('/api/changeemail', function(req, res) {
        conn.query('UPDATE users SET email = ? WHERE username = ?',
        [req.query.email, req.query.username]
        , function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                // console.log(result);
                // console.log('Searched username from users table.');
            }
        });
    });

    app.post('/api/changenumber', function(req, res) {
        conn.query('UPDATE users SET number = ? WHERE username = ?',
        [req.query.number, req.query.username]
        , function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                // console.log(result);
                // console.log('Searched username from users table.');
            }
        });
    });

    app.get('/api/getchatmessages', function(req, res) {
        conn.query('SET SQL_SAFE_UPDATES=0');
        conn.query('select * from chat_messages where (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?) order by sent_time;',
        [req.query.sender, req.query.receiver, req.query.receiver, req.query.sender]
        , function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {   
                res.send(result);
                // console.log(result);
                // console.log('Fetched chat messages.');
            }
        });
        conn.query('UPDATE chat_messages SET read_time = CURRENT_TIMESTAMP() WHERE receiver = ?;',
        [req.query.sender]);
        // conn.query('SET SQL_SAFE_UPDATES=1;');
    });

    app.post('/api/sendchatmessages', function(req, res) {
        conn.query('INSERT INTO chat_messages (message, sender, sent_time, receiver, read_time) values (?,?,CURRENT_TIMESTAMP(),?,null)',
        [req.query.message, req.query.sender, req.query.receiver]
        , function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                // console.log(result);
                // console.log('Searched chats from chats table.');
            }
        });
        
    });

    app.get('/api/gethealthcoaches', function(req, res){
        conn.query('select u_a.first_name from (select first_name, last_name from user_authentication) u_a inner join (select distinct sender from chat_messages) c on c.sender = u_a.first_name;'
        ,function(err, result){
            if(err) {
                console.log(err);
                return err;
            }
            if(result){
                res.json(result);
                console.log("all health coaches sending message : ",result)
            }
        })
    })

    app.get('/api/getfirebaseusers', function(req,res){
        conn.query('SELECT * FROM firebase_users',
        function(err, result){
            if(err){
                console.log(err);
            } else {
                res.send(result);
            }
        })
    })

    app.post('/api/addfirebaseuser', function(req,res){
        conn.query('SELECT * FROM firebase_users WHERE username = ?',
        [req.query.username],
        function(err,result){
            if(err){
                console.log(err);
            }
            if(result.length == 0) {
                conn.query('INSERT INTO firebase_users (username, name, patient) VALUES (?,?,?)',
                [req.query.username, req.query.name, req.query.patient], 
                function(err, result) {
                    if(err) {
                        console.log(err);
                    } else {
                        res.json(result);
                    }
                })
            } else {
                res.send('user exist');
            }
            
        })
    })

    app.get('/api/removefirebaseuser', function(req,res){
        conn.query('DELETE FROM firebase_users WHERE username = ?',
        [req.query.username], 
        function(err, result) {
            if(err) {
                console.log(err);
            } else {
                res.send(result);
            }
        })
    })

};





