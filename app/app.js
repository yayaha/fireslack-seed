'use strict';

/**
 * @ngdoc overview
 * @name angularfireSlackApp
 * @description
 * # angularfireSlackApp
 *
 * Main module of the application.
 */
angular
  .module('angularfireSlackApp', [
    'firebase',
    'angular-md5',
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'home/home.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              $state.go('channels');
            }, function(error){
            });
          }
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'auth/login.html',
        controller: 'AuthCtrl as authCtrl',
        resolve: {
          requireNoAuth: function ($state, Auth) {
            return Auth.$requireAuth().then(function (auth) {
              $state.go('home');
            }, function (error) {
              return;
            });
          }
        }
      })
      .state('register', {
        url: '/register',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/register.html',
        resolve: {
          requireNoAuth: function ($state, Auth) {
            return Auth.$requireAuth().then(function (auth) {
              $state.go('home');
            }, function (error) {
            });
          }
        }
      })
      .state('profile', {
        url: '/profile',
        resolve: {
          auth: function ($state, Users, Auth) {
            return Auth.$requireAuth().catch(function (auth) {
              $state.go('home');
            });
          },
          profile: function (Users, Auth) {
            return Auth.$requireAuth().then(function (auth) {
              return Users.getProfile(auth.uid).$loaded();
            });
          }
        },
        controller: 'ProfileCtrl as profileCtrl',
        templateUrl: 'users/profile.html'
      })
      .state('channels', {
        url: '/channels',
        resolve: {
          channels: function(Channels) {
            return Channels.$loaded();
          },
          profile: function ($state, Auth, Users) {
            return Auth.$requireAuth().then(function(auth) {
              return Users.getProfile(auth.uid).$loaded().then(function(profile){
                if (profile.displayName) {
                  return profile;
                } else {
                  $state.go('profile');
                }
              })
            }, function(error) {
              $state.go('home');
            });
          }
        },
        controller: 'ChannelsCtrl as channelsCtrl',
        templateUrl: 'channels/index.html'
      })
      .state('channels.create', {
        url: '/create',
        templateUrl: 'channels/create.html',
        controller: 'ChannelsCtrl as channelsCtrl'
      });

    $urlRouterProvider.otherwise('/');
  })
  .constant('FirebaseUrl', 'https://learn-fireslack.firebaseio.com/');
