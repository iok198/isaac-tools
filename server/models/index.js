const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

const User = require("../models/user.model.js")(sequelize, Sequelize);
const Word = require("../models/word.model.js")(sequelize, Sequelize);
const Sentence = require("../models/sentence.model.js")(sequelize, Sequelize);
const WordSentence = require("../models/wordSentence.model.js")(sequelize, Sequelize);

Sentence.belongsToMany(Word, { through: WordSentence });
Word.belongsToMany(Sentence, { through: WordSentence });
WordSentence.belongsTo(Word);
WordSentence.belongsTo(Sentence);
Word.hasMany(WordSentence);
Sentence.hasMany(WordSentence);

db.User = User;
db.Word = Word;
db.Sentence = Sentence;
db.WordSentence = WordSentence;

module.exports = db;