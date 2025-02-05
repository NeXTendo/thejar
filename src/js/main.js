document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submit-btn");
    const feelingInput = document.getElementById("feeling-input");
    const responseText = document.getElementById("response-text");
    const responseGif = document.getElementById("response-gif");
    const clickSound = document.getElementById("click-sound");
  
    // 🎥 Cute GIFs List
    const gifs = [
        "/assets/gifs/hug.gif",
        "/assets/gifs/cute-animal.gif",
        "/assets/gifs/heart.gif",
        "/assets/gifs/kawaii.gif"
    ];

    // 💬 AI Response Handler
    submitBtn.addEventListener("click", async () => {
        clickSound.play();
        
        const userMessage = feelingInput.value.trim();
        if (userMessage === "") {
            responseText.innerText = "Please tell me what’s on your heart... 💕";
            return;
        }

        responseText.innerText = "Thinking... 🤔";
        
        try {
            const res = await fetch("http://localhost:5000/api/generate-response", { // ✅ Corrected API URL
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await res.json();
            if (data.reply) {
                responseText.innerText = data.reply;
                
                // Show random GIF
                const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
                responseGif.src = randomGif;
                responseGif.classList.remove("hidden");
            } else {
                responseText.innerText = "Hmm, I couldn't think of a response. 💭";
            }

        } catch (error) {
            responseText.innerText = "Oops! Something went wrong. 😞";
            console.error(error);
        }

        feelingInput.value = "";
    });

});
