const mongoose = require( 'mongoose' );
const pointSchema = mongoose.model('point');

const STEP = 1000;
const KDTree = require('./KDTree');
const sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.getKNN = async function(req, res){
    let x = parseFloat(req.body.x);
    let y = parseFloat(req.body.y);
    let radius = parseFloat(req.body.radius);
    let k = parseFloat(req.body.k);
    if (isNaN(x) || isNaN(y) || isNaN(radius) || isNaN(k)) 
        return sendJsonResponse(res, 400, {
            message: "Data is not correct"
        });

    await pointSchema.createIndexes( { x: 1, y: 1 } );
    let curentIndex = 0;
    let nearestNeighbours = [];
    
    while(curentIndex < radius){
        if( k <= 0 ) break;
        
        /*
        * Я выбираю не сразу все данные в заданном радиусе. Я делаю выборку по нарастающей.
        * Квадрат 3- это квадрат со сторонами равными заданному радиусу.
        * На первой итерации я выбираю точки из квадрата 1 и ищу в нем нужное кол-во соседей
        * Если не нахожу, то уже выбираю точки из квадрата 2, за вычетом всех предыдущих точек, из квадрата 3
        * Так же ним ищу оставшееся кол-во соседей.
        * Цикл повторяется пока я не дойду до заданного радиуса, либо пока не найду заданное кол-во соседей.
        *           radius
        * |------------------------------|
        *(3)_______________________________
        * |                              |
        * |                              |
        * |   (2)__________________      |
        * |     |                  |     |
        * |     |  (1)________     |     |
        * |     |    |   .    |    |     |
        * |     |    | (x,y)  |    |     |
        * |     |    |________|    |     |
        * |     |                  |     |
        * |     |__________________|     |
        * |                              |
        * |______________________________|
        */
        let data = await pointSchema.find({
            $and: [
                {
                    $or : [
                        {
                            x: {
                                $gte: x - Math.min(curentIndex + STEP, radius),
                                $lte: x - curentIndex
                            },
                        },
                        {
                            x: {
                                $gte: x + curentIndex,
                                $lte: x + Math.min(curentIndex + STEP, radius)
                            },
                        }
                    ]
                },
                {
                    $or : [
                        {
                            y: {
                                $gte: y - Math.min(curentIndex + STEP, radius),
                                $lte: y - curentIndex
                            },
                        },
                        {
                            y: {
                                $gte: y + curentIndex,
                                $lte: y + Math.min(curentIndex + STEP, radius)
                            },
                        }
                    ]
                }
            ]

        }).lean()

        if(data.length > 0){
            let points =  data.map(p => {
                return {
                    x: parseFloat(p.x), 
                    y: parseFloat(p.y)
                }
            })

            console.log("Points. Time:",points);

            let tree = new KDTree(points);
            
            let consideredPoints = [];
            let knn = tree.getNearestNeighbours({x, y}, k, consideredPoints, radius);
            nearestNeighbours.push.apply(nearestNeighbours, knn);

            k -= knn.length;
            
        }
        curentIndex += STEP;
    }
    return sendJsonResponse(res, 200, {
        data: nearestNeighbours
    });

}

module.exports.createPoint = async function(req, res){
    let x = parseFloat(req.body.x);
    let y = parseFloat(req.body.y);
    let name = req.body.name;

    if (isNaN(x) || isNaN(y) || !name ) 
        return sendJsonResponse(res, 400, {
            message: "Data is not correct"
        });

    pointSchema.create({
        x: x,
        y: y,
        name: name
    })
    .then(result => {
        return sendJsonResponse(res, 200, {
            data: result
        });
    })
    .catch(e =>{
        return sendJsonResponse(res, 500, {
            message: "DB query error"
        });
    });
}

module.exports.updatePoint = function(req, res){
    let id = req.params.id;
    let x = req.body.x;
    let y = req.body.y;
    let name = req.body.name;
    let setObj = {}
    if(x) setObj.x = x;
    if(y) setObj.y = y;
    if(name) setObj.name = name;

    pointSchema.findOneAndUpdate({_id: id}, {$set: setObj})
        .exec()
        .then(result => {
            return sendJsonResponse(res, 200, {
                data: result
            });
        }).catch(e =>{
            return sendJsonResponse(res, 500, {
                message: "DB query error",
                e: e
            });
        });
}

module.exports.getPoints = function(req, res){
    let skip = 0;
    let limit = 20;

    pointSchema.find({})
        .limit(limit)
        .skip(skip)
        .sort({_id: -1})
        .exec()
        .then(data => {
            let result = data.map(p => {
                return {
                    _id: p._id,
                    name: p.name,
                    x: parseFloat(p.x), 
                    y: parseFloat(p.y)
                }
            })
            return sendJsonResponse(res, 200, {data: result});
        }).catch(e => {
            return sendJsonResponse(res, 500, {
                message: "DB query error",
                e: e
            });
        });
}

module.exports.deletePoint = function(req, res){
    let id = req.params.id;

    pointSchema.findByIdAndDelete(id)
    .exec()
    .then(deleted =>{
        return sendJsonResponse(res, 200, {
            data: deleted
        })
    }).catch(e => {
        return sendJsonResponse(res, 500, {
            message: "DB query error",
            e: e
        });
    });
}



module.exports.getPoint = function(req, res){

    pointSchema.findById(req.params.id)

        .exec()
        .then(data => {
            let result = {
                    id: data._id,
                    name: data.name,
                    x: parseFloat(data.x), 
                    y: parseFloat(data.y)
                }

            return sendJsonResponse(res, 200, {data: result});
        }).catch(e => {
            return sendJsonResponse(res, 500, {
                message: "DB query error",
                e: e
            });
        });
}