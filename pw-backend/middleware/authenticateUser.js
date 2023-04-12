const admin = require('./firebaseAdmin');

const authenticateUser = (requiredRole = null) => {
	console.log('authenticating....');
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send('Unauthorized');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;

      if (!requiredRole || decodedToken.role === requiredRole) {
      	console.log('Admin detected');
        next();
      } else {
        return res.status(403).send('Forbidden');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).send('Unauthorized');
    }
  };
};


module.exports = authenticateUser;
