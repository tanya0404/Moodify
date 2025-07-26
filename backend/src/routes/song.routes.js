const express = require('express');
const multer = require('multer');
const uploadFile = require('../service/service');
const router = express.Router();
const songModel = require('../models/song.model');


const upload = multer({ storage:multer.memoryStorage() });


router.post('/songs',upload.single('audio'), async(req, res) => {
    console.log(req.body);
    console.log(req.file);
    const fileData = await uploadFile(req.file);
    songModel.create({
        title: req.body.title,
        artist: req.body.artist,
        audio: fileData.url,
        mood: req.body.mood
    });
    console.log(fileData);
    res.status(201).send({ message: 'Song created successfully',
        song: req.body
     });
})

router.get('/songs', async (req, res) => {
    const { mood } = req.query;
    const normalizedMood = mood?.trim().toLowerCase();
    const songs = await songModel.find({
        mood:normalizedMood
    });
    res.status(200).json({
        message: 'Songs fetched successfully',
        songs: songs
    });
})
module.exports = router;