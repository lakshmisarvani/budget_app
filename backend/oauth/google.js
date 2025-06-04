const { Google } = require('arctic');
const { env } = require('../../config/env.js');
export const google = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  `${env.CLIENT_URL}/google/callback`  // dynamic callback (we'll create this route to verify after login)
);
