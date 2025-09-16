var express = require('express');
var router = express.Router();
var verifyToken = require('../../config/middleware/jwt')
var Model_Admin = require('../../model/Model_Admin')
const Model_User = require('../../model/Model_User');


router.get('/', async(req, res)=>{
    try{
        const data = await Model_Admin.getPIC()
        res.status(200).json({data})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})
router.get('/periode-kosong', async(req, res)=>{
    try{
        const data = await Model_Admin.getPeriode()
        res.status(200).json({data})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

router.post('/store', async(req, res)=>{
    try{
        let {bidang, email, password} = req.body
        const user_level = 'pic';
        const existingUser = await Model_User.getEmail(email);
                if (existingUser && existingUser.length > 0) {
                    return res.status(400).json({ message: `Email ${email} sudah digunakan, ganti email lain` });
                }
        const validatePass = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!validatePass.test(password)) {
            return res.status(400).json({
                        status: false,
                        message: 'Password harus mengandung minimal 1 huruf besar, 1 angka, dan panjang minimal 8 karakter'
                    });
                }
        const akunPeserta = await Model_User.registerAkun(email, password, user_level);
        const idAkun = akunPeserta.insertId;
        const data = {
            bidang,
            id_users: idAkun
        }
        await Model_Admin.storePIC(data)
        res.status(200).json({message: 'pembuatan akun pic berhasil'})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

router.get('/(:id)', async(req, res)=>{
    try{
        let id = req.params.id
        let data = await Model_Admin.getIdUsersForPIC(id)
        res.status(200).json({data})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})
router.patch('/update/(:id)', async(req, res)=>{
    try{
        let id = req.params.id
        let {bidang, email, password} = req.body
        const existingUser = await Model_User.getEmail(email);
            if (existingUser && existingUser.length > 0) {
                return res.status(400).json({ message: `Email ${email} sudah digunakan, ganti email lain` });
            }
        const validatePass = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!validatePass.test(password)) {
            return res.status(400).json({
                        message: 'Password harus mengandung minimal 1 huruf besar, 1 angka, dan panjang minimal 8 karakter'
                    });
            }
        let rows = await Model_Admin.getIdUsersForPIC(id)
        console.log(rows)
        await Model_User.updateAkunPIC(rows[0].id_users, email, password);
        let data = {
            bidang
        }
        await Model_Admin.updatePIC(id, data)
        res.status(200).json({message: 'data berhasil diperbarui'})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})
//bagian delete belum fix, dikarenakan di database harus dilakukan delete cascade
router.delete('/delete/(:id)', async(req, res)=>{
    try{
        let id = req.params.id
        await Model_Admin.deletePIC(id)
        res.status(200).json({message: 'data berhasil dihapus'})
    }catch(err){
        res.status(500).json({ status: false, error: err.message });
    }
})

module.exports = router