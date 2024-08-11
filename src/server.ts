import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import routers from "./routers";

dotenv.config();

// Create an Express application
const app = express();
app.use(cors());

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.json());
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

app.use(routers);
export default app;
