import mysql from "mysql";

const db = mysql.createConnection({
    host: "localhost",
    user: "super",
    password: "",
    database: "totp"
});

// open the MySQL connection
db.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

export default db;
