var Connection = require('tedious').Connection;
var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;
var bcrypt = require('bcryptjs');
var config = require('../helper').config;

module.exports = function (context, req) {
    var username = req.body.username;
    var password = req.body.password;

    if (!username) {
        context.log("ERROR: No username provided in the request");
        error();
    }
    if (!password) {
        context.log("ERROR: No password provided in the request");
        error();
    }
    
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        if (err) {
            context.log(err);
            error();
        }
        context.log("Connected to the database");
        register();
    });

    function register() {
        bcrypt.hash(password, 8, function(err, hash) {
            if (err) {
                context.log(err);
                error();
            } else {
                request = new Request("INSERT INTO users (username, password) VALUES (@username, @hash)", function(err) {
                    if (err) {
                        context.log(err);
                        error();
                    } else {
                        context.log("Added user to the database");
                        context.done();
                    }
                });
        
                request.addParameter('username', TYPES.NVarChar, username);
                request.addParameter('hash', TYPES.NVarChar, hash);
                connection.execSql(request);
            }
        });
    };

    function error() {
        context.res = {
            status: 500
        }
        context.done();
    };
};