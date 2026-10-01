// ===============================
// REGISTER
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;

        const message = document.getElementById("message");

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        role
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                message.style.color = "green";
                message.textContent = data.message;

                registerForm.reset();

            } else {

                message.style.color = "red";
                message.textContent = data.message;

            }

        } catch (error) {

            message.style.color = "red";
            message.textContent =
                "Unable to connect to the server.";

            console.error(error);
        }

    });

}


// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const message = document.getElementById("loginMessage");

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                // Save JWT token
                localStorage.setItem("token", data.token);

                // Save user information
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                message.style.color = "green";
                message.textContent = "Login successful!";

                // Redirect based on role
                setTimeout(() => {

                    if (data.user.role === "student") {

                        window.location.href =
                            "student-dashboard.html";

                    } else if (data.user.role === "company") {

                        window.location.href =
                            "company-dashboard.html";

                    } else if (data.user.role === "admin") {

                        window.location.href =
                            "admin-dashboard.html";

                    }

                }, 1000);

            } else {

                message.style.color = "red";
                message.textContent = data.message;

            }

        } catch (error) {

            message.style.color = "red";
            message.textContent =
                "Unable to connect to the server.";

            console.error(error);
        }

    });

}