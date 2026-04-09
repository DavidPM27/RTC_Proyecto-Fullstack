const Plant = require("../models/plant.model");

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
        const plant = new Plant(req.body);
        const plantDB = await plant.save();
        return res.status(201).json(plantDB);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updatePlant = async (req, res) => {
    try {
        const { id } = req.params;
        const plant = await Plant.findByIdAndUpdate(id, req.body, { new: true });
        if (!plant) {
            return res.status(404).json({ message: "Plant not found" });
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

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.plants.push({
            plant: plant,
            lastWatered: new Date()
        });
        await user.save();  
        // Check if the plant has been successfully added to the user
        if (!user.plants.includes(plant)) {
            return res.status(400).json({ message: "Plant not added to user" });
        }   
        return res.status(200).json(plant);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllPlants, getPlantById, createPlant, deletePlant, updatePlant, addPlantToUser };