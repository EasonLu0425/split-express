const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const passportJWT = require("passport-jwt");
const { User } = require("../models");

// set up Passport strategy

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    // customize user field
    {
      usernameField: "account",
      passwordField: "password",
      passReqToCallback: false,
    },
    // authenticate user
    (account, password, cb) => {
      User.findOne({ where: { account } }).then((user) => {
        if (!user)
          return cb(null, false, {
            message: "帳號或密碼錯誤!",
          });
        bcrypt.compare(password, user.password).then((res) => {
          if (!res)
            return cb(null, false, {
              message: "帳號或密碼錯誤!",
            });
          return cb(null, user.toJSON());
        });
      });
    }
  )
);

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
passport.use(
  new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
    User.findByPk(jwtPayload.id, {
    })
      .then((user) => cb(null, user))
      .catch((err) => cb(err));
  })
);

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});
passport.deserializeUser((id, cb) => {
  User.findByPk(id).then((user) => {
    return cb(null, user);
  });
});


module.exports = passport;
