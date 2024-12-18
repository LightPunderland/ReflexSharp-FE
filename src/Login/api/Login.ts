import axios from "axios";
import { BASE_API_URL } from "../../constants/constants";

interface GoogleSignInData {
    clientId: string;
    username: string;
    token: string

}

interface UserDTO {
    id: string;
    googleId: string;
    email: string;
    displayName: string;
    publicRank: string;
    xp: number;
    gold: number;
}

const LoginService = {
    googleSignIn: async (data: GoogleSignInData): Promise<UserDTO> => {
        return axios
            .post<{ message: string; user: UserDTO }>(
                `${BASE_API_URL}/api/auth/google-signin`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                const { message, user } = response.data;

                console.log("Backend Response:", message);

                // Store the user in session storage
                sessionStorage.setItem("user", JSON.stringify(user));

                // Return the user object
                return user;
            })
            .catch((error) => {
                console.error("Google Sign-In failed:", error);
                throw error;
            });
    }
}

export default LoginService;