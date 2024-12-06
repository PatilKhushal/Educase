// imports
const express = require('express');
const { connectDB } = require('./connection');


// initializations
const app = express();
app.use(express.json());

// connection to Local Mongo DB
connectDB().getConnection((error) => {
    if (error) 
        console.error("Connection unsuccessful due to => ", error);
    else
        console.log("Connected to DB Successfully");
});

app.post('/addSchool', (request, response) => {
    const { name, address, latitude, longitude } = request.body;

    // Input validation
    if (!name || !address || !latitude || !longitude) {
        return response.status(400).json({ error: 'All fields are required' });
    }

    const sql = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, address, latitude, longitude], (err, result) => {
        if (err) {
            console.error(err);
            return response.status(500).json({ error: 'Database error' });
        }
        return response.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
    });
});

app.get('/listSchools', (request, response) => {
    const { latitude, longitude } = request.query;

    if (!latitude || !longitude) {
        return response.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const sql = 'SELECT id, name, address, latitude, longitude FROM schools';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return response.status(500).json({ error: 'Database error' });
        }

        const schools = results.map((school) => {
            const dist = getDistance(
                { lat: parseFloat(latitude), lon: parseFloat(longitude) },
                { lat: school.latitude, lon: school.longitude }
            );
            return { ...school, distance: dist };
        });

        schools.sort((a, b) => a.distance - b.distance);

        return response.status(200).json(schools);
    });
});

// Helper function to calculate distance
function getDistance(coord1, coord2) {
    const R = 6371;
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLon = toRad(coord2.lon - coord1.lon);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(coord1.lat)) *
            Math.cos(toRad(coord2.lat)) *
            Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(value) {
    return (value * Math.PI) / 180;
}


// Running server on port 3000
app.listen(3000, () => console.log("Server running on port 3000"))