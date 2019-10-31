var Connection = require('tedious').Connection;
var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;
var config = require('../helper').config;

module.exports = function (context, req) {
    var userid = req.query.id;
    if (!userid) {
        context.log("No id provided");
        context.done;
    }

    var currentData = {};
    
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        if (err) {
            context.log(err);}
        context.log("Connected");
        getUsername();
    });

    function getUsername() {
        request = new Request("select username from users where userid = @id", function(err) {
            if (err) {
                context.log(err);}
        });

        request.addParameter('id', TYPES.Int, userid);

        request.on('row', function(columns) {
            currentData.Username = columns[0].value;
            context.log(currentData);
        });

        request.on('requestCompleted', function () {
            context.res = {
                status: 200,
                body: "Username: " + (currentData.Username) 
            };
            context.done();
        });
        connection.execSql(request);
    };
};