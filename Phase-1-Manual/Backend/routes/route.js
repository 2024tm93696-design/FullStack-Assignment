const router = require('express').Router();
const { adminRegister, adminLogIn, getAdminDetail} = require('../controllers/admin.js');
const {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    } = require('../controllers/student.js');
const { teacherRegister, teacherLogIn, getTeachers, getTeacherDetail, deleteTeachers, deleteTeacher } = require('../controllers/teacher.js');
const { addEquipment, getEquipments, getEquipmentDetail, updateEquipment, deleteEquipment } = require('../controllers/equipment.js');
const {createRequest, updateRequestStatus, markAsReturned, getAllRequests, getMyRequests} = require('../controllers/request.js');

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

//Request

router.post('/createRequest', createRequest);
router.get('/requests', getAllRequests);
router.get('/myRequest/:id', getMyRequests);
router.put('/updateRequest/:id', updateRequestStatus);
router.put('/markReturn/:id', markAsReturned);

module.exports = router;