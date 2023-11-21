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

    // console.log(req.file);
    console.log(req.body);
    let inputData = req.body;
    // if (req.file) {
    //     inputData.image_path = req.file.filename; // Setting image path if file is uploaded
    //   } else {
    //     return res.status(422).json({
    //       mgs: 'Image not uploaded',
    //     }); // Sending error if image is required but not uploaded
    //   }

    Serie.create(inputData)
    .then(data => {
        console.log(`New Serie Created`, data);
        res.status(201).json(data);
    })
    .catch(err => {
        if (err.name === "ValidationError") {
            // console.error('Validation Error!!', err);
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

    if (req.file) {
        body.image_path = req.file.filename; // Updating image path if file is uploaded
    }

    Serie.findByIdAndUpdate(id, data, {
        new: false,
    })
    .then(data => {
        deleteImage(data.image_path); // Deleting old image file
        if (data) {
            res.status(201).json(data); // Sending updated data if found
        } else {
        deleteImage(body.data.image_path); // Deleting new image file if no data found
        res.status(404).json({
          message: `Serie with id: ${id} not found`,
        }); // Sending message if no data found for update
      }
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

const deleteImage = (filename) => {
    let path = `/public/uploads/${filename}`;
  
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(err); // Logging errors if file doesn't exist
        return;
      }
      fs.unlink(path, (err) => {
        if (err) throw err; // Handling file deletion error
        console.log(`${filename} was deleted`); // Logging file deletion success
      });
    });
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
        deleteImage(imagePath); // Deleting associated image file
        res.status(200).json({ msg: `Serie ${id} deleted!` });
    })
    .catch(err => {
        if (err.name === "CastError") {
            res.status(404).json({msg: `Serie ${id} not found`});
        }
        else {
            console.error(err);
            // res.status(500).json(err);
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