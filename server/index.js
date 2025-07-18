require('dotenv').config({ path: __dirname + '/../.env' });
//console.log("🔍 ENV API KEY:", process.env.DEEPSEEK_API_KEY);

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const chatRouter = require('./routes/chat');
const compRouter = require('./routes/compatibility');

const app = express(); // ✅ Define `app` first!

app.use(cors());       // ✅ Now you can use `app.use(...)`
app.use(bodyParser.json());

app.use('/api/chat', chatRouter);
app.use('/api/compatibility', compRouter);

const PORT = process.env.PORT || 8888;
app.listen(PORT, '0.0.0.0', () => {
  console.log("Server running on port 8888");
});