const mongoose = require("mongoose");

// 데이터 스키마 정의
const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    minLength: 5,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // sparse : 해당 필드에 값이 있을 때만 고유성을 적용
  },
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // 원래는 bcrypt를 사용하여 비밀번호를 암호화하고 비교해야 함
  // plain password는 클라이언트가 입력한 비밀번호
  // this.password는 데이터베이스에 저장된 비밀번호
  if (plainPassword === this.password) {
    cb(null, true);
  } else {
    cb(null, false);
  }
  return cb({ error: "error" });
};

// 모델 생성
const User = mongoose.model("User", userSchema);

module.exports = User;
