const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = (req, res) => {

    let newUser = new User(req.body);
    newUser.password = bcrypt.hashSync(req.body.password, 10);

    // let err = newUser.validateSync();
    
    // if (err) {
    //     console.log(err);
    //     return res.status(500).json(err);
    // }

    newUser.save()
    .then(user => {
        user.password = undefined;
        return res.status(201).json({data: user});
    })
    .catch(err => {
        console.log(err);
        return res.status(400).json({msg: err});
    });

    // newUser.save((err, user) => {
    //     if(err) {
    //         return res.status(400).json({msg: err});
    //     }
    //     else {
    //         user.password = undefined;
    //         return res.status(201).json({data: user});
    //     }
    // });
};

const login = (req, res) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        // check if password match
        if(!user || !user.comparePassword(req.body.password)) {
            return res.status(401).json({ msg: 'Authentication failed. Invalid user or password' });
        }

        let token = jwt.sign({
            email: user.email,
            full_name: user.full_name,
            _id: user._id
        }, process.env.JWT_SECRET);

        return res.status(200).json({token});
    })
    .catch(err => {
        console.log(err);
        return res.status(400).json({msg: err});
    });
};

const loginRequired = (req, res, next) => {
    if (req.user) {
        next();
    }
    else {
        return res.status(401).json({msg: 'Unauthorized User!'});
    }
}

const profile = (req, res) => {
    
};

const readOne = (req, res) => {

};

const readData = (req, res) => {

};

module.exports = {
    register,
    login,
    profile,
    loginRequired
};