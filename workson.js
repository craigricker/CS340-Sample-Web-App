module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getWorkson(res, mysql, context, complete){
        mysql.pool.query("SELECT works_on.id, f_name, l_name, team.name, works_on.join_date FROM \
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
    
    function getWorksonFilt(res, req, mysql, context, complete){
        var sql = "SELECT works_on.id, f_name, l_name, team.name, works_on.join_date FROM \
            works_on JOIN team ON works_on.tid = team.id\
            JOIN employee ON works_on.eid = employee.id\
            WHERE team.id = ?";
        var inserts = [req.body.filterTeam];
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
        context.jsscripts = ["deleteWorkson.js"];
        getWorkson(res, mysql, context, complete);
        getEmployees(res, mysql, context, complete);
        getTeams(res, mysql, context, complete);
        context.startSource = "All"
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                console.log("About to load workson, context is:");
                console.log(context);
                res.render('workson', context);
            }
        }
    });
    
    
    function getEmployees(res, mysql, context, complete){
        mysql.pool.query("SELECT id, CONCAT(f_name, \" \", l_name) as employeeNames FROM employee", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employees = results;
            complete();
        });
    }
    function getTeams(res, mysql, context, complete){
        mysql.pool.query("SELECT id, team.name as teamName FROM team", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.teams = results;
            complete();
        });
    }
    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO works_on (eid, tid) VALUES (?, ?)";
        var inserts = [req.body.employeeNew, req.body.team];
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
        getEmployees(res, mysql, context, complete);
        getTeams(res, mysql, context, complete);
        getWorksonFilt(res, req, mysql, context, complete);
        context.startSource = "Filtered"
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('workson', context);
            }
        }
    });
    
    router.delete('/:id', function(req, res){
        console.log("in workson delete");
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM works_on WHERE id=?";
        var inserts = [req.params.id];
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