document.addEventListener('DOMContentLoaded', () => {
  // Global mouse event prevention – disable all mouse actions
  document.addEventListener('mousedown', (e) => { e.preventDefault(); });
  document.addEventListener('mouseup', (e) => { e.preventDefault(); });
  document.addEventListener('click', (e) => { e.preventDefault(); });
  
  // Get element references
  const editableTextElement = document.getElementById('editable-text');
  const targetTextElement = document.getElementById('target-text');
  const startAgainButton = document.getElementById('start-again');
  const nextLevelButton = document.getElementById('next-level');
  const showShortcutsButton = document.getElementById('show-shortcuts');
  const shortcutsElement = document.getElementById('shortcuts');
  const keystrokeCountElement = document.getElementById('keystroke-count');
  const resultMessageElement = document.getElementById('result-message');
  const perfectScoreElement = document.getElementById('perfect-score-value');
  const differenceElement = document.getElementById('difference-value');
  // Modal elements (retained but not actively used)
  const retryModal = document.getElementById('retry-modal');
  const retryMessage = document.getElementById('retry-message');

  // State variables
  let keystrokeCount = 0;
  let currentLevel = 0;

  // Define sentence pairs
  const sentencePairs = [
    { original: "The house is red.", target: "The house is ready.", minMoves: 7 },
    { original: "She bought some groceries.", target: "She brought me groceries.", minMoves: 10 },
    { original: "He enjoys reading books.", target: "He reads books.", minMoves: 12 },
    { original: "They went for a walk.", target: "They walked.", minMoves: 12 },
  ];

  // Define keyboard shortcuts (for display only)
  const keyboardShortcuts = [
    '←: move left',
    '→: move right',
    '↑: go to beginning of sentence',
    'option (alt) + →: Move one word to the right',
    'option (alt) + ←: Move one word to the left',
    'shift + option (alt) + →: Select one word to the right',
    'shift + option (alt) + ←: Select one word to the left',
    'shift + ←: Highlight one space left',
    'shift + →: Highlight one space right',
    '⌘ (Ctrl) + →: Move to the end of the line',
    '⌘ (Ctrl) + ←: Move to the beginning of the line (hint: ↑ is better)',
    '⌘ (Ctrl) + shift + →: Select to the end of the line',
    '⌘ (Ctrl) + shift + ←: Select to the beginning of the line',
    'delete: Delete the selected text or the character before the cursor',
    '⌘ (Ctrl) + delete: Delete the entire line',
    'Fn + delete: forward delete (Mac only)',
  ];

  // Display keyboard shortcuts
  function displayShortcuts() {
    const ul = document.querySelector('#shortcuts ul');
    ul.innerHTML = '';
    keyboardShortcuts.forEach(shortcut => {
      const li = document.createElement('li');
      li.textContent = shortcut;
      ul.appendChild(li);
    });
  }

  // Update Perfect Score display
  function updatePerfectScore() {
    const sentencePair = sentencePairs[currentLevel];
    perfectScoreElement.textContent = sentencePair.minMoves;
  }

  // Reset Difference display to 0
  function updateDifference() {
    differenceElement.textContent = '0';
  }

  // Central reset/initialization function for a level
  function resetGameForLevel(levelIndex) {
    currentLevel = levelIndex;
    keystrokeCount = 0;
    resultMessageElement.textContent = '';
    editableTextElement.textContent = sentencePairs[currentLevel].original;
    targetTextElement.textContent = `Target: ${sentencePairs[currentLevel].target}`;
    keystrokeCountElement.textContent = keystrokeCount;
    updatePerfectScore();
    updateDifference();
    // Force focus on the editable text area and position cursor at the beginning
    editableTextElement.focus();
    const range = document.createRange();
    range.selectNodeContents(editableTextElement);
    range.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

  // When user presses Enter, check the answer
  function checkAnswer() {
    const currentText = editableTextElement.textContent.trim();
    // "Target: " is 8 characters; slice it off to get the target
    const targetText = targetTextElement.textContent.slice(8).trim();
    const sentencePair = sentencePairs[currentLevel];
    if (currentText === targetText) {
      let diff = keystrokeCount - sentencePair.minMoves;
      differenceElement.textContent = diff;
      if (diff === 0) {
  resultMessageElement.textContent = "NAILED IT!";
} else if (diff > 0) {
  resultMessageElement.textContent = "u can do better ;)";
} else {
  resultMessageElement.textContent = "k wait that's impressive";
}
    } else {
      alert("The text does not match the target. Try again!");
    }
  }

  // Listen for keystrokes in the editable text area
  editableTextElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      checkAnswer();
    } else {
      keystrokeCount++;
      keystrokeCountElement.textContent = keystrokeCount;
    }
  });
  editableTextElement.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      checkAnswer();
    }
  });

  // Button events:
  startAgainButton.addEventListener('click', () => {
    resetGameForLevel(currentLevel);
  });
  nextLevelButton.addEventListener('click', () => {
    let newLevel = currentLevel + 1;
    if (newLevel < sentencePairs.length) {
      resetGameForLevel(newLevel);
    } else {
      alert("Congratulations! You've completed all levels.");
      resetGameForLevel(0);
    }
const prevLevelButton = document.getElementById('prev-level');
prevLevelButton.addEventListener('click', () => {
  if (currentLevel > 0) {
    resetGameForLevel(currentLevel - 1);
  } else {
    alert("You're already at the first level.");
  }
});
  });
  showShortcutsButton.addEventListener('click', () => {
    shortcutsElement.classList.toggle('hidden');
    displayShortcuts();
  });

  // Initialize the game
  resetGameForLevel(0);
  displayShortcuts();
});