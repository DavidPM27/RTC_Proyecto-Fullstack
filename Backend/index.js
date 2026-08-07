require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./src/config/db");
const { connectCloudinary } = require("./src/config/cloudinary");
const userRouter = require('./src/api/routes/user.routes');
const plantRouter = require('./src/api/routes/plant.routes');

const PORT = 3000;
const app = express();

connectDB();
connectCloudinary();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());

app.get('/health', (req, res) => res.sendStatus(200)); // ping target to prevent Render free-tier spin-down

app.use('/users', userRouter);
app.use('/plants', plantRouter);

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});