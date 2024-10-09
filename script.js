window.onload = function () {
  document.body.classList.add('fade-in');
};

// Select input fields by their IDs
const memorySizeInput = document.getElementById('memory-size');
const compactionTimeInput = document.getElementById('comp-time');
const coalescingHoleInput = document.getElementById('coal-hole');

// Select the buttons to capture the input values
const memoryButton = document.querySelector('.mems-3 button');
const compactionButton = document.querySelector('.comp-4 button');
const coalescingButton = document.querySelector('.hole-5 button');

// Event listener for memory size input
memoryButton.addEventListener('click', function() {
  const memorySize = memorySizeInput.value;
  console.log('Memory Size:', memorySize);
});

// Event listener for compaction time input
compactionButton.addEventListener('click', function() {
  const compactionTime = compactionTimeInput.value;
  console.log('Compaction Time:', compactionTime);
});

// Event listener for coalescing hole input
coalescingButton.addEventListener('click', function() {
  const coalescingHole = coalescingHoleInput.value;
  console.log('Coalescing Hole Time:', coalescingHole);
});

// Select the input fields for process name, size, and TU
const processNameInput = document.getElementById('processno-input');
const processSizeInput = document.getElementById('size-input');
const processTUInput = document.getElementById('tu-input');

// Select the add button
const addProcessButton = document.querySelector('.process-input-container .add-button');

// Select the parent container for processes
const parentProcessesContainer = document.querySelector('.parent-processes-container');

// Event listener to handle adding a process
addProcessButton.addEventListener('click', function() {
  const processName = processNameInput.value;
  const processSize = processSizeInput.value;
  const processTU = processTUInput.value;

  // Create the new process div (processes-container)
  const newProcessDiv = document.createElement('div');
  newProcessDiv.classList.add('processes-container');

  // Create the user-inputs div
  const userInputsDiv = document.createElement('div');
  userInputsDiv.classList.add('user-inputs');
  userInputsDiv.innerHTML = `
      <p>${processName}</p>
      <p>${processSize} KB</p>
      <p>${processTU}</p>
  `;

  // Create the edit-del-container div
  const editDelDiv = document.createElement('div');
  editDelDiv.classList.add('edit-del-container');
  editDelDiv.innerHTML = `
      <button class="del-button"><img src="images/x.svg" class="del-red"></button>
  `;

  // Append user-inputs and edit-del-container to the new process div
  newProcessDiv.appendChild(userInputsDiv);
  newProcessDiv.appendChild(editDelDiv);

  // Append the new process div to the parent-processes-container
  parentProcessesContainer.appendChild(newProcessDiv);

  // Clear the input fields
  processNameInput.value = '';
  processSizeInput.value = '';
  processTUInput.value = '';

  // Add delete listeners for the new process
  addDeleteListeners();
});

// Select the delete button for clearing inputs
const delProcessButton = document.querySelector('.process-input-container .del-button');

// Event listener to handle clearing the inputs
delProcessButton.addEventListener('click', function() {
  // Clear the input fields
  processNameInput.value = '';
  processSizeInput.value = '';
  processTUInput.value = '';
});

// Function to handle deleting a specific process container
function deleteProcess(event) {
  // Find the parent processes-container of the clicked delete button
  const processContainer = event.target.closest('.processes-container');
  if (processContainer) {
      processContainer.remove(); // Remove the process container from the DOM
  }
}

// Add event listeners to all delete buttons in the existing processes
function addDeleteListeners() {
  const deleteButtons = document.querySelectorAll('.edit-del-container .del-button');
  deleteButtons.forEach(button => {
      button.addEventListener('click', deleteProcess);
  });
}

// Initial call to add delete listeners for any existing delete buttons
addDeleteListeners();
