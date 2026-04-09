const {
    getAllPlants,
    getPlantById,
    createPlant,
    updatePlant,
    deletePlant,
    addPlantToUser
} = require('../controllers/plant.controller');

const { auth } = require('../../middlewares/auth');
const { upload } = require('../../middlewares/img');

const plantRouter = require('express').Router();

// Public routes (or basic auth, depending on your needs. For now: public fetch)
plantRouter.get('/', getAllPlants);
plantRouter.get('/:id', getPlantById);

// Admin restricted routes for catalog management
plantRouter.post('/', auth('admin'), upload.single('image'), createPlant);
plantRouter.put('/:id', auth('admin'), upload.single('image'), updatePlant);
plantRouter.delete('/:id', auth('admin'), deletePlant);

// User specific routes
// Add a plant to the currently logged in user's collection
plantRouter.post('/:id/addToUser', auth(), addPlantToUser);

module.exports = plantRouter;
