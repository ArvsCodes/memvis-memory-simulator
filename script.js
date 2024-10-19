window.onload = function () {
    document.body.classList.add('fade-in');

    const predefinedProcesses = [
        { name: 'Job 1', size: 200, timeUnit: 5 },
        { name: 'Job 2', size: 350, timeUnit: 3 },
        { name: 'Job 3', size: 400, timeUnit: 2 },
        { name: 'Job 4', size: 80, timeUnit: 4 },
        { name: 'Job 5', size: 170, timeUnit: 4 },
        { name: 'Job 6', size: 310, timeUnit: 4 }
    ];
  
    predefinedProcesses.forEach(process => {
        addProcessToList(process.name, process.size, process.timeUnit);
    });
};

// DECLARATIONS ----------------------------------------------------------------------------------------

const memorySizeInput = document.getElementById('memory-size');
const compactionTimeInput = document.getElementById('comp-time');
const coalescingHoleInput = document.getElementById('coal-hole');

const memoryButton = document.querySelector('.mems-3 button');
const compactionButton = document.querySelector('.comp-4 button');
const coalescingButton = document.querySelector('.hole-5 button');

const processNameInput = document.getElementById('processno-input');
const processSizeInput = document.getElementById('size-input');
const processTUInput = document.getElementById('tu-input');

const addProcessButton = document.querySelector('.process-input-container .add-button');
const parentProcessesContainer = document.querySelector('.parent-processes-container');
const chartContainer = document.querySelector('.chart-container');
const simulationContainer = document.querySelector('.simulation-container');

const removeItem = document.querySelector('.oneb-8');

const forwardOnceButton = document.querySelector('.onef-6');
const forwardFullButton = document.querySelector('.fullf-7');
const forwardFullImage = forwardFullButton.querySelector('img');

const backwardOnceButton = document.querySelector('.oneb-8');
const backwardFullButton = document.querySelector('.fullb-9');
const backwardFullImage = backwardFullButton.querySelector('img');

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

let currentProcessIndex = 0;
let timeCounter = 1;
let totalUsedMemory = 0;
let decrementIndex = 0;
let holeExists = false;
let holeSize = 0;
let addedProcesses = [];
let holeIndex = -1;
let memoryHistory = [];

let coalescingHoleTime = 0;
let compactionTime = 0;
let coalescingCounter = 0;
let compactionCounter = 0;
let isCoalescing = false;
let isCompacting = false;

let forwardIntervalId = null;
let backwardIntervalId = null;

// DECLARATIONS ----------------------------------------------------------------------------------------

// FUNCTIONS ----------------------------------------------------------------------------------------

// add a process to the list
function addProcessToList(processName, processSize, processTU) {
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
    const parentProcessesContainer = document.querySelector('.parent-processes-container');
    parentProcessesContainer.appendChild(newProcessDiv);

    // Add delete listeners for the new process
    addDeleteListeners();
}

// delete a specific process container
function deleteProcess(event) {
    // Find the parent processes-container of the clicked delete button
    const processContainer = event.target.closest('.processes-container');
    if (processContainer) {
        processContainer.remove(); // Remove the process container from the DOM
    }
}
  
// add event listeners to all delete buttons in the existing processes
function addDeleteListeners() {
const deleteButtons = document.querySelectorAll('.edit-del-container .del-button');
deleteButtons.forEach(button => {
    button.addEventListener('click', deleteProcess);
});
}

// check and combine adjacent holes or memory-div one step at a time
function coalesceAdjacentHoles() {
    const blocks = simulationContainer.children;
    let holesCombined = false;

    // Iterate over the blocks and find the first adjacent pair of holes or memory-div
    for (let i = 0; i < blocks.length - 1; i++) {
        const currentBlock = blocks[i];
        const nextBlock = blocks[i + 1];

        // Check if both current and next blocks are holes or memory-div
        if ((currentBlock.classList.contains('hole') || currentBlock.classList.contains('memory-div')) &&
            (nextBlock.classList.contains('hole') || nextBlock.classList.contains('memory-div'))) {

            const currentSize = parseInt(currentBlock.textContent.match(/\d+/)[0]);
            const nextSize = parseInt(nextBlock.textContent.match(/\d+/)[0]);

            const combinedSize = currentSize + nextSize;

            // Update the current block with the new combined size
            currentBlock.textContent = `${combinedSize} KB remaining`;
            currentBlock.style.height = `${(combinedSize / parseInt(memorySizeInput.value)) * 100}%`;

            // Update the global `holeSize` to reflect the combined hole size
            holeSize = combinedSize;

            // Remove the next block
            nextBlock.remove();

            holesCombined = true;
            break;
        }
    }

    return holesCombined;
}

// check and combine adjacent holes or memory-div based on current time unit
function coalesceAdjacentHolesIfTimeUnitIsValid() {
    const currentTimeUnit = timeCounter;

    // Only coalesce if the current time unit is a multiple of the coalescing time
    if (coalescingHoleTime > 0 && currentTimeUnit > 0 && currentTimeUnit % coalescingHoleTime === 0) {
        return coalesceAdjacentHoles(); // Call the existing function to combine holes
    }
    return false; // No holes were combined
}

// get the current state of the memory container
function getCurrentMemoryState() {
    const memoryState = [];
    const blocks = simulationContainer.children;
    
    for (let block of blocks) {
        memoryState.push(block.outerHTML); // Store the entire block's HTML
    }
    
    return memoryState.join(''); // Join them into a single string
}

// perform compaction (largest block first, then combine holes)
function performStorageCompaction() {
    return new Promise((resolve) => {
        const blocks = Array.from(simulationContainer.children);

        // Separate process blocks and holes/memory-div
        let processBlocks = [];
        let holeBlocks = [];
    
        blocks.forEach(block => {
            if (block.classList.contains('process-block')) {
                processBlocks.push(block);
            } else if (block.classList.contains('hole') || block.classList.contains('memory-div')) {
                holeBlocks.push(block);
            }
        });
    
        // Sort process blocks from largest to smallest size
        processBlocks.sort((a, b) => {
            const sizeA = parseInt(a.textContent.match(/\((\d+) KB\)/)[1]);
            const sizeB = parseInt(b.textContent.match(/\((\d+) KB\)/)[1]);
            return sizeB - sizeA; // Sort largest to smallest
        });
    
        let currentBlockIndex = 0;
    
        function moveNextBlock() {
            // Check if we still have blocks to move
            if (currentBlockIndex < processBlocks.length) {
                const block = processBlocks[currentBlockIndex];
    
                // Move the block to the top of the container but below the previous largest block
                const firstHoleOrSmallerBlock = Array.from(simulationContainer.children).find(child => 
                    child.classList.contains('hole') || child.classList.contains('memory-div') || 
                    parseInt(child.textContent.match(/\((\d+) KB\)/)?.[1]) < parseInt(block.textContent.match(/\((\d+) KB\)/)[1])
                );
    
                if (firstHoleOrSmallerBlock) {
                    simulationContainer.insertBefore(block, firstHoleOrSmallerBlock);
                } else {
                    // If no smaller blocks or holes found, place the block at the end
                    simulationContainer.appendChild(block);
                }
    
                currentBlockIndex++;
    
                // Move the next block after a delay
                setTimeout(() => {
                    // Add a new cell to the chart AFTER the block has been moved
                    addCell('SC'); 
                    moveNextBlock(); // Call for the next block movement
                }, 1000); // Adjust this delay if needed
                
            } else {
                // All blocks have been moved, now combine and place holes
                combineHoles(holeBlocks);
            }
        }
    
        moveNextBlock(); // Start moving blocks
        setTimeout(() => {
            resolve(); // Indicate compaction is done
        }, 3000); // Simulate compaction delay
    });
}

// combine holes after all blocks have been moved
function combineHoles(holeBlocks) {
    let combinedSize = 0;

    // Combine all holes and memory-div into one
    holeBlocks.forEach(hole => {
        combinedSize += parseInt(hole.textContent.match(/\d+/)[0]);
        hole.remove(); // Remove each hole or memory-div from the container
    });

    // Create a new combined hole with the total size
    if (combinedSize > 0) {
        const combinedHoleDiv = document.createElement('div');
        combinedHoleDiv.classList.add('hole');
        combinedHoleDiv.style.height = `${(combinedSize / parseInt(memorySizeInput.value)) * 100}%`;
        combinedHoleDiv.style.backgroundColor = 'var(--primary-color)';
        combinedHoleDiv.style.color = 'var(--text-color)';
        combinedHoleDiv.textContent = `${combinedSize} KB remaining`;

        // Place the combined hole after the last process block
        simulationContainer.appendChild(combinedHoleDiv);

        // Update the global `holeSize` to reflect the combined hole size
        holeSize = combinedSize; // Correctly update the global hole size here
        holeExists = true;
    }
}

// stop auto-forwarding when simulation is done
function stopAutoForwardingIfFullSizeHoleDetected() {
    const memorySize = parseInt(memorySizeInput.value);
    const fullSizeHole = Array.from(simulationContainer.children).some(block => {
        return block.classList.contains('hole') && parseInt(block.textContent) === memorySize;
    });

    // If a full-size hole is detected, stop auto-forwarding immediately
    if (fullSizeHole) {

        // Get the latest time unit from the last appended cell in the chart
        const latestCell = chartContainer.lastElementChild;
        const latestTimeUnit = latestCell ? latestCell.querySelector('.tu').textContent : '0';

        // Update the output container with the latest time unit
        const ftuOutputContainer = document.querySelector('.ftu');
        ftuOutputContainer.innerHTML = `${latestTimeUnit}`;

        if (forwardIntervalId !== null) {
            clearInterval(forwardIntervalId);
            forwardIntervalId = null;
            forwardFullImage.src = 'images/player-skip-forward.svg'; // Update the button image
            forwardFullButton.classList.remove('active'); // Indicate auto-forwarding is inactive
        }
    }
}

// add a cell to the time chart based on label
function addCell(label = '') {
    console.log(`Adding cell with label: ${label} at time: ${timeCounter}`);

    const newCellContainer = document.createElement('div');
    newCellContainer.classList.add('cell-container');

    const newCell = document.createElement('div');
    newCell.classList.add('cell');

    // Create the time unit paragraph
    const timeUnit = document.createElement('p');
    timeUnit.classList.add('tu');
    timeUnit.textContent = timeCounter;

    // Determine the content of newCell based on the provided label
    if (label === 'CH') {
        // Coalescing holes
        newCell.innerHTML = `<p>CH</p>`;
        newCell.classList.add('cell-ch');
        timeUnit.classList.add('time-ch'); // Add class for different time unit style
    } else if (label === 'SC') {
        // Storage compaction
        newCell.innerHTML = `<p>SC</p>`;
        newCell.classList.add('cell-sc');
        timeUnit.classList.add('time-sc'); // Add class for different time unit style
    } else if (label.startsWith('J')) {
        // Display the P# for adding blocks or decrementing time units
        newCell.innerHTML = `<p>${label}</p>`;
        timeUnit.classList.add('time-j');
    } else {
        // Default to NA if no label is provided
        newCell.innerHTML = `<p>NA</p>`;
        newCell.classList.add('cell-na');
        timeUnit.classList.add('time-na'); // Add class for different time unit style
    }

    newCellContainer.appendChild(newCell);
    newCellContainer.appendChild(timeUnit);
    chartContainer.appendChild(newCellContainer);

    timeCounter++;
}

// FUNCTIONS ----------------------------------------------------------------------------------------

// EVENT LISTENERS ----------------------------------------------------------------------------------------
  
addProcessButton.addEventListener('click', function() {
    const processName = processNameInput.value;
    const processSize = processSizeInput.value;
    const processTU = processTUInput.value;

    const newProcessDiv = document.createElement('div');
    newProcessDiv.classList.add('processes-container');

    const userInputsDiv = document.createElement('div');
    userInputsDiv.classList.add('user-inputs');
    userInputsDiv.innerHTML = `
        <p>${processName}</p>
        <p>${processSize} KB</p>
        <p>${processTU}</p>
    `;

    const editDelDiv = document.createElement('div');
    editDelDiv.classList.add('edit-del-container');
    editDelDiv.innerHTML = `
        <button class="del-button"><img src="images/x.svg" class="del-red"></button>
    `;

    newProcessDiv.appendChild(userInputsDiv);
    newProcessDiv.appendChild(editDelDiv);

    parentProcessesContainer.appendChild(newProcessDiv);

    processNameInput.value = '';
    processSizeInput.value = '';
    processTUInput.value = '';

    addDeleteListeners();
});
  
addDeleteListeners();

removeItem.addEventListener('click', function() {
    const chartContainer = document.querySelector('.chart-container');
    
    const lastCellContainer = chartContainer.lastElementChild;
    if (lastCellContainer) {
        chartContainer.removeChild(lastCellContainer);
        timeCounter--; 
    }
});

memoryButton.addEventListener('click', function() {
    const memorySize = memorySizeInput.value;

    simulationContainer.innerHTML = '';

    if (memorySize) {
        const memoryDiv = document.createElement('div');
        memoryDiv.classList.add('memory-div');

        const memoryText = document.createElement('p');
        memoryText.textContent = `${memorySize} KB remaining`;

        memoryDiv.appendChild(memoryText);

        simulationContainer.appendChild(memoryDiv);
    }
});

compactionButton.addEventListener('click', function() {
    compactionTime = parseInt(compactionTimeInput.value) || 0;
    console.log('Compaction Time:', compactionTime);
});
  
coalescingButton.addEventListener('click', function () {
    coalescingHoleTime = parseInt(coalescingHoleInput.value) || 0; 
    console.log('Coalescing Hole Time:', coalescingHoleTime);
});

forwardOnceButton.addEventListener('click', function() {

    const ftuOutputContainer = document.querySelector('.ftu');
    ftuOutputContainer.innerHTML = '...';

    if (isCompacting) return;

    memoryHistory.push(getCurrentMemoryState());

    const currentTimeUnit = timeCounter;
    console.log(currentTimeUnit);

    if (isCoalescing) return;

    let wasAutoForwarding = forwardIntervalId !== null;

    if (currentTimeUnit > 0 && currentTimeUnit % compactionTime === 0) {
        isCompacting = true;
        addCell('SC');
        performStorageCompaction().then(() => {
            isCompacting = false;

            if (wasAutoForwarding) {
                forwardIntervalId = setInterval(() => forwardOnceButton.click(), 1000);
                forwardFullImage.src = 'images/player-pause.svg'; // Update the button image
                forwardFullButton.classList.add('active'); // Indicate auto-forwarding is active
            }

            stopAutoForwardingIfFullSizeHoleDetected();
        });

        if (forwardIntervalId !== null) {
            clearInterval(forwardIntervalId);
            forwardIntervalId = null;
        }
        return;
    }
    
    if (coalesceAdjacentHolesIfTimeUnitIsValid()) {
        addCell('CH');
        stopAutoForwardingIfFullSizeHoleDetected();
        return; 
    }

    const parentProcesses = document.querySelectorAll('.parent-processes-container .processes-container');
    let processBlocks = simulationContainer.querySelectorAll('.process-block');

    if (processBlocks.length === 0) {
        // Avoid adding "NA" at the start when the chart is empty
        if (chartContainer.children.length > 0) {
            // If nothing else happens (no processes added or decremented), add a placeholder cell to advance time
            addCell('NA'); // NA stands for "No Action"
        }

        // Try coalescing again if only holes remain and the current time is a multiple of coalescingHoleTime
        if (coalescingHoleTime > 0 && currentTimeUnit > 0 && currentTimeUnit % coalescingHoleTime === 0) {
            if (coalesceAdjacentHoles()) {
                // Add a cell indicating that holes were coalesced
                addCell('CH');
                stopAutoForwardingIfFullSizeHoleDetected();
                return;
            }
        }
    }

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
                blockDiv.style.height = `${blockHeightPercentage}%`;

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
                memoryDiv.style.height = `${(newRemainingMemorySize / memorySize) * 100}%`;
                memoryDiv.textContent = `${newRemainingMemorySize} KB remaining`;

                // Append the updated memory div below the process blocks
                simulationContainer.appendChild(memoryDiv);

                // Mark this process as added
                addedProcesses.push(processName);

                // Increment the process index to point to the next process
                currentProcessIndex++;
                // Add a cell with the label of the added block
                const processIndex = Array.from(parentProcesses).findIndex(
                    process => process.querySelector('.user-inputs p:nth-child(1)').textContent === processName
                );
                addCell(`J${processIndex + 1}`);

                return; // Stop here if we’ve added a process
            }
        }        
    }

    if (holeExists) {
        let foundProcess = null;
        for (let i = currentProcessIndex; i < parentProcesses.length; i++) {
            const processSize = parseInt(parentProcesses[i].querySelector('.user-inputs p:nth-child(2)').textContent);
            if (processSize <= holeSize && !addedProcesses.includes(parentProcesses[i].querySelector('.user-inputs p:nth-child(1)').textContent)) {
                foundProcess = parentProcesses[i];
                currentProcessIndex = i; 
                break;
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
    
            const blockHeightPercentage = (processSize / parseInt(memorySizeInput.value)) * 100;
            blockDiv.style.height = `${blockHeightPercentage}%`;
    
            blockDiv.style.backgroundColor = colors[currentProcessIndex % colors.length];
    
            const holeBlock = simulationContainer.querySelector('.hole');
            simulationContainer.replaceChild(blockDiv, holeBlock);
    
            // Subtract the process size from the updated combined hole size
            holeSize -= processSize; 
    
            // Create a new smaller hole if there’s leftover space
            if (holeSize > 0) {
                const remainingHoleDiv = document.createElement('div');
                remainingHoleDiv.classList.add('hole');
                remainingHoleDiv.style.height = `${(holeSize / parseInt(memorySizeInput.value)) * 100}%`;
                remainingHoleDiv.style.backgroundColor = 'var(--primary-color)';
                remainingHoleDiv.style.color = 'var(--text-color)';
                remainingHoleDiv.textContent = `${holeSize} KB remaining`;
    
                simulationContainer.insertBefore(remainingHoleDiv, blockDiv.nextSibling);
            } else {
                holeExists = false; // No hole left
            }
    
            addedProcesses.push(processName);
    
            // Update decrement index
            decrementIndex = Array.prototype.indexOf.call(processBlocks, blockDiv) + 1;
            if (decrementIndex >= processBlocks.length) {
                decrementIndex = 0;
            }
            holeIndex = -1;

            // Add a cell to the chart with the label based on the process added
            const processIndex = Array.from(parentProcesses).findIndex(
                process => process.querySelector('.user-inputs p:nth-child(1)').textContent === processName
            );
            addCell(`J${processIndex + 1}`); // Add the cell with the appropriate label

            // Check for a full-size hole immediately after storage compaction
            stopAutoForwardingIfFullSizeHoleDetected();
            return;
        }
    }

    if (processBlocks.length > 0) {
        let processedBlocks = 0; // Count how many blocks have been processed

        // Loop until a block is decremented or all blocks are processed
        while (processedBlocks < processBlocks.length) {
            const currentBlock = processBlocks[decrementIndex];
            const timeUnitMatch = currentBlock.textContent.match(/\((\d+) seconds left\)/);

            if (timeUnitMatch) {
                let timeUnit = parseInt(timeUnitMatch[1]);

                if (timeUnit > 0) {
                    timeUnit--; // Decrement time unit
                    currentBlock.textContent = currentBlock.textContent.replace(/\((\d+) seconds left\)/, `(${timeUnit} seconds left)`);

                    // Add a cell with the label of the decremented block
                    const currentProcessNameMatch = currentBlock.textContent.match(/^(\w+ \d+)/); // Match "Job 1", "Job 2", etc.
                    const currentProcessName = currentProcessNameMatch ? currentProcessNameMatch[0] : null;

                    if (currentProcessName) {
                        const blockIndex = Array.from(parentProcesses).findIndex(
                            process => process.querySelector('.user-inputs p:nth-child(1)').textContent.trim() === currentProcessName
                        );

                        if (blockIndex !== -1) {
                            addCell(`J${blockIndex + 1}`); // Add the cell with the appropriate label
                        } else {
                            console.error('Process not found in parent processes:', currentProcessName);
                            // Log the list of process names for further debugging
                            Array.from(parentProcesses).forEach((process, index) => {
                                console.log(`Process ${index + 1}:`, process.querySelector('.user-inputs p:nth-child(1)').textContent.trim());
                            });
                        }
                    } else {
                        console.error('Could not extract process name from the current block text.');
                    }

                    // If time unit becomes 0 after decrement, immediately convert to a hole
                    if (timeUnit === 0) {
                        const processSize = parseInt(currentBlock.textContent.match(/\((\d+) KB\)/)[1]);
                        const holeDiv = document.createElement('div');
                        holeDiv.classList.add('hole');
                        holeDiv.style.height = currentBlock.style.height;
                        holeDiv.style.backgroundColor = 'var(--primary-color)';
                        holeDiv.style.color = 'var(--text-color)';
                        holeDiv.textContent = `${processSize} KB remaining`;

                        // Replace the process block with the new hole
                        simulationContainer.replaceChild(holeDiv, currentBlock);
                        holeExists = true;
                        holeSize = processSize;
                        holeIndex = decrementIndex;

                        // Update the processBlocks list after replacing with a hole
                        processBlocks = Array.from(simulationContainer.querySelectorAll('.process-block'));

                        // Check for a full-size hole immediately after storage compaction
                        stopAutoForwardingIfFullSizeHoleDetected();
                    }

                    // Move to the next block in the sequence
                    decrementIndex = (decrementIndex + 1) % processBlocks.length;
                    break; // Exit the loop once a time unit is decremented
                }
            }

            // Move to the next block
            decrementIndex = (decrementIndex + 1) % processBlocks.length;
            processedBlocks++; // Increment the count of processed blocks

            // If all blocks have been processed without finding a valid one, reset the index
            if (processedBlocks === processBlocks.length) {
                decrementIndex = 0;
            }
        }
    }

    const memorySize = parseInt(memorySizeInput.value);
    const fullSizeHole = Array.from(simulationContainer.children).some(block => {
        return block.classList.contains('hole') && parseInt(block.textContent) === memorySize;
    });

    if (fullSizeHole) {
        if (forwardIntervalId !== null) {
            clearInterval(forwardIntervalId);
            forwardIntervalId = null;
            forwardFullImage.src = 'images/player-skip-forward.svg';
            forwardFullButton.classList.remove('active');
        }
    }
});

backwardOnceButton.addEventListener('click', function() {
    if (memoryHistory.length > 0) {
        const previousState = memoryHistory.pop();
        simulationContainer.innerHTML = previousState;
    }
});

forwardFullButton.addEventListener('click', function() {
    if (forwardIntervalId === null) {
        forwardIntervalId = setInterval(() => forwardOnceButton.click(), 1000);
        forwardFullImage.src = 'images/player-pause.svg';
        forwardFullButton.classList.add('active');
    } else {
        clearInterval(forwardIntervalId);
        forwardIntervalId = null;
        forwardFullImage.src = 'images/player-skip-forward.svg';
        forwardFullButton.classList.remove('active');
    }
});

backwardFullButton.addEventListener('click', function() {
    if (backwardIntervalId === null) {
        backwardIntervalId = setInterval(() => {
            backwardOnceButton.click(); 
        }, 1000);

        backwardFullImage.src = 'images/player-pause.svg';
        backwardFullButton.classList.add('active');
    } else {
        clearInterval(backwardIntervalId);
        backwardIntervalId = null;

        backwardFullImage.src = 'images/player-skip-forward.svg';
        backwardFullButton.classList.remove('active');
    }
});     

// EVENT LISTENERS ----------------------------------------------------------------------------------------