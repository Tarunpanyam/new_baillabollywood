const mongoose = require('mongoose');

var subDistributionSchema = new mongoose.Schema({
    title:{type:String},
    content:{type:String},
    image:{type:String} 
});
module.exports = mongoose.model("SubDistribution", subDistributionSchema);