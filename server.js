const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Use the MongoDB connection string from environment variables
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const TextSchema = new mongoose.Schema({
    text: String
});

const Text = mongoose.model('Text', TextSchema);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/add', async (req, res) => {
    const newText = new Text({ text: req.body.text });

    try {
        await newText.save();
        res.json({ message: 'Text added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save text' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});