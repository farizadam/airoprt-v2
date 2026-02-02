import auth from "@react-native-firebase/auth";
import { firebase } from "@react-native-firebase/app";

// Initialize native auth instance. If native Firebase isn't available this will throw.
const authInstance = auth();

console.log("🔥 Native Firebase loaded");

export { authInstance as auth };
export default firebase;
