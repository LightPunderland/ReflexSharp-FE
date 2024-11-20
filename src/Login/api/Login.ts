import axios from "axios";

const API_URL = "http://localhost:5050/api";

interface GoogleSignInData {
    clientId: string;
    username: string;
    token: string

}

const LoginService = {
    googleSignIn: async (data: GoogleSignInData) => {
        try {
            const response = await axios.post(`${API_URL}/auth/google-signin`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Google Sign-In failed:", error);
            throw error;
        }
    }
}

export default LoginService;