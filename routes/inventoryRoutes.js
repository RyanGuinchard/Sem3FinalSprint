const express = require("express");
const app = express();
const router = express.Router();
const pgDal = require("../services/inventoryPG.dal");
const mongodbUtil = require("../services/mongodbUtil");

app.locals.useMongoDB = true;

router.get("/", (req, res) => {
  const isLoggedIn = req.cookies.username ? true : false;
  const isAdmin = req.cookies.isAdmin === 'true';
  res.render("index", { isLoggedIn, isAdmin, useMongoDB: app.locals.useMongoDB });
});

router.get("/toggle-database", (req, res) => {
  // Toggle the useMongoDB variable
  app.locals.useMongoDB = !app.locals.useMongoDB;
  console.log(
    `Switched to ${app.locals.useMongoDB ? "MongoDB" : "PostgreSQL"}`
  );
  res.redirect("/");
});

router.get("/search", async (req, res) => {
  const isLoggedIn = req.cookies.username ? true : false;
  const isAdmin = req.cookies.isAdmin === 'true';
  const searchTerm = req.query.q;
  console.log(`Search term: ${searchTerm}`)
  if (app.locals.useMongoDB) {
    try {
      const results = await mongodbUtil.searchAllCollections(searchTerm);
      // Render the results view, passing the search results
      res.render("results", { isLoggedIn, isAdmin, query: searchTerm, results: results, useMongoDB: app.locals.useMongoDB });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error occurred while searching');
    }
  } else {
    try {
      const results = await pgDal.searchAll(searchTerm);
      res.render('results', { results, isLoggedIn, isAdmin, useMongoDB: app.locals.useMongoDB });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error occurred while searching');
    }
  }
});

router.get("/category/:category", async (req, res) => {
  const category = req.params.category;
  // Get isLoggedIn and isAdmin from the cookies
  const isLoggedIn = req.cookies.username ? true : false;
  const isAdmin = req.cookies.isAdmin === 'true';
  console.log(`Category changed to: ${category}`)
  const title = category.charAt(0).toUpperCase() + category.slice(1);
  if (app.locals.useMongoDB) {
    // Use MongoDB to get products
    try {
      await mongodbUtil.connect();
      const products = await mongodbUtil
        .db()
        .collection(category)
        .find()
        .toArray();
      res.render("productlist", {
        products: products,
        category: title,
        isLoggedIn: isLoggedIn,
        isAdmin: isAdmin,
        useMongoDB: app.locals.useMongoDB,
      });
      mongodbUtil.close();
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .send(
          `Error accessing the database with MongoDB for category ${category}.`
        );
      mongodbUtil.close();
    }
  } else {
    // Use PostgreSQL to get products
    try {
      const products = await pgDal.getAllFromTable(category);
      res.render("productlist", {
        products: products,
        category: title,
        isLoggedIn: isLoggedIn,
        isAdmin: isAdmin,
        useMongoDB: app.locals.useMongoDB,
      });
    } catch (err) {
      res
        .status(500)
        .send(
          `Error accessing the database with PostgreSQL for category ${category}.`
        );
    }
  }
});

module.exports = router;
