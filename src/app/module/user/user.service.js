const User = require("./user.model");

const createUserToDB = async (payload) => {
  console.log(payload);
  try {
    const existingUserRole = await User.findOne({ username: payload.username });
    if (existingUserRole) {
      throw new Error("User roll with the same name already exists");
    }
    const user = await User.create(payload);
    return user;
  } catch (error) {
    console.error("Error saving data to MongoDB:", error);
    throw error; // Throw the error to be handled by the caller
  }
};

const getUserDB = async () => {
  try {
    const user = await User.find().select({
      __v: 0,
    });
    return user;
  } catch (error) {
    // Handle errors
    console.error("Error fetching users:", error);
  }
};

const getUserByIdDB = async (id) => {
  console.log(id);
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("Internal server error from service");
  }
};

const updateUserDB = async (id, isactive) => {
  console.log('isactive',isactive)
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isactive: isactive },
      { new: true }
    );
    console.log(user, "service");
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error("Internal server error");
  }
};

const updateUserPasswordDB = async (id, password) => {
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { password: password },
      { new: true }
    );
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error("Internal server error");
  }
};

const updateUserMultipleStatusDB = async (dataToUpdate) => {
  try {
    const promises = dataToUpdate?.map(async (user) => {
      // Update isactive field for each user
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { isactive: user.isactive },
        { new: true }
      );
      return updatedUser;
    });
    const updatedUsers = await Promise.all(promises);
    return updatedUsers;
  } catch (error) {
    console.error("Error updating multiple users:", error);
    throw new Error("Failed to update multiple data");
  }
};

const updateUserMultipleDataDB = async (dataToUpdate) => {
  try {
    // Destructure the dataToUpdate object to extract individual fields
    const {
      _id,
      firstname,
      lastname,
      mobileNo,
      username,
      password,
      isactive,
      roleId,
      menulist,
    } = dataToUpdate;

    // Construct the update object
    const updateData = {
      firstname,
      lastname,
      mobileNo,
      username,
      password,
      isactive,
      roleId,
      menulist,
      updatedAt: Date.now(),
    };
    console.log(updateData)
    // Update the user
    const updatedUser = await User.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating multiple users:", error);
    throw new Error("Failed to update multiple data");
  }
};

const deleteUserDB = async (id) => {
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    console.log(deletedUser, "delete");
    if (!deletedUser) {
      throw new Error("User not found");
    }
    return deletedUser;
  } catch (error) {
    throw new Error("Internal server error");
  }
};

module.exports = {
  createUserToDB,
  getUserDB,
  getUserByIdDB,
  updateUserDB,
  updateUserMultipleStatusDB,
  updateUserMultipleDataDB,
  deleteUserDB,
  updateUserPasswordDB
};
