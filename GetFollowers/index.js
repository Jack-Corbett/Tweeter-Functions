var Connection = require('tedious').Connection;
var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;
var config = require('../helper').config;

module.exports = function (context, req) {
    var _currentData = {};
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

        request.addParameter('id', TYPES.Int, 1);

        request.on('row', function(columns) {
            _currentData.Username = columns[0].value;
            context.log(_currentData);
        });

        request.on('requestCompleted', function () {
            context.res = {
                status: 200,
                body: "Username: " + (_currentData.Username) 
            };
            context.done();
        });
        connection.execSql(request);
    };
};