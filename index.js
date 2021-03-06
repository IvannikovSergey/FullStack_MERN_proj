import express from 'express'
import mongoose from "mongoose";
import {registerValidation, loginValidation, postCreateValidation} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from './Controllers/userController.js';
import * as PostController from './Controllers/postController.js';
import multer from 'multer'
import handleValidationError from "./utils/handleValidationError.js";

mongoose.connect('mongodb+srv://admin:admin@cluster0.8ockj.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => {
        console.log('DB ok')
    })
    .catch((err) => {
        console.log('DB error', err)
    })

const app = express()

const storage = multer.diskStorage({
        destination: (_, __, cb) => {
            cb(null, 'uploads')
        }
    }, {
        filename: (_, file, cb) => {
            cb(null, file.originalname)
        }
    }
)

const upload = multer({storage})

app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidation, handleValidationError, UserController.login)
app.post('/auth/register', registerValidation, handleValidationError, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationError, PostController.create)
app.delete('/posts/:id', checkAuth, handleValidationError, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.update)

app.listen(4444, (err) => {
    if (err) {
        console.log(err)
    }
    console.log('Server OK')
})

