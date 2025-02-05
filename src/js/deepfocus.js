const audio = document.getElementById("audio");
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const volumeControl = document.getElementById("volume");
const songTitle = document.getElementById("song-title");
const songImage = document.getElementById("song-image");
const playlistItems = document.querySelectorAll(".playlist-item");
const sidebar = document.querySelector(".sidebar");
const toggleSidebarBtn = document.getElementById("toggle-sidebar");
const closeSidebarBtn = document.getElementById("close-sidebar");

let songs = [];
playlistItems.forEach(item => {
    songs.push({
        src: item.dataset.src,
        image: item.dataset.image,
        title: item.textContent.trim()
    });
});

let currentSongIndex = 0;

function loadSong(index) {
    audio.src = songs[index].src;
    songTitle.textContent = songs[index].title;
    songImage.src = songs[index].image;
    audio.play();
    playBtn.textContent = "⏸️";
}

playlistItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        currentSongIndex = index;
        loadSong(index);
        sidebar.classList.remove("active");
    });
});

playBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = "⏸️";
    } else {
        audio.pause();
        playBtn.textContent = "▶️";
    }
});

prevBtn.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
});

nextBtn.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
});

audio.addEventListener("timeupdate", () => {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
});

progressBar.addEventListener("input", () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});

volumeControl.addEventListener("input", () => {
    audio.volume = volumeControl.value;
});

// Sidebar toggle functionality
toggleSidebarBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
});

closeSidebarBtn.addEventListener("click", () => {
    sidebar.classList.remove("active");
});
