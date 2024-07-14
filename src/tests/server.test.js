const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const nodemailerMock = require('nodemailer-mock');

// Import your Express app
const app = require('../server');

// Setup an in-memory MongoDB database
let mongoServer;
beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Mock Nodemailer to prevent actual emails during tests
beforeEach(() => {
  nodemailerMock.mock.reset();
});

describe('POST /track', () => {
  it('should return "On Time" if harvestTime is in the future', async () => {
    const response = await request(app)
      .post('/track')
      .send({ harvestTime: new Date(Date.now() + 86400000) }); // Set 1 day in the future
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('On Time');
  });

  it('should return "Late" if harvestTime is in the past', async () => {
    const response = await request(app)
      .post('/track')
      .send({ harvestTime: new Date(Date.now() - 86400000) }); // Set 1 day in the past
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Late');
  });
});

describe('POST /addproducts', () => {
  it('should add a product', async () => {
    const productData = {
      description: 'Test Product',
      location: 'Test Location',
      harvestTime: 'Test Time',
      price: '10.00',
      contact: '1234567890',
    };

    const response = await request(app)
      .post('/addproducts')
      .send(productData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Product added successfully!');
  });
});

describe('GET /products', () => {
  it('should fetch all products', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe('DELETE /products/:id', () => {
  it('should delete a product', async () => {
    // First, add a product
    const productData = {
      description: 'Test Product',
      location: 'Test Location',
      harvestTime: 'Test Time',
      price: '10.00',
      contact: '1234567890',
    };
    const addResponse = await request(app)
      .post('/addproducts')
      .send(productData);

    const productId = addResponse.body.productId;

    // Then, delete the product
    const deleteResponse = await request(app).delete(`/products/${productId}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('Product removed successfully!');
  });

  it('should return 404 if product not found', async () => {
    const deleteResponse = await request(app).delete('/products/invalidProductId');
    expect(deleteResponse.status).toBe(404);
    expect(deleteResponse.body.error).toBe('Product not found');
  });
});

describe('POST /contact', () => {
  it('should send an email', async () => {
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message',
    };

    const response = await request(app)
      .post('/contact')
      .send(contactData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Email sent successfully');
    
    // Check if the email was sent using nodemailerMock
    const sentMail = nodemailerMock.mock.sentMail();
    expect(sentMail.length).toBe(1);
    expect(sentMail[0].data.to).toBe('totimbugz@gmail.com'); // Check if email was sent to the correct address
  });

  it('should return 500 if email sending fails', async () => {
    // Simulate nodemailer error
    nodemailerMock.mock.shouldFailOnce(new Error('Failed to send email'));

    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message',
    };

    const response = await request(app)
      .post('/contact')
      .send(contactData);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to send email');
  });
});
