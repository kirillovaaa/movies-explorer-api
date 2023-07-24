const router = require("express").Router();
const mongoose = require("mongoose");
const { Joi, celebrate } = require("celebrate");

const JoiObjectId = Joi.string()
  .custom((value, helpers) => {
    const filtered = mongoose.Types.ObjectId.isValid(value);
    return !filtered ? helpers.error("any.invalid") : value;
  }, "invalid objectId")
  .required();

const { getMe, updateUser } = require("../controllers/users");

router.get("/users/me", getMe); //информация о пользователе
router.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  updateUser,
); //обновлем информацию о пользователе

module.exports = router;
