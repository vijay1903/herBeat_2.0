var app = angular.module("myApp",['chart.js']);


app.controller('cardCtrl', function($scope, $filter, $http){
    // $scope.date = "";
    $scope.goals = 0;
    $scope.username = document.getElementById("user_username").value;
    $scope.userId = document.getElementById("user_id").value;
    $scope.updateDate = function() {
        // $scope.date = $filter('date')($scope.date);
    
    
        // For goals card
        $http({
            url: '/api/getusergoals',
            method: 'GET',
            params: {username: $scope.username, date: $filter('date')($scope.date,'yyyy-MM-dd')}
        })
        .success(function(data) {
            console.log(data);
            $scope.goals_readiness = data[0].user_readiness_level;
            $scope.goals_walk = data[0].user_walk_target;
            $scope.goals_energy = data[0].user_current_energy;
            $scope.goals_date = $filter('date')(data[0].activity_time,'medium');
        })
        .error(function(error) {
                console.log('Error: ' + error);
        });

        //for performance card
        $http({
            url: '/api/getperformance',
            method: 'GET',
            params: {username: $scope.username, date: $filter('date')($scope.date,'yyyy-MM-dd')}
        })
        .success(function(data) {
            console.log(data);
            $scope.per_sitting = data[0].sitting;
            $scope.per_walking = data[0].walking;
            $scope.per_steps = data[0].step;
            $scope.per_distance = data[0].distance;
            $scope.per_av_hr = data[0].hr;
            $scope.per_time = $filter('date')(data[0].time,'medium');
        })
        .error(function(error) {
                console.log('Error: ' + error);
        });
        //For EMA response card
        $http({
            url: '/api/gettotalemas',
            method: 'GET',
            params: {username: $scope.username, date: $filter('date')($scope.date,'yyyy-MM-dd')}
        })
        .success(function(data) {
            console.log(data);
            $scope.res_den = data[0].count;
            $scope.res_time = $filter('date')(data[0].total_date,'medium');
        })
        .error(function(error) {
                console.log('Error: ' + error);
        });

        $http({
            url: '/api/getemaresponsecount',
            method: 'GET',
            params: {username: $scope.username, date: $filter('date')($scope.date,'yyyy-MM-dd')}
        })
        .success(function(data) {
            console.log(data);
            $scope.res_num = data[0].count;
            // $scope.res_time2 = $filter('date')(data[0].ema_date,'medium');
        })
        .error(function(error) {
                console.log('Error: ' + error);
        });

        //For Message card
        $http({
            url: '/api/getmessagecount',
            method: 'GET',
            params: {username: $scope.username, date: $filter('date')($scope.date,'yyyy-MM-dd')}
        })
        .success(function(data) {
            console.log(data);
            $scope.msg_num = data[0].count;
            $scope.msg_date = $filter('date')(data[0].msg_date,'medium');
        })
        .error(function(error) {
                console.log('Error: ' + error);
        });
    };   
});

app.controller('chartCtrl', function($scope, $filter, $http){
    $scope.dates = ["2018-02-13","2018-02-14"];
    // var data = {};

    $scope.getHR = function() {
        $http({
            url: '/api/getheartrate',
            method: 'GET',
            params: {username: "DrBeckie", date: $filter('date')($scope.heart_date,'yyyy-MM-dd')}
        })
        .success(function(data) {
            console.log(data);
            var dates = [];
            var h_rate = [];
            for(var i = 0; i < data.length; i++){
                h_rate[i] = data[i].hr;
                dates[i] = $filter('date')(data[i].act_time,'hh:mm a');;
            }
            console.log(dates, h_rate)
            $scope.labels = dates;
            $scope.data = h_rate;
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });

        // console.log("data : ", data);
        
        $scope.series = ['Heart Rate'];
        
        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };
        // $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
        $scope.options = {
            scales: {
            yAxes: [
                {
                // id: 'y-axis-1',
                type: 'linear',
                display: true,
                position: 'left'
                }
            ]
            },
            fill: false
        };
        $scope.chart_colors = [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];


    }
});

app.controller('radarCtrl', function($scope, $filter,$http){
    $scope.dates = ["2018-03-04","2018-03-05","2018-03-06","2018-03-07","2018-03-08","2018-03-09","2018-03-10"];
    $scope.getACT = function() {
        $http({
            url: '/api/getuseractivities',
            method: 'GET',
            params: {username: "DrBeckieUpdated"} //, date: $filter('date')($scope.activity_date,'yyyy-MM-dd')}
        })
        .success(function(data) {
            console.log(data);
            var times = [0,0,0,0,0];
            var act = ["jogging","standing","walking","sitting","None"];
            for(var i = 0; i < data.length; i++){
                for(var j = 0; j<5; j++){
                    if(act[j] == data[i].activity){
                        times[j] = data[i].count;
                    }
                }
            }
            console.log(act, times)
            $scope.labels = act;
            $scope.data = times;
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
        $scope.chart_colors = [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];


    }
});


// 4,5,7,8,9