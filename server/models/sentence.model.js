module.exports = (sequelize, Sequelize) => {
    const Sentence = sequelize.define("sentences", {
        text: {
            type: Sequelize.STRING
        },
        source: {
            type: Sequelize.STRING
        },
        link: {
            type: Sequelize.STRING
        },
        notes: {
            type: Sequelize.STRING
        }
    });
    return Sentence;
};