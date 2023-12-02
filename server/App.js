const express = require('express');
const router = express.Router();

//All Import_______________________________________________
const Auth = require('./Components/Authentication');
const AddRsources = require('./Components/AddResources');
const InventoryResources = require('./Components/InventoryResources');
const YearTopThesis = require('./Components/YearTopThesis')
const AdminAccount = require('./Components/AdminAccount');


router.use('/', Auth);
router.use('/', AddRsources);
router.use('/', InventoryResources);
router.use('/', YearTopThesis)
router.use('/', AdminAccount);

module.exports = router;