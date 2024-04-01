const mongoose = require("mongoose")


const connection = mongoose.connect("mongodb+srv://abhijeet:abhijeet@cluster0.6oakvd5.mongodb.net/Socket5733")

module.exports = {connection}