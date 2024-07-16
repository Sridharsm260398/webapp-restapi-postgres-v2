const express = require('express');
const router = express.Router();
const upload = require('../utils/multerConfig');
router.post('/uploads', upload.single('photo'), (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'File uploaded successfully',
      file: req.file
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});
module.exports = router;
