const bdd = require('../models');

console.log('Syncronisation de la BDD');
bdd.sequelize.sync({ alter: true });
