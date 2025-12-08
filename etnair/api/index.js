const express = require('express');
const http = require ('http');
const app = express();
require('dotenv').config();

const server = http.createServer((req, res)=>{
  res.end('Hello, ETNAir!');
});

server.listen(2999);

// app.get('/', (req, res) => {
//   res. json({ message: 'Hello, ETNAir!' });
// });

// const PORT = process.env. PORT || 2999;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
