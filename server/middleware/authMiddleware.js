const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    // Если метод равен OPTIONS, то пропускаем, нас интересует только пост гет пут делит
    if (req.method === "OPTIONS") {
        next()
    }
    try{
        // Из хедеров, в токен обычно помещают хедр авторизейшен, но в токене обычно помещают сначала тип токена, а потом сам токен
        // В нашем случае тип токена Bearer, по пробелу два этих слова надо отлепить и по первому индексу получить сам токен
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({message: "Не авторизован"})
        }
        // раскадирование токена, если он существует
        // Перед этим надо ипортировать сам токен - const jwt = require('jsonwebtoken')
        // Вызываем функцию verify, которая будет проверять токен на валидность, в нее помещаем сам токен и секретный ключ
        const decoded = jwt.verify(token, process.env.SECRET_KEY )
        // Добавляем данные, которые мы вытащили из этого токена, во всех вункциях этот user будет доступен
        req.user = decoded
        next()

        // Переходим в userRouter

    } catch (e) {
        res.status(401).json({message: "Не авторизован"})
    }
}