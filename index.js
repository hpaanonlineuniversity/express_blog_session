const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const postsRoute = require('./routes/posts_route');
const authRoute = require('./routes/auth_route');
const cors = require('cors');

// Database setup
const mongoose = require('mongoose');
const { REDIS_PASSWORD,SESSION_SECRET,MONGO_USERNAME,MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DB } = require('./config/config');
const mongoURL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

// Session and Redis setup
const session = require('express-session');
const { createClient } = require('redis');
const { RedisStore } = require('connect-redis');


// Initialize the Redis client.
const redisClient = createClient({
  url: `redis://default:${REDIS_PASSWORD}@redis:6379`
  //url: 'redis://redis:6379'
});


// Connect to Redis
redisClient.connect()
  .then(() => console.log('Connected to Redis'))
  .catch((err) => console.error('Redis connection error:', err));

// Initialize the session store with the Redis client.
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

// Use the session middleware
app.use(session({
  store: redisStore,
  secret: SESSION_SECRET,
  secret_options: { minLength: 10, maxLength: 50 },
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 10 } // 10 minutes
}));


// MongoDB connection
                 
const tryWithRetry = () => {
  mongoose
    .connect(mongoURL)
    .then(() => { console.log('Connected to MongoDB');})
    .catch(err => { 
        console.error('MongoDB connection error:', err); 
        setTimeout(tryWithRetry, 5000);
      });     
  }
tryWithRetry();

// Trust the first proxy
//app.set('trust proxy', 1);


// Enable CORS for all routes
//app.use(cors());


// Enable CORS with specific settings
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Allow cookies to be sent
}));


// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Routes
// Posts routes
app.use('/posts', postsRoute);


// Auth routes
app.use('/auth', authRoute);

app.get('/', (req, res) => {
  res.send('Hello World!');
  console.log('Hello World!'); // Log to the console when the root route is accessed
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});