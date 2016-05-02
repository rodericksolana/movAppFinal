angular.module('starter.controllers', ['ngCordova'])

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



.controller('LoginCtrl', function ($scope, $state, servicioApp, $ionicPopup, DataShare, $cordovaCamera, $cordovaFileTransfer) {

var imageURL;

/*Funcion para poner alertas con mensajes en pantalla*/
 $scope.showAlert = function(msg) {
      $ionicPopup.alert({
          title: msg.title,
          template: msg.message,
          okText: 'Ok',
          okType: 'button-stable'
      });
    };

/*Funcion para logear*/
    $scope.login = function () {
        // DataShare.user = {id: 1, username: 'Tatum', perfil: 'user'};
        // $state.go('tab.home');
        servicioApp.login($scope.login).then(function (data) {
		if (data.data.respCode == 1) {
            DataShare.user = data.data.result[0];
            $state.go('tab.home');
        } else {
            $ionicPopup.alert({
        title: "ERROR",
                template: "Revisar  (Usuario y Contraseña)",
                okText: 'Ok',
                okType: 'button-positive'
            });
        }
        });
    };

	$scope.datosPersona={}; //arreglo para los datos de las personas

/*Funcion para registrar y subir la foto al servidor*/
    $scope.registra = function ()  {

$scope.datosPersona.imagen = "http://ubiquitous.csf.itesm.mx/~pddm-1129839/content/final/.Proyecto/Servicios/upload/" + $scope.datosPersona.username + "-" + $scope.datosPersona.password +".jpg";


/*Comienza la parte para registrar al usuario*/

    servicioApp.registra({
                    Usuario: $scope.datosPersona.username,
                    Pw: $scope.datosPersona.password,
                    Interes: $scope.datosPersona.Interes,
		    imagen: $scope.datosPersona.imagen
                }).success(function(data){
		 if(data == 1)
        {
	     $state.go('login');
             $scope.showAlert({
                        title: "Info",
                        message: "Datos guardados - Inicia Sesión"
                    });

	var server_url = "http://ubiquitous.csf.itesm.mx/~pddm-1129839/content/" +
            "final/.Proyecto/Servicios/file_upload.php";
        var filename = $scope.datosPersona.username + "-" +$scope.datosPersona.password +".jpg" ;
          
        var options_up = {
              fileKey: "file",
              fileName: filename,
              chunkedMode: false,
              mimeType: "image/jpg",
              params : {'directory':'upload', 'fileName':filename}
          };
 
        $cordovaFileTransfer.upload(server_url, imageURL, options_up).then(function(result) {
            console.log("SUCCESS: " + JSON.stringify(result.response));

            if (result.response !== "File successfully uploaded!") {
                alert("Hubo un error al subir la imagen.");
                return false;
            } 
            
            var img_path = "http://ubiquitous.csf.itesm.mx/~pddm-1129839/content/final/.Proyecto/Servicios/upload/" + filename;
     
            
        }, function(err) {
            console.log("ERROR: " + JSON.stringify(err));
            alert("It was an error uploading the file");
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
/*Funcion para tomar una foto*/
	  $scope.pic = function() {
        var options = { 
            quality : 75, 
            //destinationType : Camera.DestinationType.DATA_URL, 
	    destinationType : Camera.DestinationType.FILE_URL,
            sourceType : Camera.PictureSourceType.CAMERA, 
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 500,
            targetHeight: 500,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
 
        $cordovaCamera.getPicture(options).then(function(imageData) {
            //$scope.imgURI = "data:image/jpeg;base64," + imageData;
		$scope.imgURI = imageData;
		imageURL = imageData;
	/*$scope.showAlert({
                        title: "imgURI",
                        message: imageURL
                    });*/
        }, function(err) {
            // An error occured. Show a message to the user
        });
    }//Cierre de funcion pic
	
	
})//termina controlador login



.controller('AccountCtrl', function($scope, $stateParams, $http, $ionicModal,
            $cordovaImagePicker, $cordovaCamera, $cordovaFileTransfer, DataShare,
            servicioApp) {

 $scope.showDataId = function() {
      servicioApp.getId(DataShare.user.id).success(function(datosPersona) {
            $scope.datosPersona = datosPersona;
        });
        
    };

    $scope.showDataId();

	



})//Cierre controlador Cuenta






.controller('AppCtrl', function ($scope, $state)  {

	/*$scope.validar= function() {
	//aqui se hacen las validaciones
	$state.go('sidemenu.home');
	}*/

})

.controller('CameraCtrl', function($scope, $stateParams, $http, $ionicModal,
            $cordovaImagePicker, $cordovaCamera, $cordovaFileTransfer, DataShare,
            servicioApp) {
                
    $scope.model = {};
    $scope.model.image = '';
    $scope.model.geolocalizado = false;
    
    $scope.collection = {
        selectedImage : ''
    };
    
    var myLatLng;
    
    $scope.loadImages = function() {
        document.addEventListener("deviceready", function () {
        var options = {
                maximumImagesCount: 1, // número máximo de images a seleccionar
                width: 640,
                height: 640,
                quality: 50            // Higher is better
            };
        $cordovaImagePicker.getPictures(options).then(function (results) {
            
            // como sólo se permite seleccionar una, no es necesario hacer un ciclo
            if (results.length > 0) {
                $scope.collection.selectedImage = results[0];
                $scope.model.image = $scope.collection.selectedImage;
                $scope.model.hide = false; // mostramos la imagen
            }
            
        }, function(error) {
            console.log('Error: ' + JSON.stringify(error));    // In case of error
        });
        })
    };
    
    $scope.Geolocalizar = function () { $ionicModal.fromTemplateUrl('templates/mapa_modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
    });
    };
    
    $scope.saveLocation = function() {
        var ubi = $scope.ubicacion;
        $scope.modal.remove();
        console.log("ubicación: ");
        console.log(DataShare.coordenate);
    };
    
    $scope.savePic = function() {
        var server_url = "http://ubiquitous.csf.itesm.mx/~pddm-1129839/content/" +
            "final/.Proyecto/Servicios/file_upload.php";
        var filename = "u" + DataShare.user.id + "-" + Date.now().toString() + ".jpg";
          
        var options_up = {
              fileKey: "file",
              fileName: filename,
              chunkedMode: false,
              mimeType: "image/jpg",
              params : {'directory':'upload', 'fileName':filename}
          };
        $cordovaFileTransfer.upload(server_url, $scope.model.image, options_up).then(function(result) {
            console.log("SUCCESS: " + JSON.stringify(result.response));
            if (result.response !== "File successfully uploaded!") {
                alert("Hubo un error al subir la imagen.");
                return false;
            } 
            
            var img_path = "http://ubiquitous.csf.itesm.mx/~pddm-1129839/content/final/.Proyecto/Servicios/upload/" + filename;
            servicioApp.imgInsert({"idPersona": DataShare.user.id,
                                "ubicacion": DataShare.coordenate.latitude + "," + 
                                             DataShare.coordenate.longitude,
                                "descripcion": $scope.model.description,
                                "tipo": 'foto', // no está vendido aún
                                "ruta": img_path}).then(
            function(resp) {
                alert("Datos guardados exitosamente.");	
                $state.go('app.main');
            }, function(error) {
                console.log(error);
                alert("Hubo un error con la comunicación al servidor. Intente de nuevo.");
            });
            
        }, function(err) {
            console.log("ERROR: " + JSON.stringify(err));
            alert("It was an error uplading the file");
        }, function (progress) {
            // constant progress updates
        });
    };



  
})

.directive('pddmMapa', function ($ionicLoading) {
    return {
        restrict: 'E',
      	scope: {
          latitud : "=",
          longitud : "=",
          geolocalizado : "="
        },
      	bindToController: true,
        controllerAs: "$ctrl",
        template: "<div ng-model='ubicacion.latitud'></div>",
        controller: function ($scope, $element, DataShare) {
          function CreateMap(centro, successFunction) {
                var map = new google.maps.Map($element[0], {
                    center: centro,
                    //zoom: 17,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    panControl: false,
                    streetViewControl: false,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.TOP_CENTER
                    }
                });
                var styledMapType = new google.maps.StyledMapType([
                {
                    featureType: 'all',
                    elementType: 'all'
                }], {
                    map: map,
                    name: 'Night Map'
                });
                map.mapTypes.set('map-style', styledMapType);
                map.setMapTypeId('map-style');
                google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
                    e.preventDefault();
                    return false;
                });
                google.maps.event.addListener(map, 'click', function (e) {
                    CreateMarker(e.latLng);
                });
                
                var marker = new google.maps.Marker();
                function CreateMarker(latLng) {
                    	$scope.latitud = latLng.lat(); //latitud
                      $scope.longitud = latLng.lng(); //longitud
                    console.log($scope.latitud);
                    console.log($scope.longitud);
                    DataShare.coordenate = {latitude: latLng.lat(), longitude: latLng.lng()}
                    
                    marker.setMap(null);
                    marker = new google.maps.Marker({
                        position: latLng,
                        animation: google.maps.Animation.DROP,
                        map: map
                    });
                    //map.setZoom(17);
                    setTimeout(function () {
                        map.setZoom(17);
                        map.setCenter(latLng);
                    }, 500);
                }
                if (successFunction) {
                    successFunction(CreateMarker);
                }
            }
            if (!$scope.geolocalizado) {//No se ha obtenido la ubicación
                $ionicLoading.show({
                    template: 'Cargando...'
                });
                navigator.geolocation.getCurrentPosition(function (pos) {
                    var LatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                    CreateMap(LatLng, function (CreateMarker) {
                        CreateMarker(LatLng);
                        $ionicLoading.hide();
                        $scope.geolocalizado = true;
                    });
                }, function () {
                    //Ubicación por defecto
                    var LatLng = new google.maps.LatLng(6.233311, -75.575248);
                    CreateMap(LatLng, function () {
                        $ionicLoading.hide();
                        $scope.geolocalizado = true;
                    });
                },{maximumAge: 3000, timeout: 5000, enableHighAccuracy: true});
            } else {
                var LatLng = new google.maps.LatLng($scope.latitud,
                                                 $scope.longitud);
                CreateMap(LatLng, function (CreateMarker) {
                    CreateMarker(LatLng);
                });
            }
        }
    }
})



