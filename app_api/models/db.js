const mongoose = require( 'mongoose' );
const dbURI = 'mongodb://localhost/mongoose-knn';
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
mongoose.connect(dbURI, connectionParams);

require('./point');


mongoose.connection.on('connected', () => {
    console.log("Mongoose connected to " + dbURI);
});

mongoose.connection.on('error', function(err){
    console.log("Mongoose connection error: " + err);
});

mongoose.connection.on('disconnected', () => {
    console.log("Mongoose disconnected");
});


const readLine = require("readline");
if (process.platform === "win32"){
    const rl = readLine.createInterface ({
        input: process.stdin,
        output: process.stdout
    });
    rl.on ("SIGINT", function (){
        process.emit ("SIGINT");
    });
}


