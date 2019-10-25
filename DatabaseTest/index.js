var Connection = require('tedious').Connection;
var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;

module.exports = function (context, myTimer) {
    var _currentData = {};
    var config = {
        server: 'tweeter-data.database.windows.net',
        authentication: {
            type: 'default',
            options: {
                userName: 'jc02rbt',
                password: 'an1hG8K!55w'
            }
        },
        options: {
            database: 'tweeter',
            encrypt: true
        }
    };
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