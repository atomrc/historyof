var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.runSql(`
        ALTER TABLE stories DROP CONSTRAINT IF EXISTS events_user_id_fkey;
        ALTER TABLE stories ALTER user_id TYPE VARCHAR(64);
    `, callback);
};

exports.down = function(db, callback) {
    db.runSql("ALTER TABLE stories ALTER user_id TYPE UUID REFERENCES users (id)", callback);
};
