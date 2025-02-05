document.addEventListener("DOMContentLoaded", () => {
    const moodButtons = document.querySelectorAll(".mood-btn");
    const submitMoodBtn = document.getElementById("submit-mood");
    const moodSummary = document.getElementById("mood-summary");
    const responseText = document.getElementById("response-text");
    const responseGif = document.getElementById("response-gif");
    const feelingInput = document.getElementById("feeling-input");
    const clickSound = new Audio("/src/assets/sounds/click.mp3");
    const themeSwitcher = document.getElementById("theme-switcher");
    const submitBtn = document.getElementById("submit-btn");
    
    const gifs = [
        "public/assets/gifs/hug.gif",
        "public/assets/gifs/cute-animal.gif",
        "public/assets/gifs/heart.gif",
        "public/assets/gifs/kawaii.gif"
    ];

    let selectedMood = null;

    // 🎵 Play Click Sound
    moodButtons.forEach(button => {
        button.addEventListener("click", () => {
            clickSound.play();
            selectedMood = button.getAttribute("data-mood");

            // Animate background change
            document.body.dataset.mood = selectedMood;
        });
    });

    // 📥 Save Mood to MongoDB
    submitMoodBtn.addEventListener("click", async () => {
        if (!selectedMood) {
            alert("Please select a mood first! 💖");
            return;
        }

        try {
            const response = await fetch("/save-mood", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mood: parseInt(selectedMood) })
            });

            if (response.ok) {
                alert("Mood saved! 🥰");
                fetchMoodSummary();
            } else {
                alert("Oops! Something went wrong. 😞");
            }
        } catch (error) {
            console.error("Error saving mood:", error);
        }
    });

    // 📊 Fetch Mood Summary
    async function fetchMoodSummary() {
        try {
            const res = await fetch("/get-mood-summary");
            const data = await res.json();
            moodSummary.innerText = data.summary;
        } catch (error) {
            console.error("Error fetching mood summary:", error);
        }
    }
    fetchMoodSummary();

    // 📝 AI Response Handling
    document.getElementById("submit-btn").addEventListener("click", async () => {
        clickSound.play();
        
        const userMessage = feelingInput.value.trim();
        if (!userMessage) {
            responseText.innerText = "Please tell me what’s on your heart... 💕";
            return;
        }

        responseText.innerText = "Thinking... 🤔";

        try {
            const res = await fetch("/generate-response", {
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

    // 🎨 Theme Switcher
    const buttons = document.querySelectorAll(".theme-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            document.documentElement.setAttribute("data-theme", btn.getAttribute("data-theme"));
            localStorage.setItem("selected-theme", btn.getAttribute("data-theme"));
        });
    });

    // Load saved theme
    const savedTheme = localStorage.getItem("selected-theme");
    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
    }
});