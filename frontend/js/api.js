const API_BASE = "https://solus-blog.onrender.com/api/v1";

class API {
    static getHeaders() {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
        };
    }

    static async request(endpoint, method = "GET", body = null) {
        const options = {
            method,
            headers: this.getHeaders(),
            ...(body && { body: JSON.stringify(body) })
        };

        try {
            const res = await fetch(`${API_BASE}${endpoint}`, options);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Something went wrong");
            return data;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }

    // Auth Helpers
    static login(email, password) {
        return this.request("/users/login", "POST", { email, password });
    }
    
    static register(username, email, password) {
        return this.request("/users/register", "POST", { username, email, password });
    }

    static getMe() {
        return this.request("/users/me");
    }
}