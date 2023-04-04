import {createPool} from "mysql2/promise";
import {config} from "../config/config";


export const db = createPool({
    host: config.host,
    user: config.user,
    database: config.database,
    password: config.password,
    namedPlaceholders: true,
    decimalNumbers: true
})