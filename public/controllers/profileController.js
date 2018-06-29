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