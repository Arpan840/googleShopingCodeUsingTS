// eslint-disable-next-line no-console

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { environment } from './environment';


const authClient = new OAuth2Client(environment.Client_Id, environment.Client_secret, environment.Redirect_Uri);

const authUrl = authClient.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/content',
  });
console.log(authUrl)  

const tokensPromise = authClient.getToken("4/0AbUR2VMnZ9ffNaf3jVKp9aKyMcKAqiHmRo2cLbLhq7-msNKSF-JXZO6GK9mD-fkPjNVw8g")
  .then(tokens => {
    authClient.setCredentials(tokens.tokens);
    return tokens.tokens;
  })
  .catch(error => {
   
    console.error('Error fetching tokens:', error);
    throw error;
  });


tokensPromise
  .then(tokens => {
    
    console.log('Tokens:', tokens);
  })
  .catch(error => {
    
    console.error('Error handling tokens:', error);
  });

  
