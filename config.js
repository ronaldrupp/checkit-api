const port = 3000;
const baseURL = `http://localhost:${port}`;
module.exports = {
  // The secret for the encryption of the jsonwebtoken
  baseURL: baseURL,
  port: port,
  // The credentials and information for OAuth2
  oauth2Credentials: {
    client_id:
      "10275853460-f457s1rj15u25f4lj0irtnt701187acv.apps.googleusercontent.com",
    project_id: "daapp-286117", // The name of your project
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "ZGnyCI-34kcSYG4efhjtH_Zq",
    redirect_uris: [`http://localhost:8080`],
    scopes: [
      "https://www.googleapis.com/auth/classroom.courses.readonly",
      "https://www.googleapis.com/auth/classroom.profile.photos",
      "https://www.googleapis.com/auth/classroom.profile.emails",
      "https://www.googleapis.com/auth/classroom.rosters",
      "https://www.googleapis.com/auth/classroom.rosters.readonly",
      "openid",
    ],
  },
};
