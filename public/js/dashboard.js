
const token = sessionStorage.getItem("token");

if (!token) {
    window.location.href = "/login";
}

const linksContainer = document.getElementById("linksContainer");
const createUrlForm = document.getElementById("createUrlForm");
const message = document.getElementById("message");

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (response.status === 401) {
        sessionStorage.removeItem("token");
        window.location.href = "/login";
        return null;
    }

    return response;
}

async function loadUrls() {
    try {
        const response = await apiRequest("/api/urls");

        if (!response) return;

        const data = await response.json();
        const urls = data.urls || [];

        document.getElementById("totalLinks").textContent = urls.length;

        const totalClicks = urls.reduce(
            (total, url) => total + Number(url.clicks || 0),
            0
        );

        document.getElementById("totalClicks").textContent = totalClicks;

        linksContainer.replaceChildren();

        if (urls.length === 0) {
            linksContainer.textContent = "You haven't created any links yet.";
            return;
        }

        urls.forEach((url) => {
            const card = document.createElement("div");
            card.className = "link-card";

            const original = document.createElement("p");
            original.textContent = url.original_url;

            const shortLink = document.createElement("a");
            shortLink.href = `${window.location.origin}/${encodeURIComponent(url.short_code)}`;
            shortLink.textContent = shortLink.href;
            shortLink.target = "_blank";
            shortLink.rel = "noopener noreferrer";

            const clicks = document.createElement("p");
            clicks.textContent = `Clicks: ${url.clicks}`;

            const actions = document.createElement("div");
            actions.className = "link-actions";

            const copyButton = document.createElement("button");
            copyButton.textContent = "Copy";

            copyButton.addEventListener("click", async () => {
                await navigator.clipboard.writeText(shortLink.href);
                copyButton.textContent = "Copied!";
            });

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";

            editButton.addEventListener("click", async () => {
                const newUrl = prompt("Enter the new original URL:", url.original_url);

                if (!newUrl) return;

                try {
                    new URL(newUrl);
                } catch {
                    alert("Please enter a valid URL.");
                    return;
                }

                const response = await apiRequest(`/api/urls/${url.url_id}`, {
                    method: "PUT",
                    body: JSON.stringify({ originalUrl: newUrl })
                });

                if (response && response.ok) {
                    loadUrls();
                } else if (response) {
                    const data = await response.json();
                    alert(data.message || "Could not update URL.");
                }
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", async () => {
                if (!confirm("Delete this shortened URL?")) return;

                const response = await apiRequest(`/api/urls/${url.url_id}`, {
                    method: "DELETE"
                });

                if (response && response.ok) {
                    loadUrls();
                } else if (response) {
                    alert("Could not delete URL.");
                }
            });

            actions.append(copyButton, editButton, deleteButton);
            card.append(original, shortLink, clicks, actions);
            linksContainer.appendChild(card);
        });
    } catch (error) {
        linksContainer.textContent = "Could not load your links.";
    }
}

createUrlForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const originalUrl = document.getElementById("originalUrl").value;

    try {
        new URL(originalUrl);
    } catch {
        message.textContent = "Please enter a valid URL.";
        return;
    }

    const response = await apiRequest("/api/urls", {
        method: "POST",
        body: JSON.stringify({ originalUrl })
    });

    if (!response) return;

    const data = await response.json();

    if (!response.ok) {
        message.textContent = data.message || "Could not create short URL.";
        return;
    }

    message.textContent = "Short URL created successfully.";
    createUrlForm.reset();
    loadUrls();
});

document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("token");
    window.location.href = "/login";
});

loadUrls();
