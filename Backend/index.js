require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db");
const { connectCloudinary } = require("./src/config/cloudinary");
const userRouter = require('./src/api/routes/user.routes');
const plantRouter = require('./src/api/routes/plant.routes');

const PORT = 3000;
const app = express();

connectDB();
connectCloudinary();

app.use(express.json());

app.use('/users', userRouter);
app.use('/plants', plantRouter);

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});