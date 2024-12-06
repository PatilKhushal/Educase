const mysql = require('mysql2');

function connectDB()
{
    return mysql.createPool({
        host: process.env.MYSQLHOST,
        user: process.env.MYSQLUSER,
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    });
}

module.exports = {
    connectDB,
}