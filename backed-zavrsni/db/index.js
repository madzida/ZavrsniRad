const { Pool } = require("pg");

const pool = new Pool({
  user: "ziyluhsslikpjr",
  host: "ec2-3-248-121-12.eu-west-1.compute.amazonaws.com",
  database: "d1vn4o36e5hgda",
  password: "4f8bced288b5628e94e7f655085374ab41d81e8641f44bd6d76ac154d6d66fb1",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});
/* pool.query("select * from teacher", (err, res) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.log(err.message);
  }
}); */
module.exports = {
  query: (text, params) => {
    const start = Date.now();
    return pool.query(text, params).then((res) => {
      const duration = Date.now() - start;
      //console.log('executed query', {text, params, duration, rows: res.rows});
      return res;
    });
  },
  pool: pool,
};
