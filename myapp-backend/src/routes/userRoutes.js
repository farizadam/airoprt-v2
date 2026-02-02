const express = require("express");
const UserController = require("../controllers/userController");
const AuthController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
const { validate, validationRules, Joi } = require("../middleware/validation");

const router = express.Router();
// Stripe Connect onboarding
router.post("/me/stripe-account", UserController.createStripeAccount);

// All routes require authentication
router.use(authMiddleware);

// Validation schema for profile update
const updateProfileSchema = Joi.object({
  first_name: Joi.string().min(2).max(100).trim(),
  last_name: Joi.string().min(2).max(100).trim(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
  role: Joi.string().valid("driver", "passenger", "both"),
  avatar_url: Joi.string().uri().allow(null, ""),
}).min(1); // At least one field required

// Routes
router.get("/me", UserController.getProfile);
// Accept both PATCH and PUT for profile updates (frontend may use PUT)
router.patch(
  "/me",
  validate(updateProfileSchema),
  UserController.updateProfile,
);
router.put("/me", validate(updateProfileSchema), UserController.updateProfile);

// Allow deleting account via /users/me to match mobile client
router.delete("/me", AuthController.deleteAccount);

// Avatar upload route
router.post("/me/avatar", UserController.uploadAvatar);
router.delete("/me/avatar", UserController.deleteAvatar);

// Saved locations routes
router.get("/me/locations", UserController.getSavedLocations);
router.post("/me/locations", UserController.addSavedLocation);
router.patch("/me/locations/:locationId", UserController.updateSavedLocation);
router.delete("/me/locations/:locationId", UserController.deleteSavedLocation);

module.exports = router;
