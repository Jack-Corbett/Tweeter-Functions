var Connection = require('tedious').Connection;
var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;
var config = require('../helper').config;

module.exports = function (context, req) {
    var id = req.body.id;
    var followed = req.body.followed;

    if (!id) {
        context.log("ERROR: No user id provided in the request");
        context.done;
    }
    if (!followed) {
        context.log("ERROR: No user id provided in the request to unfollow");
        context.done;
    }
    
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        if (err) {
            context.log(err);}
        context.log("Connected to the database");
        unfollowUser();
    });

    function unfollowUser() {
        request = new Request("DELETE FROM following WHERE followingid = @id AND followedid = @followed", function(err) {
            if (err) {
                context.log(err);}
        });

        request.addParameter('id', TYPES.Int, id);
        request.addParameter('followed', TYPES.Int, followed);

        connection.execSql(request);
    };
};