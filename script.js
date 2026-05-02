// Grab elements from the page.
const statusText = document.getElementById('status-text');
const startBtn = document.getElementById('start-btn');
const clickArea = document.getElementById('click-area');

let canClick = false;
let waitTimerId = null;
let clickStartTime = 0; // Timestamp for when "CLICK!" appears.

// List of all possible visual state classes for the click area.
const areaStates = ['state-neutral', 'state-waiting', 'state-ready', 'state-warning'];

// Small helper: keep state updates in one place so the code stays easy to read.
function setClickAreaState(stateClass) {
  clickArea.classList.remove(...areaStates);
  clickArea.classList.add(stateClass);
}

// Initial state when the page first loads.
setClickAreaState('state-neutral');

// Start button sets up the "wait" phase.
startBtn.addEventListener('click', () => {
  statusText.textContent = 'WAIT...';
  startBtn.disabled = true;
  canClick = false;
  clickStartTime = 0;

  // During waiting, the area should show a warning/red appearance.
  setClickAreaState('state-waiting');

  // Wait for a random amount of time before showing "CLICK!".
  const randomDelay = Math.floor(Math.random() * 3000) + 1000; // 1-4 seconds

  waitTimerId = setTimeout(() => {
    statusText.textContent = 'CLICK!';
    canClick = true;

    // Green means the player can click now.
    setClickAreaState('state-ready');

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

      // Show warning feedback for false start.
      setClickAreaState('state-warning');

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

  // After a valid reaction result, go back to neutral appearance.
  setClickAreaState('state-neutral');

  if (waitTimerId) {
    clearTimeout(waitTimerId);
    waitTimerId = null;
  }
});
