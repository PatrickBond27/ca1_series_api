const Serie = require('../models/serie.model');
const fs = require('fs');

const readData = (req, res) => {

    Serie.find()
    .then((data) => {
        console.log(data);

        if(data.length > 0) {
            res.status(200).json(data);
        }
        else {
            res.status(404).json('None found');
        }
    })
    .catch(err => {
        console.log(err);
        // res.status(500).json(err);
    });

    // res.status(200).json({
    //     "msg": "All series retrieved"
    // });
};

const readOne = (req, res) => {
    let id = req.params.id;

    Serie.findById(id)
    .then((data) => {

        if(!data) {
            res.status(404).json({ msg: `Serie ${id} not found!`});
        }

        res.status(200).json(data);

    })
    .catch((err) => {
        console.error(err);
        if(err.name === 'CastError') {
            res.status(404).json({ msg: `Serie ${id} not found!`});
        } else {
            res.status(500).json(err);
        }
    });

    // connect to db and retrieve serie with :id

    // res.status(200).json({
    //     "msg": `You retrieved serie with ID: ${id}`
    // });
};

const createData = (req, res) => {

    console.log(req.body);
    let inputData = req.body;

    Serie.create(inputData)
    .then(data => {
        console.log(`New Serie Created`, data);
        res.status(201).json(data);
    })
    .catch(err => {
        if (err.name === "ValidationError") {
            res.status(422).json(err);
        }
        else {
            console.error(err);
            res.status(500).json(err);
        }
    });

    // check data is valid, 
    // connect to db and check email exists, if yes respond with error
    // if serie info is missing, respond with error

    // if(data.password.length < 6) {
    //     res.status(422).json({
    //         "msg": "serie password must be over 6 characters"
    //     });
    // } 
    // else {
    //     res.status(200).json({
    //         "msg": "All good",
    //         "data": data
    //     })
    // }

    // res.status(200).json({
    //     "msg": "All good"
    // });
};

const updateData = (req, res) => {

    let id = req.params.id;
    let data = req.body;

    Serie.findByIdAndUpdate(id, data, {
        new: false,
    })
    .then(newData => {
        res.status(201).json(newData);
    })
    .catch(err => {
        if(err.name === 'ValidationError'){
            res.status(422).json(err);
        }
        else if(err.name === 'CastError'){
            res.status(404).json({ msg: `Serie ${id} not found!`});
        }
        else {
            console.error(err);
            res.status(500).json(err);
        }
    });

    // connect to db and check if serie exists,
    // check data is valid, if yes update serie with :id

    // data.id = id;

    // res.status(200).json({
    //     "msg": `You updated the serie with ID: ${id}`,
    //     "data": data
    // });
};

const deleteData = (req, res) => {

    let id = req.params.id;
    let imagePath = '';

    Serie.findByIdAndDelete({
        _id: id
      })
    .then(data => {
        console.log('data', data);
        if(data) {
            imagePath = data.image_path; // Storing image path before deletion
            return data.deleteOne(); // Deleting data entry
        } else {
            res.status(404).json({msg: `Serie ${id} not found`});
        }
    })
    .then(() => {
        deleteImg(imagePath); // Deleting associated image file
        res.status(200).json({ msg: `Serie ${id} deleted!` });
    })
    .catch(err => {
        if (err.name === "CastError") {
            res.status(404).json({msg: `Serie ${id} not found`});
        }
        else {
            console.error(err);
            res.status(500).json(err);
        }
    });

    // connect to db and check if serie exists, if yes delete serie with :id

    // res.status(200).json({
    //     "msg": `You deleted the serie with ID: ${id}`
    // });
};

module.exports = {
    readData,
    readOne,
    createData,
    updateData,
    deleteData
};