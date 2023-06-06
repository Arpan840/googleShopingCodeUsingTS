"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const google_auth_library_1 = require("google-auth-library");
const environment_1 = require("./environment");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const authClient = new google_auth_library_1.OAuth2Client(environment_1.environment.Client_Id, environment_1.environment.Client_secret, environment_1.environment.Redirect_Uri);
const authUrl = authClient.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/content',
});
console.log(authUrl);
app.get('/oauth/callback', async (req, res) => {
    const code = req.query.code;
    console.log(code);
    try {
        const { tokens } = await authClient.getToken(code);
        authClient.setCredentials(tokens);
        console.log('Access token:', tokens.access_token);
        createProduct(tokens.access_token);
        updateProduct('YOUR_PRODUCT_ID', {
            title: 'New Title',
            description: 'New Description',
        });
        getAllProducts(tokens.access_token);
        deleteProduct('YOUR_PRODUCT_ID');
        res.send('Authentication successful!');
    }
    catch (error) {
        console.error('Error fetching tokens:', error);
        res.status(500).send('Authentication failed!');
    }
});
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
async function createProduct(accessToken) {
    try {
        const merchantId = environment_1.environment.MerchantId;
        console.log('merchant', merchantId);
        const productData = {
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
        const auth = new googleapis_1.google.auth.OAuth2();
        console.log('auth12', auth);
        auth.setCredentials({ access_token: accessToken });
        const content = googleapis_1.google.content({ version: 'v2', auth });
        console.log('content12', content);
        const response = await content.products.insert({
            merchantId,
            requestBody: productData,
        });
        console.log('Product created:', response.data);
    }
    catch (err) {
        console.log('Error creating product:', err);
    }
}
async function updateProduct(productId, productData) {
    try {
        const merchantId = environment_1.environment.MerchantId;
        const auth = new googleapis_1.google.auth.OAuth2();
        auth.setCredentials(authClient.credentials);
        const content = googleapis_1.google.content({ version: 'v2.1', auth });
        const response = await content.products.update({
            merchantId,
            productId,
            requestBody: productData,
        });
        console.log('Product updated:', response.data);
    }
    catch (error) {
        //console.error('Error updating product:', error);
    }
}
async function getAllProducts(accessToken) {
    try {
        const merchantId = environment_1.environment.MerchantId;
        const auth = new googleapis_1.google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });
        const content = googleapis_1.google.content({ version: 'v2', auth });
        const response = await content.products.list({
            merchantId,
        });
        const products = response.data.resources || [];
        console.log('All products:', products);
    }
    catch (error) {
        //console.error('Error fetching products:', error);
    }
}
async function deleteProduct(productId) {
    try {
        const merchantId = environment_1.environment.MerchantId;
        const auth = new googleapis_1.google.auth.OAuth2();
        auth.setCredentials(authClient.credentials);
        const content = googleapis_1.google.content({ version: 'v2.1', auth });
        const response = await content.products.delete({
            merchantId,
            productId,
        });
        console.log('Product deleted:', response.data);
    }
    catch (error) {
        //console.error('Error deleting product:', error);
    }
}
