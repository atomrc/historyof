var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.runSql("ALTER TABLE stories ALTER title TYPE VARCHAR(100)", callback);
};

exports.down = function(db, callback) {
    db.runSql("ALTER TABLE stories ALTER title TYPE VARCHAR(64)", callback);
};
