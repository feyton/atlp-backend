//This is where all business logic is handled
//Equivalent to middleware. Create functions that process request here
//Remember to import all in routes

import * as models from "./models.js";
const User = models.userModel;

const loginView = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json({ message: "Bad request" });
    }
    const user = await User.findOne({ email: email }).exec();
    !user && res.status(400).json({ message: "Wrong credentials" });
    const validatePassword = user.isValidPassword(password);
    !validatePassword && res.status(400).json({ message: "wrong credentials" });
    let userInfo = {
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName,
      roles: user.roles,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      _id: user._id,
    };
    return res.status(200).json({ data: userInfo });
    //    return res.json({ message: "Login" });
  } catch (err) {
    console.log(err);
  }
};

const createUserView = async (req, res) => {
  try {
    let { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(403).json({ message: "Bad request" });
    }
    const duplicateEmail = await User.findOne({ email: email }).exec();
    if (duplicateEmail) {
      return res.status(403).json({ message: "Email taken" });
    }
    const result = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });
    res.status(201).json({ message: "created", data: result });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: err.message });
  }
};

const updateUserView = async (req, res)=>{
    return res.status(200).json({message:'user'})
}
//add your function to export
export { loginView, createUserView, updateUserView };
