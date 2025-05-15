const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173'  // <-- your Svelte frontend URL & port
}));
app.use(express.json());

const {
  SCORM_APP_ID,
  SCORM_SECRET_KEY,
  SCORM_BASE_URL,
  COURSE_ID
} = process.env;

const authHeader = 'Basic ' + Buffer.from(`${SCORM_APP_ID}:${SCORM_SECRET_KEY}`).toString('base64');

app.get('/api/get-launch-link', async (req, res) => {
    console.log("GET /api/get-launch-link was called");
  const learnerId = req.query.learnerId || 'user123';
  const regId = `reg-${learnerId}-${Date.now()}`;

  try {
    // 1. Create Registration
    await axios.post(`${SCORM_BASE_URL}/registrations`, {
      courseId: COURSE_ID,
      registrationId: regId,
      learner: {
        id: learnerId,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com"
      }
    }, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json'
      }
    });

    // 2. Get Launch URL
    const response = await axios.post(`${SCORM_BASE_URL}/registrations/${regId}/launchLink`, {
      redirectOnExitUrl: "http://localhost:5173"  // or your frontend URL
    }, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json'
      }
    });

    res.json({ launchUrl: response.data.launchLink });
  } catch (err) {
    const errorMsg = err.response?.data || err.message;
    console.error('SCORM Error:', errorMsg);
    res.status(500).json({ error: errorMsg });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));