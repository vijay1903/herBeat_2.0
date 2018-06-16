module.exports = function(app, conn) {

    app.get('/api/getusergoals', function(req, res) {
        conn.query('select activity_time, user_readiness_level, user_walk_target, user_current_energy from set_goals where username = ? order by DATEDIFF(activity_time,?) desc, activity_time desc LIMIT 1;'
        , [req.query.username, req.query.date], function (error, result) {
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
        conn.query('select max(user_sitting_duration) as sitting, max(user_walking_duration) as walking, max(user_step_count) as step, max(distance_covered_in_miles) as distance, avg(user_heart_rate) as hr, max(activity_time) as time from physical_activity where username = ? group by DATE(activity_time) order by DATEDIFF(max(activity_time),?) desc LIMIT 1;'
        , [req.query.username, req.query.date], function (error, result) {
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
        conn.query('select count(record_id) as count, max(DATE(activity_time)) as total_date from ema_schedule_perday where username=? group by DATE(activity_time) order by DATEDIFF(max(DATE(activity_time)),?) desc;'
        , [req.query.username, req.query.date], function (error, result) {
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

    app.get('/api/getemaresponsecount', function(req, res) {
        conn.query('select count(record_id) as count, max(DATE(activity_time)) as ema_date from ema_response where username=? group by DATE(activity_time) order by DATEDIFF(max(DATE(activity_time)),?) desc ;'
        , [req.query.username, req.query.date], function (error, result) {
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

    app.get('/api/getmessagecount', function(req, res) {
        conn.query('select count(msg) as count, max(DATE(time_sent)) as msg_date from sent_push_msg where username=? group by DATE(time_sent) order by DATEDIFF(max(DATE(time_sent)),?) desc ;'
        , [req.query.username, req.query.date], function (error, result) {
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

    app.get('/api/getheartrate', function(req, res) {
        conn.query('select round(avg(user_heart_rate),2) as hr, max(activity_time) as act_time from physical_activity where username = ? and DATE(activity_time) = ? group by activity_time order by activity_time asc;'
        , [req.query.username, req.query.date], function (error, result) {
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
        conn.query('select user_selected_activity as activity, count(*) as count from ema_response where username = ? group by user_selected_activity;'
        , [req.query.username], function (error, result) {
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
};





