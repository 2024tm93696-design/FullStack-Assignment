import express from "express";
const router = express.Router();
import passport from "passport";
import userController from "../controllers/user.js";
import requestController from "../controllers/request.js"
import equipController from "../controllers/equipment.js"

const {
     RegisterUser,
     LoginUser,
     isAuthenticated,
     logout,
     forgotPassword,
     changePassword,
     verifyMiddleware,
     verifyUser,
     GoogleLoginSuccess,
     GoogleLogout
} = userController;

const {
     addEquipment,
     getEquipments,
     getEquipmentDetail,
     updateEquipment,
     deleteEquipment
} = equipController

const {
     createRequest,
     updateRequestStatus,
     markAsReturned,
     getAllRequests,
     getMyRequests,
     getTeacherRequests
} = requestController;

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User registration, login, and authentication
 *   - name: Google
 *     description: Google OAuth routes
 *   - name: Equipment
 *     description: Equipment management
 *   - name: Requests
 *     description: Borrow/return requests
 */

/** ------------------ User Routes ------------------ */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string }
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/register', RegisterUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enrollmentNum: { type: integer }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', verifyMiddleware, LoginUser);

/**
 * @swagger
 * /isAuthenticated:
 *   post:
 *     summary: Check if user is authenticated
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User is authenticated
 */
router.post('/isAuthenticated', isAuthenticated);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.get('/logout', logout);

/**
 * @swagger
 * /changePassword/{username}:
 *   post:
 *     summary: Change user password
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role: { type: string }
 *               oldPassword: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Password changed
 */
router.post('/changePassword/:username', changePassword);

/**
 * @swagger
 * /forgotPassword/{username}:
 *   post:
 *     summary: Forgot password for user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Password reset link sent
 */
router.post('/forgotPassword/:username', forgotPassword);

/**
 * @swagger
 * /verifyUser:
 *   post:
 *     summary: Verify user email or account
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User verified
 */
router.post('/verifyUser', verifyUser);

/** ------------------ Google OAuth Routes ------------------ */

/**
 * @swagger
 * /login/success:
 *   get:
 *     summary: Google login success
 *     tags: [Google]
 *     responses:
 *       200:
 *         description: Logged in successfully
 */
router.get("/login/success", GoogleLoginSuccess);

/**
 * @swagger
 * /google/logout:
 *   get:
 *     summary: Google logout
 *     tags: [Google]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.get("/google/logout", GoogleLogout);

/**
 * @swagger
 * /google/return:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Google]
 *     responses:
 *       200:
 *         description: Google OAuth callback
 */
router.get('/google/return', passport.authenticate('google', { successRedirect: 'http://localhost:3000/loginpage', failureRedirect: '/' }));

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google login
 *     tags: [Google]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 */
router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

/** ------------------ Equipment Routes ------------------ */

/**
 * @swagger
 * /addEquipment:
 *   post:
 *     summary: Add new equipment
 *     tags: [Equipment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               category: { type: string }
 *               condition: ["AVAILABLE", "OUT OF STOCK"]
 *               quantity: { type: integer }
 *               availability: { type: integer }
 *     responses:
 *       201:
 *         description: Equipment added
 */
router.post('/addEquipment', addEquipment);

/**
 * @swagger
 * /equipments:
 *   get:
 *     summary: Get all equipment
 *     tags: [Equipment]
 *     responses:
 *       200:
 *         description: List of all equipment
 */
router.get('/equipments', getEquipments);

/**
 * @swagger
 * /equipment/{id}:
 *   get:
 *     summary: Get equipment by ID
 *     tags: [Equipment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Equipment details
 */
router.get('/equipment/:id', getEquipmentDetail);

/**
 * @swagger
 * /equipment/{id}:
 *   put:
 *     summary: Update equipment
 *     tags: [Equipment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               category: { type: string }
 *               condition: ["AVAILABLE", "OUT OF STOCK"]
 *               quantity: { type: integer }
 *               availability: { type: integer }
 *               role: {type : integer}
 *     responses:
 *       200:
 *         description: Equipment updated
 */
router.put('/equipment/:id', updateEquipment);

/**
 * @swagger
 * /equipment/{id}:
 *   delete:
 *     summary: Delete equipment
 *     tags: [Equipment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Equipment deleted
 */
router.delete('/equipment/:id', deleteEquipment);

/** ------------------ Request Routes ------------------ */

/**
 * @swagger
 * /createRequest:
 *   post:
 *     summary: Create a new request
 *     tags: [Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               equipment:
 *  type: object
 *             properties: {
 *                equipmentId : { type: string }
 *                name: { type: string }
 *               category: { type: string }
 *               condition: ["AVAILABLE", "OUT OF STOCK"]
 *               quantity: { type: integer }
 *               availability: { type: integer }
 *                  }
 *               student: 
 *  type: object
 *             properties: {
 *                 enrollmentNum: { type: string },
 *                 name: { type: string }
 *                 email: { type: string }
 * }
 *               status: { type: string }
 *               role: { type: string }
 *               requestDate: { type: string, format: date }
 *               returnDate: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Request created
 */
router.post('/createRequest', createRequest);

/**
 * @swagger
 * /requests:
 *   get:
 *     summary: Get all requests
 *     tags: [Requests]
 *     responses:
 *       200:
 *         description: List of all requests
 */
router.get('/requests', getAllRequests);

/**
 * @swagger
 * /myRequest/{id}:
 *   get:
 *     summary: Get requests for a student
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of student requests
 */
router.get('/myRequest/:id', getMyRequests);

/**
 * @swagger
 * /teacherRequests/{id}:
 *   get:
 *     summary: Get requests for a teacher
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of teacher requests
 */
router.get('/teacherRequests/:id', getTeacherRequests);

/**
 * @swagger
 * /updateRequest/{id}:
 *   put:
 *     summary: Update request status
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string }
 *     responses:
 *       200:
 *         description: Request updated
 */
router.put('/updateRequest/:id', updateRequestStatus);

/**
 * @swagger
 * /markReturn/{id}:
 *   put:
 *     summary: Mark request as returned
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Request marked as returned
 */
router.put('/markReturn/:id', markAsReturned);

export default router;
