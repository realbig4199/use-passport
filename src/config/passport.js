const passport = require("passport");
const User = require("../models/users.model");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy({ usernameField: "email", passwordField: "password" }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
      if (err) return done(err);

      if (!user) {
        return done(null, false, { msg: "존재하지 않는 사용자입니다." });
      }

      user.comparePassword(password, (err, isMatch) => {
        if (err) return done(err);

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { msg: "비밀번호가 일치하지 않습니다." });
        }
      });
    });
  })
);
