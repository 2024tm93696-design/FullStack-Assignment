const bcrypt = require('bcrypt');
const Student = require('../models/studentSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Admin = require('../models/adminSchema.js');
const { TokenGenerator, TokenVerification } = require('./auth/UserAuth.js');

const RegisterUser = async (req, res) => {
    try {
        const schema = req.body.role === 'Student' ? Student : req.body.role === 'Teacher' ? Teacher : Admin;
        console.log(req.body.role, 'lll');
        
        const existingUser = await schema.findOne({ email: req.body.email });
          console.log(existingUser, 'opop');
          
        if (existingUser) {
            return res.status(409).send({
                status: 409,
                message: 'User with specified email already exists'
            });
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        const hashedAns1 = bcrypt.hashSync(req.body.ans1, 10);

        const newUser = new schema({
            enrollmentNum: req.body.enrollmentNum,
            role: req.body.role,
            name: req.body.name,
            email: req.body.email,
            ans1: hashedAns1,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        res.status(200).send({
            status: 200,
            message: 'User registered successfully',
            user: savedUser
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).send({
            status: 500,
            message: 'Internal server error',
            error: err.message
        });
    }
};


const verifyMiddleware = async (req, res, next) => {
    try {
        const schema = req.body.role === 'Student' ? Student : req.body.role === 'Teacher' ? Teacher : Admin;
        const username = req.body.email;
        const password = req.body.password;

        const user = await schema.findOne({ email: username });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(404).send({
                status: 404,
                message: 'Invalid credentials'
            });
        }

        next();

    } catch (err) {
        console.error('Verification error:', err);
        res.status(500).send({
            status: 500,
            message: 'Internal server error',
            error: err.message
        });
    }
};


const LoginUser = async (req, res) => {
    try {
        const schema = req.body.role === 'Student' ? Student : req.body.role === 'Teacher' ? Teacher : Admin;
        const username = req.body.email;
        console.log(username);

        const user = await schema.findOne({ email: username });

        if (!user) {
            return res.status(404).send({
                status: 404,
                message: "Invalid Credentials"
            });
        }

        const name = user.name;
        const enrollmentNum = user.enrollmentNum;
        const role = user.role;
        const token = TokenGenerator(user._id);

        res.cookie("jwt", token, { httpOnly: false }); // consider httpOnly: true in production
        res.status(200).send({
            status: 200,
            token,
            enrollmentNum,
            username,
            name,
            role,
            message: "User login success"
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).send({
            status: 500,
            message: "Internal server error",
            error: err.message
        });
    }
};

const isAuthenticated = (req, res) => {
    try {
        const rawToken = req.headers.authorization || req.body.headers;
        if (!rawToken || !rawToken.startsWith("Bearer ")) {
            return res.status(401).send(
                {
                    status: 401, isAuthenticated: false, message: "Token missing or malformed"
                });
        }

        const jwtoken = rawToken.slice(7); // Remove "Bearer " prefix
        const isValid = TokenVerification(jwtoken);

        res.status(200).send({
            status: 200,
            isAuthenticated: isValid
        });
    } catch (err) {
        console.error("Auth check error:", err);
        res.status(500).send({ status: 500, isAuthenticated: false, message: "Internal server error" });
    }
};



const VerifyTokenMiddleware = (req, res, next) => {
    try {
        const rawToken = req.headers.authorization || req.body.headers;
        if (!rawToken || !rawToken.startsWith("Bearer ")) {
            return res.status(401).send({ status: 401, isAuthenticated: false, message: "Token missing or malformed" });
        }

        const jwtoken = rawToken.slice(7); // Remove "Bearer " prefix
        const isValid = TokenVerification(jwtoken);

        if (isValid === true) {
            next();
        } else {
            res.status(401).send({ status: 401, isAuthenticated: false, message: "You are not authorized" });
        }
    } catch (err) {
        console.error("Token verification error:", err);
        res.status(500).send({ status: 500, isAuthenticated: false, message: "Internal server error" });
    }
};

const logout = (req, res) => {
    try {
        res.clearCookie("jwt"); // ✅ Clear the cookie named "jwt"
        res.status(200).send({
            status: 200,
            message: "Logout successfully"
        });
    } catch (err) {
        console.error("Logout error:", err);
        res.status(500).send({
            status: 500,
            message: "Internal server error", error: err.message
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const schema = req.body.role === 'Student' ? Student : req.body.role === 'Teacher' ? Teacher : Admin;
        const oldPassword = req.body.oldpassword;
        const newPassword = req.body.newpassword;

        const user = await schema.findOne({ email: req.params.username });

        if (!user) {
            return res.status(404).send({
                status: 404,
                message: "User not found"
            });
        }

        const isMatch = bcrypt.compareSync(oldPassword, user.password);

        if (!isMatch) {
            return res.status(404).send({
                status: 404,
                message: "Old password is incorrect"
            });
        }

        user.password = bcrypt.hashSync(newPassword, 10);
        await user.save();

        res.status(200).send({
            status: 200,
            message: "Password changed successfully"
        });

    } catch (err) {
        console.error("Password change error:", err);
        res.status(500).send({
            status: 500,
            message: "Internal server error", error: err.message
        });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const schema = req.body.role === 'Student' ? Student : req.body.role === 'Teacher' ? Teacher : Admin;
        const email = req.params.email;
        const newPassword = req.body.password;

        console.log(email);

        const user = await schema.findOne({ email });

        if (!user) {
            return res.status(404).send({
                status: 404,
                message: "User not found"
            });
        }

        user.password = bcrypt.hashSync(newPassword, 10);
        await user.save();

        res.status(200).send({
            status: 200,
            message: "New password generated successfully"
        });

    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).send({
            status: 500,
            message: "Internal server error",
            error: err.message
        });
    }
};

const verifyUser = async (req, res) => {
    try {
        const schema = req.body.role === 'Student' ? Student : req.body.role === 'Teacher' ? Teacher : Admin;
        const { email, ans1 } = req.body;

        const user = await schema.findOne({ email });

        if (!user) {
            return res.status(403).send({
                status: 403,
                message: "Invalid Email"
            });
        }

        const isAnswerCorrect = bcrypt.compareSync(ans1, user.ans1);

        if (!isAnswerCorrect) {
            return res.status(403).send({
                status: 403,
                message: "Incorrect answer or Incorrect security question"
            });
        }

        res.status(200).send({
            status: 200,
            user: user.email
        });

    } catch (err) {
        console.error("Verification error:", err);
        res.status(500).send({
            status: 500,
            message: "Internal server error",
            error: err.message
        });
    }
}

const GoogleLoginSuccess = (req, res) => {
    try {

        if (req.user) {
            const { email, enrollmentNum, name, role } = req.user;
            const token = TokenGenerator(email);

            // Set JWT cookie (consider httpOnly: true in production)
            res.cookie("jwt", token, {
                httpOnly: false, // Set to true in production for security
                secure: false,   // Set to true if using HTTPS
                sameSite: "Lax"
            });

            res.status(200).send({
                status: 200,
                token,
                enrollmentNum,
                email,
                name,
                role,
                message: "User login success"
            });
        } else {
            res.status(403).json({
                status: 403,
                error: true, message: "Not Authorized"
            });
        }
    } catch (err) {
        console.error("Google login error:", err);
        res.status(500).json({
            status: 500,
            error: true, message: "Internal server error"
        });
    }
};

const GoogleLogout = (req, res) => {
    try {
        res.clearCookie("jwt"); // Clear your app's auth token
        res.clearCookie("connect.sid"); // Clear session if using express-session
        res.status(200).send({
            status: 200,
            message: "Logout successful"
        });
    } catch (err) {
        console.error("Logout error:", err);
        res.status(500).send({
            status: 500,
            message: "Internal server error"
        });
    }
};

module.exports = { RegisterUser, LoginUser, verifyMiddleware, isAuthenticated, VerifyTokenMiddleware, logout, changePassword, verifyUser, forgotPassword, GoogleLoginSuccess, GoogleLogout }