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
    
    
    function getComputers(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name, type, serial FROM computer", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            // results["0"] = "None";
            results.push({"id": 0, "name": "No Computer"});
            console.log("The results are");
            console.log(results);
            context.computers = results;
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
        getComputers(res, mysql, context, complete);
        context.startSource = "All"
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('employee', context);
            }
        }
    });

    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        if (req.body.computer == 0) {
            req.body.computer = null;
        }
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO employee (f_name, l_name, ssn, phone, bid, computer)\
            VALUES (?, ?, ?,?, ?, ?)";
        var inserts = [req.body.f_name, req.body.l_name, req.body.ssn,
            req.body.phone, req.body.building, req.body.computer];
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
        getComputers(res, mysql, context, complete);
        context.startSource = "Filtered"
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                console.log(context);
                res.render('employee', context);
            }
        }
    });
    
    return router;
}();