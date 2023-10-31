import dotenv from "dotenv";
import app from "./application/app";
import './application/db/create-db'
import './application/db/db';

dotenv.config();

const port = process.env.SERVER_PORT || 3000;

const startServer = async () => {
  app.listen(port, () => {
    console.log(`Server started at Port ${port}`);
  });
};

startServer();
