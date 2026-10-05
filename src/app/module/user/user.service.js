const User = require("./user.model");
const bcrypt = require("bcrypt");

const isBcryptHash = (value) =>
  typeof value === "string" && /^\$2[aby]\$/.test(value);

const sanitizeUser = (user) => {
  if (!user) {
    return user;
  }
  const obj =
    typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.hashPassword;
  return obj;
};

const sanitizeUsers = (users) => {
  if (!Array.isArray(users)) {
    return users;
  }
  return users.map(sanitizeUser);
};

const verifyUserPassword = async (plainPassword, user) => {
  if (!plainPassword || !user) {
    return false;
  }
  const candidates = [...new Set([user.hashPassword, user.password].filter(Boolean))];
  for (const stored of candidates) {
    if (isBcryptHash(stored)) {
      const matched = await bcrypt.compare(plainPassword, stored);
      if (matched) {
        return true;
      }
    } else if (stored === plainPassword) {
      return true;
    }
  }
  return false;
};

const hashPasswordValue = async (plainPassword) => {
  return bcrypt.hash(plainPassword, 10);
};

const createUserToDB = async (payload) => {
  try {
    const existingUserRole = await User.findOne({ username: payload.username });
    if (existingUserRole) {
      throw new Error("User roll with the same name already exists");
    }
    const plainPassword = payload.hashPassword || payload.password;
    if (!plainPassword) {
      throw new Error("Password is required");
    }
    const hashedPassword = await hashPasswordValue(plainPassword);
    payload.hashPassword = hashedPassword;
    payload.password = hashedPassword;
    const user = await User.create(payload);
    return sanitizeUser(user);
  } catch (error) {
    console.error("Error saving data to MongoDB:", error);
    throw error;
  }
};

const getUserDB = async () => {
  try {
    const user = await User.find().select({
      password: 0,
      hashPassword: 0,
      __v: 0,
    });
    return sanitizeUsers(user);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const getCurrentUserDB = async (loginUser) => {
  try {
    if (!loginUser) {
      return null;
    }
    const query = loginUser.userId
      ? { _id: loginUser.userId }
      : { username: loginUser.username };
    const user = await User.findOne(query);
    if (!user) {
      return null;
    }
    return sanitizeUser(user);
  } catch (error) {
    throw new Error("Internal server error from service");
  }
};

const getUserByIdDB = async (id) => {
  try {
    const user = await User.findById(id).select({
      password: 0,
      hashPassword: 0,
      __v: 0,
    });
    if (!user) {
      throw new Error("User not found");
    }
    return sanitizeUser(user);
  } catch (error) {
    throw new Error("Internal server error from service");
  }
};

const updateUserDB = async (id, isactive) => {
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isactive: isactive },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    return sanitizeUser(user);
  } catch (error) {
    throw new Error("Internal server error");
  }
};
const updateUserInformationDB = async (id, data) => {
  try {
    const { password, hashPassword, ...safeData } = data || {};
    const user = await User.findByIdAndUpdate(
      id,
      { $set: safeData },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    return sanitizeUser(user);
  } catch (error) {
    throw new Error("Internal server error");
  }
};

const updateUserPasswordDB = async (id, password) => {
  const hashedPassword = await hashPasswordValue(password);
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword, hashPassword: hashedPassword },
      { new: true, runValidators: true }
    );
    if (!user) {
      throw new Error("User not found");
    }

    return sanitizeUser(user);
  } catch (error) {
    console.error("Error in updateUserPasswordDB:", error.message, error.stack);
    throw error;
  }
};

const updateUserMultipleStatusDB = async (dataToUpdate) => {
  try {
    const promises = dataToUpdate?.map(async (user) => {
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { isactive: user.isactive },
        { new: true }
      );
      return sanitizeUser(updatedUser);
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
    const {
      _id,
      firstname,
      lastname,
      mobileNo,
      username,
      isactive,
      roleId,
      menulist,
    } = dataToUpdate;

    const updateData = {
      firstname,
      lastname,
      mobileNo,
      username,
      isactive,
      roleId,
      menulist,
      updatedAt: Date.now(),
    };
    const updatedUser = await User.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    return sanitizeUser(updatedUser);
  } catch (error) {
    console.error("Error updating multiple users:", error);
    throw new Error("Failed to update multiple data");
  }
};

const deleteUserDB = async (id) => {
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new Error("User not found");
    }
    return sanitizeUser(deletedUser);
  } catch (error) {
    throw new Error("Internal server error");
  }
};

module.exports = {
  sanitizeUser,
  sanitizeUsers,
  verifyUserPassword,
  createUserToDB,
  getUserDB,
  getCurrentUserDB,
  getUserByIdDB,
  updateUserDB,
  updateUserMultipleStatusDB,
  updateUserMultipleDataDB,
  deleteUserDB,
  updateUserPasswordDB,
  updateUserInformationDB,
};
