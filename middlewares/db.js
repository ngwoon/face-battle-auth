const mysql = require("mysql2");

let pool;
let promisePool;

module.exports = {
    connect: async () => {
        try {
            pool = mysql.createPool({
                host: "localhost",
                user: "root",
                password: "rhksdn95",
                database: "oauth_test",
                port: "3306",
                charset: "utf8",
                waitForConnections: true, // default
            });
            promisePool = pool.promise();
        } catch(error) {
            console.log("DB 연결 에러");
            console.log(error); 
        }
    },
    query: async (sql) => {
        try {
            console.log("before start querying");
            const result = await promisePool.query(sql);
            console.log("after querying");
            return result[0];
        } catch(error) {
            console.log("회원정보 DB 검색 에러");
            console.log(error);
            return [];
        }
    },
};