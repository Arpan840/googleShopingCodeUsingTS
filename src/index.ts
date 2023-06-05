// eslint-disable-next-line no-console

import { google, content_v2 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { environment } from './environment';

const authClient = new OAuth2Client(environment.Client_Id, environment.Client_secret, environment.Redirect_Uri);

const authUrl = authClient.generateAuthUrl({
  access_type: 'offline',
  scope: 'https://www.googleapis.com/auth/content',
});
console.log(authUrl)

const tokensPromise = authClient.getToken("4%2F0AbUR2VOEf62ACYgCZEMZTjm4fOA1G2MGiDRB-Ow8cVxLS8IRO6OyC5Ox6h5k9QRJs__png")
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
    createProduct();
  })
  .catch(error => {

    console.error('Error handling tokens:', error);
  });

async function createProduct() {
  try {
    const merchantId = environment.MerchantId;
    const productData: content_v2.Schema$Product = {
      title: 'Laptop',
      description: 'i9 processer, 2080 gtx',
      price: {
        value: '10.99',
        currency: 'USD',
      },
      availability: 'in stock',
      condition: 'new',
    };
    const content = google.content({ version: 'v2', auth: authClient })
    const response = await content.products.insert({
      merchantId,
      requestBody: productData,
    });
    console.log('Product created:', response.data);
  }
  catch (error) {
    console.error('Error creating product')
  }
}
async function getAllProducts() {
  try {
    const merchantId = environment.MerchantId;
    const content = google.content({ version: 'v2', auth: authClient });
    const response = await content.products.list({
      merchantId,
    });
    const products = response.data.resources || [];
    console.log(products)
  } catch (error) {
    console.error(error)
  }
}

