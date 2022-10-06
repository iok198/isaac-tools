const express = require("express");

const router = express.Router();
const { Word, Sentence, WordSentence } = require("../models");
const { includeUser, requireUser } = require("../middleware/auth");

router.use(includeUser);

router.get("/word", requireUser, async (req, res) => {
    const text = req.query.text;
    const wordEntry = await Word.findOne({ where: { text } });
    res.json(wordEntry);
});

router.post("/add", requireUser, async (req, res) => {
    const word = req.body;
    const { text, source, link, notes } = word.sentences[0];
    let wordEntry = await Word.findOne({ where: { text: word.text } });
    wordEntry = wordEntry || await Word.create({ text: word.text, definition: word.definition });
    let sentenceEntry = await Sentence.findOne({ where: { text } });
    console.log(sentenceEntry);
    sentenceEntry = sentenceEntry || await Sentence.create({ text, source, link, notes });

    if (await wordEntry.hasSentence(sentenceEntry)) {
        return res.status(401).json({ message: "Entry already exists" });
    }

    await wordEntry.addSentence(sentenceEntry);

    return res.json(wordEntry);
});

// TODO: check for ownership of word
router.put("/word/:id", requireUser, async (req, res) => {
    const { id } = req.params;
    const { text, definition, sentences } = req.body;
    console.log(req.body);
    
    const wordEntry = await Word.findByPk(id); 
    wordEntry.text = text;
    wordEntry.definition = definition;

    await Promise.all(sentences.map(async (sentence) => {
        const sentenceEntry = await Sentence.findByPk(sentence.id);
        sentenceEntry.text = sentence.text;
        sentenceEntry.source = sentence.source;
        sentenceEntry.link = sentence.link;
        sentenceEntry.notes = sentence.notes;
        return await sentenceEntry.save();
    }));

    await wordEntry.save();
    return res.json(wordEntry);
});

router.delete("/word/:id", requireUser, async (req, res) => {
    const { id } = req.params;
    
    const wordEntry = await Word.findByPk(id, { include: Sentence });
    const sentences = JSON.parse(JSON.stringify(wordEntry.sentences));
    await wordEntry.destroy();
    await Promise.all(sentences.map(async (sentence) => {
        const sentenceEntry = await Sentence.findByPk(sentence.id, { include: Word });
        if (sentenceEntry.words.length === 0) {
            return await sentenceEntry.destroy();
        }
    }));
    return res.json(wordEntry);
});

router.post("/exists", requireUser, async (req, res) => {
    const words = req.body;
    const result = {};

    await Promise.all(words.map(async (text) => {
        const wordEntry = await Word.findOne({ where: { text } });
        const id = wordEntry ? wordEntry.id : null;
        result[text] = id;
    }));
    
    res.json(result);
});

router.get("/all", requireUser, async (req, res) => {
    const entries = await Word.findAll({ include: Sentence });
    res.json(entries);
});

module.exports = router;
