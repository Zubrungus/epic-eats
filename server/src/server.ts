const forceDatabaseRefresh = false;
import path from 'path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import sequelize from './config/connection.js';
import routes from './routes/index.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serves static files in the entire client's dist folder
app.use(express.static('../client/dist'));
app.use(express.urlencoded({ extended: true })); 

app.use(express.json());
app.use(routes);
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});
sequelize.sync({ force: forceDatabaseRefresh }).then(() => {

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
