require('./lib/utils/global.util');
require('dotenv').config({
  path: './.env',
});

const app = require('./app');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(
    D(`Client Server on PORT : '${PORT}' `),
    C(`Mode - ${NODE_ENV}  `)
  );
});
