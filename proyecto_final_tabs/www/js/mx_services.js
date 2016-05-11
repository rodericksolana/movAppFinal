angular.module('starter.services', [])

.factory('Constants', function() {
    return {
        IconILikeNoPressed: "ion-ios-heart-outline",
        IconILikePressed: "ion-ios-heart",
        
        IconComment: "ion-ios-chatbubble-outline"
    }
})



.factory('servicioApp', function($http) {
    var baseUrl = 'http://ubiquitous.csf.itesm.mx/~pddm-1129839/content/final/.Proyecto/Servicios/';
    // var baseUrl2 = 'http://ubiquitous.csf.itesm.mx/~pddm-1182791/content/final/pf/service/';
    
    return {
        login: function(login) {
            return $http.get(baseUrl+'login.php?Usuario='+login.username+'&Pw='+login.password);
        },

        registra: function(datosPersona){
            return $http.post(baseUrl+'registro.php',datosPersona,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        
        imgInsert: function(json) {
            return $http.post(baseUrl + 'img_insert.php', json, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            })
        }, 
        
        imgSearch: function(json) {
            return $http.post(baseUrl + 'img_search.php', json, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            })
        }, 
        
        getPersonById: function(json) {
            return $http.post(baseUrl + 'select_persona_id.php', json, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            })
        }, 

        getIdMedia: function(personaId){
                return $http.get(baseUrl+'select_id_media.php?id='+personaId); 
            },
        
        getMedia: function(Id){
                return $http.get(baseUrl+'select_media.php?id='+Id); 
            },
       
        getMediaMain: function(){
                return $http.get(baseUrl+'select_media_main.php'); 
            }
    };
    
})

.factory('DataShare', function() {
    var data = {};
    data.coordenate = {};
    data.user = {};
    data.searchAgain = true;
    data.selectedImg = null;
    
    return {
        coordenate: data.coordenate,
        user: data.user,
        searchAgain: data.searchAgain,
        selectedImg: data.selectedImg
    }
})

