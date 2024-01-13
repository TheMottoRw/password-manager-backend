import db from "../db.js";

const load = (id = 0) => {
    let query = "select * from logs";
    let queryId = `select * from logs where id=${id}`;
    return new Promise((resolve, reject) => {
        if (id === 0) {
            db.query(query, (err, res) => {
                if (err) reject(err);
                resolve(res);
            })
        } else {
            db.query(queryId, (err, res) => {
                if (err) reject(err);
                resolve(res);
            })
        }
    })
}
export default {
    load
}