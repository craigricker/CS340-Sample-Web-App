module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getBuildings(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name, ad_line1, ad_line2, city, state, zip, year_purchased FROM building", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }

    function getBuilding(res, mysql, context, id, complete){
        var sql = "SELECT * FROM building WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.building = results[0];
            complete();
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteBuilding.js"];
        var mysql = req.app.get('mysql');
        getBuildings(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('building', context);
            }

        }
    });

    /* Display one person for the specific purpose of updating people */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatebuilding.js"];
        var mysql = req.app.get('mysql');
        getBuilding(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            console.log(context)
            if(callbackCount >= 1){
                res.render('update-building', context);
            }

        }
    });

    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO building (name, ad_line1, ad_line2, city, state, zip, year_purchased) VALUES (?,?,?,?,?,?,?)";
        var inserts = [req.body.name, req.body.ad_line1, req.body.ad_line2,
            req.body.city, req.body.state, req.body.zip, req.body.year_purchased];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/building');
            }
        });
    });

    // /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log("Updating building!")
        
        console.log(req.body)
        var sql = "UPDATE building SET name=?, ad_line1=?, ad_line2=?, city=?, state=?, zip=?, year_purchased=? WHERE id=?";
        var inserts = [req.body.name, req.body.ad_line1, req.body.ad_line2, req.body.city,
            req.body.state, req.body.zip, req.body.year_purchased, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    // /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM building WHERE id = ?";
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