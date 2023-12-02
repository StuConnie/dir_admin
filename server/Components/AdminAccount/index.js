const express = require('express');
const router = express.Router();
const adminAccount_column = require('../../databases/adminAccount_column');
const column_adminAccount = adminAccount_column();



router.get('/loginAcc', async (req, res) => {
    const { username, password } = req.query;

    try{
        const data = await column_adminAccount.find({ username: username, password: password });

        res.json({ success: data.length == 1 });
    }catch(e){
        res.json({ success: false });
    }
});

router.post('/getAccount', async (req, res) => {

    try{
        const data = await column_adminAccount.findOne({ username: 'VMSC' });
        
        res.json({ success: true, data: data });
    }catch(e){
        res.json({ success: false });
    }

});


router.post('/updateAccount', async (req, res) => {
    const { password } = req.body;

    try{
        await column_adminAccount.updateOne({ username: 'VMSC' }, { $set: { password: password } });

        const data = await column_adminAccount.findOne({ username: 'VMSC' });
        res.json({ success: true, data: data });
    }catch(e){
        console.log(e);
        res.json({ success: false });
    }
});


module.exports = router;