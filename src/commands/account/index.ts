import { category } from "../../utils/index";
import register from "./register";
import changePassword from "./change-password";

export default category("Account", [register, changePassword]);
