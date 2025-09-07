//////// new changes
// Sidebar and dropdown logic (no changes needed)
const openBtn = document.getElementById('openBtn');
const modalBox = document.getElementById('modalBox');
openBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    modalBox.classList.toggle('show');
});
document.addEventListener('click', (e) => {
    if (!modalBox.contains(e.target) && !openBtn.contains(e.target)) {
        modalBox.classList.remove('show');
    }
});
const openSide = document.getElementById('sidebarToggle');
const sidebarContent = document.getElementById('contentSideBtn');
const closeBtn = document.getElementById('closeSideBtn');
openSide.addEventListener('click', () => {
    sidebarContent.classList.add('open');
});

closeBtn.addEventListener('click', () => {
    sidebarContent.classList.remove('open');
});
document.addEventListener('click', (e) => {
    if (!sidebarContent.contains(e.target) && !openSide.contains(e.target)) {
        sidebarContent.classList.remove('open');
    }
});
// Google Charts setup
google.charts.load('current', {
    packages: ['corechart', 'bar']
});

// FIXED: Use querySelector to select the main content container by its class
const mainContentContainer = document.querySelector('.main-content-container');
// A function to load content from a specific URL
const loadContent = (url) => {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load page: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            mainContentContainer.innerHTML = html;
            // Only call drawCharts if the loaded page is the dashboard
            if (url === 'dashboard.html') {
                google.charts.setOnLoadCallback(drawCharts);
            }

            // Initialize booking modal if booking.html is loaded
            if (url === 'booking.html') {
                initBookingModal();
            }
        })
        .catch(error => {
            console.error('Error loading content:', error);
            mainContentContainer.innerHTML = '<p>Sorry, the content could not be loaded.</p>';
        });
};
// Chart functions (unchanged)
function drawCharts() {
    drawLineChart();
    drawPieChart();
    drawBarChart();
}

function drawLineChart() {
    var data1 = google.visualization.arrayToDataTable([
        ['Month', '2025', '2024'],
        ['June', 19, 8],
        ['July', 6, 9],
        ['August', 9, 12],
        ['Sept', 17, 24]
    ]);
    var options1 = {
        title: 'Total Visitors in the last 4 months',
        hAxis: {
            title: 'Year',
            titleTextStyle: {
                color: '#333'
            }
        },
        vAxis: {
            minValue: 0
        }
    };
    var chart1 = new google.visualization.AreaChart(document.getElementById('chart_div'));
    chart1.draw(data1, options1);
}

function drawPieChart() {
    var data = google.visualization.arrayToDataTable([
        ['Crime Type', 'Number of Inmates'],
        ['Assault', 20],
        ['Drug Offenses', 50],
        ['Theft', 12],
        ['Homicide', 8],
        ['Burglary', 7],
    ]);
    var options = {
        title: 'Top 5 Crimes Committed by Inmates'
    };
    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(data, options);
}
function drawBarChart() {
    var data = google.visualization.arrayToDataTable([
        ["Gender", "Population", {
            role: "style"
        }],
        ["Male", 23, "#3c49d2ff"],
        ["Female", 14, "red"],
        ["Other", 5, "gold"],
    ]);

    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1, {
            calc: "stringify",
            sourceColumn: 1,
            type: "string",
            role: "annotation"
        }, 2]);
    var options = {
        title: "Inmate Population by Gender",
        bar: {
            groupWidth: "95%"
        },
        legend: {
            position: "none"
        },
    };
    var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
    chart.draw(view, options);
}
window.addEventListener('resize', drawCharts);

// Event listener for all links
document.addEventListener('click', (e) => {
    const targetLink = e.target.closest('a[data-page]');
    if (targetLink) {
        e.preventDefault();
        const pageToLoad = targetLink.getAttribute('data-page');
        loadContent(pageToLoad);
    }
});
// Load the initial dashboard content when the page first loads
document.addEventListener('DOMContentLoaded', () => {
    loadContent('dashboard.html');
});
// Booking modal initialization function
function initBookingModal() {
    const bookingModal = document.getElementById('bookingModal');
    const addBookingBtn = document.getElementById('booking-btn-open').querySelector('button');
    const closeBookingModalBtn = document.getElementById('closeBookingModal');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const modalPages = [
        document.getElementById('modalPage1'),
        document.getElementById('modalPage2'),
        document.getElementById('modalPage3'),
    ];
    let currentModalPage = 0;
    function showModalPage(index) {
        modalPages.forEach((page, i) => {
            page.style.display = i === index ? 'flex' : 'none';
        });
        prevPageBtn.disabled = index === 0;
        nextPageBtn.textContent = index === modalPages.length - 1 ? 'Submit' : 'Next';
    }
    addBookingBtn.addEventListener('click', () => {
        bookingModal.style.display = 'flex';
        currentModalPage = 0;
        showModalPage(currentModalPage);
    });

    closeBookingModalBtn.addEventListener('click', () => {
        bookingModal.style.display = 'none';
    });
    prevPageBtn.addEventListener('click', () => {
        if (currentModalPage > 0) {
            currentModalPage--;
            showModalPage(currentModalPage);
        }
    });
    nextPageBtn.addEventListener('click', () => {
        if (currentModalPage < modalPages.length - 1) {
            currentModalPage++;
            showModalPage(currentModalPage);
        } else {
            // On Submit: close modal for now
            bookingModal.style.display = 'none';
        }
    });

    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            bookingModal.style.display = 'none';
        }
    });
}