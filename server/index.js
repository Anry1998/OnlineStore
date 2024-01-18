require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/model')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')


const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({})) 
app.use('/api', router)

// этот параметр в самом конце 
app.use(errorHandler) 
app.get('/', (req, res) => {

    res.status(200).json({m: 'req.body'})
})

// app.post('/registration', (req, res) => {
//     const {email, password, role} = req.body
//     const user = User.create({email, role, password})
//     return res.json(user)
// })


 
const start = async  () => {
    try {
        // устанавливаем подключение к базе данных
        await sequelize.authenticate()
        // функция сверяет состояние базы данных со схемой данных, которая будет описана позже
        await sequelize.sync()
               


        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
start() 
 

// const add = async () => {
//     const User = models.User2
//     // const jane = await User.create({ email: 'user2@mail', password: '12345',  })

//     // const john = await User.create({ email: 'John', password: '12345' })
     
//     await User.update(
//         {
//             email: 'Johnnnnn',
//         },
//         {
//           where: {
//             id: 9,
//           },
//         }
//       )

//     // jane.password = 'user222@mail'
//     // console.log(jane.toJSON())
//     // console.log(JSON.stringify(jane, null, 2))
// }
//  add()

// const reload = async () => {
//     john.password = 'Bob'
//      await john.reload()
// }
 
  
 