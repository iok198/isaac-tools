const express = require("express")

const CONSTANTS = require("../constants")

const sampleData = require("../sampleData")
const userRoute = require("./user");

const YTDlpWrap = require("yt-dlp-wrap").default;
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

const router = express.Router();

console.log(userRoute);

// MasterDetail Page Endpoint
router.get(CONSTANTS.ENDPOINT.MASTERDETAIL, (req, res) => {
  res.json(sampleData.textAssets)
})

// Grid Page Endpoint
router.get(CONSTANTS.ENDPOINT.GRID, (req, res) => {
  res.json(sampleData.textAssets)
})

router.get("/clip", async (req, res) => {
    const { videoID, start, end } = req.query;
    console.log(`${videoID}: ${start} - ${end}`);

    res.set("content-type", "audio/mpeg");
    res.set("accept-ranges", "bytes");

    const ytDlpWrap = new YTDlpWrap();
    const videoPath = path.join(__dirname, "..", "..", "cache", "video-audio", `${videoID}.m4a`);

    const hasCache = fs.existsSync(videoPath);

    if (!hasCache) {
        await ytDlpWrap.execPromise([
            `https://www.youtube.com/watch?v=${videoID}`,
            "--extract-audio",
            "--audio-format",
            "m4a",
            "-o",
            videoPath
        ]);
    } 

    ffmpeg(videoPath)
        .setStartTime(start)
        .duration(end - start)
        .format("mp3")
        .outputOptions(['-movflags frag_keyframe+empty_moov'])
        .pipe(res, { end: true });
});

module.exports = router;
