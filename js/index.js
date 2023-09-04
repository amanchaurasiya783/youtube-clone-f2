//constants
const searchInput= document.getElementById('searchInput');
const searchBtn= document.getElementById('searchBtn');
const cardSection = document.getElementById('cardSection');

//initial function call to render data on initial screen
getSearchResults('standUp Comedy');

//function call to render data on search
searchBtn.addEventListener('click', ()=>{
    try{
        if(searchInput.value === "" || searchInput.value.trim() == "") return;
        getSearchResults(searchInput.value.trim());
    }
    catch(error){
        console.log('Error Occured On Search Click : ',error);
    }
})

//function to load data on UI
async function getSearchResults(searchString){
    try{
        let url = `${baseURL}/search?key=${apiKey}&q=${searchString}&part=snippet&maxResults=20`;
        const response = await fetch(url, {method: 'GET'});
        const result = await response.json();
        addDataOnUI(result.items);
    }
    catch(error){
        console.log('Error Occured on Searching data : ',error);
    }
}

// render video card on UI
function addDataOnUI(videos){
    try{        
        cardSection.innerHTML = ""
        videos.forEach(async (video) => {
            const videoStats = await videoStatistics(video.id.videoId);
            const channelStats = await fetchChannelDetails(video.snippet.channelId);
            cardSection.innerHTML += `
            <div class="card" id="card" onclick="redirectToVideo('${video.id.videoId}')"  value="${video.id.videoId}">
            <div class="thumbnail"><img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title} thumbnail"></div>
                <div class="detailsSection">
                    <div id="cardProfile"><div class="profile"><img src="${channelStats.items[0].snippet.thumbnails.default.url}" alt="channel profile pic"></div></div>
                    <div class="details">
                        <div class="videoTitle" id="videoTitle">${video.snippet.title.slice(0, 35)}...</div>
                        <div class="channelName" id="channelName">${video.snippet.channelTitle}</div>
                        <span class="totalViews" id="totalViews">${calcViews(videoStats.statistics.viewCount)} Views &nbsp; | &nbsp;</span>
                        <span class="uploadTime" id="uploadTime"> ${calcTime(video.snippet.publishTime)} ago</span>
                    </div>
                </div>
            </div>
            `
        })
    }
    catch(error){
        console.log('Error Occured on adding Video Cards : ', error);
    }
}

// function to Set the videoId in sessionStorage
function redirectToVideo(videoId) {
    // Set the videoId in sessionStorage
    sessionStorage.setItem('videoId', videoId);
    // Redirect to the new page
    window.location.href = 'videoDetails.html';
}