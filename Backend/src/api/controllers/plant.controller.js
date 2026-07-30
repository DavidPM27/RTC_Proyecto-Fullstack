const Plant = require("../models/plant.model");
const User = require("../models/user.model");
const { deleteImgCloudinary } = require("../../utils/cloudinary");

const getAllPlants = async (req, res) => {
    try {
        const plants = await Plant.find();
        return res.status(200).json(plants);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getPlantById = async (req, res) => {
    try {
        const { id } = req.params;
        const plant = await Plant.findById(id);
        return res.status(200).json(plant);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const createPlant = async (req, res) => {
    try {
        // Validate if the plant already exists
        const plantExist = await Plant.findOne({ common_name: req.body.common_name });
        if (plantExist) {
            return res.status(400).json({ message: "Plant already exists" });
        }

        // Validate that the plant is well formed
        const plantData = { ...req.body };
        if (req.file) {
            plantData.default_image = req.file.path;
        }
        const plant = new Plant(plantData);
        const plantDB = await plant.save();
        return res.status(201).json(plantDB);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updatePlant = async (req, res) => {
    try {
        const { id } = req.params;
        const existingPlant = await Plant.findById(id);
        if (!existingPlant) {
            return res.status(404).json({ message: "Plant not found" });
        }

        const updateData = { ...req.body };
        if (req.file) {
            updateData.default_image = req.file.path;
        }

        const plant = await Plant.findByIdAndUpdate(id, updateData, { new: true });

        if (req.file && existingPlant.default_image && existingPlant.default_image.includes('cloudinary')) {
            deleteImgCloudinary(existingPlant.default_image);
        }

        return res.status(200).json(plant);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deletePlant = async (req, res) => {
    try {
        const { id } = req.params;
        const plant = await Plant.findByIdAndDelete(id);
        if (!plant) {
            return res.status(404).json({ message: "Plant not found" });
        }

        // Remove all references to this plant from every user's garden
        await User.updateMany({}, { $pull: { plants: { plant: plant._id } } });

        // Delete the image from Cloudinary if it was stored there
        if (plant.default_image && plant.default_image.includes('cloudinary')) {
            deleteImgCloudinary(plant.default_image);
        }

        return res.status(200).json(plant);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const addPlantToUser = async (req, res) => {
    try {
        const { id } = req.params;
        const plant = await Plant.findById(id);
        if (!plant) {
            return res.status(404).json({ message: "Plant not found" });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const alreadyInGarden = user.plants.some(
            (entry) => entry.plant.toString() === plant._id.toString()
        );
        if (alreadyInGarden) {
            return res.status(409).json({ message: "Esta planta ya está en tu huerto" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $push: { plants: { plant: plant._id, lastWatered: new Date() } } },
            { new: true }
        );
        return res.status(200).json(plant);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllPlants, getPlantById, createPlant, deletePlant, updatePlant, addPlantToUser };