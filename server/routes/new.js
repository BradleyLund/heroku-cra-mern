module.exports = function (app) {
  const car = require("../controllers/car.controller.js");
  app.post("/newuser", car.createANewUser);
};
