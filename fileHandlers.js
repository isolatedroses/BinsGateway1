





let player;

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}


// Function to display a YouTube video in a modal using MediaElement.js
function showVideoModal(videoUrl) {
    const modal = document.getElementById('videoModal');
	const fullscreenTrigger = document.getElementById('fullscreenTrigger');
	

    // Ensure the YouTube URL is in the correct format
    if (videoUrl.includes('youtu.be')) {
        // Convert shortened URL to the full YouTube URL
        const videoId = videoUrl.split('/').pop();  // Extract the video ID
        videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }

    // Initialize MediaElement.js if it's not already initialized
    if (!player) {
        player = new MediaElementPlayer('videoPlayer', {
            stretching: 'responsive',
            features: ['playpause', 'progress', 'volume', 'fullscreen'],
            youtube: {
                controls: 0,
                modestbranding: 1,
                rel: 0
            },
            /*
			success: function(mediaElement, originalNode) {
                // Listen for fullscreen changes on the document
                document.addEventListener('fullscreenchange', function() {
                    if (document.fullscreenElement === null) {
                        // Pause the video if not in fullscreen mode
                        mediaElement.pause();
						closeVideoModal();
                    }
                });
            }
			*/
			
			success: function(mediaElement, originalNode) {
                // Listen for fullscreen changes across different browsers
                document.addEventListener('fullscreenchange', onFullscreenChange);
                document.addEventListener('webkitfullscreenchange', onFullscreenChange);
                document.addEventListener('mozfullscreenchange', onFullscreenChange);
                document.addEventListener('msfullscreenchange', onFullscreenChange);
            }
        	
			
			
        });
    }

    // Set the new video URL and play the video
    player.setSrc(videoUrl);
    player.load();
	//player.play();
	
	/*
	// Add a 2-second delay before entering fullscreen and playing the video
		setTimeout(function() {
			if (player.enterFullScreen) {
            player.enterFullScreen(); // Use MediaElement.js's built-in fullscreen method
			player.play();
        } 
		}, 2000);  // 2000 milliseconds = 2 seconds
	*/
	
	 setTimeout(function() {
        if (isIOS()) {
            // On iOS devices, use webkitEnterFullscreen
            const videoElement = document.getElementById('videoPlayer');
            if (videoElement.webkitEnterFullscreen) {
                videoElement.webkitEnterFullscreen();
            }
        } else {
            if (player.enterFullScreen) {
                player.enterFullScreen(); // Use MediaElement.js's built-in fullscreen method
            }
        }
        player.play();
    }, 2000);  // 2000 milliseconds = 2 seconds
	

    // Disable right-click across the entire modal
    modal.oncontextmenu = function() {
        return false; // Prevent right-click menu for the entire modal
    };

    // Show the modal
    modal.style.display = "block";

    // Close modal if clicked outside modal content
    window.onclick = function(event) {
        if (event.target === modal) {
            closeVideoModal();
        }
    };
	
	
	
	// Function to handle fullscreen changes
	function onFullscreenChange() {
		const isFullscreen = document.fullscreenElement || 
							 document.webkitFullscreenElement || 
							 document.mozFullScreenElement || 
							 document.msFullscreenElement;

		if (!isFullscreen) {
			// Exit fullscreen: pause the video and close the modal
			player.pause();
			closeVideoModal();
		}
	}


	// Attach fullscreen trigger to the "Click" text
    fullscreenTrigger.onclick = function() 
	{
        if (player.enterFullScreen) {
            player.enterFullScreen(); // Use MediaElement.js's built-in fullscreen method
			player.play();
        } else {
            console.error('Fullscreen mode not supported');
        }
    };
	
}

// Function to close the YouTube video modal and stop playback
function closeVideoModal() {
    const modal = document.getElementById('videoModal');

    // Hide the modal
    modal.style.display = "none";

    // Stop the video
    if (player) {
        player.pause();
        player.setSrc(''); // Clear the video source
    }

    // Remove the window click listener after closing the modal
    window.onclick = null;
}



// Function to show the PDF (appends ?raw=true for GitHub URLs)
function showPdfModal(pdfUrl) {
    const pdfViewer = document.getElementById('pdfViewer');
    pdfViewer.src = pdfUrl + '?raw=true'; // Append ?raw=true for GitHub URLs
}

// Function to handle file downloads or open the PDF in the modal
function downloadFile(url, isFile) {
    if (isFile) {
        console.log(url);

        // Check if the file is a PDF by checking if the URL ends with '?raw=true'
        if (url.toLowerCase().endsWith('?raw=true')) {
            showPdfModal(url); // Display the PDF
			//downloadFileInNewWindow(url)
			//showPdfModal(url)
        } else {
			/*
			console.log("VIDEO URLXX>>>",url);
            // For non-PDF files (ZIP, etc.), trigger download
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = ''; // Force the download dialog
            document.body.appendChild(anchor);
            anchor.click(); // Trigger click event
            document.body.removeChild(anchor); // Remove anchor after download
			*/
			
			 showVideoModal(url);
        }
    } else {
		
		console.log("VIDEO URL>>>",url);
        // For YouTube videos, open in modal (handle separately, if required)
        showVideoModal(url);
    }
	
	


	
	
}




