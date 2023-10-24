const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;

const jwtSettings = require('../constants/jwtSetting');
const { Employee } = require('../models');

//check token have to accept
const passportVerifyToken = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
        secretOrKey: jwtSettings.SECRET,
    },
    async (payload, done) => {
        try {
            const user = await Employee.findOne({
                _id: payload._id,
                isDeleted: false,
            }).select('-password');

            if(!user){
                return done(null, false);
            }

            return done(null, user);
        } catch (error) {
            done(error, false);
        }
    },
);

//check account
const passportVerifyAccount = new LocalStrategy(
    {
        usernameField: 'email',
    },
    async(email, password, done) => {
        try {
            const user = await Employee.findOne({
                isDeleted: false,
                email,
            });

            if(!user) return done(null, false);

            // transmit field password from front end to method isValidPass
            const isCorrectPass = await user.isValidPass(password);

            user.password = undefined;

            if(!isCorrectPass) return done(null, false);

            return done(null, user);
        } catch (error) {
            done(error, false);
        }
    },
);

//check account basic login - have to create token with infomation less
const passportConfigBasic = new BasicStrategy(async (email, password, done) => {
        try {
            const user = await Employee.findOne({
                email: email,
                isDeleted: false,
            });

            if(!user) return done(null, false);

            const isCorrectPass = await user.isValidPass(password);

            if(!isCorrectPass) return done(null, false);

            return done(null, user);
        } catch (error) {
            done(error, false);
        }
    }
);
module.exports = {
    passportVerifyToken,
    passportVerifyAccount,
    passportConfigBasic,
};