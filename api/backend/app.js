const express = require('express');
require('dotenv').config();
const app = express();

app.use(express.json());

app.use('/users', require('./routes/users'));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
