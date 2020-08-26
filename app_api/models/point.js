// ch -- channel modelffmpegSegmentTime
var mongoose = require( 'mongoose' );

var pointSchema = new mongoose.Schema({
    name: {type: String, required: true},
    x: {type: mongoose.Types.Decimal128, required: true},
    y: {type: mongoose.Types.Decimal128, required: true}
});

mongoose.model('point', pointSchema);