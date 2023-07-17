const router = require("express").Router();
const mongoose = require("mongoose");

const {} = require("../controllers/");

router.get("/users");
router.get("/users/me");

module.exports = router;
