var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/college', { useNewUrlParser: true });

var loginSchema = mongoose.Schema({
    Id: String,
    username: String,
    password: String,
    avatar: String,
    role: String,

    google:{
        Token: String
    },

    facebook:{
        Token: String
    }
});

var login = mongoose.model('login', loginSchema);



module.exports = login;
