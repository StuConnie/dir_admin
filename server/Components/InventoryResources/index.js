const express = require('express');
const router = express.Router();
const resources_column = require('../../databases/resources_column');
const column_resources = resources_column();
const cloudinary = require('cloudinary');
const searchTitle_column = require('../../databases/searchTitle_column');
const searchTitleF = searchTitle_column();
const rate_column = require('../../databases/rate_column');
const column_rate = rate_column();

cloudinary.config({
    cloud_name: 'dutfzeatp',
    api_key: 916367643684954,
    api_secret: '_unAztN3J7l90QHlYMCcekmo8Ig'
});


//Get data of documents_______________________________________________________
router.get('/get_resources', async (req, res) => {
    const { course, search, year } = req.query;
    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);

    try{
        let data = '';
        let countAll = '';
        if(search.trim().length == 0 && year.trim().length == 0){
            //If search and year are empty only 'course' will find_______________________
            if(course !== 'ALL'){
                countAll = await column_resources.find({ course: course }).count();
                data = await column_resources.find({ course: course })
                .sort( { createdAt: 'descending' } ).skip(skip).limit(6);
            }else{
                countAll = await column_resources.find().count();
                data = await column_resources.find()
                .sort( { createdAt: 'descending' } ).skip(skip).limit(6);
            }
        }else if(year.trim().length > 0 && search.trim().length == 0){
            //If search is empty but year is not 'course with year' will find_______________________
            if(course !== 'ALL'){
                countAll = await column_resources.find({ course: course, yearFilter: year }).count()
                data = await column_resources.find({ course: course, yearFilter: year })
                .sort( { createdAt: 'descending' } ).skip(skip).limit(6);
            }else{
                countAll = await column_resources.find({ yearFilter: year }).count()
                data = await column_resources.find({ yearFilter: year })
                .sort( { createdAt: 'descending' } ).skip(skip).limit(6);
            }
        }else if(year.trim().length == 0 && search.trim().length > 0){
            //If year is empty but search is not 'course with search' will find_______________________
            if(course !== 'ALL'){
                countAll = await column_resources.aggregate([
                    { $search: {
                        index: 'search_document',
                        text: { query: search, path: 'title' }
                    }},
                    {
                        $match: {
                          $and: [
                            { course: course },
                          ]
                        }
                    },
                    { $count: "total" }
                ])

                data = await column_resources.aggregate([
                    { $search: {
                        index: 'search_document',
                        text: { query: search, path: 'title' }
                    }},
                    {
                        $match: {
                          $and: [
                            { course: course },
                          ]
                        }
                    },
                    { $sort: {
                        createdAt: -1
                    }},
                    { $skip: skip },
                    { $limit: 6 }
                ])
            }else{
                countAll = await column_resources.aggregate([
                    { $search: {
                        index: 'search_document',
                        text: { query: search, path: 'title' }
                    }},
                    { $count: "total" }
                ])


                data = await column_resources.aggregate([
                    { $search: {
                        index: 'search_document',
                        text: { query: search, path: 'title' }
                    }},
                    { $sort: {
                        createdAt: -1
                    }},
                    { $skip: skip },
                    { $limit: 6 }
                ])
            }
        }else{
            //If year and search is not empty 'course with year and search' will find_______________________
            if(course !== 'ALL'){
                countAll = await column_resources.aggregate([
                    { $search: {
                        index: 'search_document',
                        text: { query: search, path: 'title' }
                    }},
                    {
                        $match: {
                          $and: [
                            { 
                                course: course,
                                yearFilter: year
                            },
                          ]
                        }
                    },
                    { $count: "total" }
                ])

                data = await column_resources.aggregate([
                    { $search: {
                        index: 'search_document',
                        text: { query: search, path: 'title' }
                    }},
                    {
                        $match: {
                          $and: [
                            { 
                                course: course,
                                yearFilter: year
                            },
                          ]
                        }
                    },
                    { $sort: {
                        createdAt: -1
                    }},
                    { $skip: skip },
                    { $limit: 6 }
                ])

            }else{
                countAll = await column_resources.aggregate([
                    { $search: {
                        index: 'search_document',
                        text: { query: search, path: 'title' }
                    }},
                    {
                        $match: {
                          $and: [
                            { 
                                yearFilter: year
                            },
                          ]
                        }
                    },
                    { $count: "total" }
                ])

                data = await column_resources.aggregate([
                    { $search: {
                        index: 'search_document',
                        text: { query: search, path: 'title' }
                    }},
                    {
                        $match: {
                          $and: [
                            { 
                                yearFilter: year
                            },
                          ]
                        }
                    },
                    { $sort: {
                        createdAt: -1
                    }},
                    { $skip: skip },
                    { $limit: 6 }
                ])
            }
        }

        //Get count of topyear and other thesis______________________________________________
        const countTopYear = await column_resources.find({selectedTop: 'top3'});
        const countOtherThesis = await column_resources.find({selectedTop: 'others'});

        res.json({ success: true, data: data, countTopYear: countTopYear.length, countOtherThesis: countOtherThesis.length,
            countAll: typeof countAll === 'object' ? [...countAll].length > 0 ? [...countAll][0].total:0:countAll });
    }catch(error){
        res.json({ success: false });
    }
})


//Get the selected data by id__________________________________________________________________
router.post('/getSelected', async (req, res) => {
    try{
        const data = await column_resources.find({ _id: req.body._id });
        res.json({ response: data.length > 0, data: data });
    }catch(e){
        res.json({ response: false });
    }
});


//Update data by id____________________________________________________________________________
router.post('/updateSelected', async (req, res) => {
    const { _id, file, fileType, title, member, year, yearFilter, course, enableComment } = req.body.IData;
    const { publicId, secureURI, oldpublicId } = req.body;

    try{
        let obj = {
            title: title,
            overview: overview,
            member: member,
            year: year,
            yearFilter: yearFilter,
            course: course,
            enableComment: enableComment,
            titleFirstLetter: title[0].toUpperCase()
        };

        if(fileType === 'object') {
            obj['documentURI'] = secureURI;
            obj['documentID'] = publicId;

            //delete file from cloudinary____________________________
            await cloudinary.uploader.destroy(oldpublicId); 
        }

        column_resources.updateOne({
            _id: _id
         }, {$set: obj}).then((err, ress) => {
                searchTitleF.updateOne({
                    id_document: _id
                }, {$set: { title: title }}).then((err, resss) => {
                    res.json({response: 'success'});
                })
            }
         );
    }catch(error){
        res.json({response: 'false'});
    }
});




//Delete documents____________________________________________________________________
router.post('/delete_resources', async (req, res) => {
    try{
        const data = await column_resources.find({ _id: req.body._id });

        await cloudinary.uploader.destroy(data[0].documentID); //delete file to cloudinary___
        await column_resources.deleteOne({ _id: req.body._id }); //delete data to resouces_documents mongodb___
        await searchTitleF.deleteOne({ id_document: req.body._id }); //delete data to search_documents mongodb___
        await column_rate.deleteMany({ id_document: req.body._id }); //delete data to rate_documents mongodb___
        
        res.json({ response: true });
    }catch(err){
        res.json({ response: false });
    }
});



module.exports = router;

