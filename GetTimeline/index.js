var Connection = require('tedious').Connection;
var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;
var config = require('../helper').config;

module.exports = function (context, req) {
    var id = req.query.id;
    if (!id) {
        context.log("ERROR: No user id provided in request");
        error();
    }
    
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        if (err) {
            context.log(err);
            error();
        }
        context.log("Connected to the database");
        getTimeline();
    });

    function getTimeline() {
        request = new Request("SELECT p.postid, u.username, p.content, p.time FROM following f \
            INNER JOIN posts p ON f.followingid = @id AND f.followedid = p.userid \
            INNER JOIN users u ON p.userid = u.userid \
            UNION \
            SELECT p.postid, u.username, p.content, p.time FROM posts p \
            INNER JOIN users u ON p.userid = u.userid \
            WHERE p.userid = @id \
            ORDER BY p.time DESC", function(err) {
            if (err) {
                context.log(err);
                error();
            }
        });

        request.addParameter('id', TYPES.Int, id);

        var json = [];
        request.on('row', function(columns) {
            var rowData = {};
            columns.forEach(function(column) {
                rowData[column.metadata.colName] = column.value;
            });
            json.push(rowData);
        });

        request.on('requestCompleted', function () {
            context.res = {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: json
            };
            context.log(json);
            context.done();
        });
        connection.execSql(request);
    };

    function error() {
        context.res = {
            status: 500
        }
        context.done();
    };
};