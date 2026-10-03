// ==========================================
// INTERNZO - AUTH / API CONFIG
// ==========================================

// IMPORTANT:
// Keep /api here because the auth routes use:
// /api/auth/register
// /api/auth/login

const API_URL = "https://internzo-backend.onrender.com/api";


// ==========================================
// API HELPER
// ==========================================

async function apiFetch(endpoint, options = {}) {

    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {

        const response = await fetch(
            `${API_URL}${endpoint}`,
            {
                ...options,
                headers
            }
        );

        const data =
            await response.json().catch(() => ({}));

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Something went wrong."
            );

        }

        return data;

    } catch (error) {

        console.error(
            "INTERNZO API Error:",
            error
        );

        throw error;

    }

}


// ==========================================
// WAKE UP RENDER SERVER
// ==========================================

// Render free servers can sleep after inactivity.
// This starts the wake-up request early.

function wakeServer() {

    fetch(
        "https://internzo-backend.onrender.com/",
        {
            method: "GET"
        }
    ).catch(() => {});

}


// Start waking the backend immediately.

wakeServer();


// ==========================================
// REGISTER
// ==========================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            const role =
                document
                    .getElementById("role")
                    .value;


            const message =
                document.getElementById(
                    "message"
                );


            // Prevent empty values

            if (
                !name ||
                !email ||
                !password ||
                !role
            ) {

                message.style.color = "red";

                message.textContent =
                    "Please fill in all fields.";

                return;

            }


            // Loading state

            const submitButton =
                registerForm.querySelector(
                    'button[type="submit"]'
                );


            const originalButtonText =
                submitButton
                    ? submitButton.textContent
                    : "";


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Creating account...";

            }


            message.style.color =
                "#a1a1aa";

            message.textContent =
                "Creating your account...";


            try {

                const data =
                    await apiFetch(
                        "/auth/register",
                        {
                            method: "POST",

                            body:
                                JSON.stringify({
                                    name,
                                    email,
                                    password,
                                    role
                                })
                        }
                    );


                // SUCCESS

                message.style.color =
                    "green";

                message.textContent =
                    data.message ||
                    "Registration successful!";


                registerForm.reset();


            } catch (error) {

                console.error(
                    "Register error:",
                    error
                );


                message.style.color =
                    "red";

                message.textContent =
                    error.message ||
                    "Registration failed.";

            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        originalButtonText;

                }

            }

        }
    );

}


// ==========================================
// LOGIN
// ==========================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            // Prevent empty values

            if (!email || !password) {

                message.style.color =
                    "red";

                message.textContent =
                    "Please enter email and password.";

                return;

            }


            // Loading state

            const submitButton =
                loginForm.querySelector(
                    'button[type="submit"]'
                );


            const originalButtonText =
                submitButton
                    ? submitButton.textContent
                    : "";


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Signing in...";

            }


            message.style.color =
                "#a1a1aa";

            message.textContent =
                "Signing you in...";


            try {

                const data =
                    await apiFetch(
                        "/auth/login",
                        {
                            method: "POST",

                            body:
                                JSON.stringify({
                                    email,
                                    password
                                })
                        }
                    );


                // =================================
                // SAVE JWT
                // =================================

                localStorage.setItem(
                    "token",
                    data.token
                );


                // =================================
                // SAVE USER
                // =================================

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        data.user
                    )
                );


                // =================================
                // SUCCESS
                // =================================

                message.style.color =
                    "green";

                message.textContent =
                    "Login successful!";


                // =================================
                // REDIRECT
                // =================================

                setTimeout(
                    function () {

                        if (
                            data.user.role ===
                            "student"
                        ) {

                            window.location.href =
                                "student-dashboard.html";

                        }

                        else if (
                            data.user.role ===
                            "company"
                        ) {

                            window.location.href =
                                "company-dashboard.html";

                        }

                        else if (
                            data.user.role ===
                            "admin"
                        ) {

                            window.location.href =
                                "admin-dashboard.html";

                        }

                        else {

                            message.style.color =
                                "red";

                            message.textContent =
                                "Unknown user role.";

                        }

                    },
                    500
                );

            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                message.style.color =
                    "red";

                message.textContent =
                    error.message ||
                    "Login failed.";

            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        originalButtonText;

                }

            }

        }
    );

}