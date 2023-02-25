'use strict';

const AURORA = document.querySelector('.aurora');
const goodColors = [
    '#a55eea',
    '#2d98da'
];
const scrollThreshold = 10;
let slide = 0;
let scrollToNextIntent = 0;
let startTouch;

function pluralize(count, word) {
    return count === 1 ? word : word + 's';
}

function renderWithData(data) {
    // Attended hackathons
    const attendedContainer = document.querySelector('.attended-container');
    
    for (let hackathon of data['hackathons']['attended']) {
        attendedContainer.appendChild(createHackathonCard(hackathon));
    }

    // On Radar hackathons
    const radarContainer = document.querySelector('.radar-container');
    
    if (data['hackathons']['on_radar'].length === 0) {
        let h2 = document.createElement("h2");
        h2.textContent = "Nothing to see right now";

        radarContainer.appendChild(h2);
    } else {
        for (let hackathon of data['hackathons']['on_radar']) {
            radarContainer.appendChild(createHackathonCard(hackathon));
        }
    }

    // Stats
    const statistics = data['statistics'];
    const attendedCount = document.querySelector('.js-attended-count');
    const winCount = document.querySelector('.js-win-count');
    const winPercentage = document.querySelector('.js-win-percentage');

    attendedCount.textContent = `${statistics['attended'].toLocaleString()} ${pluralize(statistics['attended'], 'hackathon')}`;
    winCount.textContent = `${statistics['won'].toLocaleString()} of them`;
    winPercentage.textContent = `${Math.round(statistics['won'] / statistics['attended'] * 100).toLocaleString()}%`;
}

function createHackathonCard(hackathon) {
    let container = document.createElement('div');
    container.classList = 'hackathon';
    
    // Shared elements
    let image = document.createElement('img');
    let name = document.createElement('h3');

    image.src = hackathon['image'];
    image.classList.add('hackathon-logo')
    name.textContent = hackathon['name'];

    container.appendChild(name);
    container.appendChild(image);

    // Unique elements
    if (hackathon['project'] !== undefined && hackathon['awards'] !== undefined) {
        // Completed hackathon
        let link = document.createElement('a');
        let seeProject = document.createElement('button');
        seeProject.classList = 'button';
        seeProject.textContent = 'See our project';
        link.appendChild(seeProject);
        link.href = hackathon['project']['link'];
        container.appendChild(link);
    }

    return container;
}

function onMount() {
    // Create aurora
    for (let i = 0; 8 > i; i++) {
        const bubble = document.createElement('div');

        bubble.style.transition = '2s ease-in-out';
        bubble.classList = 'bubble';

        AURORA.appendChild(bubble);
    }

    // Update data
    fetch('data.json').then(r => r.json()).then(renderWithData);

    // Update scroll position
    slide = document.querySelector('main').scrollTop / window.innerHeight;

    // Remove event listener
    document.removeEventListener('DOMContentLoaded', onMount);
}

function onResize() {
    slide = document.querySelector('main').scrollTop / window.innerHeight;

    document.querySelector('main').scrollTo({
        behavior: 'auto',
        top: window.innerHeight * slide
    });
}

function onCleanup() {
    // Remove event listener
    document.removeEventListener('close', onCleanup);
    document.removeEventListener('wheel', onScroll);
    document.removeEventListener('resize', onResize);
    document.removeEventListener('dragstart', onDragStart);
}

function onTouchStart(event) {
    startTouch = event['changedTouches'][0]['clientY'];
}

function onTouchEnd(event) {
    let diff = event['changedTouches'][0]['clientY'] - startTouch;

    scrollToNextIntent = scrollThreshold * diff;
    onScroll({
        'wheelDeltaY': diff
    });
}

document.addEventListener('touchstart', onTouchStart);
document.addEventListener('touchend', onTouchEnd);
document.addEventListener('resize', onResize);
document.addEventListener('DOMContentLoaded', onMount);
document.addEventListener('close', onCleanup);

