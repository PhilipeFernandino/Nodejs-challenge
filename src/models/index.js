const dbSync = async () => {
    try {
        console.log('Sincronizando DB');
        const database = require('../../db.js');
        require('./User.js');
        require('./Following.js');
        require('./Repo.js');
        require('./Star.js');
        // await database.sync({ force: true });
    } catch (error) {
        console.log(error);
    }
};

module.exports = dbSync;
