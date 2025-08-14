import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

// Helper function to set cookie with consistent options
const setCookie = (res, token) => {
	const cookieOptions = {
		httpOnly: true,
		maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
		sameSite: "None", // Required for cross-origin
		secure: process.env.NODE_ENV === "production", // HTTPS in production
	};
	
	console.log("Setting cookie with options:", cookieOptions);
	res.cookie("jwt-linkedin", token, cookieOptions);
};

export const signup = async (req, res) => {
	try {
		console.log("Signup request received");
		const { name, username, email, password } = req.body;

		if (!name || !username || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}
		
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ message: "Email already exists" });
		}

		const existingUsername = await User.findOne({ username });
		if (existingUsername) {
			return res.status(400).json({ message: "Username already exists" });
		}

		if (password.length < 6) {
			return res.status(400).json({ message: "Password must be at least 6 characters" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = new User({
			name,
			email,
			password: hashedPassword,
			username,
		});

		await user.save();
		console.log("User created successfully:", user.username);

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
		console.log("JWT token generated");

		setCookie(res, token);

		res.status(201).json({ 
			message: "User registered successfully",
			user: {
				_id: user._id,
				name: user.name,
				username: user.username,
				email: user.email
			}
		});

		const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;

		try {
			await sendWelcomeEmail(user.email, user.name, profileUrl);
		} catch (emailError) {
			console.error("Error sending welcome Email", emailError);
		}
	} catch (error) {
		console.log("Error in signup: ", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const login = async (req, res) => {
	try {
		console.log("Login request received");
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({ message: "Username and password are required" });
		}

		const user = await User.findOne({ username });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		console.log("User authenticated successfully:", user.username);

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
		console.log("JWT token generated for login");

		setCookie(res, token);

		res.json({ 
			message: "Logged in successfully",
			user: {
				_id: user._id,
				name: user.name,
				username: user.username,
				email: user.email
			}
		});
	} catch (error) {
		console.error("Error in login controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const logout = (req, res) => {
	console.log("Logout request received");
	res.clearCookie("jwt-linkedin", {
		httpOnly: true,
		sameSite: "None",
		secure: process.env.NODE_ENV === "production",
	});
	res.json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req, res) => {
	try {
		console.log("getCurrentUser called for user:", req.user?.username);
		res.json(req.user);
	} catch (error) {
		console.error("Error in getCurrentUser controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};