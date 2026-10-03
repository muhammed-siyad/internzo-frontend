// ==========================================
// INTERNZO - API HELPER
// ==========================================

// Your deployed Render backend
const API_URL = "https://internzo-backend.onrender.com";

// ==========================================
// API REQUEST
// ==========================================

async function apiFetch(endpoint, options = {}) {

    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    // Add JWT token automatically
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        // Try to read JSON response
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong"
            );
        }

        return data;

    } catch (error) {

        console.error("INTERNZO API Error:", error);

        throw error;
    }
}


// ==========================================
// WAKE UP RENDER SERVER
// ==========================================

function wakeServer() {

    fetch(`${API_URL}/`, {
        method: "GET"
    }).catch(() => {
        // Ignore wake-up errors
    });

}


// Start waking Render without blocking the page
wakeServer();


// ==========================================
// INTERNSHIP CACHE
// ==========================================

let internshipCache = null;
let internshipCacheTime = 0;

// Cache for 2 minutes
const INTERNSHIP_CACHE_TIME = 2 * 60 * 1000;


// ==========================================
// GET INTERNSHIPS
// ==========================================

async function getInternships(forceRefresh = false) {

    const now = Date.now();

    // Use cached data if available
    if (
        !forceRefresh &&
        internshipCache &&
        now - internshipCacheTime < INTERNSHIP_CACHE_TIME
    ) {

        console.log("INTERNZO: Using cached internships");

        return internshipCache;
    }


    console.log("INTERNZO: Fetching internships...");


    const data = await apiFetch("/api/internships");


    // Save cache
    internshipCache = data;
    internshipCacheTime = now;


    return data;
}


// ==========================================
// CLEAR INTERNSHIP CACHE
// ==========================================

function clearInternshipCache() {

    internshipCache = null;
    internshipCacheTime = 0;

}


// ==========================================
// REFRESH INTERNSHIPS
// ==========================================

async function refreshInternships() {

    clearInternshipCache();

    return await getInternships(true);

}