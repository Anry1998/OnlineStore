const uuid = require('uuid')
const path = require('path')
const {Device, DeviceInfo} = require('../models/model')
const ApiError = require('../error/ApiError')
const { title } = require('process')
  
class DeviswController {
    async create(req, res, next) {
        try {
            let {name, price, brandId, typeId, info} = req.body 
            const {img} = req.files 
            // Создаем уникальное имя файла
            let fileName = uuid.v4() + '.jpg'
            // У path вызываем метод resolve (она адаптирует путь к операционной системе): 
            // первым параметром передаем __dirname - это путь до текущей папки с контроллерами
            // Затем передаем две точки, чтобы подняться на директорию выше, 
            // следом указываем папку статик, то есть куда помещаем наш объект, и указываем имя файла fileName
            img.mv(path.resolve(__dirname, '..', 'static', fileName))

            // ID объекту присваивается после создания объекта, поэтому эту строку мы поднимаем выше info
            const device = await Device.create({name, price, brandId, typeId, img: fileName})
            
            if (info) {
                // Когда мы передаем какие-то данные через форм дату они приходят в виде строки, поэтому надо распарсить в json  формат
                info = JSON.parse(info)

                // после того как массив распарсили, пробегаемся по нему форичем и для каждого элемента массива вызываем функцию криэйт
                // await здесь не ставим намеренно, чтобы не блокировать весь поток, чтобы создавались асинхронно
                info.forEach(i =>
                    DeviceInfo.create({
                        // объект передаем в заголовок, его мы получаем из элемента итерации
                        title: i.title,
                        // описание
                        description: i.description,
                        deviceId: device.id
                    })
                )
            }

        

        return res.json(device)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
        
    }  

    async getAll(req, res) {
        
        let {brandId, typeId, limit, page} = req.query
        // Если страница не указана, то сделаем ее первой
        page = page || 1
        // Если лимит не указан, то будем отправлять по 9 устройств
        limit = limit || 2
        // Считаем отступ, допустим мы перешли на вторую страницу и первые 9 товаров нам надо пропустить
        let offset = page * limit - limit 
        let devices 
        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll( { })
        }
        if (brandId && !typeId) {
            devices = await Device.findAndCountAll({where:{brandId}}) 
        }
        if (!brandId && typeId) {
            devices = await Device.findAndCountAll({where:{typeId}})
        }
        if (brandId && typeId) {
            devices = await Device.findAndCountAll({where:{typeId, brandId}})
        }

        

        return res.json( devices)
    }

    async getOne(req, res, next) {
        const {id} = req.params 
        const devise = await Device.findOne(
            {
                where: {id},
                // Помимо устройства необходимо получить массив характеристик, поскольку этот запрос будет работать тогда, когда мы откроем страницу детального просмотра устройства
                // Для этого указывается поле инклюд и указываем модель, которую мы хотим подгрузить и названия поля, которое будет в этом объекте
                include: [{model: DeviceInfo, as: 'info'}]
            }
        )
        return res.json(devise)
    }
}

module.exports = new DeviswController()