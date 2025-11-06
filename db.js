import mysql from "mysql2/promise";

export const db = await mysql.createPool({
  host: "classmysql.engr.oregonstate.edu", 
  user: "cs340_swanskel",      
  password: "8110",             
  database: "cs340_swanskel",               
  connectionLimit: 10                      
});
