const express = require('express');
const bodyParser = require('body-parser');
const sendEmail = require('./sendEmail');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/api/send-email', sendEmail);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});