const express = require('express');
const router = express.Router();

const resources_column = require('../../databases/resources_column');
const column_resources = resources_column();


//Get year top thesis and others______________________________________________
router.get('/getYearTop_thesis', async (req, res)  => {
    try{
        const top3 = await column_resources.find({ selectedTop: 'top3' });
        const othersTop = await column_resources.find({ selectedTop: 'others' });

        res.json({ response: true, top3: top3, othersTop: othersTop });
    }catch(error){
        console.log(error);
        res.json({ response: false });
    }
});


//Add from year top thesis and others_____________________________________________________________
router.post('/AddYearTop', async (req, res) => {
    const { _id, typeOfOtherYear } = req.body;
    try{
        column_resources.updateOne({
            _id: _id
         }, {$set: {  selectedTop: typeOfOtherYear } }).then((err, ress) => {
                res.json({ response: true });
            }
         );
    }catch(error){
        res.json({ response: false });
    }
});

//Remove from year top thesis and others_____________________________________________________________
router.post('/RemoveYearTop', async (req, res) => {
    const { _id } = req.body;
    try{
        column_resources.updateOne({
            _id: _id
         }, {$set: {  selectedTop: 'new' } }).then((err, ress) => {
                res.json({ response: true });
            }
         );
    }catch(error){
        res.json({ response: false });
    }
});


module.exports = router;