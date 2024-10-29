const User = require("../../model/user/userModel");
module.exports = {
  getListUser: async (req, res) => {
    const users = await User.find();    
    res.render("./admin/userList", { users });
  },
  userBlock: async (req, res) => {
    try {
      const { userId, status } = req.body;
      
      
      const result = await User.findByIdAndUpdate(
        userId,
        {
          status: status === "active" ? "block" : "active",
        },
        { new: true }
      );

      if (result) {
        return res.status(200).json({
          message: "User status updated successfully",
          updatedStatus: result.status,
        });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      return res
        .status(500)
        .json({ message: "Server error while updating user status" });
    }
  },
  changeUserType: async (req, res) => {
    try {
      const { userId, usertype } = req.body;

      const result = await User.findByIdAndUpdate(
        userId,
        {
            usertype: usertype === "user" ? "admin" : "user",
        },
        { new: true }
      );

      if (result) {
        return res.status(200).json({
          message: "User status updated successfully",
          updatedStatus: result.status,
        });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      return res
        .status(500)
        .json({ message: "Server error while updating user status" });
    }
  },
};
