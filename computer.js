module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getComputers(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name, type, serial FROM computer", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }



    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteComputer.js"];
        var mysql = req.app.get('mysql');
        getComputers(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('computer', context);
            }

        }
    });



    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO computer (name, type, serial) VALUES (?,?,?)";
        var inserts = [req.body.name, req.body.type, req.body.serial];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/computer');
            }
        });
    });

    // /* The URI that update data is sent to in order to update a person */


    
    function getComputerFilt(res, req, mysql, context, complete){
        var sql = "SELECT * FROM computer WHERE serial > ?";
        var inserts = [req.body.serial];
        
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }
    
    router.post('/filter', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        console.log("You are in filter")
        getComputerFilt(res, req, mysql, context, complete);
        context.startSource = "Filtered"
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                console.log(context);
                res.render('computer', context);
            }
        }
    });

    // /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM computer WHERE id = ?";
        var inserts = [req.params.id];
        console.log("Got into router delete for computers!");
        console.log(inserts);
        console.log("That was inserts!");
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();