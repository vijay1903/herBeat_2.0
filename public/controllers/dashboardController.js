var app = angular.module("myApp",['chart.js']);


app.controller('navCtrl', function($rootScope, $scope) {
    var midnight = new Date();
    midnight.setHours(0,0,0,0);
    $rootScope.start_date = midnight;
    $rootScope.end_date = new Date();
    $scope.start = midnight;
    $scope.end = new Date();


    // $scope.search = function(){
    //     $rootScope.start_date = $scope.start;
    //     $rootScope.end_date = $scope.end;
    //     // return $rootScope.start_date, $rootScope.end_date;
    // };

    $scope.date_change = function(newVal){
        $rootScope.start_date = $scope.start;
        $rootScope.end_date = $scope.end; 
        $rootScope.$broadcast('datechange',{});
    };


});
app.controller('cardCtrl', function($rootScope, $scope, $filter, $http){
    $scope.card_start_date = $rootScope.start_date;
    $scope.card_end_date = $rootScope.end_date;
    $scope.username = document.getElementById("user_username").value;
    $scope.userId = document.getElementById("user_id").value;
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };
    var cards = function(start, end) {
        $scope.per_sitting = 0;
        $scope.per_walking = 0;
        $scope.per_steps = 0;
        $scope.per_distance = 0;
        $scope.per_av_hr = 0;
        $scope.count = 0;
        $scope.res_den = 0;
        $scope.res_num = 0;
        $scope.msg_num = 0;

        $scope.card_start_date = start;
        $scope.card_end_date = end;

        $scope.activities_options = [4,5,6];

        $http({
            url: '/api/getusergoals',
            method: 'GET',
            params: {username: $scope.username, start_date: $filter('date')($scope.card_start_date,'yyyy-MM-dd'), end_date: $filter('date')($scope.card_end_date,'yyyy-MM-dd')}
        })
        .success(function(data) {
            // console.log(data);
            if(data.length){
                $scope.count = data.length;
                var vals=[];
                var avg = 0;
                for(var item of data){
                    avg += item.walk;
                    vals.push(item.walk); 
                }
                // for cards
                avg /= (data.length);
                $scope.max = $filter('orderBy')(vals,vals,true)[0];
                $scope.min = $filter('orderBy')(vals,vals)[0];
                $scope.avg = $filter('number')(avg,2);
                // for tables
                $scope.goals = data;
                
            }

            $scope.goals_start_date = $scope.card_start_date;
            $scope.goals_end_date = $scope.card_end_date;
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });

        //for performance card
        $http({
            url: '/api/getperformance',
            method: 'GET',
            params: {username: $scope.username, start_date: $filter('date')($scope.card_start_date,'yyyy-MM-dd'), end_date: $filter('date')($scope.card_end_date,'yyyy-MM-dd')}
        })
        .success(function(data) {
            // console.log(data);
            if(data.length){
                $scope.acts = data;
                $scope.per_sitting = 0;
                $scope.per_walking = 0;
                $scope.per_steps = 0;
                $scope.per_distance = 0;
                var avg = 0;
                var vals = [];
                for(var item of data){
                    avg += item.hr;
                    $scope.per_sitting += item.sitting;
                    $scope.per_walking += item.walking;
                    $scope.per_steps += item.step;
                    $scope.per_distance += item.distance;
                    vals.push(item.hr); 
                }
                if($scope.per_sitting >= 3600){
                    $scope.per_sitting /= 3600;
                    $scope.per_sitting = $filter('number')($scope.per_sitting,2);
                    $scope.per_sitting += " hrs.";
                } else {
                    $scope.per_sitting /= 60;
                    $scope.per_sitting = $filter('number')($scope.per_sitting,2);
                    $scope.per_sitting += " mins.";
                }
                if($scope.per_walking >= 3600){
                    $scope.per_walking /= 3600;
                    $scope.per_walking = $filter('number')($scope.per_walking,2);
                    $scope.per_walking += " hrs.";
                } else {
                    $scope.per_walking /= 60;
                    $scope.per_walking = $filter('number')($scope.per_walking,2);
                    $scope.per_walking += " mins.";
                }
                avg /= (data.length);
                $scope.per_av_hr = $filter('number')(avg,2)
                
                $scope.per_distance = $filter('number')($scope.per_distance,2);
                $scope.per_steps = $filter('number')($scope.per_steps,0);
                
            }
            $scope.per_start_date = $scope.card_start_date;
            $scope.per_end_date = $scope.card_end_date;
            // $filter('date')(data[0].time,'medium');
        })
        .error(function(error) {
                console.log('Error: ' + error);
        });
        //For EMA response card
        $http({
            url: '/api/gettotalemas',
            method: 'GET',
            params: {username: $scope.username, start_date: $filter('date')($scope.card_start_date,'yyyy-MM-dd'), end_date: $filter('date')($scope.card_end_date,'yyyy-MM-dd')}
        })
        .success(function(data) {
            // console.log(data);
            if(data.length){
            $scope.res_den = data[0].count;
            }
            $scope.res_start_date = $scope.card_start_date;
            $scope.res_end_date = $scope.card_end_date;
            // $filter('date')(data[0].total_date,'medium');
        })
        .error(function(error) {
                console.log('Error: ' + error);
        });

        $http({
            url: '/api/getemaresponse',
            method: 'GET',
            params: {username: $scope.username, start_date: $filter('date')($scope.card_start_date,'yyyy-MM-dd'), end_date: $filter('date')($scope.card_end_date,'yyyy-MM-dd')}
        })
        .success(function(data) {
            // console.log(data);
            $scope.res_num = data.length;
            $scope.searchText = '';
            // $scope.searchCat = ["response_date","activity","company","location","food","feel"];
            
            $scope.searchBy = function(){
                if($scope.searchText == ''){
                    $scope.responses = data;
                    $scope.searchCount = data.length;
                } else {
                    $scope.responses = $filter('filter')(data,$scope.searchText);
                    $scope.searchCount = $scope.responses.length;
                }
            }
            $scope.searchBy();

            //for activity radar 
            var act_times = [0,0,0,0,0,0];
            var act = ["jogging","standing","walking","sitting","bicycling","None of the above"];
            for(var i = 0; i < data.length; i++){
                for(var j = 0; j< 6 ; j++){
                    if(data[i].activity == act[j]){
                        act_times[j]++;
                    }
                }
            }
            // console.log(act, act_times);
            $scope.labels_act = act;
            $scope.data_act = act_times;
            $scope.chart_colors_act = [ '#00ADF9'];

            // for feelings radar
            var feel_times = [0,0,0,0,0];
            var feel = ["Very Positive","Positive","Neutral","Negative","Very Negative"];
            for(var i = 0; i < data.length; i++){
                for(var j = 0; j< 5; j++){
                    if(feel[j] == data[i].feel){
                        feel_times[j]++;
                    }
                }
            }
            // console.log(feel, feel_times);
            $scope.labels_feel = feel;
            $scope.data_feel = feel_times;
            $scope.chart_colors_feel = ['#DCDCDC'];
             
            // for loaction radar
            var loc_times = [0,0,0,0,0,0];
            var loc = ["In House", "at recreation center", "at park", "at restaurant", "None of the place", "at gym"];
            for(var i = 0; i < data.length; i++){
                for(var j = 0; j<6; j++){
                    if(loc[j] == data[i].location){
                        loc_times[j]++;
                    }
                }
            }
            // console.log(loc, loc_times);
            $scope.labels_loc = loc;
            $scope.data_loc = loc_times;
            $scope.chart_colors_loc = ['#46BFBD'];

            // for company radar
            var comp_times = [0,0,0,0,0,0];
            var comp = ["Alone", "With Spouse", "With Children", "With friends", "With Co-worker", "None of the above"];
            for(var i = 0; i < data.length; i++){
                for(var j = 0; j < 6; j++){
                    if(comp[j] == data[i].company){
                        comp_times[j]++;
                    }
                }
            }
            // console.log(comp, comp_times);
            $scope.labels_comp = comp;
            $scope.data_comp = comp_times;
            $scope.chart_colors_comp = ['#FDB45C'];

            // for food radar
            var healthy_times = [0,0,0,0,0,0];
            var unhealthy_times = [0,0,0,0,0,0];
            var healthy = ["Protein","Vegetable","Whole Grain","One Drink","Fruit","None of the Above"];
            var unhealthy = ["Sweet and Sugary Drink","Salty Snack","SeveralDrink","Fried food","Didn' Eat anything last hour"];
            for(var i = 0; i < data.length; i++){
                for(var j = 0; j< 6; j++){
                    if(healthy[j] == data[i].food){
                        healthy_times[j]++;
                    }
                    if(unhealthy[j] == data[i].food){
                        unhealthy_times[j]++;
                    }
                }
            }
            $scope.labels_healthy = healthy;
            $scope.data_healthy = healthy_times;
            $scope.chart_colors_healthy = ['#6AB35F'];
            $scope.labels_unhealthy = unhealthy;
            $scope.data_unhealthy = unhealthy_times;
            $scope.chart_colors_unhealthy = [ '#F87D6C'];
             
        })
        .error(function(error) {
                console.log('Error: ' + error);
        });

        //For Message card
        $http({
            url: '/api/getmessages',
            method: 'GET',
            params: {username: $scope.username, start_date: $filter('date')($scope.card_start_date,'yyyy-MM-dd'), end_date: $filter('date')($scope.card_end_date,'yyyy-MM-dd')}
        })
        .success(function(data) {
            $scope.messages = data;
            if(data.length){
            $scope.msg_num = data.length;
            }
            $scope.msg_start_date = $scope.card_start_date;
            $scope.msg_end_date = $scope.card_end_date;
        })
        .error(function(error) {
                console.log('Error: ' + error);
        });
    };
    // cards($rootScope.start_date,$rootScope.end_date);
    $scope.$on('datechange', function(event, args){
        cards($rootScope.start_date,$rootScope.end_date);
    });   
});

app.controller('chartCtrl', function($rootScope, $scope, $filter, $http){
    $scope.heart_start_date = $rootScope.start_date;
    $scope.heart_end_date = $rootScope.end_date;
    $scope.heart_options = []
    $scope.heart_scale = 1;
    $scope.username = document.getElementById("user_username").value;
    $scope.heart_range = "Monthly";
    var heart = function(start, end) {
        $scope.heart_start_date = start;
        $scope.heart_end_date = end;
        var dates = [];
        var h_rate = [];
        var chart_color_arr = [];
        var counter_arr = [];
        var counter = '';
        
        $http({
            url: '/api/getheartrate',
            method: 'GET',
            params: {username: $scope.username, start_date: $filter('date')($scope.heart_start_date,'yyyy-MM-dd'), end_date: $filter('date')($scope.heart_end_date,'yyyy-MM-dd')}
        })
        .success(function(data) {
            // console.log(data);
           
            var range = 'MMM';
            switch ($scope.heart_range) {
                case "Monthly":
                    range='MMM yyyy';
                    break;
                case "Weekly":
                    range='ww yyyy';
                    break;
                case "Daily":
                    range='dd MMM yyyy';
                    break;
                default:
                    range='MMM yyyy';
            }
            // var counter = "06";
            if(data.length){
                counter = $filter('date')(data[0].act_time,range);
                counter_arr.push(counter);
                h_rate[counter] = [];
                dates[counter] = [];
                chart_color_arr[counter] = [];
            }
            var k = 0,l = 0;
            for(var i = 0; i < data.length; i++,l++){
                
                if($filter('date')(data[i].act_time,range) != counter){
                    l = 0;
                    counter = $filter('date')(data[i].act_time,range);
                    counter_arr.push(counter);
                    h_rate[counter] = [];
                    dates[counter] = [];
                    chart_color_arr[counter] = [];
                }
                h_rate[counter][l] = (data[i].hr).toString();
                dates[counter][l] = $filter('date')(data[i].act_time,'MMM dd hh:mm a');
                chart_color_arr[counter].push(
                    { // grey
                      backgroundColor: 'rgba(148,159,177,0.2)',
                      pointBackgroundColor: 'rgba(148,159,177,1)',
                      pointHoverBackgroundColor: 'rgba(148,159,177,1)',
                      borderColor: 'rgba(148,159,177,1)',
                      pointBorderColor: '#fff',
                      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
                    }
                );
            }
            var page_no = 0;
            currentPage(page_no);
            function currentPage(current){
                if(!counter_arr[current+1]){
                    $scope.next = true;
                } else {
                    $scope.next = false;
                }
                if(!counter_arr[current-1]){
                    $scope.prev = true;
                } else {
                    $scope.prev = false;
                }
                var x = counter_arr[current];
                // console.log("in loop",dates[x],h_rate[x],counter_arr);
                
                $scope.heart_options = [counter_arr[current]];


                $scope.chart_color = chart_color_arr[x];
                $scope.data = h_rate[x];
                $scope.labels = dates[x];
                // console.log(" scope variable ",$scope.data,$scope.labels);
            }
            $scope.nextPage = function(){
                if(counter_arr[page_no+1]){
                    page_no++;
                    currentPage(page_no);
                }
            }
            $scope.prevPage = function(){
                if(counter_arr[page_no-1]){
                    page_no--;
                    currentPage(page_no);
                }
            }
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });        
        $scope.series = ['Heart Rate'];
       
       

        $scope.options = {
            responsive: false,
            maintainAspectRatio: false,
            legend: {
                position: 'top',
            },
            scales: {
                xAxes: [{
                    display: true,
                    min : 0 ,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Heart rate'
                    },
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
        };
        


    };
    // heart($rootScope.start_date,$rootScope.end_date);

    $scope.$on('datechange', function(event, args){
        heart($rootScope.start_date,$rootScope.end_date);
    })
});

// app.controller('radarCtrl', function($rootScope, $scope, $filter, $http){
//     $scope.activity_start_date = $rootScope.start_date;
//     $scope.activity_end_date = $rootScope.end_date;
//     $scope.username = document.getElementById("user_username").value;
    
//     var radar = function(start, end){
//         $scope.activity_start_date = start;
//         $scope.activity_end_date = end;
        
        


        
//         $http({
//             url: '/api/getuseractivities',
//             method: 'GET',
//             params: {username: $scope.username, start_date: $filter('date')($scope.activity_start_date,'yyyy-MM-dd'), end_date: $filter('date')($scope.activity_end_date,'yyyy-MM-dd')}
//         })
//         .success(function(data) {
//             // console.log(data);
//             var act_times = [0,0,0,0,0,0];
//             var act = ["jogging","standing","walking","sitting","bicycling","None of the above"];
//             var data = [];
//             data = $rootScope.ema_responses;
//             console.log("EMA Responses : ",$rootScope.ema_responses);
//             for(var i = 0; i < data.length; i++){
//                 for(var j = 0; j< 6 ; j++){
//                     if(act[j] == data[i].activity){
//                         act_times[j] = data[i].count;
//                     }
//                 }
//             }
//             // console.log(act, act_times);
//             $scope.labels_act = act;
//             $scope.data_act = act_times;
//         })
//         .error(function(error) {
//             console.log('Error: ' + error);
//         });
//         $scope.chart_colors_act = [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];
        
//         $http({
//             url: '/api/getuserfeelings',
//             method: 'GET',
//             params: {username: $scope.username, start_date: $filter('date')($scope.activity_start_date,'yyyy-MM-dd'), end_date: $filter('date')($scope.activity_end_date,'yyyy-MM-dd')}
//         })
//         .success(function(data) {
//             // console.log(data);
//             var feel_times = [0,0,0,0,0];
//             var feel = ["Very Positive","Positive","Neutral","Negative","Very Negative"];
//             for(var i = 0; i < data.length; i++){
//                 for(var j = 0; j< 5; j++){
//                     if(feel[j] == data[i].feeling){
//                         feel_times[j] = data[i].count;
//                     }
//                 }
//             }
//             // console.log(feel, feel_times);
//             $scope.labels_feel = feel;
//             $scope.data_feel = feel_times;
//         })
//         .error(function(error) {
//             console.log('Error: ' + error);
//         });
//         $scope.chart_colors_feel = [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];

//         $http({
//             url: '/api/getuserlocations',
//             method: 'GET',
//             params: {username: $scope.username, start_date: $filter('date')($scope.activity_start_date,'yyyy-MM-dd'), end_date: $filter('date')($scope.activity_end_date,'yyyy-MM-dd')}
//         })
//         .success(function(data) {
//             // console.log(data);
//             var loc_times = [0,0,0,0,0];
//             var loc = ["In House", "at recreation center", "at park", "at restaurant", "None of the place"];
//             for(var i = 0; i < data.length; i++){
//                 for(var j = 0; j<5; j++){
//                     if(loc[j] == data[i].location){
//                         loc_times[j] = data[i].count;
//                     }
//                 }
//             }
//             // console.log(loc, loc_times);
//             $scope.labels_loc = loc;
//             $scope.data_loc = loc_times;
//         })
//         .error(function(error) {
//             console.log('Error: ' + error);
//         });
//         $scope.chart_colors_loc = [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];
        

//         $http({
//             url: '/api/getusercompany',
//             method: 'GET',
//             params: {username: $scope.username, start_date: $filter('date')($scope.activity_start_date,'yyyy-MM-dd'), end_date: $filter('date')($scope.activity_end_date,'yyyy-MM-dd')}
//         })
//         .success(function(data) {
//             // console.log(data);
//             var comp_times = [0,0,0,0,0,0];
//             var comp = ["Alone", "With Spouse", "With Children", "With friends", "With Co-worker", "None of the above"];
//             for(var i = 0; i < data.length; i++){
//                 for(var j = 0; j < 6; j++){
//                     if(comp[j] == data[i].company){
//                         comp_times[j] = data[i].count;
//                     }
//                 }
//             }
//             // console.log(comp, comp_times);
//             $scope.labels_comp = comp;
//             $scope.data_comp = comp_times;
//         })
//         .error(function(error) {
//             console.log('Error: ' + error);
//         });
//         $scope.chart_colors_comp = [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];
        

//     };
//     radar($rootScope.start_date,$rootScope.end_date);

//     $scope.$on('datechange', function(event, args){
//         radar($rootScope.start_date,$rootScope.end_date);
//     })
    
// });


app.controller("barCtrl", function($rootScope, $scope, $filter, $http) {
    $scope.all_goals_start_date = $rootScope.start_date;
    $scope.all_goals_end_date = $rootScope.end_date;
    $scope.username = document.getElementById("user_username").value;
    
    
    var bar = function(start, end) {
        $scope.options_bar = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'top',
            },
            scales: {
                xAxes: [{
                    display: true,
                    position: 'top',
                    scaleLabel: {
                        display: true,
                        labelString: 'Walking time in minutes'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Dates'
                    }
                }]
            }
        };


        $scope.all_goals_start_date = start;
        $scope.all_goals_end_date = end;
        var set_goals = [];
        var get_goals = [];
        var dates = [];
        date1 = new Date($scope.all_goals_start_date);
        date1.setHours(0,0,0,0);
        date2 = new Date($scope.all_goals_end_date);
        date2.setHours(0,0,0,0);
        var diff = (date2.getTime()-date1.getTime())/86400000;
        dates[0] = date1;
        for(var d = 1; d <= diff;d++){
            dates[d] = new Date(dates[d-1].getTime()+86400000);
        }
        var formatted_dates = [];
        for(var j = 0; j< dates.length;j++){
            formatted_dates[j] = $filter('date')(dates[j],'yyyy-MM-dd');
        }
        $scope.horizon_scale = 1;
        var x = 40*(formatted_dates.length)*($scope.horizon_scale);
        console.log("length  ",x);
        $scope.horizon_height = {'height':x+"px;"}
        
        // console.log("dates array : ",dates);
        // console.log("formatted dates array :", formatted_dates);

        $scope.bar_options = [4,5,6];

        $http({
            url:"/api/getallsetgoals",
            method:"GET",
            params: {username: $scope.username, start_date: $filter('date')($scope.all_goals_start_date,'yyyy-MM-dd'), end_date: $filter('date')($scope.all_goals_end_date,'yyyy-MM-dd')}
        })
        .success(function(data){
            // console.log(data);
            var j = 0;
            for(var i = 0; i < formatted_dates.length; i++){
                if(data.length == 0){
                    set_goals[i] = 0;
                    continue;
                }
                var d = new Date(data[j].set_date);
                d.setHours(0,0,0,0);
                var date = $filter('date')(d,'yyyy-MM-dd');
                
                // console.log('set_date : ',date);
                
                
                if(date == formatted_dates[i]){
                    set_goals.push(data[j].set_goal);
                    j++;
                    if(j == data.length)
                        break;
                } else {
                    set_goals.push(0);

                }
                // console.log(set_goals);
                
            }
        })
        .error(function(error){
            console.log('Error : '+error);
        });
        // console.log("set_goals array : ",set_goals);
        
        $http({
            url:"/api/getallgetgoals",
            method:"GET",
            params: {username: $scope.username, start_date: $filter('date')($scope.all_goals_start_date,'yyyy-MM-dd'), end_date: $filter('date')($scope.all_goals_end_date,'yyyy-MM-dd')}
        })
        .success(function(data){
            // console.log(data);
            var j = 0;
            for(var i = 0; i < formatted_dates.length; i++ ){
                if(data.length == 0){
                    get_goals[i] = 0;
                    continue;
                }
                var d = new Date(data[j].get_date);
                d.setHours(0,0,0,0);
                var date = $filter('date')(d,'yyyy-MM-dd');
                // console.log('set_date : ',date);
                // console.log(formatted_dates[i]);
                if(date == formatted_dates[i]){
                    get_goals.push(data[j].get_goal);
                    j++;
                    if(j == data.length)
                        break;
                } else {
                    get_goals.push(0);
                }     
            }
            
        })
        .error(function(error){
            console.log('Error : '+error);
        });
        // console.log("get_goals array : ",get_goals);
        
        $scope.labels_bar = formatted_dates;
        $scope.series_bar = ['Set goal','Achieved goal'];
        $scope.data_bar = [set_goals, get_goals];
        $scope.chart_color_bar = [{//blue
            backgroundColor: 'rgba(62, 56, 229, 0.9)',
            pointHoverBackgroundColor: 'rgba(148,159,177,1)',
            borderColor: 'rgba(1,1,1,1)',
        },{//red
            backgroundColor: 'rgba(240, 45, 45, 0.9)',
            borderColor: 'rgba(1,1,1,1)',
        }
        ];
        
        
    };
    // bar($rootScope.start_date,$rootScope.end_date);
    $scope.$on('datechange', function(event, args){
        bar($rootScope.start_date,$rootScope.end_date);
    });
});

// app.controller("tables",function($rootScope, $scope, $http, $filter){
//     // $scope.goals
    

//     var tables = function(start, end){
//         $scope.table_start_date = start;
//         $scope.table_end_date = end;
//         $http({
//             url:"/api/getusergoals",
//             method:'get',
//             params:{username:$scope.username, start_date: $filter('date')($scope.table_start_date,'yyyy-MM-dd'), end_date: $filter('date')($scope.table_end_date,'yyyy-MM-dd')}
//         })
//         .success(function(data){
//             if(data.length){
//                 $scope.goals = data;
//             }
//         })
//         .error(function(error){
//             console.log('Error', error)
//         });
//     }

//     tables($rootScope.start_date,$rootScope.end_date);
//     $scope.$on('datechange', function(event, args){
//         tables($rootScope.start_date,$rootScope.end_date);
//     });
// });
