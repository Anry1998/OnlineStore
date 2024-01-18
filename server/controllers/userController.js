const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/model')


// Генерация токена
const generateJwt = (id, email, role) => {
    // sign - знак
    return jwt.sign(
        // Первым параметром передается объект - центральная часть токена в которую будут вшиваться какие-то данные
        {id, email, role},
        // Вторым параметром передается секретный ключ, храним его в переменных окружения, его никто не должен знать
        process.env.SECRET_KEY,
        // Указывае сколько будет жить токен (это не единственная опция)
        {expiresIn: '24h'}
    )
}

class UserController { 
    async reqistration(req, res, next) {
        const {email, password, role} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        // асинхронная фуекция хеширования пароля, второй параметр - сколько раз мы его будем хешировать
        const hashPassword = await bcrypt.hash(password, 5)
        // Создаем пользователя, пароль не забываем передать захешированный
        const user = await User.create({email, role, password: hashPassword})
        // userId - столбец в баскете
        const basket = await Basket.create({userId: user.id})
        // ВЫЗЫВАЕМ ФУНКЦИЮ ГЕНЕРАТОРА ТОКЕНА С ПАРАМЕТРАМИ ИЗ USER
        const token = generateJwt(user.id, user.email, user.role)
        // Возвращаем сам токен
        return res.json({token})
    } 

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        // Для того, чтобы убедиться в том, что пароль, который ввел пользователь совпадает с тем, что есть в базе данных
        // Так как в базе данных у нас лежит захешированный пароль, с помощью этой функции мы сравниваем пароли, первым праметром - пароль, который написал пользователь, вторым- который храниться в базе
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        // Снова генирируем токен со всеми необходимыми параметрами
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async check(req, res, next) {
        // res.json({m: "Все ОК"})
        // Если пользователь постоянно использует свой аккаунт, токен у него будет перезаписываться
        // Передаем все необходимые параметры в функцию и возвращаем на клиент
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
}

module.exports = new UserController()