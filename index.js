var Fetch = Fetch || {};
Fetch = (function(global) {
    'use strict';

    var rdf = require('rdflib');
    var auth = require('solid-auth-client');

    var FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/');

    // var webID = 'https://kezike.databox.me/profile/card#me';
    // var webID = 'https://kezike_test.solidtest.space/profile/card#me';
    // var webID = 'https://www.w3.org/People/Berners-Lee/card#i';
    var homeURI = 'http://localhost:8080/';
    var popupURI = homeURI + 'popup.html';

    var store = rdf.graph();
    var timeout = 5000; // 5000 ms timeout
    var fetcher = new rdf.Fetcher(store, timeout);

    // Initialize app
    function init() {
        document.getElementById('login').setAttribute('onclick', 'Fetch.login()');
    }

    // Load user profile
    function loadProfile(webId) {
        /*var fetchOptions = {'withCredentials': true};
        fetcher.load(webId, fetchOptions).then(function(fetchResponse) {
            console.log('fetchResponse:', fetchResponse);
            var me = rdf.sym(webId);
            var name = FOAF('name');
            var myNameObj = store.any(me, name);
            var myName = myNameObj.value;
            var img = FOAF('img');
            var myImgObj = store.any(me, img);
            var myImg = myImgObj.value;
            var knows = FOAF('name');
            var myFriends = store.each(me, knows);
            console.log('My name:', myName);
            console.log('My image:', myImg);
            console.log('My friends:');
            for (var i = 0; i < myFriends.length; i++) {
              var friend = myFriends[i];
              console.log(friend.value);
            }
            document.getElementById('name').textContent = myName;
            document.getElementById('image').setAttribute('src', myImg);
            document.getElementById('profile').classList.remove('hidden');
        });*/
        fetcher.nowOrWhenFetched(webId, function(ok, body, xhr) {
            if (!ok) {
              console.log("Oops, something happened and couldn't fetch data");
            } else {
              try {
                var me = rdf.sym(webId);
                var name = FOAF('name');
                var myNameObj = store.any(me, name);
                var myName = myNameObj.value;
                var img = FOAF('img');
                var myImgObj = store.any(me, img);
                var myImg = myImgObj.value;
                var knows = FOAF('knows');
                var myFriends = store.each(me, knows);
                console.log('My name:', myName);
                console.log('My image:', myImg);
                console.log('My friends:');
                for (var i = 0; i < myFriends.length; i++) {
                  var friend = myFriends[i];
                  console.log(friend.value);
                }
                document.getElementById('name').textContent = myName;
                document.getElementById('image').setAttribute('src', myImg);
                document.getElementById('profile').classList.remove('hidden');
              } catch (err) {
                console.log(err);
              }
            }
        });
    }

    // Login to app
    function login() {
        auth.currentSession().then(function(currentSession) {
            var webId;
            if (currentSession) {
              console.log('currentSession', currentSession);
              webId = currentSession.webId;
              loadProfile(webId);
            } else {
              auth.popupLogin({popupUri: popupURI}).then(function(popupSession) {
                  console.log('popupSession', popupSession);
                  webId = popupSession.webId;
                  loadProfile(webId);
              });
            }
        });
    }

    /*function login() {
        auth.currentSession().then(function(currentSession) {
            var webId;
            if (currentSession) {
              webId = currentSession.webId;
              console.log('currentSession.webId:', webId);
              loadProfile(webId);
            } else {
              auth.login().then(function(loginSession) {
                  // webId = webID;
                  webId = loginSession.webId;
                  console.log('loginSession:', loginSession);
                  loadProfile(webId);
              });
            }
            // loadProfile(webId);
        });
    }*/
    
    // return public functions
    return {
        init: init,
        login: login
    }; 
}(this));

console.log('Fetch:', Fetch);
Fetch.init();
Fetch.login();
// document.getElementById('login').setAttribute('onclick', 'Fetch.login()');
