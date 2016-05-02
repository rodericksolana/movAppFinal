angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('Constants', function() {
    return {
        IconILikeNoPressed: "ion-ios-heart-outline",
        IconILikePressed: "ion-ios-heart",
        
        IconComment: "ion-ios-chatbubble-outline"
    }
})



.factory('servicioApp', function($http) {
    var baseUrl = 'http://ubiquitous.csf.itesm.mx/~pddm-1129839/content/final/.Proyecto/Servicios/';
    var baseUrl2 = 'http://ubiquitous.csf.itesm.mx/~pddm-1182791/content/final/pf/service/';
    
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
            return $http.post(baseUrl2 + 'img_insert.php', json, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            })
        }, 

	getId: function(personaId){
            return $http.get(baseUrl+'select_id.php?id='+personaId); 
        }
    };
    
})

.factory('DataShare', function() {
    var data = {};
    data.coordenate = {};
    data.user = {};
    
    return {
        coordenate: data.coordenate,
        user: data.user
    }
})

