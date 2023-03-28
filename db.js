var mysql = require('mysql');

module.exports = {
    getData: function(sql, param, callback){
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'rootroot',
            database: 'pharmacy'
        });

        connection.connect(function(err){
            if(err)
            {
                console.log('error connecting database ...');
            }
        });
        if(param == null)
        {
            connection.query(sql, function(err, result){
                callback(result);
            });
        }
        else
        {
            connection.query(sql, param, function(err,result){
                if(err){
                    console.log(err)
                }
                callback(result);
            });
        }
    },
    execute:(sql, param)=>{
        return new Promise((resolve,reject)=>{
            var connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'rootroot',
                database: 'pharmacy'
            });
            connection.connect(function(err){
                if(err)
                {
                    console.log('error connecting database ...');
                    reject(err);
                }
            });
            if(param == null) {
                connection.query(sql, function(err, result){
                    if(err){
                        reject(err)
                    }
                    resolve(result)
                });
            }else{
                connection.query(sql, param, function(err,result){
                    if(err){
                        reject(err)
                    }
                    resolve(result)
                });
            }
        })
    }
};
