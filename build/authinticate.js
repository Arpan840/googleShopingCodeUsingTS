"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google_auth_library_1 = require("google-auth-library");
const environment_1 = require("./environment");
const authClient = new google_auth_library_1.OAuth2Client(environment_1.environment.Client_Id);
// Set the credentials
authClient.setCredentials({
    access_token: 'ACCESS_TOKEN',
    refresh_token: 'REFRESH_TOKEN',
});
// Rest of your code...
