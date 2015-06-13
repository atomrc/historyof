require("dotenv").load();
var dbm = global.dbm || require("db-migrate");
var type = dbm.dataType;

var createSql = "CREATE EXTENSION \"uuid-ossp\";" +
    "CREATE TABLE users (" +
    "    id UUID PRIMARY KEY DEFAULT uuid_generate_v1()," +
    "    login VARCHAR UNIQUE NOT NULL," +
    "    password VARCHAR(128) NOT NULL," +
    "    pseudo VARCHAR(64)," +
    "    created_at TIMESTAMP DEFAULT NOW()," +
    "    updated_at TIMESTAMP" +
    ");" +

    "CREATE TABLE timelines (" +
    "    id UUID PRIMARY KEY DEFAULT uuid_generate_v1()," +
    "    user_id UUID REFERENCES users (id)," +
    "    title VARCHAR(64) NOT NULL," +
    "    created_at TIMESTAMP DEFAULT NOW()," +
    "    updated_at TIMESTAMP" +
    ");" +

    "CREATE TABLE events (" +
    "    id UUID PRIMARY KEY DEFAULT uuid_generate_v1()," +
    "    timeline_id UUID REFERENCES timelines (id)," +
    "    title VARCHAR(64) NOT NULL," +
    "    type VARCHAR(30) NOT NULL," +
    "    date TIMESTAMP NOT NULL," +
    "    description text," +
    "    created_at TIMESTAMP DEFAULT NOW()," +
    "    updated_at TIMESTAMP" +
    ");";

exports.up = function(db, callback) {
    db.runSql(createSql, callback);
};

exports.down = function(db, callback) {
    var tables = ["events", "timelines", "users"],
        nbDrop = 0;

    tables.forEach(function (table) {
        db.dropTable(table, function () {
            nbDrop++;
            console.log(table);
            if (nbDrop === tables.length) {
                db.runSql("DROP EXTENSION \"uuid-ossp\"", callback);
            }
        });
    });
};
