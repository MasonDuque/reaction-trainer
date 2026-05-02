// Grab elements from the page.
const statusText = document.getElementById('status-text');
const startBtn = document.getElementById('start-btn');
const clickArea = document.getElementById('click-area');

let canClick = false;
let waitTimerId = null;

// Start button sets up the "wait" phase.
startBtn.addEventListener('click', () => {
  statusText.textContent = 'WAIT...';
  startBtn.disabled = true;
  canClick = false;

  // Wait for a random amount of time before showing "CLICK!".
  const randomDelay = Math.floor(Math.random() * 3000) + 1000; // 1-4 seconds

  waitTimerId = setTimeout(() => {
    statusText.textContent = 'CLICK!';
    canClick = true;
  }, randomDelay);
});

// Clicking the large area only works when "CLICK!" is shown.
clickArea.addEventListener('click', () => {
  if (!canClick) {
    return;
  }

  statusText.textContent = 'Click Start';
  canClick = false;
  startBtn.disabled = false;

  // Clear the timer just in case a new round starts quickly.
  if (waitTimerId) {
    clearTimeout(waitTimerId);
    waitTimerId = null;
  }
});
