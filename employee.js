module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getEmployees(res, mysql, context, complete){
        mysql.pool.query("SELECT f_name, l_name, ssn, phone, building.name AS buildName FROM employee JOIN building ON employee.bid = building.id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }
    
    function getEmployeesFilt(res, req, mysql, context, complete){
        var sql = "SELECT f_name, l_name, ssn, phone, building.name AS buildName FROM employee JOIN building ON employee.bid = building.id WHERE building.id = ?";
        var inserts = [req.body.equalTo];
        console.log(req.body.equalTo);
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }
    function getBuildings(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name as allBuildName FROM building", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.buildings = results;
            complete();
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getBuildings(res, mysql, context, complete);
        getEmployees(res, mysql, context, complete);
        context.startSource = "All"
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('employee', context);
            }
        }
    });

    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO employee (f_name, l_name, ssn, phone, bid) VALUES (?, ?, ?,?, ?)";
        var inserts = [req.body.f_name, req.body.l_name, req.body.ssn, req.body.phone, req.body.building];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('employee');
            }
        });
    });
    router.post('/filter', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        console.log("You are in filter")
        getBuildings(res, mysql, context, complete);
        getEmployeesFilt(res, req, mysql, context, complete);
        context.startSource = "Filtered"
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                console.log(context);
                res.render('employee', context);
            }
        }
    });
    
    return router;
}();