// Function to decode base64 encoded CSV content
function decodeCSV(base64String) {
    try {
        // Decode the base64 string
        const decodedData = atob(base64String);
        return decodedData;
    } catch (error) {
        console.error('Error decoding CSV:', error);
        return null;
    }
}

// Function to detect the browser type
function detectBrowser() {
    const userAgent = navigator.userAgent;

    if (userAgent.indexOf("Firefox") > -1) {
        return "Firefox";
    } else if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
    } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
        return "Safari";
    } else if (userAgent.indexOf("Edge") > -1) {
        return "Edge";
    } else {
        return "Other";
    }
}

// Function to show or download PDF based on browser
function handlePDF(url) {
    const browser = detectBrowser();

    // For browsers that open PDFs inline (e.g., Chrome, Edge), open in new small window
    if (browser === "Chrome" || browser === "Edge") {
        // Open in a small popup window
        const pdfWindow = window.open(url, "_blank", "width=800,height=600");
        if (!pdfWindow) {
            alert('Popup blocker might be enabled. Please allow popups for this site.');
        }
    } else if (browser === "Firefox" || browser === "Safari" || browser === "Other") {
        // Force download for Firefox, Safari, and other browsers
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = ''; // This forces the download dialog
        document.body.appendChild(anchor);
        anchor.click(); // Trigger click event
        document.body.removeChild(anchor); // Remove anchor after download
    }
}

// Function to handle file downloads or open the PDF in a new window
function downloadFile(url, isFile) {
    if (isFile) {
        // Check if the file is a PDF; if so, handle it based on browser type
        if (url.toLowerCase().endsWith('.pdf')) {
            handlePDF(url);
        } else {
            // For non-PDF files (ZIP, etc.), trigger download
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = ''; // Force download dialog
            document.body.appendChild(anchor);
            anchor.click(); // Trigger click event
            document.body.removeChild(anchor); // Remove anchor after download
        }
    } else {
        // For YouTube videos, open in modal (handle separately)
        showModal(url);
    }
}

// Function to show the video in a modal
function showModal(videoUrl) {
    const modal = document.getElementById('videoModal');
    const videoElement = document.getElementById('modalVideo');

    videoElement.src = videoUrl;  // Set the video source
    modal.style.display = "block";  // Show the modal
}

// Function to close the video modal
function closeModal() {
    const modal = document.getElementById('videoModal');
    const videoElement = document.getElementById('modalVideo');

    videoElement.src = '';  // Remove the video source
    modal.style.display = "none";  // Hide the modal
}

// Fetch and load the obfuscated CSV file (obsdata.csv) from the local directory
fetch('obsdata.csv')
    .then(response => response.text())
    .then(obfuscatedText => {
        const decodedText = decodeCSV(obfuscatedText);  // Decode the base64-encoded CSV file

        if (decodedText) {
            // Parse the CSV using PapaParse after decoding
            Papa.parse(decodedText, {
                header: true,
                skipEmptyLines: true, // Skip empty rows
                complete: function(results) {
                    processCSVData(results.data); // Process the decoded and parsed data
                }
            });
        }
    })
    .catch(error => {
        console.error('Error loading the obfuscated CSV file:', error);
    });

// Function to decode base64 encoded CSV content
function decodeCSV(base64String) {
    try {
        // Decode the base64 string
        const decodedData = atob(base64String);
        return decodedData;
    } catch (error) {
        console.error('Error decoding CSV:', error);
        return null;
    }
}

// Function to process the parsed CSV data
function processCSVData(data) {
    const supermodules = {}; // Dictionary to store all data grouped by Superheading > Heading > Sub-Heading > Resource Links
    let lastSuperheading = null;
    let lastHeading = null;
    let lastSubheading = null;

    data.forEach(function(row) {
        const superheading = row['Superheading'] ? row['Superheading'].trim() : '';
        const heading = row['Heading'] ? row['Heading'].trim() : '';
        const subheading = row['Sub-Heading'] ? row['Sub-Heading'].trim() : '';
        const resourceLink = row['Resource Links'] ? row['Resource Links'].trim() : '';
        const resourceURL = row['Actual URL'] ? row['Actual URL'].trim() : '';  // Extract the actual URL column

        if (superheading && superheading.length > 0) {
            lastSuperheading = superheading;
            if (!supermodules[lastSuperheading]) {
                supermodules[lastSuperheading] = {};
            }
        }

        if (heading && heading.length > 0 && lastSuperheading) {
            lastHeading = heading;
            if (!supermodules[lastSuperheading][lastHeading]) {
                supermodules[lastSuperheading][lastHeading] = {};
            }
        }

        if (subheading && subheading.length > 0 && lastSuperheading && lastHeading) {
            lastSubheading = subheading;
            if (!supermodules[lastSuperheading][lastHeading][lastSubheading]) {
                supermodules[lastSuperheading][lastHeading][lastSubheading] = [];
            }
        }

        if (resourceLink && resourceURL && lastSuperheading && lastHeading && lastSubheading) {
            const linkIsFile = resourceLink.toLowerCase().endsWith("file");
            const isVideo = resourceURL.includes("youtube");

            let finalURL = resourceURL;
            if (linkIsFile && !isVideo) {
                finalURL += "?raw=true";  // Add raw=true for files
            }

            supermodules[lastSuperheading][lastHeading][lastSubheading].push({
                linkText: resourceLink,
                linkURL: finalURL,
                isFile: !isVideo  // Set this flag to differentiate videos
            });
        }
    });

    generateCourseContent(supermodules);
}

// Function to dynamically generate the course content after grouping the data
function generateCourseContent(supermodules) {
    const container = document.getElementById('course-content');
    container.innerHTML = '';

    for (const superheading in supermodules) {
        if (supermodules.hasOwnProperty(superheading)) {
            let superheadingHTML = `<details><summary>${superheading}</summary>`;

            for (const heading in supermodules[superheading]) {
                if (supermodules[superheading].hasOwnProperty(heading)) {
                    superheadingHTML += `<details><summary>${heading}</summary>`;

                    for (const subheading in supermodules[superheading][heading]) {
                        if (supermodules[superheading][heading].hasOwnProperty(subheading)) {
                            superheadingHTML += `<details class="sub-heading"><summary>${subheading}</summary><ul>`;

                            supermodules[superheading][heading][subheading].forEach(resource => {
                                const downloadHandler = `downloadFile('${resource.linkURL}', ${resource.isFile})`;
                                superheadingHTML += `<li><a href="javascript:void(0);" onclick="${downloadHandler}">${resource.linkText}</a></li>`;
                            });

                            superheadingHTML += `</ul></details>`;
                        }
                    }

                    superheadingHTML += `</details>`;
                }
            }

            superheadingHTML += `</details>`;
            container.innerHTML += superheadingHTML;
        }
    }
}

