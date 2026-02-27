export async function apiRequest(endpoint, method = "GET", body = null, token = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!res.ok) {
      const error = await res.json();

      // If unauthorized or token missing, redirect to login
      if (res.status === 401 || res.status === 403) {
        window.location.href = "/login"; // redirect to login page
        return; // stop further execution
      }

      throw new Error(error.detail || "API Error");
    }

    return res.json();
  } catch (err) {
    // Optional: console log or further handling
    console.error(err);
    throw err;
  }
}
