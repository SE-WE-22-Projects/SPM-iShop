const { Sequelize } = require('sequelize');

const connect = () => {
    let config;
    if (Number.parseInt(process.env.USE_SQLITE)) {
        // config for a local sqlite db
        config = {
            dialect: "sqlite",
            storage: "local_db.sqlite",
        };

        console.log("Using local sqlite db");
    }
    else {
        // configure connection for mysql using .env 

        let port = process.env.MYSQL_PORT ? Number.parseInt(process.env.MYSQL_PORT) : undefined;

        config = {
            dialect: "mysql",
            host: process.env.MYSQL_HOST,
            port: port,
            database: process.env.MYSQL_DATABASE,
            username: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            logging: false
        };

        let emptyOk = ["password", "port"];

        // validate config
        for (const k in config) {
            if (emptyOk.indexOf(k) != -1 && !config[k]) {
                console.error(`MYSQL_${k.toUpperCase()} is not set in env`)
            }
        }

        console.log(`Using mysql database ${process.env.MYSQL_DATABASE} on ${process.env.MYSQL_HOST}`)
    }

    if (!Number.parseInt(process.env.SQL_LOG_QUERY)) {
        config.logging = false;
    }

    return new Sequelize(config);
}

const sequelize = connect();

async function initDB() {
    console.log("Loading all defined models...")
    let glob = require('glob')
    let path = require('path');

    let debugSync = Number.parseInt(process.env.SQL_SYNC_DEBUG) == 1;

    glob.sync('./models/*.js').forEach(function (file) {
        if (debugSync) console.log(file);
        require(path.resolve(file));
    });

    console.log("Loaded all models.")
    if (Number.parseInt(process.env.SQL_SYNC_SKIP)) {
        console.log('Skipping Database Sync.')
        return;
    }


    let syncConfig = {
        force: false, pool: {
            acquire: 250000,
            idle: 250000,
        }
    };
    if (Number.parseInt(process.env.SQL_SYNC_FORCE)) {
        console.log("Dropping existing tables")
        syncConfig.force = true;
    }

    if (Number.parseInt(process.env.SQL_SYNC_ALTER)) {
        console.log("Altering existing tables")
        syncConfig.alter = true;
    }

    if (!debugSync) {
        syncConfig.logging = () => { }
    }


    console.log("Synchronizing database with models...");
    await sequelize.sync(syncConfig);
    console.log("Finished synchronizing database.")
}


module.exports = { sequelize, initDB };