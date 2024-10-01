const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();
const validator = require("validator");
const nodemailer = require("nodemailer");
const authmodel = require("../../model/user/userModel");
const { ObjectId } = require("mongodb");



const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = {
  registerGet: (req, res) => {
    if (req.session.user) {
      return res.redirect("user/home");
    }
    const errorMessage = req.query.error || null;

    res.render("./user/signUp", { error: errorMessage });
  },
  registerPost: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Check if all required fields are provided
      if (!name || !email || !password) {
        return res.redirect("/user/register?error=All fields are required.");
      }

      // Validate password strength
      if (!validator.isStrongPassword(password)) {
        return res.redirect(
          "/user/register?error=Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a symbol."
        );
      }

      // Check if the user already exists
      const existingUser = await authmodel.findOne({ email });
      if (existingUser) {
        console.log("User already exists:", existingUser);
        return res.redirect("/user/register?error=User already exists.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`,
      };

      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).send("Internal Server Error");
        } else {
          console.log("Email sent: " + info.response);

          req.session.tempUser = { name, email, password: hashedPassword, otp };
          return res.render("./user/verify-otp", { error: null });
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  },
  verifyOtpPost: async (req, res) => {
    if (req.session.editTempUser) {
      const { otp1, otp2, otp3, otp4, otp5, otp6 } = req.body;
      const otp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;

      if (req.session.editTempUser.otp === otp) {
        const { name, email } = req.session.editTempUser;
        try {
          await authmodel.updateOne(
            { email: req.session.user.email },
            { $set: { name: name, email: email } }
          );
          req.session.user = { name: name, email: email };
          delete req.session.editTempUser;
          return res.redirect("/user/home");
        } catch (error) {
          console.error("Error updating user:", error);
          res.status(500).send("Internal Server Error");
        }
      } else {
        return res.render("./user/verify-otp", { error: "Invalid otp" });
      }
    }
    try {
      const { otp1, otp2, otp3, otp4, otp5, otp6 } = req.body;
      const otp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;

      if (req.session.tempUser && req.session.tempUser.otp === otp) {
        const { name, email, password } = req.session.tempUser;
        const newUser = new authmodel({ name, email, password });

        await newUser.save();

        req.session.user = newUser;
        delete req.session.tempUser;

        res.redirect("/user/home");
      } else {
        console.log("Invalid OTP");
        res.redirect("/user/otp");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
  resendOtpGet: async (req, res) => {
    if (req.session.user) {
      return res.redirect("/home");
    }
    try {
      if (!req.session.tempUser) {
        return res.redirect("/user/register");
      }

      const { email } = req.session.tempUser;

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`,
      };

      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).send("Internal Server Error");
        } else {
          console.log("Email sent: " + info.response);

          req.session.tempUser.otp = otp;

          res.render("./user/verify-otp", {
            message: "A new OTP has been sent to your email.",
          });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
  loginGet: (req, res) => {
    if (req.session.user) {
      return res.redirect("/user/myAccount");
    }
    const errorMessage = req.session.error_message;
    req.session.error_message = null;
    res.render("./user/login", { errorMessage });
  },
  loginPost: async (req, res) => {
    
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        req.session.error_message = "Email and password are required.";
        return res.redirect("/user/login");
      }

      const user = await authmodel.findOne({ email });
      if (!user) {
        req.session.error_message = "User doesn't exist.";
        console.log("User doesn't exist.");
        return res.redirect("/user/login");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        req.session.error_message = "Invalid password.";
        return res.redirect("/user/login");
      }

      req.session.user = user;
      if (user.usertype === "admin") {
        req.session.isAdmin = true;
        return res.redirect("/dashboard");
      }
      if(req.session.prepage){
        const rout = req.session.prepage
        delete req.session.prepage
        return res.redirect(rout) 
      }
      res.redirect("/user/home");
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).send("Internal Server Error");
    }
  },
  forgetPassword: (req, res) => {
    res.render("./user/emailForm", { errorMessage: "" });
  },
  postForgetPassword: async (req, res) => {
    const { email } = req.body;
    const user = await authmodel.findOne({ email });

    if (!user) {
      return res.render("./user/emailForm", {
        errorMessage: "User does not exist",
      });
    }
    if (!req.session.passwordReset) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`,
      };

      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).send("Internal Server Error");
        } else {
          console.log("Email sent: " + info.response);
          req.session.tuser = user;
          req.session.passwordReset = { otp };
          res.redirect("/user/reset");
        }
      });
    }
  },
  resetPassword: (req, res) => {
    if (!req.session.passwordReset) {
      res.redirect("/user/forget");
    }
    res.render("./user/resetPassword", { errorMessage: "" });
  },
  postResetPassword: async (req, res) => {
    const { otp, new_password, confirm_password } = req.body;

    const passwordStrengthRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!req.session.passwordReset || otp !== req.session.passwordReset.otp) {
      return res.render("./user/resetPassword", {
        errorMessage: "Invalid OTP. Please try again.",
      });
    }

    if (new_password !== confirm_password) {
      return res.render("./user/resetPassword", {
        errorMessage: "Passwords do not match. Please re-enter your password.",
      });
    }

    if (!passwordStrengthRegex.test(new_password)) {
      return res.render("./user/resetPassword", {
        errorMessage:
          "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(new_password, 10);
      const result = await authmodel.updateOne(
        { _id: req.session.tuser._id },
        { $set: { password: hashedPassword } },
        { new: true }
      );

      delete req.session.tuser;
      delete req.session.passwordReset;

      res.redirect("/user/login");
    } catch (error) {
      console.error(error);
      res.render("./user/resetPassword", {
        errorMessage:
          "An error occurred while resetting your password. Please try again.",
      });
    }
  },
  myAccount: async (req, res) => {
    if (req.session.user) {
      const user = await authmodel.findOne({ email: req.session.user.email });
      return res.render("./user/userAccount", { user });
    }
    res.redirect("/user/login");
  },
  postMyAccount: async (req, res) => {
    const { name, email } = req.body;
    if (req.session.user.email === email && req.session.user.name === name) {
      res.redirect("/user/home");
    }
    if (req.session.user.email == email && req.session.user.name !== name) {
      await authmodel.updateOne({ email: email }, { $set: { name: name } });
      req.session.user.name = name;
      res.redirect("/user/myAccount");
    }
    if (req.session.user.email !== email) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`,
      };

      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).send("Internal Server Error");
        } else {
          console.log("Email sent: " + info.response);
          req.session.editTempUser = { email: email, name: name, otp: otp };
          res.render("./user/verify-otp", { error: null });
        }
      });
    }
  },
  logOut: (req, res) => {
    req.session.destroy();
    res.redirect("/user/home");
  },
};
