// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

.state('login', {
    url: '/login',
      
        templateUrl: "templates/login.html", 
	controller: 'LoginCtrl'
      
    
  })

 .state('registro', {
    url: '/registro',
      
        templateUrl: "templates/registro.html", 
	controller: 'LoginCtrl'
      
    
  })


  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'TabCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeCtrl'
      }
    }
  })
  
  .state('tab.report', {
    url: '/report',
    views: {
      'tab-report': {
        templateUrl: 'templates/tab-report.html',
        controller: 'ReportCtrl'
      }
    }
  })
  
  .state('tab.report-detail', {
      url: '/reportdetail',
      views: {
        'tab-report': {
          templateUrl: 'templates/img-detail.html',
          controller: 'ImgDetailCtrl'
        }
      }
    })

  .state('tab.home-detail', {
      url: '/home/:imgId',
      views: {
        'tab-home': {
          templateUrl: 'templates/img-detail.html',
          controller: 'ImgDetailCtrl'
        }
      }
    })

  .state('tab.search', {
      url: '/search',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search.html',
          controller: 'SearchCtrl'
        }
      }
    })

  .state('tab.cam', {
    url: '/cam',
    views: {
      'tab-cam': {
        templateUrl: 'templates/tab-cam.html',
        controller: 'CameraCtrl'
      }
    }
  })
  
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

.state('tab.account-detail', {
      url: '/account/:accountId',
      views: {
        'tab-account': {
          templateUrl: 'templates/account-detail.html',
          controller: 'AccountDetailCtrl'
        }
      }
    })
  

  .state('tab.img-detail', {
      url: '/img/:imgId',
      views: {
        'tab-home': {
          templateUrl: 'templates/img-detail.html',
          controller: 'ImgDetailCtrl'
        }
      }
    })
    
    .state('tab.search-detail', {
      url: '/searchdetail',
      views: {
        'tab-search': {
          templateUrl: 'templates/img-detail.html',
          controller: 'ImgDetailCtrl'
        }
      }
    })

 ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

})
