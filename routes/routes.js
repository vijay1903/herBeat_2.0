var bcrypt = require('bcrypt-nodejs');


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
                console.log(result);
                console.log('Fetched goals from DB.');
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
                console.log(result);
                console.log('Fetched performance from DB.');
            }
        });
    });

    app.get('/api/gettotalemas', function(req, res) {
        conn.query('select distinct count(*) as count from ema_schedule_perday where username=? and DATE(activity_time) BETWEEN ? AND ? order by DATE(activity_time) desc;'
        , [req.query.username, req.query.start_date, req.query.end_date], function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                console.log(result);
                console.log('Fetched total emas from DB.');
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
                console.log(result);
                console.log('Fetched ema response count from DB.');
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
                console.log(result);
                console.log('Fetched message count from DB.');
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
                console.log(result);
                console.log('Fetched heartrate from DB.');
            }
        });
    });

    app.get('/api/getuseractivities', function(req, res) {
        conn.query('select user_selected_activity as activity, count(*) as count from ema_response where username = ? and DATE(activity_time) BETWEEN ? AND ? group by user_selected_activity;'
        , [req.query.username, req.query.start_date, req.query.end_date], function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                console.log(result);
                console.log('Fetched ema user activity from DB.');
            }
        });
    });

    app.get('/api/getuserfeelings', function(req, res) {
        conn.query('select user_feelings as feeling, count(*) as count from ema_response where username = ? and DATE(activity_time) BETWEEN ? AND ? group by user_feelings;'
        , [req.query.username, req.query.start_date, req.query.end_date], function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                console.log(result);
                console.log('Fetched feelings from DB.');
            }
        });
    });

    app.get('/api/getuserlocations', function(req, res) {
        conn.query('select user_curr_location as location, count(*) as count from ema_response where username = ? and DATE(activity_time) BETWEEN ? AND ? group by user_curr_location;'
        , [req.query.username, req.query.start_date, req.query.end_date], function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                console.log(result);
                console.log('Fetched location from DB.');
            }
        });
    });

    app.get('/api/getusercompany', function(req, res) {
        conn.query('select user_company as company, count(*) as count from ema_response where username = ? and DATE(activity_time) BETWEEN ? AND ? group by user_company;'
        , [req.query.username, req.query.start_date, req.query.end_date], function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                console.log(result);
                console.log('Fetched company from DB.');
            }
        });
    });

    app.get('/api/getallsetgoals', function(req, res) {
        conn.query('select sum(user_walk_target) as set_goal, DATE(activity_time) as set_date from set_goals where  username = ? and DATE(activity_time) BETWEEN ? AND ? group by DATE(activity_time);'
        , [req.query.username, req.query.start_date, req.query.end_date], function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                console.log(result);
                console.log('Fetched walking set goals from DB.');
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
                console.log(result);
                console.log('Fetched walking get goals from DB.');
            }
        });
    });

    app.get('/api/searchusername', function(req, res) {
        conn.query('select * from users where username = ? and email = ?',[req.query.username, req.query.email]
        , function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                console.log(result);
                console.log('Searched username from users table.');
            }
        });
    });

    app.post('/api/setpassword', function(req, res) {
        conn.query('UPDATE users SET password = ? WHERE username = ?;',
        [bcrypt.hashSync(req.query.password, null, null),req.query.username]
        , function (error, result) {
            if (error)
            {
                console.log(error);
            }
            else
            {
                res.json(result);
                console.log(result);
                console.log('Searched username from users table.');
            }
        });
    });





};





