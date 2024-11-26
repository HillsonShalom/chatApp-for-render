import bcrypt from "bcrypt";
import registerDTO from "../DTO/registerDTO";
import loginDTO from "../DTO/loginDTO";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model";
import { Token } from "../Tokem.model";
import { Types } from "mongoose";

export const registerUser = async (
  newUser: registerDTO
): Promise<Types.ObjectId> => {
  try {
    newUser.password = await bcrypt.hash(newUser.password, 10);
    const { name, password, phone_number } = newUser;
    const dbUser = new userModel({
      name,
      password,
      phone_number,
    });
    await dbUser.save();
    return dbUser._id as Types.ObjectId;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (userDetails: loginDTO): Promise<string> => {
  try {
    const user = await userModel.findOne({ name: userDetails.name });
    if (!user) throw new Error("User not found");

    if (!(await bcrypt.compare(userDetails.password, user.password))) {
      throw new Error("Wrong password!");
    }

    const token = jwt.sign({ user: user._id }, process.env.SECRET_KEY!, {
      expiresIn: "10h",
    });
    return `Bearer ${token}`;
  } catch (error) {
    throw error;
  }
};
