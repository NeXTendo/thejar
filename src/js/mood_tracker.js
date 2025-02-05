document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submit-btn");
    const feelingInput = document.getElementById("feeling-input");
    const responseText = document.getElementById("response-text");
    const responseGif = document.getElementById("response-gif");
    const clickSound = document.getElementById("click-sound");

    const gifs = [
        "public/assets/gifs/hug.gif",
        "public/assets/gifs/cute-animal.gif",
        "public/assets/gifs/heart.gif",
        "public/assets/gifs/kawaii.gif"
    ];

    submitBtn.addEventListener("click", async () => {
        clickSound.play();

        const userMessage = feelingInput.value.trim();
        if (userMessage === "") {
            responseText.innerText = "Please tell me what’s on your heart... 💕";
            return;
        }

        responseText.innerText = "Thinking... 🤔";

        try {
            const res = await fetch("http://localhost:5000/generate-response", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await res.json();
            responseText.innerText = data.reply;

            // Show random GIF
            const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
            responseGif.src = randomGif;
            responseGif.classList.remove("hidden");

        } catch (error) {
            responseText.innerText = "Oops! Something went wrong. 😞";
            console.error(error);
        }

        feelingInput.value = "";
    });

    // **Theme Switcher**
    const themeSwitcher = document.getElementById("theme-switcher");
    const body = document.body;
    const themes = ["pastel-theme", "cozy-night-theme", "sakura-theme"];

    let currentThemeIndex = 0;
    body.classList.add("earthy-theme");

    themeSwitcher.addEventListener("click", () => {
        body.classList.remove(themes[currentThemeIndex]);
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        body.classList.add(themes[currentThemeIndex]);
    });

    // **Mood Tracker**
    const moodButtons = document.querySelectorAll(".mood-btn");
    const moodSummary = document.getElementById("mood-summary");

    moodButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const moodValue = button.getAttribute("data-mood");

            await fetch("http://localhost:5000/save-mood", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mood: parseInt(moodValue) })
            });

            fetchMoodSummary();
        });
    });

    async function fetchMoodSummary() {
        const res = await fetch("http://localhost:5000/get-mood-summary");
        const data = await res.json();
        moodSummary.innerText = data.summary;
    }

    // Fetch mood summary on load
    fetchMoodSummary();
});
