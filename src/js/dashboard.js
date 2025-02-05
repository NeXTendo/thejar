document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("http://localhost:5000/weekly-summary");
    const moodData = await response.json();

    const labels = moodData.map(entry => entry.date);
    const moods = moodData.map(entry => entry.mood);

    // 🎨 Line Chart - Mood Over Time
    new Chart(document.getElementById("lineChart"), {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Mood Rating",
                data: moods,
                borderColor: "#6A994E",
                backgroundColor: "rgba(106, 153, 78, 0.2)",
                fill: true
            }]
        }
    });

    // 🥧 Pie Chart - Mood Distribution
    const moodCounts = {};
    moods.forEach(mood => { moodCounts[mood] = (moodCounts[mood] || 0) + 1; });

    new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: {
            labels: Object.keys(moodCounts),
            datasets: [{
                data: Object.values(moodCounts),
                backgroundColor: ["#FFB5A7", "#FF9B54", "#FFCAD4", "#6A994E", "#386641"]
            }]
        }
    });

    // 📊 Bar Chart - Mood Trends per Day
    new Chart(document.getElementById("barChart"), {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Mood Levels",
                data: moods,
                backgroundColor: "#A7C957"
            }]
        }
    });

    // 📆 Calendar Heatmap (D3.js)
    const calendarData = moodData.map(entry => ({
        date: new Date(entry.date),
        mood: entry.mood
    }));

    const svg = d3.select("#calendar-heatmap").append("svg").attr("width", 600).attr("height", 200);
    const rects = svg.selectAll("rect")
        .data(calendarData)
        .enter()
        .append("rect")
        .attr("x", d => d.date.getDate() * 20)
        .attr("y", d => d.date.getMonth() * 20)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", d => d3.interpolateRdYlGn(d.mood / 5));
});
