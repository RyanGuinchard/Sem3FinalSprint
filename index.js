require('dotenv').config();
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
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
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