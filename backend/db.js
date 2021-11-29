const mysql = require("mysql");
const pool = mysql.createPool({
    host: "pei17y9c5bpuh987.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "xkn8ctcqk3q6q1wb",
    password: "rdxybipdyypykk6t",
    database: "vhou70oui3xzdr4k",
});

module.exports = pool;