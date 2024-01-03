const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const ejs = require('ejs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.post('/upload', async (req, res) => {
    try {
        const { image } = req.body;

        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = `uploaded_image_${Date.now()}.png`;
        const filePath = path.join(__dirname, 'uploads', fileName);

        await fs.writeFile(filePath, buffer);

        console.log('Image uploaded successfully:', fileName);

        res.status(200).json({ success: true, fileName });
    } catch (error) {
        console.error('Error during image upload:', error);
        res.status(500).render('error', { errorMessage: 'Internal Server Error' });
    }
});

app.get('/uploads/:fileName', async (req, res) => {
    try {
        const fileName = req.params.fileName;
        const filePath = path.join(__dirname, 'uploads', fileName);

        const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

        if (fileExists) {
            res.sendFile(filePath);
        } else {
            res.status(404).render('error', { errorMessage: 'Image not found' });
        }
    } catch (error) {
        console.error('Error while handling image request:', error);
        res.status(500).render('error', { errorMessage: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
