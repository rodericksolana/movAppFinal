angular.module('starter.controllers', ['ngCordova'])

.controller('TabCtrl', function($scope, DataShare, $state) {
    $scope.model = {};
    $scope.model.perfil = DataShare.user.perfil;
})

.controller('HomeCtrl', function($scope, $http, $ionicPopup, DataShare, $state,
            servicioApp) {
                
    $scope.showAlert = function(msg) {
      $ionicPopup.alert({
          title: msg.title,
          template: msg.message,
          okText: 'Ok',
          okType: 'button-stable'
      });

    };
    

 $scope.showDataMain = function() {
      servicioApp.getMediaMain().success(function(datosMediaMain) {
            $scope.datosMediaMain = datosMediaMain;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
        
    };

    $scope.showDataMain();

 $scope.selectImg = function(datosMediaMains) {
        DataShare.selectedImg = datosMediaMains;
        $state.go('tab.home-detail');
		   
    };

})

.controller('ReportCtrl', function($scope, servicioApp, DataShare, $state) {
    $scope.model = {};
    $scope.model.reports = [];
    
    $scope.showReports = function() {
        servicioApp.reporteSelect({}).then(
        function(resp) {
            if (resp.data.respCode === 1) {
                $scope.model.reports = resp.data.result;
            } 
        }, function(error) {
            console.log(error);
            alert("Hubo un error con la comunicación al servidor. Intente de nuevo.");
        });
    }
    
    $scope.selectImg = function(image) {
        DataShare.selectedImg = {ubicacion: null,
                                 idPersona: image.idPersonas,
                                 id: image.mediaId,
                                 ruta: image.mediaRuta,
                                 reporteId: image.reporteId,
                                 descripcion: image.mediaDesc};
        $state.go('tab.report-detail');
    };
    
    $scope.showReports();
})

.controller('SearchCtrl', function($scope, servicioApp, DataShare, $state) {
    var startIndex = 0;
    var queryResults = [];
    $scope.model = {};
    $scope.model.results = [];
    $scope.model.query = '';
    
    // busqueda de manera remota en el servidor cada 100 filas
    $scope.search = function() {
        servicioApp.imgSearch({"startIndex": startIndex}).then(
        function(resp) {
            //startIndex += 100;
            queryResults = resp.data.result;
            
        }, function(error) {
            console.log(error);
            alert("Hubo un error con la comunicación al servidor. Intente de nuevo.");
        });
    };
    
    $scope.filter = function() {
        var query = $scope.model.query.toLowerCase();
        
        if (query.length >= 3) {
            if (DataShare.searchAgain) {
                DataShare.searchAgain = false;
                startIndex = 0;
                $scope.search();
            }
            
            $scope.model.results = [];
            for (var i = 0; i < queryResults.length; ++i) {
                var hashtags = queryResults[i].hashtag;
                if (hashtags != null && hashtags.includes(query)) {
                    $scope.model.results.push(queryResults[i])
                }
            }
            
            // no enconctró nada en este grupo, vuelve a llamar a search
            // para traer otro grupo de 100
            if ($scope.model.results.length === 0 && queryResults.length === 100) {
                startIndex += 100;
                $scope.search();
            }
        }
    };
    
    $scope.selectImg = function(image) {
        DataShare.selectedImg = image;
        $state.go('tab.search-detail');
    };
    
    $scope.search();
})


.controller('ImgDetailCtrl', function($scope, $stateParams, $ionicModal, $ionicPopup, 
            $state, $ionicHistory, DataShare, servicioApp, Constants) {
    $scope.showComment = function() {
        $scope.model.showComment = true;
        var comment = document.getElementById("imgDetailComment");
        comment.click();
    };
    
    $scope.model = {};
    $scope.model.perfil = DataShare.user.perfil;
    $scope.model.id= DataShare.user.id;
    $scope.model.image = DataShare.selectedImg;
    
    $scope.model.showComment = false;
    $scope.model.showLoc = false;
    $scope.model.voteIcon = '';
    $scope.model.totalVotes = '';
    
    if ($scope.model.image.ubicacion != null && $scope.model.image.ubicacion != ''
        && $scope.model.image.ubicacion != 'undefined,undefined') {
        $scope.model.showLoc = true;
        var loc = $scope.model.image.ubicacion.split(',');
        DataShare.coordenate = {latitude: loc[0], longitude: loc[1]};
        DataShare.setLoc = true;
    } else {
        DataShare.setLoc = false;
    }
    
    servicioApp.getPersonById({id: $scope.model.image.idPersona}).then(
    function(resp) {
        if (resp.data.respCode == 1) {
            $scope.model.user = {};
            $scope.model.user.img = resp.data.result[0].imagen;
            $scope.model.user.name = resp.data.result[0].Usuario;
            
        } else {
            alert("Hubo un error al recuperar los datos, intente nuevamente.");
        }
    }, function(error) {
        alert("Hubo un error al contactar al servidor, intente de nuevo.");
    });
    
    $scope.Geolocalizar = function () { $ionicModal.fromTemplateUrl('templates/mapa_modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
    });
    };
    
    $scope.report = function() {
       var confirmPopup = $ionicPopup.confirm({
         title: 'Reportar',
         template: '¿Estás seguro que quieres reportar esta publicación?'
       });

       confirmPopup.then(function(res) {
         if(res) {
            servicioApp.reporteInsert({idMedia: $scope.model.image.id, 
                                       idReportador: DataShare.user.id}).then(
            function(resp) {
                if (resp.data.respCode === 1) {
                    $ionicPopup.alert({
                        title: 'Info',
                        template: 'Reporte realizado con éxito.'
                    });

                } else {
                    alert("Hubo un error al realizar el reporte, intente nuevamente.");
                }
            }, function(error) {
                alert("Hubo un error al contactar al servidor, intente nuevamente.");
            });
         } else {
            console.log('reportar cancelado');
         }
       });
     };
     
    $scope.vote = function() {
        if ($scope.model.voteIcon === Constants.IconNotVoted) {
            servicioApp.votoInsert({idPublicacion: $scope.model.image.id, 
                                    idPersonas: DataShare.user.id}).then(
            function(resp) {
                if (resp.data.respCode === 1) {
                    $scope.model.voteIcon = Constants.IconVoted;
                    $scope.model.totalVotes = parseInt($scope.model.totalVotes) + 1;
                    $scope.model.totalVotes += '';
                } else {
                    alert("Hubo un error al realizar la operación, intente nuevamente.");
                }
            }, function(error) {
                alert("Hubo un error al contactar al servidor, intente nuevamente.");
            });
        } else {
            servicioApp.votoDelete({idPublicacion: $scope.model.image.id, 
                                    idPersonas: DataShare.user.id}).then(
            function(resp) {
                if (resp.data.respCode === 1) {
                    $scope.model.voteIcon = Constants.IconNotVoted;
                    $scope.model.totalVotes = parseInt($scope.model.totalVotes) -1;
                    $scope.model.totalVotes += '';
                } else {
                    alert("Hubo un error al realizar la operación, intente nuevamente.");
                }
            }, function(error) {
                alert("Hubo un error al contactar al servidor, intente nuevamente.");
            });
        }
    };
    
    $scope.quitarReporte = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Quitar Reporte',
            template: '¿Estás seguro que quieres quitar el reporte de esta imagen?'
        });
        
        confirmPopup.then(function(resp) {
            if (resp) {
                servicioApp.reporteQuitar({idMedia: $scope.model.image.id}).then(
                function(resp) {
                    if (resp.data.respCode === 1) {
                        var alerta = $ionicPopup.alert({
                            title: 'Info',
                            template: 'Reporte eliminado con éxito.'
                        });
                        alerta.then(function(resp) {
                            console.log("Alerta respuesta: " + resp);
                            $ionicHistory.goBack();
                        });
                    } else {
                        $ionicPopup.alert({
                            title: 'Info',
                            template: 'Hubo un error al eliminar el reporte, intente nuevamente.'
                        });
                    }
                }, function(error) {
                    alert("Hubo un error al contactar al servidor, intente nuevamente.");
                });
            }
        })
    };
    
    $scope.eliminarImagenReportada = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Eliminar Imagen',
            template: '¿Estás seguro que quieres eliminar esta imagen?'
        });
        
        confirmPopup.then(function(resp) {
            if (resp) {
                servicioApp.reporteDelete({idMedia: $scope.model.image.id}).then(
                function(resp) {
                    if (resp.data.respCode === 1) {
                        var alerta = $ionicPopup.alert({
                            title: 'Info',
                            template: 'Imagen eliminada con éxito.'
                        });
                        alerta.then(function(resp) {
                            console.log("Alerta respuesta: " + resp);
                            $ionicHistory.goBack();
                        });
                    } else {
                        $ionicPopup.alert({
                            title: 'Info',
                            template: 'Hubo un error al eliminar la imagen, intente nuevamente.'
                        });
                    }
                }, function(error) {
                    alert("Hubo un error al contactar al servidor, intente nuevamente.");
                });
                
            }
        });
    };
    
    
    servicioApp.votoSelect({idPublicacion: $scope.model.image.id, 
                            idPersonas: DataShare.user.id}).then(
    function(resp) {
        if (resp.data.respCode === 1) {
            if (resp.data.result.user > 0) {
                $scope.model.voteIcon = Constants.IconVoted;
            } else {
                $scope.model.voteIcon = Constants.IconNotVoted;
            }
            
            $scope.model.totalVotes = resp.data.result.total;
        } else {
            $scope.model.voteIcon = Constants.IconNotVoted;
        }
    }, function(error) {
        $scope.model.voteIcon = Constants.IconNotVoted;
    });
	
$scope.eliminaPub = function()
{

	var confirmPopup = $ionicPopup.confirm
	({
		 title: 'Log Out',
		 template: '¿Desea eliminar la publicación?'
	 });

		confirmPopup.then(function(res) {
			 if(res) {
			servicioApp.eliminaP($scope.model.image.id ).success(function(data) {
			if(data == 1)
		{
			$ionicHistory.goBack();

		}
		else
		{
			alert("Hubo un error");
		}
			});

		 } else {
		    console.log('Cancel eliminaPub');
			}
		 
		});
       
};


	$scope.comenta = function()
	  {

		 servicioApp.insertCom({
                    idPersonas: DataShare.user.id,
                    idPublicacion: $scope.model.image.id,
                    texto: $scope.model.comment
               		  }).success(function(data){
					var string;
					string= data.trim();
						 if(string == 1)
						{
							$scope.Comentarios();
				 
						}
				});	



	  }; 


	$scope.Comentarios = function() {
     	 servicioApp.getComents($scope.model.image.id ).success(function(datosComs) {
          	  $scope.datosComs = datosComs;
 		}).finally(function() {
        	    $scope.$broadcast('scroll.refreshComplete');
      		  });
        
  	  };
       
   		 $scope.Comentarios();

 
})



.controller('LoginCtrl', function ($scope, $state, servicioApp, $ionicPopup, 
            DataShare, $cordovaCamera, $cordovaFileTransfer, $ionicHistory) {

	var imageURL;

 	$ionicHistory.clearCache();
    $ionicHistory.clearHistory();

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
            if (DataShare.user.perfil === 'user') {
                $state.go('tab.home');
            } else {
                $state.go('tab.report');
            }
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

            if (result.response.trim() !== "File successfully uploaded!") {
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
            allowEdit : false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 640,
            targetHeight: 640,
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
            servicioApp, $state  ,$ionicPopup, DataShare, $window, $ionicHistory) {


 $scope.showDataIdMedia = function() {
	$scope.datosPersona  =  [{"Usuario":DataShare.user.username,"Interes":DataShare.user.intereses,"imagen":DataShare.user.imagen,"perfil":DataShare.user.perfil}];

      servicioApp.getIdMedia(DataShare.user.id).success(function(datosMedia) {
            $scope.datosMedia = datosMedia;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
        
    };


    $scope.showDataIdMedia();

	

/* Esto es lo q regresa el login y lo q pasa a ser DataShare.user.ELEMENTO
{"respCode":1,"result":[{"id":"14","username":"Rod","perfil":"user","intereses":"Beber y beber","imagen":"http:\/\/ubiquitous.csf.itesm.mx\/~pddm-1129839\/content\/final\/.Proyecto\/Servicios\/upload\/Rod-123.jpg"}]}
*/



 $scope.selectImg = function(datosMedia) {
        DataShare.selectedImg = datosMedia;
        $state.go('tab.account-detail');
		   
    };

$scope.logOut=function ()
{
var confirmPopup = $ionicPopup.confirm({
         title: 'Log Out',
         template: '¿Estás seguro que quieres salir de tu cuenta?'
       });

	confirmPopup.then(function(res) {
         if(res) {
	document.getElementById("logOut").style.visibility="hidden"; 
  	 $ionicHistory.clearCache();
  	 $ionicHistory.clearHistory();
		$state.go('login');
            //$state.go('login', {}, {reload: true});
	//$window.location.reload(true);
	//location.reload();
         } else {
            console.log('No cerró sesión');
         }
       });

};

})//Cierre controlador Cuenta



.controller('AccountDetailCtrl', function($scope,$stateParams,$ionicPopup,$ionicModal,$state,servicioApp, DataShare, $cordovaFileTransfer ){

    DataShare.searchAgain = true;


		$state.go($state.current, $stateParams, {reload: true, inherit: false});
		  
		$scope.showDataMedia = function() {
			  servicioApp.getMedia($stateParams.accountId).success(function(datosMedia) {
				    $scope.datosMedia = datosMedia;
					});	
			};
			   
		$scope.showDataMedia();
		
		$scope.elimina = function($event){
			alert(event.target.id);
			document.getElementById("elimina").style.visibility="hidden"; 
		};


   	
	
})






.controller('AppCtrl', function ($scope, $state)  {

	/*$scope.validar= function() {
	//aqui se hacen las validaciones
	$state.go('sidemenu.home');
	}*/

})

.controller('CameraCtrl', function($scope, $stateParams, $http, $ionicModal, $ionicPopup,
            $cordovaImagePicker, $cordovaCamera, $cordovaFileTransfer, DataShare,
            $state, servicioApp) {
    $scope.showAlert = function(msg) {
      $ionicPopup.alert({
          title: msg.title,
          template: msg.message,
          okText: 'Ok',
          okType: 'button-stable'
      });
    };
    
    DataShare.searchAgain = true;
                
    $scope.model = {};
    $scope.model.image = '';
    $scope.model.hide = true;
    $scope.model.geolocalizado = false;
    
    $scope.getHashtags = function() {
        var description = $scope.model.description.toLowerCase();
        var hashes = [];
        do{
            var index = description.indexOf("#");
            var space = description.indexOf(' ', index);
            space = space === -1 ? description.length :
                                   space;
            hashes.push(description.substring(index, space));
            
            description = description.substring(space + 1)
        } while (index !== -1);
        hashes.pop();   //elimino el último
        
        var tags = '';
        for (var i = 0; i < hashes.length; ++i) {
            tags += hashes[i] + ',';
        }
        return tags;
    };
    
    $scope.loadImages = function() {
        DataShare.setLoc = false;
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
                $scope.model.image = results[0];
                $scope.model.hide = false; // mostramos la imagen
            }
            
        }, function(error) {
            console.log('Error: ' + JSON.stringify(error));    // In case of error
        });
        })
    };
    
    $scope.takePicture = function() {
        DataShare.setLoc = false;
        document.addEventListener("deviceready", function () {
        var options = {
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 640,
          targetHeight: 640,
        };

        $cordovaCamera.getPicture(options).then(function(imageURI) {
            $scope.model.image = imageURI;
            $scope.model.hide = false; // mostramos la imagen
        }, function(err) {
          console.log(err);
        });

      }, false);
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
            if (result.response.trim() !== "File successfully uploaded!") {
                alert("Hubo un error al subir la imagen.");
                return false;
            } 
            
            var ubicacion = DataShare.coordenate.latitude === undefined ? ''
                          : DataShare.coordenate.latitude + "," + 
                            DataShare.coordenate.longitude;
                            
            var hashtags = $scope.getHashtags();
            
            var img_path = "http://ubiquitous.csf.itesm.mx/~pddm-1129839/content/final/.Proyecto/Servicios/upload/" + filename;
            servicioApp.imgInsert({"idPersona": DataShare.user.id,
                                "ubicacion": ubicacion,
                                "descripcion": $scope.model.description,
                                "tipo": 'foto', 
                                "ruta": img_path,
                                "hashtag": hashtags}).then(
            function(resp) {
                //$scope.showAlert({title: "Info", message: "Datos guardados exitosamente."});	
                alert("Datos guardados exitosamente.");
                $scope.clearView();
                $state.go('tab.account');
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
    
    // limpia la pantalla y restablece los valores predeterminados
    $scope.clearView = function() {
        $scope.model.image = '';
        $scope.model.hide = true;
        $scope.model.geolocalizado = false;
        $scope.model.description = '';
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

.directive('pddmLoc', function ($ionicLoading) {
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
          function CreateMap(successFunction) {
                var map = new google.maps.Map($element[0], {
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
                // google.maps.event.addListener(map, 'click', function (e) {
                    // CreateMarker(e.latLng);
                // });
                
                var marker = new google.maps.Marker();
                function CreateMarker(latLng) {
                    $scope.latitud = DataShare.coordenate.latitude; //latitud
                    $scope.longitud = DataShare.coordenate.longitude; //longitud
                    
                    latLng = new google.maps.LatLng($scope.latitud, $scope.longitud);
                    
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
            CreateMap(function (CreateMarker) {
                CreateMarker(null);
                $ionicLoading.hide();
                $scope.geolocalizado = true;
            });
        }
    }
})



