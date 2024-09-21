let url = `https://jiosaavn-ruddy.vercel.app/api/search/songs?query=`
const button = document.getElementById('search')
const songWrapper = document.querySelector('.song-wrapper')

songWrapper.style.visibility = 'hidden'

button.addEventListener('click', function(e){
    e.preventDefault();
    const song = document.getElementById('song')
    if(song.value === '' || !isNaN(song.value)){
        songNotFound()
    }else{
        url = `https://jiosaavn-ruddy.vercel.app/api/search/songs?query=+${song.value}`
        getSong(url)
    }
})

function getSong(url){
    fetch(url)
    .then((response) => {
        if(!response.ok){
            alert('Network Error')
        }else{
            return response.json()
        }
    })
    .then((data) => {
        const obj = data;
        getSongData(obj)
    })
    .catch((error) => {
        console.log(error);
    })
}

function getSongData(obj) {
    if(obj.data.results.length === 0){
        songNotFound()
    }
    else{
        const newAudioSource = obj.data.results[0].downloadUrl[4].url;
        const newImageSource = obj.data.results[0].image[2].url;
        const songDuration = obj.data.results[0].duration;
        const songName = obj.data.results[0].name
        const singerName = obj.data.results[0].artists.primary[0].name

        addSongLink(newAudioSource)
        addSongImage(newImageSource)
        addSongName(songName)
        addSingerName(singerName)
        updateSongEndTime(songDuration)
        addAnimation()
        playSong()
        removeAnimation()
    }
}

// add song audio source link
function addSongLink(newAudioSource){
    const audioSourceElement = document.getElementById('song-link');
    audioSourceElement.src = newAudioSource;

    const audioElement = audioSourceElement.parentElement;

    audioElement.load();
}

// add song image on page
function addSongImage(newImageSource) {
    document.querySelector('#song-image img').src = newImageSource;
}

// add song name on page
function addSongName(songName){
    document.querySelector('.song-name').textContent = songName
}

// add singer name on page
function addSingerName(singerName) {
    document.querySelector('.singer-name').textContent = singerName
}

// update song end time
function updateSongEndTime(songDuration) {
    const songEndTime = document.getElementById('song-end-time')

    let minutes = (songDuration/60)
    songEndTime.textContent = minutes.toFixed(2)
}

function songNotFound() {
    addAnimation()
    document.querySelector('#song-image img').src = './assets/not-found.png'
    document.querySelector('#song-image').style.border = 'none'
    document.querySelector('.song-name').textContent = "Song not Found"
    document.querySelector('.singer-name').textContent = "Please Try Again"
    document.querySelector('.song-length').style.display = 'none'
    document.querySelector('.seek-bar').style.display = 'none'
    document.querySelector('.controls').style.display = 'none'
    songWrapper.style.visibility = 'visible'
    removeAnimation()
}

// playing the song
function playSong() {
    document.querySelector('.song-length').style.display = 'flex'
    document.querySelector('.seek-bar').style.display = 'flex'
    document.querySelector('.controls').style.display = 'flex'

    songWrapper.style.visibility = 'visible'

    const song = document.querySelector('.song-control') 
    const playpause = document.getElementById('playpause')
    const progress = document.getElementById('progress')

    song.addEventListener('loadedmetadata', () =>{
        progress.max = song.duration
        progress.value = song.currentTime
    })

    let isPlaying = true
    const playMusic = () => {
        isPlaying = true
        song.play()
        playpause.classList.replace('fa-play', 'fa-pause')
    }

    const pauseMusic =  () => {
        isPlaying = false
        song.pause()
        playpause.classList.replace('fa-pause', 'fa-play')
    }
    
    // play pause button toggle
    playpause.addEventListener('click', () => {
        if(isPlaying){
            pauseMusic()
        }else{
            playMusic()
        }
    })

    // update the progress bar and current time of song when playing
    const songCurrentTime = document.getElementById('song-current-time')
    if(song.play()){
        setInterval(() => {
            progress.value = song.currentTime
            const minutes = Math.floor(song.currentTime / 60);
            const seconds = Math.floor(song.currentTime % 60);
            songCurrentTime.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }, 1000);
    }

    // update song when change in progress bar
    progress.addEventListener('input', () => {
        song.currentTime = progress.value;
    });

    // change play icon to pause when the song ends
    song.addEventListener('ended', () => {
        playpause.classList.replace('fa-pause', 'fa-play');
    });
}

// mute button
const song = document.querySelector('.song-control') 
const volumeBtn = document.querySelector('.fa-volume-high')
volumeBtn.addEventListener('click', () => {
    if(song.play()){
        song.muted = !song.muted;
        if (song.muted) {
            volumeBtn.classList.replace('fa-volume-high', 'fa-volume-xmark');
        } else {
            volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-high'); 
        }
    }
})

//previous track button
previous.addEventListener('click', () => {
    document.querySelector('.alert-message').textContent = 'Previous Track not Available'
    document.querySelector('.search-again').textContent = 'Search another Song'
    document.querySelector('.alert').style.display = 'flex'
    setTimeout(() => {
        document.querySelector('.alert').style.display = 'none'
    }, 2500);
})

// next track button
next.addEventListener('click', () => {
    document.querySelector('.alert-message').textContent = 'Next Track not Available'
    document.querySelector('.search-again').textContent = 'Search another Song'
    document.querySelector('.alert').style.display = 'flex'
    setTimeout(() => {
        document.querySelector('.alert').style.display = 'none'
    }, 2500);
})

// add animation
function addAnimation() {
    document.querySelector('.song-wrapper').classList.add('animate__animated','animate__zoomIn')
}

// remove animation
function removeAnimation() {
    setTimeout(() => {
        document.querySelector('.song-wrapper').classList.remove('animate__animated','animate__zoomIn')
    }, 3000);
}
