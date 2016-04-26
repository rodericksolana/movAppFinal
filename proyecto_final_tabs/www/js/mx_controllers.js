angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope) {
     $scope.images = [];
 
    $scope.loadImages = function() {
        // for(var i = 0; i < 11; i++) {
            // $scope.images.push({id: i, src: "http://placehold.it/50x50"});
        // }
        $scope.images.push({id: 1, src: "http://placehold.it/50x50"});
        $scope.images.push({id: 0, src: "img/adam.jpg"});
        $scope.images.push({id: 2, src: "img/ben.png"});
        $scope.images.push({id: 3, src: "img/ionic.png"});
        $scope.images.push({id: 4, src: "img/max.png"});
        $scope.images.push({id: 5, src: "img/mike.png"});
        $scope.images.push({id: 6, src: "img/perry.png"});
        $scope.images.push({id: 7, src: "http://placehold.it/50x50"});
        $scope.images.push({id: 8, src: "img/adam.jpg"});
        $scope.images.push({id: 9, src: "img/ben.png"});
        $scope.images.push({id: 10, src: "img/ionic.png"});
        $scope.images.push({id: 11, src: "img/max.png"});
        $scope.images.push({id: 12, src: "img/mike.png"});
        $scope.images.push({id: 13, src: "img/perry.png"});
    }
})

.controller('ChatsCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
    Chats.remove(chat);
    };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
    enableFriends: true
    };
})

.controller('ImgDetailCtrl', function($scope, $stateParams) {
    $scope.showComment = function() {
        $scope.model.showComment = true;
        var comment = document.getElementById("imgDetailComment");
        comment.click();
    };
    
    console.log("ImgDetailCtrl imgId : " + $stateParams.imgId);
    $scope.model = {};
    $scope.model.showComment = false;
})

.controller('CameraCtrl', function($scope, $stateParams) {
    
})




.controller('LoginCtrl', function ($scope, $state, servicioApp, $ionicPopup) {

 $scope.showAlert = function(msg) {
      $ionicPopup.alert({
          title: msg.title,
          template: msg.message,
          okText: 'Ok',
          okType: 'button-positive'
      });
    };


    $scope.login = function () {
        servicioApp.login($scope.login).then(function (data) {
		if (data.data == 1) {
                $state.go('tab.home');
            } else {
                $ionicPopup.alert({
			title: data.data,
                    template: "Revisar  (Usuario y Contraseña)",
                    okText: 'Ok',
                    okType: 'button-positive'
                });
            }
        });
    };

	$scope.datosPersona={};
   $scope.registra = function ()  {

servicioApp.registra({
                Usuario: $scope.datosPersona.username,
                Pw: $scope.datosPersona.password,
                Interes: $scope.datosPersona.Interes
            }).success(function(data){
             	if(data == 1)
	{
		$state.go('login');
		 $scope.showAlert({
                    title: "Info",
                    message: "Datos guardados - Inicia Sesión"
                });
	}//cierre de if
		
else
{
		$ionicPopup.alert({
			title: data,
                    template: "Intenta con otra combinación",
                    okText: 'Ok',
                    okType: 'button-positive'
                });
}//Cierre de else
            });

 	//document.write('<div>Funcion registra</div>'); //esto saca una ventana en blanco con el texto adentro


   };
})


.controller('AppCtrl', function ($scope, $state)  {

	/*$scope.validar= function() {
	//aqui se hacen las validaciones
	$state.go('sidemenu.home');
	}*/

})


