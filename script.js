// Grab elements from the page.
const statusText = document.getElementById('status-text');
const startBtn = document.getElementById('start-btn');
const clickArea = document.getElementById('click-area');

let canClick = false;
let waitTimerId = null;
let clickStartTime = 0; // Timestamp for when "CLICK!" appears.

// Start button sets up the "wait" phase.
startBtn.addEventListener('click', () => {
  statusText.textContent = 'WAIT...';
  startBtn.disabled = true;
  canClick = false;
  clickStartTime = 0;

  // Wait for a random amount of time before showing "CLICK!".
  const randomDelay = Math.floor(Math.random() * 3000) + 1000; // 1-4 seconds

  waitTimerId = setTimeout(() => {
    statusText.textContent = 'CLICK!';
    canClick = true;

    // Save the exact moment the player is allowed to click.
    clickStartTime = Date.now();
  }, randomDelay);
});

// Clicking the large area handles both false starts and valid clicks.
clickArea.addEventListener('click', () => {
  // If player clicked before "CLICK!", it's a false start.
  if (!canClick) {
    // Only treat it as a false start while we are actively waiting.
    if (startBtn.disabled) {
      statusText.textContent = 'FALSE START!';
      startBtn.disabled = false;

      // Cancel the pending timer because the round is over.
      if (waitTimerId) {
        clearTimeout(waitTimerId);
        waitTimerId = null;
      }
    }

    return;
  }

  // Player clicked at the correct time, so calculate reaction time.
  const reactionTime = Date.now() - clickStartTime;
  statusText.textContent = `Reaction time: ${reactionTime} ms`;

  // Reset for the next round.
  canClick = false;
  startBtn.disabled = false;
  clickStartTime = 0;

  if (waitTimerId) {
    clearTimeout(waitTimerId);
    waitTimerId = null;
  }
});
