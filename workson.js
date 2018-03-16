module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getWorkson(res, mysql, context, complete){
        mysql.pool.query("SELECT f_name, l_name, team.name, works_on.join_date FROM \
            works_on JOIN team ON works_on.tid = team.id\
            JOIN employee ON works_on.eid = employee.id", function(error, results, fields){
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
        getWorkson(res, mysql, context, complete);
        getEmployees(res, mysql, context, complete);
        context.startSource = "All"
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                console.log("About to load workson, context is:");
                console.log(context);
                res.render('workson', context);
            }
        }
    });
    
    
    function getEmployees(res, mysql, context, complete){
        mysql.pool.query("SELECT id, CONCAT(f_name, l_name) as employeeNames FROM employee", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            console.log("The resutls for get employees are:");
            console.log(results);
            context.employees = results;
            complete();
        });
    }

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
                res.redirect('workson');
            }
        });
    });
    router.post('/filter', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getBuildings(res, mysql, context, complete);
        getEmployeesFilt(res, req, mysql, context, complete);
        context.startSource = "Filtered"
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('workson', context);
            }
        }
    });
    
    return router;
}();