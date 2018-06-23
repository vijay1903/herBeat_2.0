var app = angular.module("forgot",[]);

app.controller('forgotCtrl', function($scope, $http){
    // $scope.username = "";
    // $scope.search_message = "";
    // $scope.password = "";
    // $scope.email = "";
    $scope.p1 = true;
    $scope.p2 = true;
    $scope.resetbutton = true;
    $scope.confirm = function() {
        $http({
            url: '/api/searchusername',
            method: 'GET',
            params: {username: $scope.username,email: $scope.email}
        })
        .success(function(data) {
            console.log(data);
            if(data.length==1){
                $scope.search_message = "User found you can now set the password.";
                $scope.p1 = false;
                $scope.p2 = false;
                $scope.resetbutton = false;
                $scope.resetpassword = function() {
                    $http({
                        url: '/api/setpassword',
                        method: 'post',
                        params: {password: $scope.password, username: $scope.username}
                    })
                    .success(function(data) {
                        // console.log(data);
                        
                        if (window.confirm('Password changed sucessfully! If you click "ok" you would be redirected to login . Cancel will load this page again. ')) 
                        {
                        window.location.href='/';
                        };
                    })
                    .error(function(error) {
                        console.log('Error: ' + error);
                        window.alert("Some error occurred ! Please try again.");
                    });
                }
            }
            if (data.length == 0){
                $scope.search_message = "No such username or email found !!";
            }
            if(data.length > 1){
                $scope.search_message = "Multiple user with same username found. Contact the support.";
            }
        })
        .error(function(error) {
                console.log('Error: ' + error);
        });
        }
})