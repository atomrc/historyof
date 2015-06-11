/*eslint-env node */

module.exports = {
    db: {
        host: process.env.POSTGRESQL_ADDON_HOST,
        user: process.env.POSTGRESQL_ADDON_USER,
        password: process.env.POSTGRESQL_ADDON_PASSWORD,
        db: process.env.POSTGRESQL_ADDON_DB
    }
};
