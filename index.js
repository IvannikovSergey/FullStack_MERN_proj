import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mongoose from "mongoose";
import {registerValidation} from "./validation/auth.js";
import {validationResult} from "express-validator";
import UserModal from './Models/User.js'

mongoose.connect('mongodb+srv://admin:admin@cluster0.8ockj.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => {
        console.log('DB ok')
    })
    .catch((err) => {
        console.log('DB error', err)
    })

const app = express()

app.use(express.json())

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModal({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash:hash
        })

        const user = await doc.save()

        const token = jwt.sign({
                _id: user._id
            }, 'secret123',
            {
                expiresIn: '30d'
            })
        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        })
    }
})

app.listen(4444, (err) => {
    if (err) {
        console.log(err)
    }
    console.log('Server OK')
})