const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceController = require('../controllers/sauce');

router.post('/', auth, multer, sauceController.addSauce);
router.get('/:id', auth, sauceController.getOneSauce);
router.get('/', auth, sauceController.getAllSauces);
router.delete('/:id', auth, sauceController.deleteSauce);
router.put('/:id', auth, multer, sauceController.modifySauce);
router.post('/:id/like', auth, sauceController.modifyLikes);


module.exports = router;
