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

// Initialize a counter for the time unit
let timeCounter = 1;

// Select the item that will trigger the creation of the new cell-container
const triggerItem = document.querySelector('.onef-6');
const chartContainer = document.querySelector('.chart-container');

// Event listener for the trigger item
triggerItem.addEventListener('click', function() {
    // Create a new cell-container div
    const newCellContainer = document.createElement('div');
    newCellContainer.classList.add('cell-container');

    // Create the inner content for the new cell
    const newCell = document.createElement('div');
    newCell.classList.add('cell');
    newCell.innerHTML = `<p>J1</p>`; // Change 'J1' as needed for uniqueness

    const timeUnit = document.createElement('p');
    timeUnit.classList.add('tu');
    timeUnit.textContent = timeCounter; // Set the time unit as the current counter value

    // Append the new elements to the cell-container
    newCellContainer.appendChild(newCell);
    newCellContainer.appendChild(timeUnit);

    // Append the new cell-container to the chart-container
    chartContainer.appendChild(newCellContainer);

    // Increment the counter for the next time unit
    timeCounter++;
});

// Select the item that will trigger the removal of the latest cell-container
const removeItem = document.querySelector('.oneb-8');

// Event listener for the remove item
removeItem.addEventListener('click', function() {
    const chartContainer = document.querySelector('.chart-container');
    
    // Check if there are any cell-containers to remove
    const lastCellContainer = chartContainer.lastElementChild;
    if (lastCellContainer) {
        chartContainer.removeChild(lastCellContainer); // Remove the last cell-container
        timeCounter--; // Decrement the counter
    }
});

// Select the item that will trigger the adding of cell-containers
const autoAddItem = document.querySelector('.fullf-7');
const autoAddImage = autoAddItem.querySelector('img'); // Select the image inside fullf-7

// Variable to keep track of the interval for adding cell-containers
let intervalId = null;

// Event listener for the auto-add item
autoAddItem.addEventListener('click', function() {
    if (intervalId === null) {
        // If no interval is set, start adding cell-containers every second
        intervalId = setInterval(() => {
            // Create a new cell-container div
            const newCellContainer = document.createElement('div');
            newCellContainer.classList.add('cell-container');

            // Create the inner content for the new cell
            const newCell = document.createElement('div');
            newCell.classList.add('cell');
            newCell.innerHTML = `<p>J1</p>`; // Change 'J1' as needed for uniqueness

            const timeUnit = document.createElement('p');
            timeUnit.classList.add('tu');
            timeUnit.textContent = timeCounter; // Set the time unit as the current counter value

            // Append the new elements to the cell-container
            newCellContainer.appendChild(newCell);
            newCellContainer.appendChild(timeUnit);

            // Append the new cell-container to the chart-container
            chartContainer.appendChild(newCellContainer);

            // Increment the counter for the next time unit
            timeCounter++;
        }, 1000); // Run every second

        // Change the image to player-pause.svg
        autoAddImage.src = 'images/player-pause.svg';
        autoAddItem.classList.add('active'); // Add active class
    } else {
        // If interval is already running, clear it
        clearInterval(intervalId);
        intervalId = null; // Reset the intervalId

        // Revert the image back to player-skip-forward.svg
        autoAddImage.src = 'images/player-skip-forward.svg';
        autoAddItem.classList.remove('active'); // Remove active class
    }
});


// Variable to keep track of the interval for removing cell-containers
let removeIntervalId = null;

// Select the item that will trigger the removal of cell-containers
const autoRemoveItem = document.querySelector('.fullb-9');
const autoRemoveImage = autoRemoveItem.querySelector('img'); // Select the image inside fullf-7

// Event listener for the remove item
autoRemoveItem.addEventListener('click', function() {
    if (removeIntervalId === null) {
        // If no interval is set, start removing cell-containers every second
        removeIntervalId = setInterval(() => {
            const chartContainer = document.querySelector('.chart-container');
            
            // Check if there are any cell-containers to remove
            const lastCellContainer = chartContainer.lastElementChild;
            if (lastCellContainer) {
                chartContainer.removeChild(lastCellContainer); // Remove the last cell-container
                timeCounter--; // Decrement the counter if desired
            }
        }, 1000); // Run every second

        // Change the image to player-pause.svg
        autoRemoveImage.src = 'images/player-pause.svg';
        autoRemoveItem.classList.add('active'); // Add active class
    } else {
        // If interval is already running, clear it
        clearInterval(removeIntervalId);
        removeIntervalId = null; // Reset the intervalId

        // Revert the image back to player-skip-forward.svg
        autoRemoveImage.src = 'images/player-skip-forward.svg';
        autoRemoveItem.classList.remove('active'); // Remove active class
    }
});



