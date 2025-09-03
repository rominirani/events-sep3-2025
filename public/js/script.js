document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('schedule');
  const searchInput = document.getElementById('searchInput');
  const loadingIndicator = document.getElementById('loading-indicator');
  let talks = [];

  // Hide schedule initially
  scheduleContainer.classList.add('hidden');

  fetch('/api/talks')
    .then(response => response.json())
    .then(data => {
      talks = data;
      renderSchedule(talks);
      // Hide loading indicator and show schedule
      loadingIndicator.classList.add('hidden');
      scheduleContainer.classList.remove('hidden');
    });

  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredTalks = talks.filter(talk => 
      talk.category.some(cat => cat.toLowerCase().includes(searchTerm))
    );
    renderSchedule(filteredTalks);
  });

  function renderSchedule(talksToRender) {
    scheduleContainer.innerHTML = '';
    let startTime = new Date('2025-01-01T10:00:00');

    talksToRender.forEach((talk, index) => {
      if (index === 3) {
        const lunchBreak = document.createElement('div');
        lunchBreak.className = 'talk';
        const lunchTime = new Date(startTime.getTime());
        lunchBreak.innerHTML = `
          <div class="time">${formatTime(lunchTime)} - ${formatTime(new Date(lunchTime.getTime() + 60 * 60 * 1000))}</div>
          <h2>Lunch Break</h2>
        `;
        scheduleContainer.appendChild(lunchBreak);
        startTime.setMinutes(startTime.getMinutes() + 60);
      }

      const talkElement = document.createElement('div');
      talkElement.className = 'talk';

      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      talkElement.innerHTML = `
        <div class="time">${formatTime(startTime)} - ${formatTime(endTime)}</div>
        <h2>${talk.title}</h2>
        <div class="speakers">${talk.speakers.join(', ')}</div>
        <div class="category">${talk.category.map(c => `<span>${c}</span>`).join('')}</div>
        <p>${talk.description}</p>
      `;

      scheduleContainer.appendChild(talkElement);

      startTime = new Date(endTime.getTime() + 10 * 60 * 1000);
    });
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
});