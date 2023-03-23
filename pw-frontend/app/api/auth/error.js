import { NextAuthError } from "next-auth/errors";

export default async function error(req, res) {
  const { error } = req.query;

  switch (error) {
    case "OAuthAccountNotLinked":
      res.status(403).json({ error: "Your email is already associated with another account." });
      break;
    case "OAuthCallback":
      res.status(403).json({ error: "There was an issue during the OAuth callback." });
      break;
    case "EmailCreateAccount":
      res.status(403).json({ error: "There was an issue while creating your account with email." });
      break;
    default:
      res.status(500).json({ error: "An unknown error occurred." });
  }
}
