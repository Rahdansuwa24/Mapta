var express = require('express');
var router = express.Router();
const Model_Users = require('../../model/Model_User');
// const limiter = require('../../config/middleware/rateLimiter')

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'email dan password tidak boleh kosong' });
    }
    try {
        const result = await Model_Users.login(email, password);
        res.json(result);
    } catch (error) {
        res.status(error.status).json({ message: error.message });
    }
});

module.exports = router;
