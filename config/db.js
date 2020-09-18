const Sequelize = require('sequelize');

module.exports = new Sequelize('meeti2','postgres','',{
    host:'localhost',
    port: '5432',
    dialect : 'postgres',
    pool:{
        max:5,
        min:0,
        acquire:3000,
        idle:10000
    },
    logging: false,
});

