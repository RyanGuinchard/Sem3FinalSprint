const express = require("express");
const app = express();
const router = express.Router();
const pgDal = require("../services/inventoryPG.dal");
const mongodbUtil = require("../services/mongodbUtil");

app.locals.useMongoDB = true;

router.get("/", (req, res) => {
  const isLoggedIn = req.cookies.username ? true : false;
  res.render("index", { isLoggedIn, useMongoDB: app.locals.useMongoDB });
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
  if (app.locals.useMongoDB) {
    const { query } = req.query;
    try {
      const results = await mongodbUtil.searchAllCollections(query);
      // Render the results view, passing the search results
      res.render("results", { query: query, results: results });
    } catch (err) {
      res.status(500).render("error", { error: err });
    }
  } else {
    //SQL logic
  }
});

router.get("/category/:category", async (req, res) => {
  const category = req.params.category;
  // Get isLoggedIn from the cookies
  const isLoggedIn = req.cookies.isLoggedIn || false;

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
