// Solid Single-Page Test Application

// Libraries and dependencies
var $auth = require('solid-auth-client');
var $rdf = require('rdflib');

// Global variables
var popupUri = 'popup.html';

var SolidPG = SolidPG || {};

SolidPG = {
    //// BEGIN REST CONFIGURATION ////
    getOptions: {
      method: 'GET',
      mode: 'cors',
      withCredentials: true,
      credentials: 'include',
      clearPreviousData: true
    },

    postOptions: {
      method: 'POST',
      headers: {
        'content-type': 'text/n3' // REPLACE ME BEFORE USAGE
      },
      mode: 'cors',
      credentials: 'include',
      body: "" // REPLACE ME BEFORE USAGE
    },
    //// END REST CONFIGURATION ////

    //// BEGIN APP ////
    // Initialize app
    init: function(event) {
        SolidPG.bindEvents();
        SolidPG.login();
    },

    // Bind val to key in obj
    bindKeyValue: function(obj, key, val) {
        obj[key] = val;
    },

    // Bind events
    bindEvents: function() {
        $(document).on('click', '#fetch-doc', SolidPG.load);
    },

    // Load content at target
    load: async function(event) {
        event.preventDefault();
        var target = $('#fetch-doc-uri').val();
        console.log(`Target: ${target}`);
        var loadPromise = new Promise((resolve, reject) => {
            SolidPG.fetcher.load(target, SolidPG.getOptions).then((resp) => {
                resolve(resp['responseText']);
            }).catch((err) => {
               reject(err);
            });
        });
        var loadResult = await loadPromise;
        console.log(`Result: ${loadResult}`);
        var fetchedDoc = $('#fetched-doc');
        fetchedDoc.text(loadResult);
        fetchedDoc.removeClass('hidden');
        return loadResult;
    },

    // Load user profile
    loadProfile: function (webId) {
        SolidPG.fetcher.nowOrWhenFetched(webId, function(ok, body, xhr) {
            if (!ok) {
              console.log("Oops, something happened and couldn't fetch data");
            } else {
              try {
                var me = $rdf.sym(webId);
                var name = FOAF('name');
                var myNameObj = SolidPG.fetcher.store.any(me, name);
                var myName = myNameObj.value;
                /*var img = FOAF('img');
                var myImgObj = SolidPG.fetcher.store.any(me, img);
                var myImg = myImgObj.value;*/
                var knows = FOAF('knows');
                var myFriends = SolidPG.fetcher.store.each(me, knows);
                console.log('My name:', myName);
                // console.log('My image:', myImg);
                console.log('My friends:');
                for (var i = 0; i < myFriends.length; i++) {
                  var friend = myFriends[i];
                  console.log(friend.value);
                }
                document.getElementById('name').textContent = myName;
                // document.getElementById('image').setAttribute('src', myImg);
                document.getElementById('profile').classList.remove('hidden');
              } catch (err) {
                console.log(err);
              }
            }
        });
    },
    
    // Track status of user session
    trackSession: async function() {
        var sessionPromise = new Promise((resolve, reject) => {
            $auth.trackSession((session) => {
                if (!session) {
                  resolve(null);
                } else {
                  resolve(session);
                }
            });
        });
        var sessionResult = await sessionPromise;
        return sessionResult;
    },

    // Login helper function
    loginHelper: function(session) {
        SolidPG.session = session;
        console.log("SolidPG.session:", SolidPG.session);
        SolidPG.fetcher = $rdf.fetcher($rdf.graph());
        console.log("SolidPG.fetcher:", SolidPG.fetcher);
        // SolidPG.updater = new $rdf.UpdateManager(SolidPG.fetcher.store);
        SolidPG.bindKeyValue(SolidPG, 'session', SolidPG.session);
        SolidPG.bindKeyValue(SolidPG, 'fetcher', SolidPG.fetcher);
    },

    // Login to app
    login: function() {
        $auth.currentSession().then(async (currentSession) => {
            if (!currentSession) {
              $auth.popupLogin({popupUri: popupUri}).then(async (popupSession) => {
                  SolidPG.loginHelper(popupSession);
              }).catch((err) => {
                 console.error(err.name + ": " + err.message);
              });
              return;
            }
            SolidPG.loginHelper(currentSession);
        }).catch((err) => {
           console.error(err.name + ": " + err.message);
        });
    },

    logout: function() {
        // localStorage.removeItem("solid-auth-client");
        // localStorage.clear();
        return $auth.logout();
    }
    //// END APP ////
};

$(window).on('load', SolidPG.init);
module.exports = SolidPG;
