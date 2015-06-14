require("dotenv").load();
var dbm = global.dbm || require("db-migrate");
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable("tags", {
        id: { type: "UUID", primaryKey: true },
        title: { type: "string", notNull: true },
        created_at: { type: "date" },
        updated_at: { type: "date" }
    }, function () {
        db.createTable("taggings", {
            story_id: {
                type: "UUID",
                foreignKey: {
                    table: "stories",
                    mapping: "id",
                    rules: {
                        onDelete: "CASCADE"
                    }
                }
            },
            tag_id: {
                type: "UUID",
                foreignKey: {
                    table: "tags",
                    mapping: "id",
                    rules: {
                        onDelete: "CASCADE"
                    }
                }
            },
            created_at: { type: "date" },
            updated_at: { type: "date" }
        }, callback);
    });
};

exports.down = function(db, callback) {
    db.dropTable("tags", function () {
        db.dropTable("taggings", callback);
    });
};
