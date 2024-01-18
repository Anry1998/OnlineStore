const jwt = require('jsonwebtoken')

module.exports = function(role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1] // Bearer asfasnfkajsfnjk
            if (!token) {
                return res.status(401).json({message: "Не авторизован"})
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            // После того как токен декодирован, необходимо выцепить роль пользователя и сравнить ее с той, которую мы передали в миддлеваре 
            if (decoded.role !== role) {
                // Если они не совпадают возвращаем, что нет доступа
                return res.status(403).json({message: "Нет доступа"})
            }
            req.user = decoded;
            next()
        } catch (e) {
            res.status(401).json({message: "Не авторизован"})
        }
    };
}