/**
 * Created by barrett on 8/28/14.
 */

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

// connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query("DROP TABLE herbeat.users;")
console.log("Table dropped!");
connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(30), \
    `facebook_id` VARCHAR(30), \
    `twitter_id` VARCHAR(30), \
    `google_id` VARCHAR(30), \
    `name` VARCHAR(30), \
    `email` VARCHAR(255), \
    `password` CHAR(60) NOT NULL, \
    `facebook_token` VARCHAR(255), \
    `twitter_token` VARCHAR(255), \
    `google_token` VARCHAR(255), \
    `provider` VARCHAR(20), \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `facebook_id_UNIQUE` (`facebook_id` ASC), \
    UNIQUE INDEX `facebook_token_UNIQUE` (`facebook_token` ASC), \
    UNIQUE INDEX `twitter_id_UNIQUE` (`facebook_id` ASC), \
    UNIQUE INDEX `twitter_token_UNIQUE` (`facebook_token` ASC), \
    UNIQUE INDEX `email_UNIQUE` (`email` ASC) \
)');

console.log('Success: Database Created!')

connection.end();
