import { Router } from "express";
import verifyUserInformation from "../middlewares/verifyUserInformation";
import verifyPasswordStrength from "../middlewares/verifyPasswordStrength";
import checkUsernameAndEmailReuse from "../middlewares/checkUsernameAndEmailReuse";
import { register, login } from "../controllers/auth.controller";
import { logout } from "../controllers/auth.controller";

const router: Router = Router();

router.post(
  "/register",
  verifyUserInformation,
  checkUsernameAndEmailReuse,
  verifyPasswordStrength,
  register,
);
router.post("/login", login);
router.post("/logout", logout);

export default router;
