var Connection = require('tedious').Connection;
var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;
var config = require('../helper').config;

module.exports = function (context, req) {
    var id = req.body.id;
    var username = req.body.username;

    if (!id) {
        context.log("ERROR: No user id provided in the request");
        context.done();
    }
    if (!username) {
        context.log("ERROR: No username provided in the request to follow");
        context.done();
    }
    
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        if (err) {
            context.log(err);}
        context.log("Connected to the database");
        followUser();
    });

    function followUser() {
        request = new Request("INSERT INTO following SELECT @id, userid FROM users WHERE username = @username", function(err) {
            if (err) {
                context.log(err);}
        });

        request.addParameter('id', TYPES.Int, id);
        request.addParameter('username', TYPES.NVarChar, username);

        request.on('requestCompleted', function () {
            context.log("Successfully followed the user");
            context.done();
        });

        connection.execSql(request);
    };
};