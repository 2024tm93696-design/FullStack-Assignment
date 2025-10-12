const router = require('express').Router();

// const { adminRegister, adminLogIn, deleteAdmin, getAdminDetail, updateAdmin } = require('../controllers/admin-controller.js');

const { adminRegister, adminLogIn, getAdminDetail} = require('../controllers/admin-controller.js');
const {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    } = require('../controllers/student_controller.js');
const { teacherRegister, teacherLogIn, getTeachers, getTeacherDetail, deleteTeachers, deleteTeacher } = require('../controllers/teacher-controller.js');
const { addEquipment, getEquipments, getEquipmentDetail, updateEquipment, deleteEquipment } = require('../controllers/equipment-controller.js');

// Admin
router.post('/adminRegister', adminRegister);
router.post('/adminLogin', adminLogIn);

router.get("/admin/:id", getAdminDetail)
// router.delete("/Admin/:id", deleteAdmin)

// router.put("/Admin/:id", updateAdmin)

// Student

router.post('/studentRegister', studentRegister);
router.post('/studentLogin', studentLogIn)

router.get("/students/:id", getStudents)
router.get("/student/:id", getStudentDetail)

router.delete("/students/:id", deleteStudents)
router.delete("/student/:id", deleteStudent)

router.put("/student/:id", updateStudent)

// Teacher

router.post('/teacherRegister', teacherRegister);
router.post('/teacherLogin', teacherLogIn)

router.get("/teachers/:id", getTeachers)
router.get("/teacher/:id", getTeacherDetail)

router.delete("/teachers/:id", deleteTeachers)
router.delete("/teacher/:id", deleteTeacher)

// Equipment

router.post('/addEquipment', addEquipment);
router.get('/equipments', getEquipments);
router.get('/equipment/:id', getEquipmentDetail);
router.put('/equipment/:id', updateEquipment);
router.delete('/equipment/:id', deleteEquipment);

module.exports = router;