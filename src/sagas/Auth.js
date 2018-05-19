import {all, call, fork, put, takeEvery} from 'redux-saga/effects';
import {
    auth,
    facebookAuthProvider,
    githubAuthProvider,
    googleAuthProvider,
    twitterAuthProvider
} from 'firebase/firebase';
import {
    SIGNIN_FACEBOOK_USER,
    SIGNIN_GITHUB_USER,
    SIGNIN_GOOGLE_USER,
    SIGNIN_TWITTER_USER,
    SIGNIN_USER,
    SIGNOUT_USER,
    SIGNUP_USER
} from 'constants/ActionTypes';
import {showAuthMessage, userSignInSuccess, userSignOutSuccess, userSignUpSuccess} from 'actions/Auth';
import {
    userFacebookSignInSuccess,
    userGithubSignInSuccess,
    userGoogleSignInSuccess,
    userTwitterSignInSuccess
} from '../actions/Auth';

const createUserWithEmailPasswordRequest = async (email, password) =>
    await  auth.createUserWithEmailAndPassword(email, password)
        .then(authUser => authUser)
        .catch(error => error);

const signInUserWithEmailPasswordRequest = async (email, password) =>
    await  auth.signInWithEmailAndPassword(email, password)
        .then(authUser => authUser)
        .catch(error => error);

const signOutRequest = async () =>
    await  auth.signOut()
        .then(authUser => authUser)
        .catch(error => error);


function* createUserWithEmailPassword({payload}) {
    const {name, email, password} = payload;
    try {
        const signUpUser = yield call(createUserWithEmailPasswordRequest, email, password);
        if (signUpUser.message) {
            yield put(showAuthMessage(signUpUser.message));
        } else {
          auth.onAuthStateChanged(function(user) {
              if (user) {
                user.updateProfile({
                  displayName: name,
                  photoURL: "images/person_placeholder.png"
                }).then(function() {
                }, function(error) {
                  put(showAuthMessage(error));
                });

              }
            });
            localStorage.setItem('user_id', email);
            localStorage.setItem('user_name', name);
            localStorage.setItem('user_pic', 'images/person_placeholder.png');
            yield put(userSignUpSuccess(signUpUser));
        }
    } catch (error) {
        yield put(showAuthMessage(error));
    }
}

const signInUserWithGoogleRequest = async () =>
    await  auth.signInWithPopup(googleAuthProvider)
        .then(authUser => authUser)
        .catch(error => error);

const signInUserWithFacebookRequest = async () =>
    await  auth.signInWithPopup(facebookAuthProvider)
        .then(authUser => authUser)
        .catch(error => error);

const signInUserWithGithubRequest = async () =>
    await  auth.signInWithPopup(githubAuthProvider)
        .then(authUser => authUser)
        .catch(error => error);

const signInUserWithTwitterRequest = async () =>
    await  auth.signInWithPopup(twitterAuthProvider)
        .then(authUser => authUser)
        .catch(error => error);


function* signInUserWithGoogle() {
    try {
        const signUpUser = yield call(signInUserWithGoogleRequest);
        console.log('google');
        console.log(signUpUser.additionalUserInfo.profile);
        if (signUpUser.message) {
            yield put(showAuthMessage(signUpUser.message));
        } else {
            localStorage.setItem('user_id', signUpUser.additionalUserInfo.profile.email);
            localStorage.setItem('user_name', signUpUser.additionalUserInfo.profile.name);
            localStorage.setItem('user_pic', signUpUser.additionalUserInfo.profile.picture);
            yield put(userGoogleSignInSuccess(signUpUser));
        }
    } catch (error) {
        yield put(showAuthMessage(error));
    }
}


function* signInUserWithFacebook() {
    try {
        const signUpUser = yield call(signInUserWithFacebookRequest);
        if (signUpUser.message) {
            yield put(showAuthMessage(signUpUser.message));
        } else {
            localStorage.setItem('user_id', signUpUser.uid);
            yield put(userFacebookSignInSuccess(signUpUser));
        }
    } catch (error) {
        yield put(showAuthMessage(error));
    }
}


function* signInUserWithGithub() {
    try {
        const signUpUser = yield call(signInUserWithGithubRequest);
        console.log('GitHub');
        console.log(signUpUser);
        if (signUpUser.message) {
            yield put(showAuthMessage(signUpUser.message));
        } else {
            localStorage.setItem('user_id', signUpUser.additionalUserInfo.profile.email);
            localStorage.setItem('user_name', signUpUser.additionalUserInfo.profile.name);
            localStorage.setItem('user_pic', signUpUser.additionalUserInfo.profile.avatar_url);
            yield put(userGithubSignInSuccess(signUpUser));
        }
    } catch (error) {
        yield put(showAuthMessage(error));
    }
}


function* signInUserWithTwitter() {
    try {
        const signUpUser = yield call(signInUserWithTwitterRequest);
        console.log('twitter');
        console.log(signUpUser);
        if (signUpUser.message) {
            if (signUpUser.message.length > 100) {
                yield put(showAuthMessage('Your request has been canceled.'));
            } else {
                yield put(showAuthMessage(signUpUser.message));
            }
        } else {
            localStorage.setItem('user_id', signUpUser.additionalUserInfo.profile.email);
            localStorage.setItem('user_name', signUpUser.additionalUserInfo.profile.name);
            localStorage.setItem('user_pic', signUpUser.additionalUserInfo.profile.profile_image_url);
            yield put(userTwitterSignInSuccess(signUpUser));
        }
    } catch (error) {
        yield put(showAuthMessage(error));
    }
}

function* signInUserWithEmailPassword({payload}) {
    const {email, password} = payload;
    try {
        const signInUser = yield call(signInUserWithEmailPasswordRequest, email, password);
        console.log(signInUser);
        if (signInUser.message) {
            yield put(showAuthMessage(signInUser.message));
        } else {
            localStorage.setItem('user_id', signInUser.user.email);
            localStorage.setItem('user_name', signInUser.user.displayName);
            localStorage.setItem('user_pic', signInUser.user.photoURL);
            yield put(userSignInSuccess(signInUser));
        }
    } catch (error) {
        yield put(showAuthMessage(error));
    }
}

function* signOut() {
    try {
        const signOutUser = yield call(signOutRequest);
        if (signInUser.message) {
            yield put(showAuthMessage(signInUser.message));
        } else {
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_name');
            localStorage.removeItem('user_pic');
            yield put(userSignOutSuccess(signInUser));
        }
    } catch (error) {
        yield put(showAuthMessage(error));
    }
}

export function* createUserAccount() {
    yield takeEvery(SIGNUP_USER, createUserWithEmailPassword);
}

export function* signInWithGoogle() {
    yield takeEvery(SIGNIN_GOOGLE_USER, signInUserWithGoogle);
}

export function* signInWithFacebook() {
    yield takeEvery(SIGNIN_FACEBOOK_USER, signInUserWithFacebook);
}

export function* signInWithTwitter() {
    yield takeEvery(SIGNIN_TWITTER_USER, signInUserWithTwitter);
}

export function* signInWithGithub() {
    yield takeEvery(SIGNIN_GITHUB_USER, signInUserWithGithub);
}

export function* signInUser() {
    yield takeEvery(SIGNIN_USER, signInUserWithEmailPassword);
}

export function* signOutUser() {
    yield takeEvery(SIGNOUT_USER, signOut);
}

export default function* rootSaga() {
    yield all([fork(signInUser),
        fork(createUserAccount),
        fork(signInWithGoogle),
        fork(signInWithFacebook),
        fork(signInWithTwitter),
        fork(signInWithGithub),
        fork(signOutUser)]);
}
