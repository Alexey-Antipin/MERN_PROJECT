const User = require("../models/User.js");
const Contact = require("../models/Contact.js");
const Router = require('express');
const router = Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Регистрация.
router.post("/registration",
  [check('email', 'Некорректный email').isEmail(),
  check('password', 'Некорректный пароль').isLength({ min: 6 })],

  async (req, res) => {
    try {

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации'
        })
      }
      const { email, password } = req.body
      const isUsed = await User.findOne({ email })

      if (isUsed) {
        return res.status(300).json({ message: 'Данный email уже занят' })
      }
      const salt = bcrypt.genSaltSync(10);
      const HashedPassword = bcrypt.hashSync(password, salt)
      const user = new User({ email, password: HashedPassword })
      await user.save()
      res.json(user)
    } catch (error) {
      res.status(500).json(error)
    }
  }
)

// Авторизация.
router.post("/authorization",
  [check('email', 'Некорректный email').isEmail(),
  check('password', 'Некорректный пароль').exists()],

  async (req, res) => {
    try {

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при авторизации'
        })
      }
      const { email, password } = req.body

      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ message: 'Такого email не существует' })
      }

      const isMatch = bcrypt.compareSync(password, user.password)

      if (!isMatch) {
        return res.status(400).json({ message: 'Пароли не совпадают' })
      }

      // Token
      const jwtSecret = "dassgsgssknfnskfjnkjsdfn"
      const token = jwt.sign(
        { userId: user.id },
        jwtSecret,
        { expiresIn: '1h' })
      res.json({ token, userId: user.id })

    } catch (error) {
      return res.status(500).json({ message: "Что-то пошло не так." })
    }
  }
)

// Создание контакта.
router.post("/addcontact", async (req, res) => {
  try {
    const { userId, firstname, telefon, status } = req.body
    if (firstname.length > 10 ||
      telefon.length > 11) {
      return res.status(300).json({ message: 'Превышено количество знаков в одной из столбцов' })
    }
    const ContactObject = await new Contact(
      {
        owner: userId,
        firstname: firstname,
        telefon: telefon,
        status: status
      })
    await ContactObject.save()
    res.json(ContactObject)
  } catch (error) {
    console.log(error)
  }
})

// Отправка контактов из сервера на клиент.
router.get("/getcontacts", async (req, res) => {
  try {
    const { userId } = req.query

    const contacts = await Contact.find({ owner: userId })
    res.json(contacts)

  } catch (error) {
    res.status(400).json(error)
  }
})

// Удаление контакта.
router.delete("/removecontact/:id", async (req, res) => {
  try {
    const Del_Contact = await Contact.findOneAndDelete({ _id: req.params.id })
    res.json(Del_Contact)
  } catch (error) {
    res.json(error)
  }
})

//Меняем статус на {!status} сервере.
router.put(`/redactionStatusContact/:id`, async (req, res) => {
  try {
    const status_contact = await Contact.findOne({ _id: req.params.id })
    status_contact.status = !status_contact.status
    await status_contact.save()
    res.json(status_contact)
  } catch (error) {
    res.json(error)
  }
})

//Редактируем контакт.
router.put(`/SaveRedactionContact/:id`, async (req, res) => {
  try {
    const { firstname, telefon } = req.body
    const contact_update = await Contact.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { firstname: firstname, telefon: telefon, status: false } })
    res.json(contact_update)
  } catch (error) {
    res.json(error)
  }
})

module.exports = router