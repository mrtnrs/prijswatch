// /api/authService.js
import { getAuth, onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import { auth } from './../../firebase/auth';


async function getIdToken() {
  console.log('getIdToken called');
  const user = auth.currentUser;
  console.log('user:', user);
  if (user) {
    const idToken = await user.getIdToken(/* forceRefresh */ true);
    const { claims } = await getIdTokenResult(auth.currentUser);
    console.log('claims:', claims);
    return idToken;
  } else {
    // User is not logged in or there's no user session
    return null;
  }
}


export { getIdToken };
