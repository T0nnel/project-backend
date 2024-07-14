import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
const nodemailer = require('nodemailer');
import { registerRoutes } from './Routes';
import axios from "axios"

dotenv.config();

const PORT: string | number = process.env.PORT || 5000;
const app: Express = express();


const allowedOrigin = 'https://project-frontend11.onrender.com'; 

app.use(express.json());
app.use(cors({ origin: allowedOrigin })); 

// Routes
registerRoutes(app);

// Connection to database
const mongo: string = 'mongodb+srv://tonnel:tonnel@cluster0.eyeqbwd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

(async function connectToDb() {
    try {
        await mongoose.connect(mongo);
        console.log('Connection to database successful');
    } catch (error) {
        console.error(error);
    }
})();

// Schema and Model
const productSchema = new mongoose.Schema({
    description: String,
    location: String,
    harvestTime: String,
    price: String,
    contact: String,
});

const Product = mongoose.model('Product', productSchema);

// Track Harvest Time
app.post('/track', (req, res) => {
    const { harvestTime } = req.body;
    const currentDate = new Date();
    const harvestDate = new Date(harvestTime);

    if (harvestDate > currentDate) {
        res.json({ status: 'On Time' });
    } else {
        res.json({ status: 'Late' });
    }
});

// Add Product
app.post('/addproducts', async (req, res) => {
    const product = new Product(req.body);
    try {
        await product.save();
        res.status(201).json({ message: 'Product added successfully!' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to add product' });
    }
});

// Fetch Products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.get('/' , (req:Request,res:Response) => {
    res.status(200).json({message:"Server is running properly"})
})

// Delete Product
app.delete('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (deletedProduct) {
            res.status(200).json({ message: 'Product removed successfully!' });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove product' });
    }
});

// Fetch data from the external link
const fetchData = async () => {
    try {
        const response = await axios.get('https://agrigrowbot.streamlit.app');
        return response.data; // Adjust this based on the actual data structure
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Home route to display the fetched data
app.get('/api/data', async (req: Request, res: Response) => {
    try {
        const data = await fetchData();
        res.status(200).json(data); // Return the fetched data as JSON
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Buyer Home
app.get('/buyerhome', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
