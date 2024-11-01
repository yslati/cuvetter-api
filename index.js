require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions ={
    origin:'*', 
    credentials:true,
    optionSuccessStatus:200,
}

app.use(cors(corsOptions))

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('Test!');
});

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/jobs', jobRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});