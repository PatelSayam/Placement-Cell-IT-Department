import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"

const adminSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
  role: {
    type: String,
    default: 'admin'
  }
});


adminSchema.pre("save",async function (next) {
  if(!this.isModified("password")){
      return next()
  }
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

adminSchema.methods.isPasswordCorrect = async function(password){
 return await bcrypt.compare(password,this.password)
}

adminSchema.methods.generateAccessToken = function(){
  return jwt.sign({
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
  }
)
}
adminSchema.methods.generateRefreshToken = function(){
  return jwt.sign({
      _id: this._id,
  },
  process.env.REFRESH_TOKEN_SECRET,
  {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
  }
)
}


export const Admin = mongoose.model('Admin', adminSchema);

