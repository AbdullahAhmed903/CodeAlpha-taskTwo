let audioFiles = [{name:"مصر دايما تامر عاشور",src:"./music/اغاني تامر عاشور - سمعنا.mp3"},{name:"اصحي للكلام تامر عاشور",src:"./music/اغاني تامر عاشور - سمعنا(1).mp3"},{name:"احنا الدنيا تامر عاشور",src:"./music/اغاني تامر عاشور - سمعنا(2).mp3"}];
const audioList = document.getElementById("audios");
const myAudio = document.getElementById("myAudio");
const playAudio = document.getElementById("play");
const backwardAudio = document.getElementById("backward");
const forwardAudio = document.getElementById("forward");
const repeatAudio = document.getElementById("repeat");
const randomAudio = document.getElementById("random");
const fileInput = document.getElementById('fileInput');
const timeline = document.getElementById("timeline");
const elapsedTimeElement = document.getElementById("elapsed-time");
const remainingTimeElement = document.getElementById("remaining-time");
const musicTitle=document.getElementById("music-title")
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');
const randomIcon = document.getElementById('random-icon');
const repeatIcon = document.getElementById('repeat-icon');



let currentAudioIndex = 0;
let isRepeating = false;
let isRandom = false;
const playIconClass = 'fa-play';
const pauseIconClass = 'fa-pause';
const repeatOnClass = 'repeat-on';
const randomOnClass = 'random-on';

window.onload=function(){
    displayAudioList()
 }

// Load audio file and display in the list
fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {        
        const reader = new FileReader();
        reader.onload = function(event) {
            const name=file.name.split(".mp3")
            
            const audioData = {
                name: name[0],
                src: event.target.result
            };
            audioFiles.push(audioData);      
            displayAudioList();       
        };
        reader.onerror = function(event) {
            console.error("File could not be read! Code " + event.target.error);
        };
        reader.readAsDataURL(file);
    } else {
        myAudio.src = ""; 
    }
});



// Display the audio list
function displayAudioList() {
    audioList.innerHTML = '';
    audioFiles.forEach((audio, index) => {
        const listItem = document.createElement('li');
        const removeButton = document.createElement('button');
        removeButton.textContent = 'X';

        listItem.textContent = audio.name;
        listItem.dataset.index = index;

        removeButton.classList.add('remove-btn');

        removeButton.addEventListener('click', (event) => {
            event.stopPropagation(); 
            removeAudio(index);
        });

        listItem.appendChild(removeButton);
        audioList.appendChild(listItem);
    });
}

function removeAudio(index) {
    audioFiles.splice(index, 1);
        displayAudioList();
}


// Select and play audio from the list
audioList.addEventListener("click", (event) => {
    if (event.target.tagName === 'LI') {
        document.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
        event.target.classList.add('selected');
        currentAudioIndex = parseInt(event.target.dataset.index, 10);
        playAudioByIndex(currentAudioIndex);
        musicTitle.textContent = audioFiles[currentAudioIndex].name;
    }
});


// Play/Pause toggle
playAudio.addEventListener('click', () => {
    if (myAudio.paused) {
        myAudio.play();
        toggleIcon(playAudio, pauseIconClass);
    } else {
        myAudio.pause();
        toggleIcon(playAudio, playIconClass);
    }
});

// Backward button functionality
backwardAudio.addEventListener("click", () => {
    const currentTime = myAudio.currentTime;
    if (currentTime <= 10) {
        if (currentAudioIndex > 0) {
            currentAudioIndex--;
            playAudioByIndex(currentAudioIndex);
            document.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
            const currentListItem = document.querySelector(`li[data-index="${currentAudioIndex}"]`);
            if (currentListItem) {
                currentListItem.classList.add('selected');
            }

        } else {
            console.log("This is the first track, cannot go back further.");
        }
    } else {
        myAudio.currentTime -= 10;
    }
});

// Forward button functionality
forwardAudio.addEventListener("click", () => {
    const currentTime = myAudio.currentTime;
    const duration = myAudio.duration;

    if (currentTime >= duration - 10) {
        if (currentAudioIndex < audioFiles.length - 1) {
            currentAudioIndex++;
            playAudioByIndex(currentAudioIndex);
            document.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
            const currentListItem = document.querySelector(`li[data-index="${currentAudioIndex}"]`);
            if (currentListItem) {
                currentListItem.classList.add('selected');
            }
        } else {
            console.log("This is the last track, cannot go forward.");
        }
    } else {
        myAudio.currentTime += 10;
    }
});

// Repeat button functionality
repeatAudio.addEventListener('click', () => {
    isRepeating = !isRepeating;
    if (isRepeating) {
        repeatAudio.classList.add('bring-to-front');
    } else {
        repeatAudio.classList.remove('bring-to-front');
    }
    toggleClass(repeatAudio, repeatOnClass, isRepeating);

    
});


// Random button functionality
randomAudio.addEventListener('click', () => {
    isRandom = !isRandom;
    toggleClass(randomAudio, randomOnClass, isRandom);
});

// When audio ends, either repeat or play the next track
myAudio.addEventListener('ended', () => {
    document.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
    if (isRepeating) {
        myAudio.currentTime = 0;
        myAudio.play();
    } else if (isRandom) {
        playRandomTrack();
    } else {
        if (currentAudioIndex < audioFiles.length - 1) {
            currentAudioIndex++;
            playAudioByIndex(currentAudioIndex);
        } else {
            toggleIcon(playAudio, playIconClass);
        }
    }
    const currentListItem = document.querySelector(`li[data-index="${currentAudioIndex}"]`);
    if (currentListItem) {
        currentListItem.classList.add('selected');
    }
});

// Play audio by index
function playAudioByIndex(index) {
    if (index >= 0 && index < audioFiles.length) {        
        const selectedAudio = audioFiles[index];
        myAudio.src = selectedAudio.src;
        musicTitle.textContent=audioFiles[index].name
        myAudio.play();

        toggleIcon(playAudio, pauseIconClass);
    }
}

// Function to toggle the icon
function toggleIcon(button, newIconClass) {
    const iconElement = button.querySelector('i');
    if (iconElement) {
        iconElement.classList.remove(playIconClass, pauseIconClass);
        iconElement.classList.add(newIconClass);
    }
}

// Function to toggle the button class
function toggleClass(button, className, condition) {
    if (condition) {
        button.classList.add(className);
    } else {
        button.classList.remove(className);
    }
}

// Play a random track
function playRandomTrack() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * audioFiles.length);
    } while (randomIndex === currentAudioIndex && audioFiles.length > 1);
    
    currentAudioIndex = randomIndex;
    playAudioByIndex(currentAudioIndex);
}

// Update range slider and time display
function updateUI() {
    const duration = myAudio.duration;
    const currentTime = myAudio.currentTime;
    
    timeline.max = duration;
    timeline.value = currentTime;

    // Update the slider track color
    timeline.style.background = `linear-gradient(to right, #2497E3 ${Math.floor((currentTime / duration) * 100)}%, #ddd ${Math.floor((currentTime / duration) * 100)}%)`;

    elapsedTimeElement.textContent = formatTime(currentTime);
    remainingTimeElement.textContent = formatTime(duration - currentTime);

    if (!myAudio.paused) {
        requestAnimationFrame(updateUI);  
    }
}

// Format time function
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Handle slider input change
timeline.addEventListener('input', () => {
    myAudio.currentTime = timeline.value;
});

// Update UI initially and when audio is played
myAudio.addEventListener('play', updateUI);
myAudio.addEventListener('pause', () => cancelAnimationFrame(updateUI));



// Update volume based on slider input
volumeSlider.addEventListener('input', () => {
    const volume = volumeSlider.value;
    myAudio.volume = volume;
    updateVolumeIcon(volume);
    updateSliderProgress(volume);
});

// Toggle mute/unmute
volumeIcon.addEventListener('click', () => {
    if (myAudio.muted) {
        myAudio.muted = false;
        volumeSlider.value = myAudio.volume;
    } else {
        myAudio.muted = true;
        volumeSlider.value = 0;
    }
    updateVolumeIcon(myAudio.volume);
    updateSliderProgress(myAudio.volume);
});

// Update volume icon based on volume level
function updateVolumeIcon(volume) {
    if (myAudio.muted || volume <= 0) {
        volumeIcon.className = 'fa-solid fa-volume-xmark fa-2xl'; 
        volumeSlider.style.background = '#fff'; 
    } else if (volume <= 0.4) {
        volumeIcon.className = 'fa-solid fa-volume-low fa-2xl'; 
    } else {
        volumeIcon.className = 'fa-solid fa-volume-high fa-2xl'; 
    }
}

// Update slider progress bar color
function updateSliderProgress(value) {
    const isMuted = myAudio.muted;
    const percent = value * 100;
    volumeSlider.style.background = isMuted
        ? '#fff' 
        : `linear-gradient(to right, #2497E3 ${percent}%, #ddd ${percent}%, #ddd 100%)`; 
}

// Initialize icon and slider
updateVolumeIcon(volumeSlider.value);
updateSliderProgress(volumeSlider.value);


randomIcon.addEventListener("click",(event)=>{
    event.target.classList.forEach(element => {
        if(element=="active"){
            event.target.classList.remove("active");
        }
        else{
            event.target.classList.add("active");
        }
        
    });
    
})

repeatIcon.addEventListener("click",(event)=>{
    event.target.classList.forEach(element => {
        if(element=="active"){
            event.target.classList.remove("active");
        }
        else{
            event.target.classList.add("active");
        }
        
    });
    
})


