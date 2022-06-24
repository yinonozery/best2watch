const mongoose = require('mongoose')


mongoose.connect('mongodb+srv://best2watch-user:<password>@best2watch.3tv2j.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})