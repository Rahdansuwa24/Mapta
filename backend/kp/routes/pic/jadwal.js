var express = require('express');
var router = express.Router();
var verifyToken = require('../../config/middleware/jwt')
var Model_Admin = require('../../model/Model_Admin')
var Model_PIC = require('../../model/Model_Pic')
const Model_User = require('../../model/Model_User');


router.get('/', verifyToken("pic"),async(req, res)=>{
    try{
        const id_users = req.user.id
        const data = await Model_PIC.getJadwal(id_users)
        res.status(200).json({data})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

module.exports = router