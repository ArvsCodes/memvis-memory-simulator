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
const addItem = document.querySelector('.onef-6');
const chartContainer = document.querySelector('.chart-container');

// // Event listener for the trigger item
addItem.addEventListener('click', function() {
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

// Select the simulation container and the memory size input
const simulationContainer = document.querySelector('.simulation-container');

memoryButton.addEventListener('click', function() {
    const memorySize = memorySizeInput.value;

    // Clear the simulation container first
    simulationContainer.innerHTML = '';

    // Check if there is a valid input
    if (memorySize) {
        // Create a new div for the memory size
        const memoryDiv = document.createElement('div');
        memoryDiv.classList.add('memory-div');

        // Create the <p> tag for memory size
        const memoryText = document.createElement('p');
        memoryText.textContent = `${memorySize} KB`;

        // Append the <p> tag to the memory div
        memoryDiv.appendChild(memoryText);

        // Append the memory div to the simulation container
        simulationContainer.appendChild(memoryDiv);
    }
});

// Select the onef-6 button for adding the block to the simulation-container
const forwardOnceButton = document.querySelector('.onef-6');

// Initialize an index to keep track of the current process to be added
let currentProcessIndex = 0;

// Variable to track the total used memory
let totalUsedMemory = 0; // Initialize a variable to keep track of used memory

// Define an array of colors
const colors = [
  '#b9fbc0', 
  '#98f5e1', 
  '#8eecf5', 
  '#90dbf4', 
  '#a3c4f3', 
  '#cfbaf0', 
  '#f1c0e8', 
  '#ffcfd2', 
  '#fde4cf',
  '#fbf8cc' 
];

// Initialize an index to keep track of which process to decrement
let decrementIndex = 0;
let holeExists = false; // Track if a hole exists
let holeSize = 0; // Store the size of the hole
let addedProcesses = []; // Track added process names
let holeIndex = -1; // Store the index of the hole

forwardOnceButton.addEventListener('click', function() {
    const parentProcesses = document.querySelectorAll('.parent-processes-container .processes-container');
    const processBlocks = simulationContainer.querySelectorAll('.process-block');

    // First: Attempt to add new process blocks if there’s available memory
    if (currentProcessIndex < parentProcesses.length) {
        const memorySize = parseInt(memorySizeInput.value); // Get total memory size input
        const memoryDiv = simulationContainer.querySelector('.memory-div'); // Get the memory div

        if (memoryDiv) {
            const remainingMemorySize = parseInt(memoryDiv.textContent.split(' ')[0]); // Extract remaining memory

            // Get the current process from the parent container
            const currentProcess = parentProcesses[currentProcessIndex];
            const processName = currentProcess.querySelector('.user-inputs p:nth-child(1)').textContent; // Process name
            const processSize = parseInt(currentProcess.querySelector('.user-inputs p:nth-child(2)').textContent); // Process size
            let processTU = parseInt(currentProcess.querySelector('.user-inputs p:nth-child(3)').textContent); // Process time unit

            // Check if there’s enough memory to add the process and it hasn't been added already
            if (remainingMemorySize >= processSize && !addedProcesses.includes(processName)) {
                // Create a new process block div
                const blockDiv = document.createElement('div');
                blockDiv.classList.add('process-block');

                // Decrement the time unit by 1 immediately
                processTU--;

                // Set the text for the block, including the decremented time unit
                blockDiv.textContent = `${processName} (${processSize} KB) (${processTU} seconds left)`;

                // Set the height of the block proportional to the memory size
                const blockHeightPercentage = (processSize / memorySize) * 100;
                blockDiv.style.height = `${blockHeightPercentage}%`; // Set the height as a percentage

                // Set the color of the block based on the index
                blockDiv.style.backgroundColor = colors[currentProcessIndex % colors.length];

                // Append the process block to the simulation container (at the bottom)
                simulationContainer.appendChild(blockDiv);

                // Update total used memory
                totalUsedMemory += processSize;

                // Calculate the remaining memory size
                const newRemainingMemorySize = memorySize - totalUsedMemory;

                // Remove any existing memory div and create a new one
                let memoryDiv = simulationContainer.querySelector('.memory-div');
                if (memoryDiv) {
                    memoryDiv.remove(); // Remove the existing memory div
                }

                // Create a new memory div for the remaining memory
                memoryDiv = document.createElement('div');
                memoryDiv.classList.add('memory-div');
                memoryDiv.style.height = `${(newRemainingMemorySize / memorySize) * 100}%`; // Memory div height proportional to remaining memory
                memoryDiv.textContent = `${newRemainingMemorySize} KB remaining`;

                // Append the updated memory div below the process blocks
                simulationContainer.appendChild(memoryDiv);

                // Mark this process as added
                addedProcesses.push(processName);

                // Increment the process index to point to the next process
                currentProcessIndex++;

                return; // Stop here if we’ve added a process
            }
        }
    }

    // Second: Handle existing blocks or holes
    if (holeExists) {
        // Check if any process can fit in the hole
        let foundProcess = null;
        for (let i = currentProcessIndex; i < parentProcesses.length; i++) {
            const processSize = parseInt(parentProcesses[i].querySelector('.user-inputs p:nth-child(2)').textContent);
            if (processSize <= holeSize && !addedProcesses.includes(parentProcesses[i].querySelector('.user-inputs p:nth-child(1)').textContent)) {
                foundProcess = parentProcesses[i];
                currentProcessIndex = i; // Update currentProcessIndex to the process we found
                break; // Stop looking once we find a fitting process
            }
        }

        if (foundProcess) {
            const processName = foundProcess.querySelector('.user-inputs p:nth-child(1)').textContent;
            let processSize = parseInt(foundProcess.querySelector('.user-inputs p:nth-child(2)').textContent);
            let processTU = parseInt(foundProcess.querySelector('.user-inputs p:nth-child(3)').textContent);

            // Create a new process block to fill the hole
            const blockDiv = document.createElement('div');
            blockDiv.classList.add('process-block');
            processTU--; // Decrement time unit

            blockDiv.textContent = `${processName} (${processSize} KB) (${processTU} seconds left)`;

            // Set the height based on hole size
            const blockHeightPercentage = (processSize / parseInt(memorySizeInput.value)) * 100;
            blockDiv.style.height = `${blockHeightPercentage}%`;

            blockDiv.style.backgroundColor = colors[currentProcessIndex % colors.length];

            const holeBlock = simulationContainer.querySelector('.hole');
            simulationContainer.replaceChild(blockDiv, holeBlock);

            // Create a new smaller hole if there’s leftover space
            holeSize -= processSize;
            if (holeSize > 0) {
                const remainingHoleDiv = document.createElement('div');
                remainingHoleDiv.classList.add('hole');
                remainingHoleDiv.style.height = `${(holeSize / parseInt(memorySizeInput.value)) * 100}%`;
                remainingHoleDiv.style.backgroundColor = '#EAEAEA';
                remainingHoleDiv.textContent = `${holeSize} KB remaining`;

                simulationContainer.insertBefore(remainingHoleDiv, blockDiv.nextSibling);
            } else {
                holeExists = false; // No hole left
            }

            // Mark this process as added
            addedProcesses.push(processName);

            // Set the index to the block after the hole
            decrementIndex = Array.prototype.indexOf.call(processBlocks, blockDiv) + 1;
            if (decrementIndex >= processBlocks.length) {
                decrementIndex = 0; // Loop back to the first block if we reach the end
            }
            holeIndex = -1; // Reset hole index

            return; // Stop here if a process was added to the hole
        } else {
            // If no process fits, decrement the block below the hole
            if (holeIndex >= 0) {
                decrementIndex = holeIndex + 1;
                if (decrementIndex >= processBlocks.length) {
                    decrementIndex = 0; // Loop to the top if necessary
                }
            }
        }
    }

    // Handle time unit decrements for existing blocks if no processes were added
    if (processBlocks.length > 0) {
        const currentBlock = processBlocks[decrementIndex]; // Start at the current block index
        const timeUnitMatch = currentBlock.textContent.match(/\((\d+) seconds left\)/);

        if (timeUnitMatch) {
            let timeUnit = parseInt(timeUnitMatch[1]);

            // Decrement the current block's time unit
            if (timeUnit > 0) {
                timeUnit--; // Decrement time unit
                currentBlock.textContent = currentBlock.textContent.replace(/\((\d+) seconds left\)/, `(${timeUnit} seconds left)`);
            }

            // Create a hole if the time unit reaches 0
            if (timeUnit === 0) {
                const processSize = parseInt(currentBlock.textContent.match(/\((\d+) KB\)/)[1]);
                const holeDiv = document.createElement('div');
                holeDiv.classList.add('hole');
                holeDiv.style.height = currentBlock.style.height;
                holeDiv.style.backgroundColor = '#EAEAEA';
                holeDiv.textContent = `${processSize} KB remaining`;

                simulationContainer.replaceChild(holeDiv, currentBlock);
                holeExists = true;
                holeSize = processSize;
                holeIndex = decrementIndex; // Store the index of the hole
            }

            // Move to the next process block for the next click
            decrementIndex++;
            if (decrementIndex >= processBlocks.length) {
                decrementIndex = 0; // Loop back to the first block if we reach the end
            }
        }
    }
});