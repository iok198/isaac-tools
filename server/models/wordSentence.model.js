module.exports = (sequelize, Sequelize) => {
    const WordSentence = sequelize.define("wordSentences", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        }
    });

    return WordSentence;
};