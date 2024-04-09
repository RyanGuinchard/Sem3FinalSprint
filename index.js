require('dotenv').config();
const useMongoDB = process.env.USE_MONGO_DB === "true";
const mongodbUtil = require('./services/mongodbUtil');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const PORT = 3000;

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the cookie-parser middleware
app.use(cookieParser());

// Middleware
app.use((req, res, next) => {
    if (req.body._method) {
      req.method = req.body._method;
    }
    next();
});

  // Add route files
  const inventoryRouter = require("./routes/inventoryRoutes");
  const usersRouter = require("./routes/userRoutes");

  // Mount route file
  app.use('/', inventoryRouter);
  app.use('/users', usersRouter);

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });