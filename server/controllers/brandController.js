const {Brand} = require('../models/model')
const ApiError = require('../error/ApiError')

class BrandController {
    async create(req, res) {
        // Диструктуризация, из тела запроса извлекаем название типа (поскольку это пост запрос у него есть тело)
        const {name} = req.body
        // с помощью фукции create этот тип мы создаем( Асинхронная функуция)
        // Также в таблице Type у меня есть соответствующее поле с названием name (id будет добавляться автоматически)
        const type = await Brand.create({name})
        // То, что нам отвечает сервер на запрос, сюда можно писать что по-кайфу
        return res.json({m: `Добавлен новый бренд: ${name}`})
    } 

    async getAll(req, res) {
        const types = await Brand.findAll()
        return res.json(types)
    } 
 
     
}
 
module.exports = new BrandController()