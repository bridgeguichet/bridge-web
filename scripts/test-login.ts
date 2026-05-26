import { config } from "dotenv";
config();

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function testLogin(email: string, password: string) {
  console.log(`\n=== TEST LOGIN: ${email} ===\n`);

  try {
    // Test login
    const loginRes = await fetch(`${API_URL}/api/auth/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log(`Login status: ${loginRes.status}`);
    const loginData = await loginRes.json();
    console.log("Login response:", JSON.stringify(loginData, null, 2));

    if (loginRes.ok && loginData.token) {
      // Get session
      const sessionRes = await fetch(`${API_URL}/api/auth/get-session`, {
        headers: {
          Authorization: `Bearer ${loginData.token}`,
        },
      });

      console.log(`\nSession status: ${sessionRes.status}`);
      const sessionData = await sessionRes.json();
      console.log("Session response:", JSON.stringify(sessionData, null, 2));
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

async function main() {
  // Test avec rootuser
  await testLogin("rootuser@bridge.com", "00000000");

  // Test avec admin
  await testLogin("admin@bridge-guichet.com", "00000000");

  process.exit(0);
}

main();
