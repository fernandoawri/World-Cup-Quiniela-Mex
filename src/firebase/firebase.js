import firebase from 'firebase';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyASlTBjicveK8l5zZsDRcrGqAnPSUwzlwQ",
  authDomain: "world-cup-quiniela-mex.firebaseapp.com",
  databaseURL: "https://world-cup-quiniela-mex.firebaseio.com",
  projectId: "world-cup-quiniela-mex",
  storageBucket: "world-cup-quiniela-mex.appspot.com",
  messagingSenderId: "323839372385"
};

firebase.initializeApp(config);
const auth = firebase.auth();

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
const githubAuthProvider = new firebase.auth.GithubAuthProvider();
const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();

const database = firebase.database();
export {
    auth,
    database,
    googleAuthProvider,
    githubAuthProvider,
    facebookAuthProvider,
    twitterAuthProvider
};
