const router = require('express').Router();
const { RegisterUser, LoginUser, isAuthenticated,logout,forgotPassword,changePassword, verifyMiddleware, verifyUser, GoogleLoginSuccess,GoogleLogout}
     = require('../controllers/user.js');
const { addEquipment, getEquipments, getEquipmentDetail, updateEquipment, deleteEquipment } = require('../controllers/equipment.js');
const {createRequest, updateRequestStatus, markAsReturned, getAllRequests, getMyRequests} = require('../controllers/request.js');
const passport = require('passport')

// User
router.post('/register', RegisterUser);
router.post('/login', verifyMiddleware, LoginUser);
router.post('/isAuthenticated',isAuthenticated);
router.get('/logout',logout)
router.post('/changePassword/:username',changePassword)
router.post('/forgotPassword/:username',forgotPassword)
router.post('/verifyUser',verifyUser)

//google
router.get("/login/success",GoogleLoginSuccess);
router.get("/google/logout",GoogleLogout);
router.get('/google/return',passport.authenticate('google',{successRedirect:'http://localhost:3000/loginpage',failureRedirect:'/'}))
router.get('/auth/google',passport.authenticate('google',{ scope:['email','profile']}))

// Equipment

router.post('/addEquipment', addEquipment);
router.get('/equipments', getEquipments);
router.get('/equipment/:id', getEquipmentDetail);
router.put('/equipment/:id', updateEquipment);
router.delete('/equipment/:id', deleteEquipment);

//Request

router.post('/createRequest', createRequest);
router.get('/requests', getAllRequests);
router.get('/myRequest/:id', getMyRequests);
router.put('/updateRequest/:id', updateRequestStatus);
router.put('/markReturn/:id', markAsReturned);

module.exports = router;