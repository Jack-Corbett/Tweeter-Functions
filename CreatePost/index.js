var Connection = require('tedious').Connection;
var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;
var config = require('../helper').config;

module.exports = function (context, req) {
    var id = req.body.id;
    var content = req.body.content;

    if (!id) {
        context.log("ERROR: No user id provided in request");
        context.done;
    }
    if (!content) {
        context.log("ERROR: No post content provided in the request");
        context.done;
    }
    
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        if (err) {
            context.log(err);}
        context.log("Connected to the database");
        createPost();
    });

    function createPost() {
        request = new Request("INSERT INTO posts (userid, content, time) VALUES (@id, @content, CURRENT_TIMESTAMP)", function(err) {
            if (err) {
                context.log(err);}
        });

        request.addParameter('id', TYPES.Int, id);
        request.addParameter('content', TYPES.NVarChar, content);

        request.on('requestCompleted', function () {
            context.log("Added post to the database");
            context.done();
        });

        connection.execSql(request);
    };
};