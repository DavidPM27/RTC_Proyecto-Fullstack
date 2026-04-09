const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema(
    {
        common_name: { type: String, required: true },
        scientific_name: { type: String, required: true },
        family: { type: String, required: true },
        genus: { type: String, required: true },
        species: { type: String, required: true },
        origin: { type: String },
        description: { type: String },
        type: { type: String },
        care_level: { type: String },
        watering: { type: String },
        watering_general_benchmark: { type: Object },
        sunlight: { type: String, enum: ["Part shade", "Full sun", "Shade", "Indirect light"] },
        care_description: { type: String },
        hardiness: { type: Object },
        default_image: { type: String },
    }
)

const Plant = mongoose.model("plants", plantSchema);
module.exports = Plant;