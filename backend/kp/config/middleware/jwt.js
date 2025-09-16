var jwt = require('jsonwebtoken')


const verifyToken = (user_level)=>{
    return(req, res, next)=>{
         const token = req.header('Authorization')?.replace('Bearer ', '')
          if (!token) {
            return res.status(403).json({status: false, message: 'Token tidak ada, akses ditolak' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (user_level && decoded.user_level !== user_level) {
                return res.status(403).json({ status: false, message: 'Akses hanya untuk ' + user_level });
            }
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ status: false, message: 'Token tidak valid' });
        }

    }
}

module.exports = verifyToken