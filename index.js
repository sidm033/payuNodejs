const express = require('express'); 
const app = express();             
const port = 5000; 
const cors = require('cors');

const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');

const dotenv = require('dotenv');
dotenv.config();

app.use(cors({ 
    origin: '*', 
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

app.get('/', async (req, res) => { 
    res.sendFile('index.html', {root: __dirname});      
});

app.get('/payu-payment', cors(), async (req, res) => { 

    const payDetails = {
        txnId:  uuidv4(),
        plan_name : "Test",
        first_name: 'Test',
        email: 'test@example.com',
        mobile: '9999999999',
        service_provide: 'test',
        amount: 19999,
        call_back_url : `${process.env.BASE_URL}/payment/success`,
        payu_merchant_key : process.env.PAYU_MERCHANT_KEY,
        payu_merchant_salt_version_1 : process.env.PAYU_MERCHANT_SALT_VERSION_1,
        payu_merchant_salt_version_2 : process.env.PAYU_MERCHANT_SALT_VERSION_2,
        payu_url : process.env.PAYU_URL,
        payu_fail_url : `${process.env.BASE_URL}/payment/failed`,
        payu_cancel_url : `${process.env.BASE_URL}/payment/cancel`,
        payu_url: process.env.PAYU_URL,
        hashString : '',
        payu_sha_token : ''
    }

    payDetails.hashString = `${process.env.PAYU_MERCHANT_KEY}|${payDetails.txnId}|${parseInt(payDetails.amount)}|${payDetails.plan_name}|${payDetails.first_name}|${payDetails.email}|||||||||||${process.env.PAYU_MERCHANT_SALT_VERSION_1}`,
    payDetails.payu_sha_token = crypto.createHash('sha512').update(payDetails.hashString).digest('hex');

    return res.json({ 
        success: true, 
        code: 200, 
        info: payDetails
    });

      
});

app.post('/payment/failed', cors(), async (req, res) => { 
    res.redirect('http://localhost:4200');
});

app.post('/payment/cancel', cors(), async (req, res) => { 
    res.redirect('http://localhost:4200');
});

app.post('/payment/success', cors(), async (req, res) => { 
    res.redirect('http://localhost:4200');
});

app.listen(port, () => {     
    console.log(`Now listening on port ${port}`); 
});