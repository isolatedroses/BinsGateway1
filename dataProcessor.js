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
        console.error('Error loading the cranky file modified by some numbskull!:', error);
    });
