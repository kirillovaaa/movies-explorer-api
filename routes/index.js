const router = require('express').Router();

const moviesRouter = require('./movies');
const usersRouter = require('./users');

router.use(usersRouter);
router.use(moviesRouter);

module.exports = router;
