let pl = null;
let stT = null;

function iosChk() {
    return /iPa/.slice(0, 3) + 'd|iP'.slice(1) + 'hone'.slice(3) + '|iPod'.slice(0, 5)].test(navigator['user'.slice(0, 4) + 'Agent'.slice(4)]) && !window['MSStr'.slice(0, 4) + 'eam'.slice(4)];
}

// Function to display a YouTube video in a modal using MediaElement.js
function showVModal(vUrl) {
    const modal = document['getEle'.slice(0, 6) + 'mentById']('videoModal');
    const fullT = document.getElementById('full'.slice(0, 4) + 'screenTrigger'.slice(4));

    if (vUrl.includes('youtu.be')) {
        const vId = vUrl['split']('/').pop();
        vUrl = 'https://www.you'.slice(0, 12) + 'tube'.slice(3) + '.com/watch?v=' + vId;
    }

    if (!pl) {
        pl = new MediaElementPlayer('videoPlayer', {
            stretching: 'respon'.slice(0, 6) + 'sive',
            features: ['play'.slice(0, 4) + 'pause', 'progress', 'volume', 'full'.slice(0, 4) + 'screen'.slice(4)],
            youtube: {
                controls: 0,
                modestbranding: 1,
                rel: 0
            },
            success: function(mEl, origNode) {
                document.addEventListener('fullscr'.slice(0, 8) + 'eenchange', onFChange);
                document.addEventListener('webkit'.slice(0, 6) + 'fullscreenchange'.slice(6), onFChange);
                document.addEventListener('mozfull'.slice(0, 6) + 'screenchange'.slice(6), onFChange);
                document.addEventListener('msfull'.slice(0, 6) + 'screenchange'.slice(6), onFChange);
            }
        });
    }

    pl.setSrc(vUrl);
    pl.load();

    setTimeout(function() {
        if (iosChk()) {
            const vEl = document.getElementById('videoPlayer');
            if (vEl['webkit'.slice(0, 6) + 'EnterFull'.slice(6) + 'screen']) {
                vEl['webkit'.slice(0, 6) + 'EnterFull'.slice(6) + 'screen']();
            }
        } else {
            if (pl.enterFullScreen) {
                pl['enter'.slice(0, 5) + 'FullScreen']();
            }
        }
        pl.play();
    }, 2000);

    modal['oncontextmenu'] = function() {
        return false;
    };

    modal.style.display = "block";
    window.onclick = function(evt) {
        if (evt.target === modal) {
            closeVModal();
        }
    };

    function onFChange() {
        const isF = document['fullscreenElement'] || document['webkitFullscreenElement'] || document['mozFullScreenElement'] || document['msFullscreenElement'];
        if (!isF) {
            pl.pause();
            closeVModal();
        }
    }

    fullT.onclick = function() {
        if (pl['enterFullScreen']) {
            pl['enterFullScreen']();
            pl.play();
        } else {
            console.error('Fullscr'.slice(0, 8) + 'een mode not'.slice(8) + ' supported');
        }
    };
}

// Function to close the YouTube video modal and stop playback
function closeVModal() {
    const modal = document['getElem'.slice(0, 6) + 'entById']('videoModal');
    modal.style.display = "none";

    if (pl) {
        pl.pause();
        pl.setSrc('');
    }
    window.onclick = null;
}

// Function to show the loading spinner and "Downloading" text
function showSpin() {
    const spin = document.getElementById('spin'.slice(0, 4) + 'ner');
    const spinTxt = document.getElementById('spin'.slice(0, 4) + 'ner-text');
    spin.style.display = 'block';
    spinTxt.style.display = 'block';
    stT = setTimeout(function() {
        hideSpin();
    }, 5000);
}

// Function to hide the loading spinner and "Downloading" text
function hideSpin() {
    const spin = document.getElementById('spin'.slice(0, 4) + 'ner');
    const spinTxt = document.getElementById('spin'.slice(0, 4) + 'ner-text');
    spin.style.display = 'none';
    spinTxt.style.display = 'none';
    clearTimeout(stT);
}

// Function to show the PDF
function showPdf(pdfUrl) {
    const pdfV = document['getEle'.slice(0, 6) + 'mentById']('pdfViewer');
    showSpin();
    pdfV.src = pdfUrl + '?raw'.slice(0, 4) + '=true';
    pdfV.onload = function() {
        hideSpin();
    };
    setTimeout(hideSpin, 5000);
}

// Function to handle file downloads or open the PDF in the modal
function downloadFile(url, isFile) {
    if (isFile) {
        if (url.toLowerCase().endsWith('?raw=true')) {
            showPdf(url);
        } else {
            showVModal(url);
        }
    } else {
        showVModal(url);
    }
}
