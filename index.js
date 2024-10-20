require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('Test!');
});

app.use('/auth', authRoutes);
app.use('/jobs', jobRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
