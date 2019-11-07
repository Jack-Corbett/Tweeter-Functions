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
        login();
    });

    function login() {
        request = new Request("SELECT userid, password FROM users WHERE username = @username", function(err, rowCount, rows) {
            if (err) {
                context.log(err);
                error();
            } else if (rowCount < 1) {
                context.log("No user found");
                error();
            } else {
                bcrypt.compare(password, rows[0][1].value, function (err, isValid) {
                    if (err) {
                        context.log(err);
                        error();
                    } else if (!isValid) {
                        context.log("Password incorrent")
                        error()
                    } else {
                        context.res = {
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: "{ userid: " + rows[0][0].value + " }"
                        };
                        context.done();
                    }
                });
            }
        });

        request.addParameter('username', TYPES.NVarChar, username);
        connection.execSql(request);
    };

    function error() {
        context.res = {
            status: 401,
            body: "Failed to login"
        }
        context.done();
    }
};