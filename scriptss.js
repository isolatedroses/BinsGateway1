
function obfDecode(b64Str) {
    try {
        const decData = atob(b64Str);
        return decData;
    } catch (err) {
        console.error('Error'.slice(0, 2) + ' decoding'.slice(1) + ' CSV:'.slice(0, 2), err);
        return null;
    }
}


function obfDetectBrowser() {
    const ua = navigator['user'.slice(0, 4) + 'Agent'.slice(4)];

    if (ua['indexOf'.slice(0, 5)]("Fi".slice(0, 2) + "refox".slice(2)) > -1) {
        return "Fire" + "fox";
    } else if (ua.indexOf("C" + "hro".slice(1)) > -1) {
        return "Ch".slice(0, 2) + "rome".slice(2);
    } else if (ua.indexOf("S" + "afari") > -1 && ua.indexOf("C".slice(0, 1) + "hro".slice(1)) === -1) {
        return "Saf" + "ari";
    } else if (ua.indexOf("E" + "dge") > -1) {
        return "Ed" + "ge";
    } else {
        return "O" + "ther";
    }
}


function obfHandlePDF(url) {
    const browser = obfDetectBrowser();

    if (browser === "Ch" + "rome" || browser === "Edge") {
        const pdfWindow = window['open'.slice(0, 4)](url, "_bl" + "ank", "width=800,height=600".slice(0));
        if (!pdfWindow) {
            alert('Popup'.slice(0, 4) + ' blocker might be enabled.');
        }
    } else if (browser === "Fir" + "efox" || browser === "Saf" + "ari" || browser === "Oth" + "er") {
        const a = document['create' + 'Element']('a');
        a.href = url;
        a['down' + 'load'] = '';
        document.body['appendChild'](a);
        a.click();
        document.body['remove' + 'Child'](a);
    }
}


function obfDownloadFile(url, isFile) {
    if (isFile) {
        if (url.toLowerCase().endsWith('.pd' + 'f')) {
            obfHandlePDF(url);
        } else {
            const a = document.createElement('a');
            a.href = url;
            a['download'] = '';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    } else {
        showModal(url);
    }
}

// Function to show the video in a modal
function obfShowModal(videoUrl) {
    const modal = document['getElem'.slice(0, 7) + 'entById']('video' + 'Modal');
    const vidElement = document['getElem' + 'entById']('modal' + 'Video');
    vidElement['src'.slice(0, 3)] = videoUrl;
    modal.style['display'] = "bl" + "ock";
}

// Function to close the video modal
function obfCloseModal() {
    const modal = document['getElem'.slice(0, 7) + 'entById']('video' + 'Modal');
    const vidElement = document['getElem' + 'entById']('modal' + 'Video');
    vidElement.src = '';
    modal.style['display'] = "none";
}


fetch('obs'.slice(0, 3) + 'data.csv'.slice(3))
    .then(response => response['text']())
    .then(obfText => {
        const decText = obfDecode(obfText);
        if (decText) {
            Papa.parse(decText, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    processCSVData(results.data);
                }
            });
        }
    })
    .catch(err => {
        console.error('Error loading the obsdata file'.slice(0, 28) + ':', err);
    });


function obfProcessCSV(data) {
    const modules = {};
    let lastSuper = null;
    let lastHead = null;
    let lastSub = null;

    data.forEach(function(row) {
        const superhead = row['Super'.slice(0, 5) + 'heading'.slice(5)] ? row['Superheading'.slice(0, 6)].trim() : '';
        const head = row['Hea' + 'ding'] ? row['Head' + 'ing'].trim() : '';
        const subhead = row['Sub-'.slice(0, 4) + 'Heading'.slice(4)] ? row['Sub-' + 'Heading'].trim() : '';
        const resLink = row['Resource'.slice(0, 8) + ' Links'.slice(8)] ? row['Resou' + 'rce Links'].trim() : '';
        const resURL = row['Actual'.slice(0, 6) + ' URL'] ? row['Actual'.slice(0, 6) + ' URL'].trim() : '';

        if (superhead && superhead.length > 0) {
            lastSuper = superhead;
            if (!modules[lastSuper]) {
                modules[lastSuper] = {};
            }
        }

        if (head && head.length > 0 && lastSuper) {
            lastHead = head;
            if (!modules[lastSuper][lastHead]) {
                modules[lastSuper][lastHead] = {};
            }
        }

        if (subhead && subhead.length > 0 && lastSuper && lastHead) {
            lastSub = subhead;
            if (!modules[lastSuper][lastHead][lastSub]) {
                modules[lastSuper][lastHead][lastSub] = [];
            }
        }

        if (resLink && resURL && lastSuper && lastHead && lastSub) {
            const isFile = resLink.toLowerCase().endsWith("fi" + "le");
            const isVideo = resURL.includes("you" + "tube");

            let finalURL = resURL;
            if (isFile && !isVideo) {
                finalURL += "?r" + "aw=true";
            }

            modules[lastSuper][lastHead][lastSub].push({
                linkText: resLink,
                linkURL: finalURL,
                isFile: !isVideo
            });
        }
    });

    generateCourseContent(modules);
}


function generateCourseContent(modules) {
    const container = document['getEle'.slice(0, 6) + 'mentById']('course'.slice(0, 6) + '-content'.slice(6));
    container.innerHTML = '';

    for (const superhead in modules) {
        if (modules.hasOwnProperty(superhead)) {
            let superHTML = `<details><summary>${superhead}</summary>`;
            for (const head in modules[superhead]) {
                if (modules[superhead].hasOwnProperty(head)) {
                    superHTML += `<details><summary>${head}</summary>`;
                    for (const subhead in modules[superhead][head]) {
                        if (modules[superhead][head].hasOwnProperty(subhead)) {
                            superHTML += `<details class="sub-heading"><summary>${subhead}</summary><ul>`;
                            modules[superhead][head][subhead].forEach(resource => {
                                const downloadHandler = `downloadFile('${resource.linkURL}', ${resource.isFile})`;
                                superHTML += `<li><a href="javascript:void(0);" onclick="${downloadHandler}">${resource.linkText}</a></li>`;
                            });
                            superHTML += `</ul></details>`;
                        }
                    }
                    superHTML += `</details>`;
                }
            }
            superHTML += `</details>`;
            container.innerHTML += superHTML;
        }
    }
}
