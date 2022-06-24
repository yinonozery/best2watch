const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/best2watch', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})