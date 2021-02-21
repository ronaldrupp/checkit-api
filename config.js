const port = 3000;
const baseURL = `http://localhost:${port}`;
module.exports = {
  // The secret for the encryption of the jsonwebtoken
  baseURL: baseURL,
  port: port,
  // The credentials and information for OAuth2
  oauth2Credentials: {
    client_id:
      "418627707496-hl0gttfaackfeabfr7nv5vfu6pdqjmhv.apps.googleusercontent.com",
    project_id: "check-it-305511", // The name of your project
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "NDoy_KkYTQ01zJBlWz4qI1QA",
    redirect_uris: [process.env.FRONTEND_URL],
    scopes: [
      "https://www.googleapis.com/auth/classroom.courses.readonly",
      "https://www.googleapis.com/auth/classroom.profile.photos",
      "https://www.googleapis.com/auth/classroom.profile.emails",
      "https://www.googleapis.com/auth/classroom.rosters.readonly",
      "https://www.googleapis.com/auth/classroom.announcements",
      "openid",
    ],
  },
};
