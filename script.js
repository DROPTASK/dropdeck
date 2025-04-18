// Helper function to select elements
const $ = (selector) => document.getElementById(selector);

// State management
const state = {
    projects: [],
    myProjects: [],
    news: [],
    tasks: {}
};

// Function to set the active tab
function setActiveTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all nav items
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show the selected tab content
    $(tabId).classList.add('active');

    // Activate the selected nav item
    document.querySelector(`.bottom-nav .nav-item[data-tab="${tabId}"]`).classList.add('active');
}

// Function to handle navigation
function navigateTo(tabId) {
    setActiveTab(tabId);
}

// Function to initialize the app
function initApp() {
    // Set up bottom navigation
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.addEventListener('click', (event) => {
            const tabId = event.currentTarget.dataset.tab;
            navigateTo(tabId);
        });
    });

    // Set up profile icon click
    $('profileIcon').addEventListener('click', () => {
        navigateTo('profile');
    });

    // Initialize default tab
    navigateTo('dashboard');

    // Initialize projects
    initializeProjects();

    // Initialize news
    initializeNews();

    // Initialize theme
    initializeTheme();

    // Update dashboard
    updateDashboard();

    // Update explore tab
    updateExplore();

    // Update news tab
    updateNews();

    // Update tasks tab
    updateTasks();

    // Set up financial modal
    setupFinancialModal();

    // Set up news navigation
    setupNewsNavigation();

    // Set up project navigation
    setupProjectNavigation();
}

// Function to initialize projects
const initializeProjects = () => {
    state.projects = [
        {
            id: 'project1',
            name: 'EcoChain',
            shortDescription: 'Building a sustainable blockchain for environmental solutions.',
            fullDescription: 'EcoChain is dedicated to creating a blockchain platform that supports environmental sustainability. By leveraging blockchain technology, EcoChain aims to improve transparency, efficiency, and collaboration in environmental projects worldwide.',
            tasks: [],
            fundingGoal: 500000,
            currentFunding: 250000,
            teamMembers: ['Alice Smith', 'Bob Johnson', 'Charlie Brown'],
            hot: true
        },
        {
            id: 'project2',
            name: 'AquaTrack',
            shortDescription: 'Tracking water quality using IoT and blockchain.',
            fullDescription: 'AquaTrack combines IoT sensors with blockchain technology to monitor and track water quality in real-time. This project ensures that water resources are managed effectively and transparently, providing accurate data to communities and organizations.',
            tasks: [],
            fundingGoal: 750000,
            currentFunding: 600000,
            teamMembers: ['David White', 'Eve Green', 'Frank Black'],
            hot: true
        },
        {
            id: 'project3',
            name: 'AgriBlock',
            shortDescription: 'Improving agricultural supply chains with blockchain.',
            fullDescription: 'AgriBlock uses blockchain to enhance the transparency and efficiency of agricultural supply chains. This project helps farmers, distributors, and consumers track products from farm to table, ensuring fair trade and reducing food waste.',
            tasks: [],
            fundingGoal: 400000,
            currentFunding: 150000,
            teamMembers: ['Grace Taylor', 'Henry Moore', 'Ivy Clark'],
            hot: false
        },
        {
            id: 'project4',
            name: 'RenewableCoin',
            shortDescription: 'Incentivizing renewable energy adoption with crypto.',
            fullDescription: 'RenewableCoin is a cryptocurrency designed to incentivize the adoption of renewable energy. By rewarding users who generate and use renewable energy, this project aims to accelerate the transition to a sustainable energy future.',
            tasks: [],
            fundingGoal: 600000,
            currentFunding: 300000,
            teamMembers: ['Jack Hill', 'Kelly Green', 'Liam Blue'],
            hot: false
        },
        {
            id: 'project5',
            name: 'CarbonTrade',
            shortDescription: 'A blockchain-based carbon credit trading platform.',
            fullDescription: 'CarbonTrade provides a transparent and efficient platform for trading carbon credits using blockchain technology. This project helps companies offset their carbon emissions and supports environmental conservation efforts.',
            tasks: [],
            fundingGoal: 800000,
            currentFunding: 700000,
            teamMembers: ['Mia Brown', 'Noah Gray', 'Olivia White'],
            hot: false
        },
        {
            id: 'project6',
            name: 'WasteChain',
            shortDescription: 'Tracking and managing waste using blockchain technology.',
            fullDescription: 'WasteChain uses blockchain to track and manage waste from generation to disposal. This project improves waste management efficiency, reduces illegal dumping, and promotes recycling.',
            tasks: [],
            fundingGoal: 450000,
            currentFunding: 200000,
            teamMembers: ['Peter Green', 'Quinn Black', 'Rachel White'],
            hot: false
        },
        {
            id: 'project7',
            name: 'ForestGuard',
            shortDescription: 'Protecting forests with blockchain-verified data.',
            fullDescription: 'ForestGuard uses blockchain to verify and secure data related to forest conservation. This project helps prevent deforestation, promotes sustainable forestry practices, and supports biodiversity.',
            tasks: [],
            fundingGoal: 550000,
            currentFunding: 400000,
            teamMembers: ['Sarah Blue', 'Tom Green', 'Uma Black'],
            hot: false
        },
        {
            id: 'project8',
            name: 'OceanClean',
            shortDescription: 'Cleaning up ocean plastic with blockchain incentives.',
            fullDescription: 'OceanClean incentivizes the cleanup of ocean plastic using blockchain-based rewards. This project engages communities and organizations in removing plastic waste from the ocean, protecting marine life and ecosystems.',
            tasks: [],
            fundingGoal: 700000,
            currentFunding: 500000,
            teamMembers: ['Victor White', 'Wendy Green', 'Xander Blue'],
            hot: false
        },
        {
            id: 'project9',
            name: 'AirQualityNet',
            shortDescription: 'Monitoring air quality with a decentralized sensor network.',
            fullDescription: 'AirQualityNet uses a decentralized network of sensors to monitor air quality in urban areas. This project provides real-time data to help communities and governments address air pollution and improve public health.',
            tasks: [],
            fundingGoal: 650000,
            currentFunding: 550000,
            teamMembers: ['Yara Green', 'Zach White', 'Ava Blue'],
            hot: false
        },
        {
            id: 'project10',
            name: 'ClimateDAO',
            shortDescription: 'A decentralized autonomous organization for climate action.',
            fullDescription: 'ClimateDAO is a decentralized autonomous organization (DAO) that funds and supports climate action initiatives. This project empowers communities to address climate change through transparent and democratic decision-making.',
            tasks: [],
            fundingGoal: 900000,
            currentFunding: 800000,
            teamMembers: ['Bob Johnson', 'Charlie Brown', 'David White'],
            hot: false
        },
        {
            id: 'project11',
            name: 'SolarShare',
            shortDescription: 'Sharing solar energy through a blockchain microgrid.',
            fullDescription: 'SolarShare enables communities to share solar energy through a blockchain-based microgrid. This project promotes energy independence, reduces reliance on fossil fuels, and supports local economies.',
            tasks: [],
            fundingGoal: 520000,
            currentFunding: 270000,
            teamMembers: ['Eve Green', 'Frank Black', 'Grace Taylor'],
            hot: false
        },
        {
            id: 'project12',
            name: 'HydroPowerChain',
            shortDescription: 'Tracking sustainable hydropower generation on blockchain.',
            fullDescription: 'HydroPowerChain tracks the generation of sustainable hydropower using blockchain technology. This project ensures that hydropower projects meet environmental standards and contribute to a clean energy supply.',
            tasks: [],
            fundingGoal: 780000,
            currentFunding: 630000,
            teamMembers: ['Henry Moore', 'Ivy Clark', 'Jack Hill'],
            hot: false
        },
        {
            id: 'project13',
            name: 'WindTrust',
            shortDescription: 'Verifying wind energy production with blockchain.',
            fullDescription: 'WindTrust verifies the production of wind energy using blockchain technology. This project provides transparent and reliable data on wind energy generation, supporting the growth of the renewable energy sector.',
            tasks: [],
            fundingGoal: 420000,
            currentFunding: 170000,
            teamMembers: ['Kelly Green', 'Liam Blue', 'Mia Brown'],
            hot: false
        },
        {
            id: 'project14',
            name: 'GeoThermalLedger',
            shortDescription: 'Managing geothermal energy resources on a blockchain ledger.',
            fullDescription: 'GeoThermalLedger manages geothermal energy resources using a blockchain ledger. This project ensures the sustainable use of geothermal energy and promotes its adoption as a clean energy source.',
            tasks: [],
            fundingGoal: 620000,
            currentFunding: 320000,
            teamMembers: ['Noah Gray', 'Olivia White', 'Peter Green'],
            hot: false
        },
        {
            id: 'project15',
            name: 'BioFuelBlock',
            shortDescription: 'Tracking biofuel production and distribution on blockchain.',
            fullDescription: 'BioFuelBlock tracks the production and distribution of biofuels using blockchain technology. This project ensures the sustainability and traceability of biofuels, supporting their role in reducing carbon emissions.',
            tasks: [],
            fundingGoal: 820000,
            currentFunding: 720000,
            teamMembers: ['Quinn Black', 'Rachel White', 'Sarah Blue'],
            hot: false
        },
        {
            id: 'project16',
            name: 'EcoCreditChain',
            shortDescription: 'Tokenizing and trading environmental credits on blockchain.',
            fullDescription: 'EcoCreditChain tokenizes and trades environmental credits on a blockchain platform. This project incentivizes environmental conservation and restoration by creating a liquid market for environmental assets.',
            tasks: [],
            fundingGoal: 470000,
            currentFunding: 220000,
            teamMembers: ['Tom Green', 'Uma Black', 'Victor White'],
            hot: false
        },
        {
            id: 'project17',
            name: 'WaterCredit',
            shortDescription: 'Issuing and trading water conservation credits via blockchain.',
            fullDescription: 'WaterCredit issues and trades water conservation credits using blockchain technology. This project promotes efficient water use and supports water conservation projects in water-stressed regions.',
            tasks: [],
            fundingGoal: 570000,
            currentFunding: 420000,
            teamMembers: ['Wendy Green', 'Xander Blue', 'Yara Green'],
            hot: false
        },
        {
            id: 'project18',
            name: 'LandRegChain',
            shortDescription: 'Securing land rights and preventing deforestation with blockchain.',
            fullDescription: 'LandRegChain secures land rights and prevents deforestation using blockchain technology. This project empowers local communities to protect their land and forests, promoting sustainable land management practices.',
            tasks: [],
            fundingGoal: 720000,
            currentFunding: 520000,
            teamMembers: ['Zach White', 'Ava Blue', 'Alice Smith'],
            hot: false
        },
        {
            id: 'project19',
            name: 'SustainableFisheries',
            shortDescription: 'Tracking sustainable fishing practices on blockchain.',
            fullDescription: 'SustainableFisheries tracks sustainable fishing practices using blockchain technology. This project ensures that fish are harvested responsibly, supporting healthy ocean ecosystems and sustainable seafood supplies.',
            tasks: [],
            fundingGoal: 670000,
            currentFunding: 570000,
            teamMembers: ['Bob Johnson', 'Charlie Brown', 'David White'],
            hot: false
        },
        {
            id: 'project20',
            name: 'GreenBuildingChain',
            shortDescription: 'Certifying green buildings and materials on blockchain.',
            fullDescription: 'GreenBuildingChain certifies green buildings and materials using blockchain technology. This project promotes sustainable construction practices and reduces the environmental impact of the built environment.',
            tasks: [],
            fundingGoal: 920000,
            currentFunding: 820000,
            teamMembers: ['Eve Green', 'Frank Black', 'Grace Taylor'],
            hot: false
        },
        {
            id: 'project21',
            name: 'EcoTourismToken',
            shortDescription: 'Incentivizing sustainable tourism with blockchain tokens.',
            fullDescription: 'EcoTourismToken incentivizes sustainable tourism practices using blockchain tokens. This project rewards travelers and businesses that support environmental conservation and local communities.',
            tasks: [],
            fundingGoal: 540000,
            currentFunding: 290000,
            teamMembers: ['Henry Moore', 'Ivy Clark', 'Jack Hill'],
            hot: false
        }
    ];

    // Load myProjects from local storage or initialize if null
    const storedMyProjects = localStorage.getItem('myProjects');
    state.myProjects = storedMyProjects ? JSON.parse(storedMyProjects) : [];

    updateMyProjects();
    updateExplore();
    updateDashboard();
    updateTasks();
};

// Function to initialize news
const initializeNews = () => {
    state.news = [
        {
            id: 'news1',
            title: 'Blockchain Revolutionizing Environmental Conservation',
            content: 'Blockchain technology is increasingly being used to enhance transparency and efficiency in environmental conservation efforts...',
            category: 'airdrop',
            date: '2024-05-01'
        },
        {
            id: 'news2',
            title: 'New Crypto Airdrop for Sustainable Energy Advocates',
            content: 'A new cryptocurrency airdrop is being launched to reward individuals who support and invest in sustainable energy solutions...',
            category: 'market',
            date: '2024-05-05'
        },
        {
            id: 'news3',
            title: 'DropDeck App Update: Enhanced Project Tracking',
            content: 'The latest update to the DropDeck app includes enhanced features for tracking project progress and managing your investments...',
            category: 'app',
            date: '2024-05-10'
        },
        {
            id: 'news4',
            title: 'Tokenomics of EcoCoin: A Deep Dive',
            content: 'An in-depth analysis of the tokenomics of EcoCoin, a cryptocurrency focused on environmental sustainability, reveals innovative mechanisms for value accrual...',
            category: 'tokenomics',
            date: '2024-05-15'
        },
        {
            id: 'news5',
            title: 'Blockchain for Carbon Credits: A Game Changer',
            content: 'The use of blockchain technology for carbon credit trading is set to revolutionize the market, providing greater transparency and reducing fraud...',
            category: 'airdrop',
            date: '2024-05-20'
        },
        {
            id: 'news6',
            title: 'AquaTrack Partners with Major Environmental Organization',
            content: 'AquaTrack, a project focused on tracking water quality using IoT and blockchain, has announced a partnership with a major environmental organization...',
            category: 'market',
            date: '2024-05-25'
        },
        {
            id: 'news7',
            title: 'DropDeck Integrates New Task Management Features',
            content: 'The DropDeck app now includes new task management features, allowing users to better organize and track their contributions to various projects...',
            category: 'app',
            date: '2024-05-30'
        },
        {
            id: 'news8',
            title: 'RenewableCoin Announces Airdrop for Early Adopters',
            content: 'RenewableCoin, a cryptocurrency designed to incentivize renewable energy adoption, has announced an airdrop for early adopters...',
            category: 'tokenomics',
            date: '2024-06-01'
        },
        {
            id: 'news9',
            title: 'Blockchain Enhancing Supply Chain Transparency in Agriculture',
            content: 'Blockchain technology is being used to enhance supply chain transparency in agriculture, ensuring fair trade and reducing food waste...',
            category: 'airdrop',
            date: '2024-06-05'
        },
        {
            id: 'news10',
            title: 'CarbonTrade Platform Sees Record Trading Volume',
            content: 'The CarbonTrade platform, which facilitates the trading of carbon credits using blockchain, has seen a record trading volume in the past month...',
            category: 'market',
            date: '2024-06-10'
        }
    ];
};

// Function to initialize theme
const initializeTheme = () => {
    const themeToggle = $('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    });
};

// Function to update dashboard
const updateDashboard = () => {
    // Calculate total investment and earnings
    let totalInvestment = 0;
    let totalEarnings = 0;

    state.myProjects.forEach(project => {
        project.investment = project.investment || 0;
        project.earnings = project.earnings || 0;
        totalInvestment += project.investment;
        totalEarnings += project.earnings;
    });

    // Update investment and earnings values
    $('dashboardInvestment').textContent = `$${totalInvestment.toFixed(2)}`;
    $('dashboardEarnings').textContent = `$${totalEarnings.toFixed(2)}`;

    // Update projects count
    $('dashboardProjects').textContent = `${state.myProjects.length}/${state.projects.length}`;

    // Calculate total tasks and completed tasks
    let totalTasks = 0;
    let completedTasks = 0;

    for (const projectId in state.tasks) {
        const tasks = state.tasks[projectId];
        totalTasks += tasks.length;
        completedTasks += tasks.filter(task => task.completed).length;
    }

     // Update tasks count
     $('dashboardTasks').textContent = `${completedTasks}/${totalTasks}`;

    // Update my projects section
    updateMyProjects();
};

// Function to update my projects section
const updateMyProjects = () => {
    const container = $('myProjects');
    container.innerHTML = '';

    if (state.myProjects.length === 0) {
        container.innerHTML = '<p class="empty-state">No projects joined yet. Explore to add some!</p>';
        return;
    }

    state.myProjects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project-card';
        projectDiv.innerHTML = `
            <h3>${project.name}</h3>
            <p>${project.shortDescription}</p>
            <button class="remove-project">Remove</button>
        `;

        const removeButton = projectDiv.querySelector('.remove-project');
        removeButton.addEventListener('click', () => {
            state.myProjects = state.myProjects.filter(p => p.id !== project.id);
            localStorage.setItem('myProjects', JSON.stringify(state.myProjects));
            updateMyProjects();
            updateExplore();
            updateDashboard();
            updateTasks();
        });

        projectDiv.addEventListener('click', (event) => {
            if (event.target !== removeButton) {
                showProjectDetail(project);
            }
        });

        container.appendChild(projectDiv);
    });
};

// Update explore tab content
const updateExplore = () => {
    const container = $('exploreProjectsGrid');
    container.innerHTML = '';
    
    if (state.projects.length === 0) {
        initializeProjects(); // If no projects, initialize them
        return;
    }
    
    state.projects.forEach(project => {
        const isJoined = state.myProjects.some(p => p.id === project.id);
        const card = document.createElement('div');
        card.className = 'explore-card';
        card.innerHTML = `
            <div class="explore-logo">
                <img src="https://via.placeholder.com/120/FFFFFF/000000?text=${project.name.charAt(0)}" alt="${project.name}" class="circular-logo">
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

// Function to update news tab
const updateNews = () => {
    const container = $('newsContainer');
    container.innerHTML = '';

    if (state.news.length === 0) {
        container.innerHTML = '<p class="empty-state">No news items yet.</p>';
        return;
    }

    state.news.forEach(newsItem => {
        const newsDiv = document.createElement('div');
        newsDiv.className = 'news-item';
        newsDiv.innerHTML = `
            <h3>${newsItem.title}</h3>
            <p class="news-date">${newsItem.date}</p>
            <p>${newsItem.content.substring(0, 100)}...</p>
            <a href="#" class="read-more" data-id="${newsItem.id}">Read More</a>
        `;

        const readMoreLink = newsDiv.querySelector('.read-more');
        readMoreLink.addEventListener('click', (event) => {
            event.preventDefault();
            showNewsDetail(newsItem.id);
        });

        container.appendChild(newsDiv);
    });
};

// Function to update tasks tab
const updateTasks = () => {
    const container = $('taskProjects');
    container.innerHTML = '';

    if (state.myProjects.length === 0) {
        container.innerHTML = '<p class="empty-state">No projects added yet. Add projects from Explore tab.</p>';
        $('taskStats').textContent = '0/0 Tasks Completed';
        return;
    }

    let totalTasks = 0;
    let completedTasks = 0;

    state.myProjects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'task-project';
        projectDiv.innerHTML = `
            <h3>${project.name}</h3>
            <div class="task-list"></div>
            <button class="add-task" data-project-id="${project.id}">Add Task</button>
        `;

        const taskList = projectDiv.querySelector('.task-list');
        const addTaskButton = projectDiv.querySelector('.add-task');

        // Load tasks for this project from state
        const tasks = state.tasks[project.id] || [];

        tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task-item';
            taskDiv.innerHTML = `
                <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
                <label for="task-${task.id}">${task.name}</label>
            `;

            const checkbox = taskDiv.querySelector('input');
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                updateDashboard();
                updateTasks();
            });

            taskList.appendChild(taskDiv);
        });

        addTaskButton.addEventListener('click', (event) => {
            const projectId = event.target.dataset.projectId;
            $('projectIdForTask').value = projectId;
            $('taskModal').style.display = 'block';
        });

        totalTasks += tasks.length;
        completedTasks += tasks.filter(task => task.completed).length;

        container.appendChild(projectDiv);
    });

    $('taskStats').textContent = `${completedTasks}/${totalTasks} Tasks Completed`;
};

// Function to show project detail
const showProjectDetail = (project) => {
    const detailContent = $('projectDetailContent');
    detailContent.innerHTML = `
        <h2>${project.name}</h2>
        <p>${project.fullDescription}</p>
        <h3>Team Members</h3>
        <ul>
            ${project.teamMembers.map(member => `<li>${member}</li>`).join('')}
        </ul>
        <div class="funding-info">
            <p>Funding Goal: $${project.fundingGoal}</p>
            <p>Current Funding: $${project.currentFunding}</p>
        </div>
        <button id="joinProjectBtn" class="action-button">${state.myProjects.some(p => p.id === project.id) ? 'Joined' : 'Join Project'}</button>
    `;

    const joinProjectBtn = $('joinProjectBtn');
    joinProjectBtn.addEventListener('click', () => {
        if (state.myProjects.some(p => p.id === project.id)) {
            // Optionally, allow users to "unjoin" the project
            state.myProjects = state.myProjects.filter(p => p.id !== project.id);
            joinProjectBtn.textContent = 'Join Project';
        } else {
            state.myProjects.push(project);
            joinProjectBtn.textContent = 'Joined';
        }
        localStorage.setItem('myProjects', JSON.stringify(state.myProjects));
        updateMyProjects();
        updateExplore();
        updateDashboard();
        updateTasks();
    });

    setActiveTab('projectDetail');
};

// Function to show news detail
const showNewsDetail = (newsId) => {
    const newsItem = state.news.find(news => news.id === newsId);
    const detailContent = $('newsDetailContent');
    detailContent.innerHTML = `
        <h2>${newsItem.title}</h2>
        <p class="news-date">${newsItem.date}</p>
        <p>${newsItem.content}</p>
    `;
    setActiveTab('newsDetail');
};

// Function to set up financial modal
const setupFinancialModal = () => {
    const modal = $('financialModal');
    const addInvestmentBtn = $('addInvestmentBtn');
    const addEarningBtn = $('addEarningBtn');
    const cancelFinancialBtn = $('cancelFinancialBtn');
    const financialForm = $('financialForm');
    const modalTitle = $('modalTitle');

    addInvestmentBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Add Investment';
        modal.style.display = 'block';
    });

    addEarningBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Add Earning';
        modal.style.display = 'block';
    });

    cancelFinancialBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    financialForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const amount = $('amount').value;
        const description = $('description').value;
        const date = $('date').value;

        // Here you would handle the submission of the financial data
        console.log('Amount:', amount, 'Description:', description, 'Date:', date);

        modal.style.display = 'none';
    });
};

// Function to set up news navigation
const setupNewsNavigation = () => {
    $('viewAllNews').addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo('news');
    });

    $('backToNews').addEventListener('click', () => {
        navigateTo('news');
    });
};

// Function to set up project navigation
const setupProjectNavigation = () => {
    $('backToExplore').addEventListener('click', () => {
        navigateTo('explore');
    });
};

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', initApp);

// Task form submission
$('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const taskName = $('taskName').value;
    const projectId = $('projectIdForTask').value;
    const taskId = Math.random().toString(36).substring(2, 15);

    if (!state.tasks[projectId]) {
        state.tasks[projectId] = [];
    }

    state.tasks[projectId].push({
        id: taskId,
        name: taskName,
        completed: false
    });

    $('taskModal').style.display = 'none';
    $('taskName').value = ''; // Clear the input field
    updateTasks();
    updateDashboard();
});

// Cancel task button
$('cancelTaskBtn').addEventListener('click', function() {
    $('taskModal').style.display = 'none';
});
