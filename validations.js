import {body} from "express-validator";

export const loginValidation = [
    body('email').isEmail(),
    body('password').isLength({min: 5}),
    body('fullName').isLength({min: 3}),
    body('avatarUrl').optional().isURL()
]

export const registerValidation = [
    body('email').isEmail(),
    body('password').isLength({min: 5}),
    body('fullName').isLength({min: 3}),
    body('avatarUrl').optional().isURL()
]

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({min:3}).isString(),
    body('text', 'Введите текст статьи').isLength({min: 10}).isString(),
    body('tags','Неверный формат тегов(введите массив)').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString()
]

