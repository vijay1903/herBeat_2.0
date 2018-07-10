var app = angular.module("profile",[]);

app.controller("passCtrl", function($scope ,$http){
    $scope.alert = true;
    
    $scope.reset = function() {
        $http({
            url: '/api/checkpassword',
            method: 'GET',
            params: {username: $scope.username,password: $scope.curr_password}
        })
        .success(function(data) {
            console.log(data);
            if(data){
                $http({
                    url: '/api/setpassword',
                    method: 'post',
                    params: {password: $scope.new_password, username: $scope.username}
                })
                .success(function(data) {
                    // console.log(data);
                    
                    if (window.confirm('Password changed sucessfully! If you click "ok" you would be redirected to Dashboard. Cancel will load this page again. ')) 
                    {
                    window.location.href='/dashboard';
                    };
                })
                .error(function(error) {
                    console.log('Error: ' + error);
                    window.alert("Some error occurred ! Please try again.");
                });
            } else {
                $scope.alert = false;
                $scope.reset_message = "Wrong username or current password !!";
            }
        })
        .error(function(error) {
                console.log('Error: ' + error);
        });
    }
});

app.controller("profileCtrl", function($scope ,$http){
    // $scope.username = "Zahar";
    $scope.username = document.getElementById("user_name").value;
    $scope.nameShow = true;
    $scope.emailShow = true;
    $scope.numberShow = true;
    $scope.change_fullname = function() {
        // $scope.nameShow = false;
        $http({
            url: '/api/changename',
            method: 'post',
            params: {username: $scope.username, fullname : $scope.name}
        })
        .success(function(data) {
            // console.log(data);
            $scope.nameShow = true;
            window.alert("Name changed success fully");
        })
        .error(function(error) {
            console.log('Error: ' + error);
            window.alert("Some error occurred ! Please try again.");
        });
    }
    $scope.change_email = function() {
        // $scope.emailShow = false;
        $http({
            url: '/api/changeemail',
            method: 'post',
            params: {username: $scope.username, email:$scope.email}
        })
        .success(function(data) {
            $scope.emailShow = true;
            window.alert("Email updated successfully!");
        })
        .error(function(error) {
            console.log('Error: ' + error);
            window.alert("Some error occurred ! Please try again.");
        });
    }
    $scope.change_number = function() {
        // $scope.numberShow = false;
        $http({
            url: '/api/changenumber',
            method: 'post',
            params: {username: $scope.username, number: $scope.number}
        })
        .success(function(data) {
            $scope.numberShow = true;
            window.alert("Contact number updated successfully!");
        })
        .error(function(error) {
            console.log('Error: ' + error);
            window.alert("Some error occurred ! Please try again.");
        });
    }
});