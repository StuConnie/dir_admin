const express = require('express');
const router = express.Router();
const resource_column = require('../../databases/resources_column');
const resourceF = resource_column();
const searchTitle_column = require('../../databases/searchTitle_column');
const searchTitleF = searchTitle_column();

router.post('/uploadResources', async (req, res) => {
    const { file, title, overview, member, year, yearFilter, course, enableComment } = req.body.IData;
    const { publicId, secureURI } = req.body;

    let date = new Date;
    let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    await new resourceF({
        title: title,
        overview: overview,
        member: member,
        year: year,
        yearFilter: yearFilter,
        course: course,
        documentURI: secureURI,
        documentID: publicId,
        enableComment: enableComment,
        dateUploaded: `${ month[date.getMonth()] } ${ date.getDate() }, ${ date.getFullYear() }`,
        selectedTop: 'new',
        deleteNot: 'new',
        titleFirstLetter: title[0].toUpperCase(),
        allRate: 0,
        star1: 0,
        star2: 0,
        star3: 0,
        star4: 0,
        star5: 0,
    }).save().then(async (data) => {
        await new searchTitleF({
            title: title,
            id_document: data._id
        }).save();

        res.json({response: 'success'});
    });
});


module.exports = router;