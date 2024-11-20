import axios from "axios";

const API_URL = "http://localhost:5050/api";

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
                `${API_URL}/auth/google-signin`,
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