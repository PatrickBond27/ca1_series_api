const express = require('express');
const router = express.Router();

const { loginRequired } = require('../controllers/user.controller');

const { readData, 
        readOne,
        createData,
        updateData,
        deleteData 
} = require('../controllers/director.controller');

router
    .get('/', readData)
    .get('/:id', readOne)
    .post('/', createData)
    .put('/:id', updateData)
    .delete('/:id', deleteData)

// router.get('/', (req, res) => {
//     res.send('get all users');
// });

module.exports = router;