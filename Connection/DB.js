const mongoose = require('mongoose')

const Connection = mongoose.connect('mongodb://0.0.0.0:27017/Rana-Consultant')

if(Connection){
    console.log('Server is connected to Database.')
}else{
    console.log('Server is not connected to Database.')

}