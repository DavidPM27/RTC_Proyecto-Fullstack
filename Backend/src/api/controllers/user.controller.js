const User = require('../models/user.model')
const Plant = require('../models/plant.model')
const bcrypt = require('bcrypt')
const { generateToken } = require('../../utils/token');
const { deleteImgCloudinary } = require('../../utils/cloudinary');

// Get all users (for admin use)
async function getAllUsers(req, res, _) {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json("Error fetching users");
  }
}

// Register a new user
async function registerUser(req, res, _) {
  try {
    const user = new User(req.body);

    if(req.file) {
      user.image = req.file.path;
    }

    const userExist = await User.findOne({ email: user.email });
    if (userExist) {
        return res.status(400).json("Error: User already exists");
    }

    const userDB = await user.save();
    return res.status(201).json(userDB);
  } catch (error) {
    return res.status(400).json("Error registering user");
  }
}

// Login user
async function loginUser(req, res, _) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json("Error: Incorrect username or password");
    }
    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = generateToken(user._id, user.email, user.role);
      return res.status(200).json(token);
    } else {
      return res.status(400).json("Error: Incorrect username or password"); 
    }
  } catch (error) {
    return res.status(400).json("Error logging in user");
  }
}

// Delete a user
async function deleteUser(req, res, _) {
  try {
    const { id } = req.params;
    // Require authenticated requester (middleware `auth` should set req.user)
    const requester = req.user;
    if (!requester) {
      return res.status(401).json("Unauthorized");
    }

    // If requester is not admin, they may only delete their own account
    if (requester.role !== 'admin' && requester._id.toString() !== id) {
      return res.status(403).json("Forbidden: cannot delete this user");
    }

    const userDeleted = await User.findByIdAndDelete(id);
    if (!userDeleted) {
      return res.status(404).json("User not found");
    }

    if (userDeleted.image) {
      deleteImgCloudinary(userDeleted.image);
    }

    return res.status(200).json({
      message: "User deleted successfully",
      user: userDeleted
    });
  } catch (error) {
    return res.status(400).json("Error deleting user");
  }
}

// Update user
async function updateUser(req, res, _) {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json("Error: User not found");
    }

    // If updating password, hash it
    if (updateData.password) {
      updateData.password = bcrypt.hashSync(updateData.password, 10);
    }

    // If updating the role, ensure only admin can do it or requester is the same user
    if (updateData.role) {
      const requester = req.user;
      if (requester.role !== 'admin' && requester._id.toString() !== id) {
        return res.status(403).json("Forbidden: cannot change role");
      }
    }

    const userUpdated = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select('-password');
    return res.status(200).json(userUpdated);
  } catch (error) {
    return res.status(400).json("Error updating user");
  }
}

// Change role of a user
async function changeUserRole(req, res, _) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const userUpdated = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');
    return res.status(200).json(userUpdated);
  } catch (error) {
    return res.status(400).json("Error changing user role");
  }
}

// Get user
async function getUser(req, res, _) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json("User not found");
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json("Error getting user");
  }
} 

// Reset password (no email verification)
async function resetPassword(req, res, _) {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json("Email and new password are required");
    }

    if (newPassword.length < 6) {
      return res.status(400).json("Password requires at least 6 characters");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json("No account found with that email");
    }

    user.password = newPassword; // pre-save hook will hash it
    await user.save();

    return res.status(200).json("Password reset successfully");
  } catch (error) {
    return res.status(400).json("Error resetting password");
  }
}

// Get the authenticated user's garden (plants with full details)
async function getUserGarden(req, res, _) {
  try {
    const user = await User.findById(req.user._id).populate('plants.plant');
    if (!user) return res.status(404).json("User not found");
    return res.status(200).json(user.plants);
  } catch (error) {
    return res.status(400).json("Error fetching user garden");
  }
}

// Remove a plant entry from user's garden
async function removeUserPlant(req, res, _) {
  try {
    const { entryId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { plants: { _id: entryId } } },
      { new: true }
    );
    if (!user) return res.status(404).json("User not found");
    return res.status(200).json({ message: "Plant removed from garden" });
  } catch (error) {
    return res.status(400).json("Error removing plant from garden");
  }
}

// Update lastWatered for a plant entry in user's garden
async function waterUserPlant(req, res, _) {
  try {
    const { entryId } = req.params;
    const user = await User.findOneAndUpdate(
      { _id: req.user._id, 'plants._id': entryId },
      { $set: { 'plants.$.lastWatered': new Date() } },
      { new: true }
    );
    if (!user) return res.status(404).json("Plant entry not found");
    return res.status(200).json({ message: "Plant watered successfully" });
  } catch (error) {
    return res.status(400).json("Error watering plant");
  }
}

// Create a custom plant and add it to user's garden
async function addCustomPlantToGarden(req, res, _) {
  try {
    const { common_name, scientific_name, wateringFrequency, default_image } = req.body;
    if (!common_name) return res.status(400).json("Plant name is required");

    const plant = new Plant({
      common_name,
      scientific_name: scientific_name || common_name,
      family: "Custom",
      genus: "Custom",
      species: scientific_name || common_name,
      default_image: req.file?.path || default_image || '',
      watering_general_benchmark: { value: String(wateringFrequency || 7) },
    });
    const savedPlant = await plant.save();

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { plants: { plant: savedPlant._id, lastWatered: new Date() } } },
      { new: true }
    );
    if (!user) return res.status(404).json("User not found");

    return res.status(201).json(savedPlant);
  } catch (error) {
    return res.status(400).json("Error adding custom plant to garden");
  }
}

module.exports = { getAllUsers, registerUser, loginUser, deleteUser, updateUser, changeUserRole, getUser, resetPassword, getUserGarden, removeUserPlant, waterUserPlant, addCustomPlantToGarden }