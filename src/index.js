// Solid Single-Page Test Application

// Libraries and dependencies
const $auth = require('solid-auth-client');
const $rdf = require('rdflib');

// Global variables
const popupUri = 'public/popup.html';

const SolidPG = SolidPG || {};

//// BEGIN REST CONFIGURATION ////
const getOptions = {
  method: 'GET',
  mode: 'cors',
  withCredentials: true,
  credentials: 'include',
  clearPreviousData: true
};

const postOptions = {
  method: 'POST',
  headers: {
    'content-type': 'text/n3' // REPLACE ME BEFORE USAGE
  },
  mode: 'cors',
  credentials: 'include',
  body: "" // REPLACE ME BEFORE USAGE
};
//// END REST CONFIGURATION ////

//// BEGIN APP ////
// Initialize app
const init = () => {
  bindEvents();
  login();
};

// Bind val to key in obj
const bindKeyValue = (obj, key, val) => {
  obj[key] = val;
};

// Bind events
const bindEvents = () => {
  $(document).on('click', '#fetch-doc', loadDocument);
};

// Load content at target
const loadDocument = async (event) => {
  event.preventDefault();
  const target = $('#fetch-doc-uri').val();
  console.log(`Target: ${target}`);
  const loadResult = (await SolidPG.fetcher.load(target))['responseText'];
  console.log(`Result: ${loadResult}`);
  const fetchedDoc = $('#fetched-doc');
  fetchedDoc.text(loadResult);
  fetchedDoc.removeClass('hidden');
  return loadResult;
};

// Load user profile
const loadProfile = (webId) => {
  SolidPG.fetcher.nowOrWhenFetched(webId, function(ok, body, xhr) {
    if (!ok) {
      console.log("Oops, something happened and couldn't fetch data");
    } else {
      try {
        const me = $rdf.sym(webId);
        const name = FOAF('name');
        const myNameObj = SolidPG.fetcher.store.any(me, name);
        const myName = myNameObj.value;
        /*const img = FOAF('img');
        const myImgObj = SolidPG.fetcher.store.any(me, img);
        const myImg = myImgObj.value;*/
        const knows = FOAF('knows');
        const myFriends = SolidPG.fetcher.store.each(me, knows);
        console.log('My name:', myName);
        // console.log('My image:', myImg);
        console.log('My friends:');
        for (let i = 0; i < myFriends.length; i++) {
          const friend = myFriends[i];
          console.log(friend.value);
        }
        document.getElementById('name').textContent = myName;
        // document.getElementById('image').setAttribute('src', myImg);
        document.getElementById('profile').classList.remove('hidden');
      } catch (err) {
        console.error(err.name + ": " + err.message);
      }
    }
  });
};

// Login helper function
const loginHelper = (session) => {
  const fetcher = $rdf.fetcher($rdf.graph());
  const updater = new $rdf.UpdateManager(fetcher.store);
  bindKeyValue(SolidPG, 'session', session);
  bindKeyValue(SolidPG, 'fetcher', fetcher);
  bindKeyValue(SolidPG, 'updater', updater);
};

// Login to app
const login = () => {
  $auth.currentSession().then(async (currentSession) => {
    if (!currentSession) {
      $auth.popupLogin({ popupUri }).then(async (popupSession) => {
        loginHelper(popupSession);
      }).catch((err) => {
        console.error(err.name + ": " + err.message);
      });
      return;
    }
    loginHelper(currentSession);
  }).catch((err) => {
    console.error(err.name + ": " + err.message);
  });
};

const logout = () => {
  // localStorage.removeItem("solid-auth-client");
  // localStorage.clear();
  return $auth.logout();
};
//// END APP ////

$(window).on('load', init);

module.exports = {
  login,
  logout,
  loadDocument
};
