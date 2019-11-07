exports.config = {
    server: 'tweeter-data.database.windows.net',
    authentication: {
        type: 'default',
        options: {
            userName: process.env["DB_USER"],
            password: process.env["DB_PASSWORD"]
        }
    },
    options: {
        database: 'tweeter',
        encrypt: true,
        rowCollectionOnRequestCompletion: true
    }
};