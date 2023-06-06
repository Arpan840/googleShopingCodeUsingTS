import { google, content_v2 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { environment } from './environment';
import express, { query } from 'express';

const app = express();
const authClient = new OAuth2Client(
  environment.Client_Id,
  environment.Client_secret,
  environment.Redirect_Uri
);

const authUrl = authClient.generateAuthUrl({
  access_type: 'offline',
  scope: 'https://www.googleapis.com/auth/content',
});
console.log(authUrl);


app.get('/oauth/callback', async (req, res) => {
  
  const code = req.query.code as string;
    console.log(code)
  try {
    const { tokens } = await authClient.getToken(code);
    authClient.setCredentials(tokens);

    console.log('Access token:', tokens.access_token);

    createProduct(tokens.access_token as string);
    updateProduct('YOUR_PRODUCT_ID', {
      title: 'New Title',
      description: 'New Description',
    });
    getAllProducts(tokens.access_token as string);
    deleteProduct('YOUR_PRODUCT_ID');

    res.send('Authentication successful!');
  } catch (error) {
    console.error('Error fetching tokens:', error);
    res.status(500).send('Authentication failed!');
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

async function createProduct(accessToken: string) {
  try {
    const merchantId = environment.MerchantId;
    console.log('merchant', merchantId);
    const productData: content_v2.Schema$Product = {
      title: 'Laptop',
      description: 'i9 processor, 2080 GTX',
      price: {
        value: '10.99',
        currency: 'USD',
      },
      availability: 'in stock',
      condition: 'new',
    };

    console.log("productDate", productData);
    const auth = new google.auth.OAuth2();
    console.log('auth12', auth);
    auth.setCredentials({ access_token: accessToken });
    const content = google.content({ version: 'v2', auth });
    console.log('content12', content);
    const response = await content.products.insert({
      merchantId,
      requestBody: productData,
    });
    console.log('Product created:', response.data);
  } catch (err) {
    
    console.log('Error creating product:', err);
  }
}

async function updateProduct(productId: string, productData: any) {
  try {
    const merchantId = environment.MerchantId;
    const auth = new google.auth.OAuth2();
    auth.setCredentials(authClient.credentials);
    const content = google.content({ version: 'v2.1', auth });
    const response = await content.products.update({
      merchantId,
      productId,
      requestBody: productData,
    });
    console.log('Product updated:', response.data);
  } catch (error) {
    //console.error('Error updating product:', error);
  }
}

async function getAllProducts(accessToken: string) {
  try {
    const merchantId = environment.MerchantId;
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    const content = google.content({ version: 'v2', auth });
    const response = await content.products.list({
      merchantId,
    });
    const products = response.data.resources || [];
    console.log('All products:', products);
  } catch (error) {
    //console.error('Error fetching products:', error);
  }
}

async function deleteProduct(productId: string) {
  try {
    const merchantId = environment.MerchantId;
    const auth = new google.auth.OAuth2();
    auth.setCredentials(authClient.credentials);
    const content = google.content({ version: 'v2.1', auth });
    const response = await content.products.delete({
      merchantId,
      productId,
    });
    console.log('Product deleted:', response.data);
  } catch (error) {
    //console.error('Error deleting product:', error);
  }
}
