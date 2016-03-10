/**
 * Created by weiluo on 3/6/16.
 */
'use strict';

angular
  .module('angularfireSlackApp')
  .factory('Auth', Auth);

Auth.$inject = ['$firebaseAuth', 'FirebaseUrl'];

function Auth($firebaseAuth, FirebaseUrl) {
  var ref = new Firebase(FirebaseUrl);
  var auth = $firebaseAuth(ref);

  return auth;
}
