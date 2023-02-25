const express = require('express');
const cardRouter = express.Router(); 
const Library = require('../public/tarot-images.json')


cardRouter.get("/:id/", async (req, res) => {
    try {
        //send card
        res.send(Library.cards[req.params.id])
    } catch (error) {
        //send error
        res.status(400).json(error)
    }
})

    

module.exports=cardRouter