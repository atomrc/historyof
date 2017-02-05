var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.runSql("ALTER TABLE events RENAME TO stories", callback);
};

exports.down = function(db, callback) {
    db.runSql("ALTER TABLE stories RENAME TO events", callback);
};
