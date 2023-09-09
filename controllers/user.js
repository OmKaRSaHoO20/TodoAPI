import jwt from "jsonwebtoken";
import User from "../models/user.js";

function generateJWTToken(password) {
  // Define the payload containing the user ID
  const payload = { password };

  // Sign the JWT token with a secret key and set an expiration time of 30 days
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1d" });

  return token;
}

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // Invalid request if params are empty
  if (!password || !email) {
    return res.status(400).json({ message: "Invalid request" });
  }

  let user; // Declare the user variable here

  try {
    // Check if the user exists in the database
    user = await User.findOne({ email });
    if (!user) {
      // Create a new user if not found
      const token = generateJWTToken(password);
      user = new User({ email, password });
      await user.save();
      return res.status(201).json({ message: "ID token created", user, token });
    } else {
      const token = generateJWTToken(password);

      return res
        .status(201)
        .json({ message: "ID token verified", user, token });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "An error occurred" });
  }
};
