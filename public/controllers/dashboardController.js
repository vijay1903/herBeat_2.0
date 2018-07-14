"use strict";

var app = angular.module("myApp",['chart.js']);


app.controller('navCtrl', function($rootScope, $scope) {
    var midnight = new Date();
    midnight.setHours(0,0,0,0);
    $rootScope.start_date = midnight;
    $rootScope.end_date = new Date();
    $scope.start = midnight;
    $scope.end = new Date();

    $(function() {

        var start = moment().hour(0).minute(0).second(0);
        var end = moment();
        
        function cb(start, end) {
            $('#reportrange span').html(start.format('MMM DD, YYYY') + ' - ' + end.format('MMM DD, YYYY'));
            $rootScope.start_date = new Date(start._d);
            $rootScope.end_date = new Date(end._d);
        }
        $('#reportrange').daterangepicker({
            startDate: start,
            endDate: end,
            opens: 'left',
            minDate: moment('2018-04-02'),
            maxDate: moment(),
            ranges: {
               'Today': [moment(), moment()],
               'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
               'Last 7 Days': [moment().subtract(6, 'days'), moment()],
               'Last 30 Days': [moment().subtract(29, 'days'), moment()],
               'This Month': [moment().startOf('month'), moment().endOf('month')],
               'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);
      
        cb(start, end);
    });
    console.log($rootScope.start_date,$rootScope.end_date);

    // var max_date = moment().format('YYYY-MM-DD');
    // // (new Date() >= $scope.end)? moment().format('YYYY-MM-DD'):$scope.end;
    // var min_date = "2018-04-02";
    // // ($scope.start > new Date("2018-04-02","YYYY-MM-DD"))?$scope.start:"2018-04-02";
    // document.getElementById("startDate").setAttribute("min",min_date);
    // document.getElementById("startDate").setAttribute("max",max_date);
    // document.getElementById("endDate").setAttribute("min",min_date);
    // document.getElementById("endDate").setAttribute("max",max_date);

    // $scope.search = function(){
    //     $rootScope.start_date = $scope.start;
    //     $rootScope.end_date = $scope.end;
    //     // return $rootScope.start_date, $rootScope.end_date;
    // }

    $scope.date_change = function(){
        if($rootScope.start_date>$rootScope.end_date){
            window.alert('Invalid date range selected. Start date must be before the end date.');
        } else {
            // $rootScope.start_date = $scope.start;
            // $rootScope.end_date = $scope.end; 
            $rootScope.$broadcast('datechange',{});       
        }
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
            $scope.goals=[];
            $scope.goals['color'] = []; 
            // console.log(data);
            if(data.length){
                $scope.card_1 = true;
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
            } else {
                $scope.card_1 = false;
                $scope.card_message_1 = "No data for this range."
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
                $scope.card_2 = true;
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
                
            } else {
                $scope.card_2 = false;
                $scope.card_message_2 = "No data for this range."
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
                $scope.card_3 = true;
                $scope.res_den = data[0].count;
            }
            else {
                $scope.card_3 = false;
                $scope.card_message_3 = "No data for this range."
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
            if(data.length){
                $scope.card_3 = true;
                $scope.res_num = data.length;
            } else {
                $scope.card_3 = false;
                $scope.card_message_3 = "No data for this range.";
            }
            $scope.searchText = {};
            $scope.all = true;
            // $scope.searchCat = ["response_date","activity","company","location","food","feel"];
            $scope.act_filter_options = [{label:"jogging", flag:true},{label:"standing", flag:true},{label:"walking", flag:true},{label:"sitting", flag:true},{label:"bicycling", flag:true},{label:"None of the above", flag:true}];
            $scope.comp_filter_options = [{label:"Alone",flag:true},{label:"With Spouse",flag:true},{label:"With Children",flag:true},{label:"With friends",flag:true},{label:"With Co-worker",flag:true},{label:"None of the above",flag:true}];
            $scope.loc_filter_options = [{label:"In House",flag:true},{label:"at recreation center",flag:true},{label:"at park",flag:true},{label:"at restaurant",flag:true},{label:"None of the place",flag:true},{label:"at gym",flag:true}];
            $scope.feel_filter_options = [{label:"Very Positive",flag:true},{label:"Positive",flag:true},{label:"Neutral",flag:true},{label:"Negative",flag:true},{label:"Very Negative",flag:true}];
            $scope.food_filter_options = [{label:"Protein",flag:true},{label:"Vegetable",flag:true},{label:"Whole Grain",flag:true},{label:"One Drink",flag:true},{label:"Fruit",flag:true},{label:"None of the Above",flag:true},{label:"Sweet and Sugary Drink",flag:true},{label:"Salty Snack",flag:true},{label:"SeveralDrink",flag:true},{label:"Fried food",flag:true},{label:"Didn' Eat anything last hour",flag:true}];
            // var filter_arr = [];
            // filter_arr['activity'] = [];
            // filter_arr['company'] = [];
            // filter_arr['location'] = [];
            // filter_arr['food'] = [];
            // filter_arr['feel'] = [];
            // $scope.searchText['activity'] = ["jogging","standing","walking","sitting","bicycling","None of the above"];
            // $scope.searchText['company'] = ["Alone", "With Spouse", "With Children", "With friends", "With Co-worker", "None of the above"];
            // $scope.searchText['location'] = ["In House", "at recreation center", "at park", "at restaurant", "None of the place", "at gym"];
            // $scope.searchText['food'] = ["Protein","Vegetable","Whole Grain","One Drink","Fruit","None of the Above","Sweet and Sugary Drink","Salty Snack","SeveralDrink","Fried food","Didn' Eat anything last hour"];
            // $scope.searchText['feel'] = ["Very Positive","Positive","Neutral","Negative","Very Negative"];
            
            var out = data;
            $scope.searchBy = function(category){
                // if($scope.searchText == ''){
                //     $scope.responses = data;
                //     $scope.searchCount = data.length;
                // } else {
                //     $scope.responses = [];
                //     console.log($scope.searchText);
                //     $scope.responses = $filter('filter')(data,$scope.searchText,true);
                //     // if((filter_arr.activity).includes($scope.searchText.activity)){
                //     //     filter_arr.activity.pop($scope.searchText.activity);
                //     //     $scope.searchText = '';
                //     // } else {
                //     //     filter_arr.activity.push($scope.searchText.activity);
                //     //     $scope.searchText = '';
                //     // }
                //     // $scope.responses = $filter('filter')(data,filter_arr[0])
                //     // console.log(filter_arr);
                //     $scope.searchCount = $scope.responses.length;
                // }

                Array.prototype.unique = function() {
                    var a = this.concat();
                    for(var i=0; i<a.length; ++i) {
                        for(var j=i+1; j<a.length; ++j) {
                            if(a[i] === a[j])
                                a.splice(j--, 1);
                        }
                    }
                
                    return a;
                };
                
                if($scope.all) {
                    var temp = [];
                    // switch(category) {
                        // case "act":{
                            temp = [];
                            for(var a in $scope.act_filter_options){
                                $scope.searchText['activity'] = $scope.act_filter_options[a].label;
                                if($scope.act_filter_options[a].flag){
                                    temp = temp.concat($filter('filter')(out,$scope.searchText,true)).unique();
                                }
                            }
                            out = temp;
                            // break;
                        // }
                        // case "comp":{
                            temp = [];
                            for(var a in $scope.comp_filter_options){
                                $scope.searchText['company'] = $scope.comp_filter_options[a].label;
                                if($scope.comp_filter_options[a].flag){
                                    temp = temp.concat($filter('filter')(out,$scope.searchText,true)).unique();
                                }
                            }
                            out = temp;
                            // break;
                        // }
                        // case "loc":{
                            temp = [];
                            for(var a in $scope.loc_filter_options){
                                $scope.searchText['location'] = $scope.loc_filter_options[a].label;
                                if($scope.loc_filter_options[a].flag){
                                    temp = temp.concat($filter('filter')(out,$scope.searchText,true)).unique();
                                }
                            }
                            out = temp;
                            // break;
                        // }
                        // case "food":{
                            temp = [];
                            for(var a in $scope.food_filter_options){
                                $scope.searchText['food'] = $scope.food_filter_options[a].label;
                                if($scope.food_filter_options[a].flag){
                                    temp = temp.concat($filter('filter')(out,$scope.searchText,true)).unique();
                                }
                            }  
                            out = temp;
                            // break;
                        // }
                        // case "feel":{
                            temp = [];
                            for(var a in $scope.feel_filter_options){
                                $scope.searchText['feel'] = $scope.feel_filter_options[a].label;
                                if($scope.feel_filter_options[a].flag){
                                    temp = temp.concat($filter('filter')(out,$scope.searchText,true)).unique();
                                }
                            }
                            out = temp;
                            // break;
                        // }
                        // default : {
                            // out = data;
                            // $scope.selectAll($scope.act_filter_options);
                            // $scope.selectAll($scope.comp_filter_options);
                            // $scope.selectAll($scope.loc_filter_options);
                            // $scope.selectAll($scope.food_filter_options);
                            // $scope.selectAll($scope.feel_filter_options);
                            // break;
                        // }
                    // }
                    $scope.responses = out;
                    $scope.searchCount = data.length; 
                } else { 
                    $scope.responses = []; 
                }
            }
            var resetAll = function(item){
                for(var i in item){
                    item[i].flag = true;
                }
            }
            $scope.resetFilter = function(){
                $scope.searchText = [];
                out = data;
                resetAll($scope.act_filter_options);
                resetAll($scope.comp_filter_options);
                resetAll($scope.loc_filter_options);
                resetAll($scope.food_filter_options);
                resetAll($scope.feel_filter_options);              
                $scope.searchBy();

            }
            
            $scope.clicked = function(item,type) {
                if(type == 'selectAll'){
                    out = data;
                    for(var x in item){
                        item[x].flag = true;
                    }
                    $scope.all = true;
                    $scope.searchBy();
                } else if(type == "deselectAll") {
                    for(var x in item){
                        item[x].flag = false;
                    }
                    $scope.all = false;
                    $scope.searchBy();
                } else {
                    // if(!$scope.all){
                        out = data;
                    // }
                    $scope.all = true;
                    $scope.searchBy();
                }
                
                // console.log("Clicked!!");
            }
            $scope.searchBy();
            $scope.radar_options = {
                scale: {
                    ticks:{
                        stepSize : ((data.length)?(5):1) //add comparision
                    }
                }
            }
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
            
            if(data.length){
                $scope.card_4 = true;
                $scope.messages = data;
                $scope.msg_num = data.length;
            } else {
                $scope.card_4 = false;
                $scope.card_message_4 = "No message for this range."
            }
            $scope.msg_start_date = $scope.card_start_date;
            $scope.msg_end_date = $scope.card_end_date;
        })
        .error(function(error) {
                console.log('Error: ' + error);
        });
    };
    cards($rootScope.start_date,$rootScope.end_date);
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
    $scope.change_range = function(){
        heart($rootScope.start_date,$rootScope.end_date);
    }
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
                $scope.card_5 = true;
                counter = $filter('date')(data[0].act_time,range);
                counter_arr.push(counter);
                h_rate[counter] = [];
                dates[counter] = [];
                chart_color_arr[counter] = [];
            } else {
                $scope.card_5 = false;
                $scope.card_message_5 = "No data for this date range.";
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
                dates[counter][l] = $filter('date')(data[i].act_time,'MMM dd yyyy hh:mm a');
                chart_color_arr[counter].push(
                    { // grey
                    //   backgroundColor: 'rgba(148,159,177,0.2)',
                    //   pointBackgroundColor: 'rgba(148,159,177,1)',
                    //   pointHoverBackgroundColor: 'rgba(148,159,177,1)',
                    //   borderColor: 'rgba(148,159,177,1)',
                    //   pointBorderColor: '#fff',
                    //   pointHoverBorderColor: 'rgba(148,159,177,0.8)'
                    // red
                    backgroundColor: 'rgba(196, 23, 55, 1)',
                    pointBackgroundColor: 'rgba(245, 168, 182, 1)',
                    pointHoverBackgroundColor: 'rgba(238, 114, 136, 0.6)',
                    borderColor: 'rgba(196, 23, 55, 1)',
                    pointBorderColor: 'rgba(196, 23, 55, 1)',
                    pointHoverBorderColor: 'rgba(229, 31, 68, 0.53)'
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
                if($scope.heart_range == "Weekly"){
                    // console.log(dates[x][0]);
                    var w_start = moment(dates[x][0],'MMM DD YYYY hh:mm a').week(counter_arr[current]).startOf('week').format('MMM DD YYYY');
                    var w_end = moment(dates[x][0],'MMM DD YYYY hh:mm a').week(counter_arr[current]).endOf('week').format('MMM DD YYYY');
                    $scope.heart_options = [w_start + " to " + w_end];
                    // $scope.heart_options = [$filter('date')(dates[x][0], 'MM dd yyyy') + " - " + $filter('date')(dates[x][(dates[x].length)-1], 'MM dd yyyy')];
                } else {
                    $scope.heart_options = [counter_arr[current]];
                }


                $scope.chart_color = chart_color_arr[x];
                $scope.data = h_rate[x];
                // $scope.labels = [];
                // var start = new Date(dates[x][0]);
                // // var time = $filter('date')(start,'hh:mm a');
                // var date = start.getDate();
                // var month = start.getMonth();
                // var year = start.getFullYear();
                // $scope.labels[0] = [start.toLocaleTimeString(),date,month,year];
                // for(var i = 1; i< dates[x].length; i++){
                //     var d = new Date(dates[x][i]);
                //     var temp = [d.toLocaleTimeString()];
                //     if(d.getDate() != date){
                //         temp.push(d.getDate());
                //         date = d.getDate();
                //     }
                //     if(d.getMonth() != month){
                //         temp.push(d.getMonth());
                //         month = d.getMonth();
                //     }
                //     if(d.getFullYear() !=year){
                //         temp.push(d.getFullYear());
                //         year = d.getFullYear();
                //     }
                //     $scope.labels[i] = temp;
                // }
                // console.log($scope.labels);

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
            animation: {
                duration:500
            },
            scales: {
                xAxes: [{
                    maxBarThickness : 20,
                    ticks:{
                        autoSkip : true,
                        autoSkipPadding: 40,
                        maxRotation : 0
                    },
                    display: true,
                    min : 0 ,
                    scaleLabel: {
                        display: false,
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
    heart($rootScope.start_date,$rootScope.end_date);

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


app.controller("barCtrl", function($rootScope, $scope, $filter, $http, $timeout) {
    $scope.all_goals_start_date = $rootScope.start_date;
    $scope.all_goals_end_date = $rootScope.end_date;
    $scope.username = document.getElementById("user_username").value;
    $scope.bar_range = "Monthly";
   
    
    $scope.options_bar = {
        animation:{
            duration: 1000
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            position: 'top',
        },
        scales: {
            xAxes: [{
                ticks :{
                    min:0,
                    stepSize: 5
                },
                display: true,
                position: 'top',
                scaleLabel: {
                    display: true,
                    labelString: 'Walking time in minutes'
                }
            }],
            yAxes: [{
                maxBarThickness : 20,
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Dates'
                }
            }]
        }
    };

    var bar = function(start, end) {
        $scope.all_goals_start_date = start;
        $scope.all_goals_end_date = end;
        var set_goals = [];
        var get_goals = [];
        var dates = [];
        var date1 = new Date($scope.all_goals_start_date);
        date1.setHours(0,0,0,0);
        var date2 = new Date($scope.all_goals_end_date);
        date2.setHours(0,0,0,0);
        var diff = (date2.getTime()-date1.getTime())/86400000;
        dates[0] = date1;
        for(var d = 1; d <= diff;d++){
            dates[d] = new Date(dates[d-1].getTime()+86400000);
        }

        
        var formatted_dates = [];
        // counter = $filter('date')(dates[0],range);
        // counter_arr.push(counter);
        // formatted_dates[counter] = [];
        // console.log(dates);
        // var l = 0;
        for(var j = 0; j < dates.length;j++){
            // if($filter('date')(dates[j],range) != counter){
            //     l = 0;
            //     counter = $filter('date')(dates[j],range);
            //     counter_arr.push(counter);
            //     formatted_dates[counter] = [];
            // }
            // formatted_dates[counter][l] = $filter('date')(dates[j],'yyyy-MM-dd');
            var d = new Date(dates[j]);
            d.setHours(0,0,0,0);
            formatted_dates.push($filter('date')(d,'yyyy-MM-dd'));
        }
        // console.log(counter_arr, formatted_dates);
        // dates = [];
        // $scope.horizon_scale = 1;
        // var x = 40*(formatted_dates.length)*($scope.horizon_scale);
        // console.log("length  ",x);
        // $scope.horizon_height = {'height':x+"px;"}
        // console.log("dates array : ",dates);
        // console.log("formatted dates array :", formatted_dates);
        


        

        $scope.bar_options = [];

        $http({
            url:"/api/getallsetgoals",
            method:"GET",
            params: {username: $scope.username, start_date: $filter('date')($scope.all_goals_start_date,'yyyy-MM-dd'), end_date: $filter('date')($scope.all_goals_end_date,'yyyy-MM-dd')}
        })
        .success(function(data){
            // console.log(data);
            // var j = 0;
            
            // for(var i in counter_arr){
            //     var l = 0;
            //     var count = counter_arr[i];
            //     set_goals[count] = [];
            //     for(var i = 0;  i < formatted_dates[count].length; i++,l++){
            //         if(data.length == 0){
            //             set_goals[count][l] = 0;
            //             continue;
            //         }
            //         var d = new Date(data[j].set_date);
            //         // d.setHours(0,0,0,0);
            //         var date = $filter('date')(d,'yyyy-MM-dd');
                    
            //         // console.log('set_date : ',date);
            //         // console.log("set_date : ",date,formatted_dates[count][i]); 

            //         if(date == formatted_dates[count][i]){
            //             set_goals[count][l] = data[j].set_goal;
            //             // set_goals.push(data[j].set_goal);
            //             j++;
            //             if(j == data.length)
            //                 break;
            //         } else {
            //             set_goals[count][l] = 0;
    
            //         }
            //     }
            //     if(j == data.length)
            //         break;
            // }
            if(data.length) {
                var j = 0;
                // console.log('set_goals',set_goals);
                for(var i = 0; i < formatted_dates.length; i++){
                    var d = new Date(data[j].set_date);
                    d.setHours(0,0,0,0);
                    var date = $filter('date')(d,'yyyy-MM-dd');
                    
                    if(date == formatted_dates[i]){
                        set_goals[i] = data[j].set_goal;
                        if(j < (data.length-1))
                            j++;
                    } else {
                        set_goals[i] = 0;
                    }
                    // console.log(set_goals);
                }
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
                
                // var j = 0;
                // for(var i in counter_arr){
                //     var l = 0;
                //     var count = counter_arr[i];
                //     // console.log(count);
                //     get_goals[count] = [];
                //     for(var i = 0;  i < formatted_dates[count].length; i++,l++){
                //         if(data.length == 0){
                //             get_goals[count][l] = 0;
                //             continue;
                //         }
                //         var d = new Date(data[j].get_date);
                //         // d.setHours(0,0,0,0);
                //         var date = $filter('date')(d,'yyyy-MM-dd');
                        
                //         // console.log('get_date : ',date);
                //         console.log("get_date",i,j,count,date,formatted_dates[count][i]);

                //         if(date == formatted_dates[count][i]){
                //             get_goals[count][l] = data[j].get_goal;
                //             // set_goals.push(data[j].get_goal);
                //             j++;
                //             if(j == data.length)
                //                 break;
                //         } else {
                //             get_goals[count][l] = 0;

                //         }
                //     }
                //     if(j == data.length)
                //         break;
                    // console.log(get_goals);
                // }
            if(data.length){
                $scope.card_6 = true;
                var j = 0;
                for(var i = 0; i < formatted_dates.length; i++){
                    var d = new Date(data[j].get_date);
                    d.setHours(0,0,0,0);
                    var date = $filter('date')(d,'yyyy-MM-dd');
                    
                    if(date == formatted_dates[i]){
                        get_goals[i] = data[j].get_goal;
                        
                        if(j < (data.length-1))
                            j++
                    } else {
                        get_goals[i] = 0;
                    }     
                }
            } else {
                $scope.card_6 = false;
                $scope.card_message_6 = "No data for this range.";
            }
            
        })
        .error(function(error){
            console.log('Error : '+error);
        });
        // console.log("get_goals array : ",get_goals);
        
        // var range = 'MMM yyyy';
        $scope.bar_range = "Monthly";
        // dates = [];
        

        $scope.change_bar_range = function() {$timeout(function() {
            // range logic starts
            var counter_arr = [];
            var counter = '';
            var temp_set_goals = [];
            var temp_get_goals = [];
            var temp_dates = [];
            var range = "";

            switch ($scope.bar_range) {
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

            counter = $filter('date')(formatted_dates[0],range);
            counter_arr.push(counter);
            temp_dates[counter] = [];
            temp_set_goals[counter] = [];
            temp_get_goals[counter] = [];
            var l = 0;
            // console.log(formatted_dates, set_goals, get_goals);
            for(var j = 0; j < formatted_dates.length; j++,l++){
                if($filter('date')(formatted_dates[j],range) != counter){
                    l = 0;
                    counter = $filter('date')(formatted_dates[j],range);
                    counter_arr.push(counter);
                    temp_dates[counter] = [];
                    temp_set_goals[counter] = [];
                    temp_get_goals[counter] = [];
                }
                temp_dates[counter][l] = $filter('date')(formatted_dates[j],'yyyy-MM-dd');
                temp_set_goals[counter][l] = set_goals[j];
                temp_get_goals[counter][l] = get_goals[j];
            }
            // console.log(temp_dates,temp_get_goals,temp_set_goals);
            // var j = 0;
            
            // for(var i in counter_arr) {
            //     var l = 0;
            //     var count = counter_arr[i];
            //     temp_set_goals[count] = [];
            //     temp_get_goals[count] = [];

            //     for(var i = 0;  i < temp_dates[count].length; i++,l++) {
                    


            //         // if(data.length == 0){
            //         //     temp_set_goals[count][l] = 0;
            //         //     continue;
            //         // }
            //         // var d = new Date(data[j].set_date);
            //         // // d.setHours(0,0,0,0);
            //         // var date = $filter('date')(d,'yyyy-MM-dd');
                    
            //         // // console.log('set_date : ',date);
            //         // // console.log("set_date : ",date,temp_dates[count][i]); 

            //         // if(date == temp_dates[count][i]){
            //         //     temp_set_goals[count][l] = data[j].set_goal;
            //         //     temp_get_goals[count][l] = data[j].set_goal;
            //         //     j++;
            //         // } else {
            //         //     temp_set_goals[count][l] = 0;
    
            //         // }
            //     }
            // }
            

            var page_no = 0;
            currentBarPage(page_no);

            function currentBarPage(current) {
                if(!counter_arr[current+1]) {
                    $scope.next_bar = true;
                } else {
                    $scope.next_bar = false;
                }
                if(!counter_arr[current-1]) {
                    $scope.prev_bar = true;
                } else {
                    $scope.prev_bar = false;
                }
                var x = counter_arr[current];
                // console.log("in loop",dates[x],h_rate[x],counter_arr);
                if($scope.bar_range == "Weekly") {
                    // console.log(temp_dates[x][0]);
                    var w_start = moment(temp_dates[x][0],'YYYY-MM-DD').week(counter_arr[current]).startOf('week').format('MMM DD YYYY');
                    var w_end = moment(temp_dates[x][0],'YYYY-MM-DD').week(counter_arr[current]).endOf('week').format('MMM DD YYYY');
                    $scope.bar_options = [w_start + " to " + w_end];
                    // $scope.heart_options = [$filter('date')(dates[x][0], 'MM dd yyyy') + " - " + $filter('date')(dates[x][(dates[x].length)-1], 'MM dd yyyy')];
                } else {
                    $scope.bar_options = [counter_arr[current]];
                }
                // console.log('temp_set_goals : ', temp_set_goals,'temp_get_goals : ',temp_get_goals)
                $scope.data_bar = [temp_set_goals[x],temp_get_goals[x]];
                $scope.labels_bar = temp_dates[x];
                // console.log(" scope variable ",$scope.data,$scope.labels);
            }
            $scope.nextBarPage = function() {
                if(counter_arr[page_no+1]) {
                    page_no++;
                    currentBarPage(page_no);
                }
            }
            $scope.prevBarPage = function() {
                if(counter_arr[page_no-1]) {
                    page_no--;
                    currentBarPage(page_no);
                }
            }

        },500)};
        $scope.change_bar_range();
        
        // $scope.labels_bar = formatted_dates;
        // $scope.data_bar = [set_goals, get_goals];
        
        
        
        $scope.series_bar = ['Set goal','Achieved goal'];
        $scope.chart_color_bar = [{//blue
            backgroundColor: 'rgba(23, 87, 196, 1)',
            pointHoverBackgroundColor: 'rgba(23, 87, 196, 0.65)',
            borderColor: 'rgba(255, 255, 255, 1)',
        },{//red
            backgroundColor: 'rgba(240, 45, 45, 0.9)',
            pointHoverBackgroundColor: 'rgba(240, 45, 45, 0.65)',
            borderColor: 'rgba(255, 255, 255, 1)',
        }
        ];
        
        
    };
    bar($rootScope.start_date,$rootScope.end_date);
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


app.controller('chatCtrl', function($scope,$filter,$http){
    $scope.username = document.getElementById('user_username').value;
    $scope.chat_class = 'chat sent';
    function updateScroll(c){
        // var element = document.getElementById("myChat");
        // element.scrollTop = c;
        $("#myChat").animate({scrollTop: c},500);
    }
    
    $scope.refresh = function(){
        chat();
    }
    var chat = function(){
        // updateScroll($scope.message_count*80);
        $http({
            url:"/api/getchatmessages",
            method:'GET',
            params:{username:$scope.username}
        })
        .success(function(data){
            if(data.length){
                $scope.chats = data;
                $scope.message_count = data.length;
                updateScroll($scope.message_count*80);
            }
        })
        .error(function(error){
            console.log('Error', error)
        });

        $scope.sendMessage = function(){
            $http({
                url:"/api/sendchatmessages",
                method:'POST',
                params:{message:$scope.chat,sender:$scope.username,receiver:"health_coach"}
            })
            .success(function(data){
                    // $scope.chats = data;
                    $scope.chat = '';
                    chat();
                    updateScroll($scope.message_count*80);
            })
            .error(function(error){
                console.log('Error', error)
            });
        }
    }
    // setInterval(chat,3000);
    chat();
});
