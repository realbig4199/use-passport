// 익스프레스 앱 생성
const express = require("express");
const app = express();

// passport 모듈 가져오기 및 관련 설정
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

// 유저 모델 가져오기
const User = require("./models/users.model");

// mongoose 모듈 가져오기
const mongoose = require("mongoose");

// 미들웨어 설정
app.use(express.json()); // JSON 데이터 파싱
app.use(express.urlencoded({ extended: false })); // URL 인코딩된 데이터 파싱 (복잡한 객체를 파싱할 때는 extended: true)

// 뷰 엔진 설정
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// mongoose 설정
mongoose
  .connect(`mongodb+srv://jintae:0419@cluster0.m7hjdgr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => {
    console.log("MongoDB 연결 성공");
  })
  .catch((err) => {
    console.log(err);
  });

// static 파일 제공
app.use("/static", express.static(path.join(__dirname, "public")));

// api 설정
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.json({ msg: info });
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }

      res.redirect("/");
    });
  });
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  // user 객체를 생성
  const user = new User(req.body);
  try {
    // user 컬렉션에 유저를 저장
    await user.save();
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
  }
});

// 포트 설정 및 서버 실행
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`${PORT}에서 서버 실행 중`);
});
