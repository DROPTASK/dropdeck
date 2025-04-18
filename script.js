
// Update explore tab content
const updateExplore = () => {
    const container = $('exploreProjectsGrid');
    container.innerHTML = '';
    
    if (state.projects.length === 0) {
        initializeProjects(); // If no projects, initialize them
        return;
    }
    
    state.projects.forEach(project => {
        const logoMap = {
            'EcoChain': '/src/assets/project-logos/ecochain-logo.png',
            'AquaTrack': '/src/assets/project-logos/aquatrack-logo.png',
            // Add more project logos here
            'default': `https://via.placeholder.com/120/FFFFFF/000000?text=${project.name.charAt(0)}`
        };

        const logoSrc = logoMap[project.name] || logoMap['default'];
        
        const card = document.createElement('div');
        card.className = 'explore-card';
        card.innerHTML = `
            <div class="explore-logo">
                <img src="${logoSrc}" alt="${project.name}" class="circular-logo">
            </div>
            <div class="explore-info">
                <h3 class="explore-name">${project.name}</h3>
                <p class="explore-description">${project.shortDescription}</p>
            </div>
        `;
        
        container.appendChild(card);
        
        card.addEventListener('click', () => {
            showProjectDetail(project);
        });
    });
};
