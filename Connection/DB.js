const mongoose = require("mongoose");
// local Database=============>>>
// const Connection = mongoose.connect('mongodb://0.0.0.0:27017/Rana-Consultant')

// MongoDB Clustor==============>
const Connection = mongoose.connect(
  "mongodb+srv://vikasrajput95181:Y788wjSDbChDsjMF@rana-consultant.1zpz5m4.mongodb.net/?retryWrites=true&w=majority&appName=Rana-Consultant"
);

if (Connection) {
  console.log("Server is connected to Database.");
} else {
  console.log("Server is not connected to Database.");
}
