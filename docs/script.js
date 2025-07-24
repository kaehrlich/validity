document.getElementById("verifyButton").addEventListener("click", async () => {
    if (!certData) return;

    document.getElementById("rawOutput").textContent = "Verifying…";
    document.getElementById("parsedOutput").textContent = "";

    try {
        const res = await fetch("https://validity.crashdebug.dev/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(certData),
        });

        const text = await res.text();
        document.getElementById("rawOutput").textContent = text;

        try {
            const parsed = JSON.parse(text);
            document.getElementById("parsedOutput").innerHTML = Object.entries(parsed)
                .map(([k, v]) => `<div><strong>${k}:</strong> ${v}</div>`)
                .join("");
        } catch {
            document.getElementById("parsedOutput").textContent = "Invalid JSON response.";
        }

    } catch (err) {
        document.getElementById("rawOutput").textContent = `Error: ${err}`;
    }
});
