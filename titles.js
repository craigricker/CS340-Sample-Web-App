module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getTitles(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM title", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }
    
    function getTitleFilt(res, req, mysql, context, complete){
        console.log("You are in getTitlesFilt");
        var sql = "SELECT * FROM title WHERE salary > ?";
        var inserts = [req.body.minSalary];
        mysql.pool.query(sql, inserts, function(error, results, fields){
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
        var mysql = req.app.get('mysql');
        getTitles(res, mysql, context, complete);
        context.startSource = "All"
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('title', context);
            }
        }
    });

    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO title (description, salary, min_years) VALUES (?,?,?)";
        console.log(req);
        var inserts = [req.body.description, req.body.salary, req.body.min_years];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('title');
            }
        });
    });
    router.post('/filter', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        console.log("You are in filter")
        getTitleFilt(res, req, mysql, context, complete);
        context.startSource = "Filtered"
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                console.log(context);
                res.render('title', context);
            }
        }
    });
    
    return router;
}();