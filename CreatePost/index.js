var Connection = require('tedious').Connection;
var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;
var config = require('../helper').config;

module.exports = function (context, req) {
    var userid = req.body.id;
    var content = req.body.content;

    if (!userid) {
        context.log("ERROR: No user id provided in request");
        context.done;
    }
    if (!content) {
        context.log("ERROR: No post content provided in request");
        context.done;
    }
    
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        if (err) {
            context.log(err);}
        context.log("Connected to the database");
        getFollowing();
    });

    function getFollowing() {
        request = new Request("INSERT INTO posts (userid, content, time) VALUES (@id, @content, CURRENT_TIMESTAMP)", function(err) {
            if (err) {
                context.log(err);}
        });

        request.addParameter('id', TYPES.Int, userid);
        request.addParameter('content', TYPES.NVarChar, content);

        connection.execSql(request);
    };
};