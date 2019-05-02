const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/tp-odysee',{useNewUrlParser: true})
    .then(() => console.log('Connected to Mongo'))
    .catch(err => {
        console.log(err);
        process.exit(); // on tue le process en cas d'échec de connection en DB
    })
