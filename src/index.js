// Solid Single-Page Test Application

// Libraries and dependencies
const $auth = require('solid-auth-client');
const $rdf = require('rdflib');

// Global variables
const popupUri = 'popup.html';
const SolidPG = SolidPG || {};
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');

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
  $(document).on('click', '#login', login);
  $(document).on('click', '#logout', logout);
};

// Load content at target
const loadDocument = async (event) => {
  event.preventDefault();
  const target = $('#fetch-doc-uri').val();
  const loadResult = (await SolidPG.fetcher.load(target))['responseText'];
  const fetchedDoc = $('#fetched-doc');
  fetchedDoc.text(loadResult);
  fetchedDoc.removeClass('hidden');
  return loadResult;
};

// Load user profile
const loadProfile = (webId) => {
  SolidPG.fetcher.nowOrWhenFetched(webId, function(ok, body, xhr) {
    if (!ok) {
      console.error('Error loading profile');
    } else {
      try {
        const me = $rdf.sym(webId);
        const name = FOAF('name');
        const myNameObj = SolidPG.fetcher.store.any(me, name);
        if (myNameObj) {
          const myName = myNameObj.value;
          const nameElement = $('#name');
          nameElement.text(myName);
        }
        const img = FOAF('img');
        const myImgObj = SolidPG.fetcher.store.any(me, img);
        if (myImgObj) {
          const myImg = myImgObj.value;
          const imgElement = $('#image');
          imgElement.attr('src', myImg);
        } else {
          const imgElement = $('#image');
          imgElement.attr('src', 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-person-512.png');
        }
        const profElement = $('#profile');
        profElement.removeClass('hidden');
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    }
  });
};

// Login helper function
const loginHelper = (session) => {
  const loginButton = $('#login');
  loginButton.attr('disabled', true);
  loginButton.addClass('hidden');
  const logoutButton = $('#logout');
  loginButton.attr('disabled', false);
  logoutButton.removeClass('hidden');
  const fetcher = $rdf.fetcher($rdf.graph());
  const updater = new $rdf.UpdateManager(fetcher.store);
  bindKeyValue(SolidPG, 'session', session);
  bindKeyValue(SolidPG, 'fetcher', fetcher);
  bindKeyValue(SolidPG, 'updater', updater);
  loadProfile(session.webId);
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

const logout = async () => {
  const logoutButton = $('#logout');
  logoutButton.attr('disabled', true);
  await $auth.logout();
  const loginButton = $('#login');
  loginButton.removeClass('hidden');
  logoutButton.attr('disabled', false);
  logoutButton.addClass('hidden');
};
//// END APP ////

$(window).on('load', init);
