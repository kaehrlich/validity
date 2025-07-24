let certData = null;

const fileInput = document.getElementById("fileInput");
const verifyButton = document.getElementById("verifyButton");
const output = document.getElementById("output");

fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const content = await file.text();
        certData = JSON.parse(content);
        output.textContent = "Ready to verify.";
        verifyButton.disabled = false;
    } catch {
        output.textContent = "Invalid JSON file.";
        certData = null;
        verifyButton.disabled = true;
    }
});

verifyButton.addEventListener("click", async () => {
    if (!certData) return;

    output.textContent = "Verifying…";
    verifyButton.disabled = true;

    try {
        const res = await fetch("https://validity.crashdebug.dev/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(certData)
        });

        const result = await res.json();
        output.textContent = JSON.stringify(result, null, 2);
    } catch (err) {
        output.textContent = `Error: ${err}`;
    }

    verifyButton.disabled = false;
});
