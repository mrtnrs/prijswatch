// /api/authService.js
import { getAuth, onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import { auth } from './../../firebase/auth';


async function getIdToken() {
  const user = auth.currentUser;
  if (user) {
    const idToken = await user.getIdToken(/* forceRefresh */ true);
    console.log('claims ', idToken.claims);
    const { claims } = await getIdTokenResult(auth.currentUser);
    console.log('clams ', claims);
    return idToken;
  } else {
    // User is not logged in or there's no user session
    return null;
  }
}


export { getIdToken };
