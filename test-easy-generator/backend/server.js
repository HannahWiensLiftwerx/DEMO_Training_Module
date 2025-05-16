const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const {
  SCORM_APP_ID,
  SCORM_SECRET_KEY,
  SCORM_BASE_URL,
  COURSE_ID
} = process.env;

const authHeader = 'Basic ' + Buffer.from(`${SCORM_APP_ID}:${SCORM_SECRET_KEY}`).toString('base64');

// ✅ This route is now correctly defined
app.get('/api/get-launch-link', async (req, res) => {
  console.log("GET /api/get-launch-link was called");
  const learnerId = req.query.learnerId || 'user123';
  const regId = `reg-${learnerId}-${Date.now()}`;

  try {
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

    const response = await axios.post(`${SCORM_BASE_URL}/registrations/${regId}/launchLink`, {
      redirectOnExitUrl: "http://localhost:5173"
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

// ✅ Properly placed endpoint
app.get('/api/check-completion', (req, res) => {
  const learnerId = req.query.learnerId || 'user123';
  const regId = req.query.regId;

  try {
    const data = fs.readFileSync(path.join(__dirname, 'results.json'));
    const statements = JSON.parse(data);

    const matching = statements.filter(s =>
      s.actor?.account?.name === learnerId &&
      s.verb?.id === "http://adlnet.gov/expapi/verbs/completed" &&
      s.context?.registration === regId
    );

    const recent = matching.some(s => {
      const ts = new Date(s.timestamp);
      const now = new Date();
      return (now - ts) / 1000 < 300; //checks to see if it happened within 5 minutes
    })
    res.json({ completed : recent});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not check completion' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
