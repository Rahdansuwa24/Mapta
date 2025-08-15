const { default: axios } = require('axios');
var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/coba-coba',async (req, res)=>{
  try{
    const {sekolah} = req.query
    const response = await axios.get(`https://api-sekolah-indonesia.vercel.app/sekolah/s?sekolah=${encodeURIComponent(sekolah)}`)
    res.send(response.data)
  }
  catch(error){
    res.status(500).send(error);
  }
})

module.exports = router;
