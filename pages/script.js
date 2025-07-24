let certData = null;

document.getElementById("fileInput").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const content = await file.text();
    try {
        certData = JSON.parse(content);
        document.getElementById("output").textContent = "Ready to verify.";
        document.getElementById("verifyButton").disabled = false;
    } catch {
        document.getElementById("output").textContent = "Invalid JSON file.";
        certData = null;
        document.getElementById("verifyButton").disabled = true;
    }
});

document.getElementById("verifyButton").addEventListener("click", async () => {
    if (!certData) return;

    document.getElementById("output").textContent = "Verifying…";

    try {
        const res = await fetch("https://validity.crashdebug.dev/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(certData)
        });

        const result = await res.json();
        document.getElementById("output").textContent = JSON.stringify(result, null, 2);
    } catch (err) {
        document.getElementById("output").textContent = `Error: ${err}`;
    }
});
