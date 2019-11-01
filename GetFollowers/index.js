var Connection = require('tedious').Connection;
var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;
var config = require('../helper').config;

module.exports = function (context, req) {
    var id = req.query.id;
    if (!id) {
        context.log("ERROR: No user id provided in request");
        context.done;
    }
    
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        if (err) {
            context.log(err);}
        context.log("Connected to the database");
        getFollowers();
    });

    function getFollowers() {
        request = new Request("SELECT u.username FROM following f \
            INNER JOIN users u ON f.followingid = u.userid AND f.followedid = @id", function(err) {
            if (err) {
                context.log(err);}
        });

        request.addParameter('id', TYPES.Int, id);

        var json = [];
        request.on('row', function(columns) {
            var rowData = {};
            columns.forEach(function(column) {
                rowData[column.metadata.colName] = column.value;
            });
            json.push(rowData)
        });

        request.on('requestCompleted', function () {
            context.res = {
                status: 200,
                body: json
            };
            context.log(json);
            context.done();
        });
        connection.execSql(request);
    };
};