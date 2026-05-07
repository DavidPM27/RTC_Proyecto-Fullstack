require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const { connectCloudinary } = require('../config/cloudinary');

const Plant = require('../api/models/plant.model');
const User = require('../api/models/user.model');

async function runSeed() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('Connected to DB');
    connectCloudinary();

    // 1. Drop collections
    await Plant.collection.drop().catch(() => {});
    await User.collection.drop().catch(() => {});

    // 3. Process Plants Catalog
    const plantsCsvPath = path.join(__dirname, '../data/plants_catalog.csv');
    const plantsCsvData = fs.readFileSync(plantsCsvPath, 'utf-8').trim().split('\n');
    const plantsData = [];
    const plantIdMap = {}; // Maps CSV ID to Mongoose ObjectId

    for (let i = 1; i < plantsCsvData.length; i++) {
        const row = plantsCsvData[i].split(',');
        if (row.length < 10) continue;

        const csvId = row[0].trim();
        const sciNameParts = row[2] ? row[2].split(' ') : [];
        const genus = sciNameParts[0] || 'Unknown';
        const species = sciNameParts[1] || 'Unknown';

        let sunlightString = row[9] ? row[9].trim() : 'Indirect light';
        if (sunlightString === 'Low light') sunlightString = 'Shade';

        const newId = new mongoose.Types.ObjectId();
        plantIdMap[csvId] = newId;

        let imageUrl = row[5] ? row[5].trim() : '';
        if (imageUrl.startsWith('http')) {
            try {
                console.log(`Uploading image for ${row[1].trim()}...`);
                const uploadRes = await cloudinary.uploader.upload(imageUrl, { folder: 'PlantImages' });
                imageUrl = uploadRes.secure_url;
            } catch (err) {
                console.error(`Failed to upload ${imageUrl}: `, err.message);
            }
        }

        plantsData.push({
            _id: newId,
            common_name: row[1] ? row[1].trim() : 'Unknown',
            scientific_name: row[2] ? row[2].trim() : 'Unknown',
            family: row[6] ? row[6].trim() : 'Unknown',
            genus: genus,
            species: species,
            description: row[12] ? row[12].trim() : '',
            default_image: imageUrl,
            type: row[4] ? row[4].trim() : '',
            care_level: row[7] ? row[7].trim() : '',
            watering: row[8] ? row[8].trim() : '',
            sunlight: sunlightString,
            hardiness: {
                min: row[10] ? row[10].trim() : '0',
                max: row[11] ? row[11].trim() : '0'
            }
        });
    }

    await Plant.insertMany(plantsData);
    console.log(`Inserted ${plantsData.length} plants.`);

    // 4. Build user-plant associations from user_plants_report.csv
    const reportPath = path.join(__dirname, '../data/user_plants_report.csv');
    const reportLines = fs.readFileSync(reportPath, 'utf-8').trim().split('\n');
    const userPlantsMap = {}; // Maps user CSV ID -> [{ plant, lastWatered }]

    const parseLastWatered = (text) => {
      const t = (text || '').trim().toLowerCase();
      const now = new Date();
      if (t === 'hoy') return now;
      const match = t.match(/hace (\d+) (día|días|semana|semanas)/);
      if (!match) return now;
      const n = parseInt(match[1]);
      const unit = match[2];
      const ms = (unit.startsWith('semana') ? n * 7 : n) * 24 * 60 * 60 * 1000;
      return new Date(now.getTime() - ms);
    };

    for (let i = 1; i < reportLines.length; i++) {
      const row = reportLines[i].split(',');
      if (row.length < 5) continue;
      const userId = row[0].trim();
      const plantCsvId = row[4].trim();
      const lastWateredText = row[14] ? row[14].trim() : '';
      if (!plantIdMap[plantCsvId]) continue;
      if (!userPlantsMap[userId]) userPlantsMap[userId] = [];
      userPlantsMap[userId].push({
        plant: plantIdMap[plantCsvId],
        lastWatered: parseLastWatered(lastWateredText),
      });
    }

    // 5. Process Clients Catalog
    const clientsCsvPath = path.join(__dirname, '../data/users_catalog.csv');
    const clientsCsvData = fs.readFileSync(clientsCsvPath, 'utf-8').trim().split('\n');
    const clientsData = [];

    for (let i = 1; i < clientsCsvData.length; i++) {
      const rowStr = clientsCsvData[i].trim();
      if (!rowStr) continue;

      const row = rowStr.split(',');
      const id_cliente = row[0].trim();
      const nombre = row[1];
      const email = row[2];
      const role = row[4] ? row[4].trim() : 'user';
      const rawPassword = row[5] ? row[5].trim() : '123456';

      const username = nombre.toLowerCase().replace(/ /g, '') + id_cliente;
      const hashedPassword = bcrypt.hashSync(rawPassword, 10);

      clientsData.push({
        _id: new mongoose.Types.ObjectId(),
        username: username,
        email: email,
        password: hashedPassword,
        role: role,
        plants: userPlantsMap[id_cliente] || [],
      });
    }

    await mongoose.connection.collection('users').insertMany(clientsData);
    console.log(`Inserted ${clientsData.length} users from CSV.`);

  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

runSeed();
