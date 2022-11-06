module.exports = (sequelize, Sequelize) => {
    const Word = sequelize.define("words", {
        text: {
            type: Sequelize.STRING
        },
        definition: {
            type: Sequelize.STRING
        }
    });
    return Word;
};