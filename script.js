
// ========== Global Variables ==========

// Store state
let state = {
    projects: [], // All available projects
    myProjects: [], // Projects the user has joined
    tasks: [], // All tasks for joined projects
    financialRecords: [], // Investment and earning records
    news: [] // News items
};

// ========== Helper Functions ==========

// Format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
};

// Format date
const formatDate = (date) => {
    const d = new Date(date);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
};

// Generate random ID
const generateId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Get element by ID shorthand
const $ = (id) => document.getElementById(id);

// Save state to local storage
const saveState = () => {
    localStorage.setItem('dropDeckState', JSON.stringify(state));
};

// Load state from local storage
const loadState = () => {
    const savedState = localStorage.getItem('dropDeckState');
    if (savedState) {
        state = JSON.parse(savedState);
    }
};

// ========== Navigation Functions ==========

// Initialize navigation
const initNavigation = () => {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            
            // Update active nav item
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Update active tab content
            tabContents.forEach(tab => {
                tab.classList.remove('active');
                if (tab.id === tabId) {
                    tab.classList.add('active');
                    updateTabContent(tabId); // Update tab specific content
                }
            });
        });
    });
};

// Update tab specific content when navigating
const updateTabContent = (tabId) => {
    switch(tabId) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'investmentEarning':
            updateInvestmentEarning();
            break;
        case 'explore':
            updateExplore();
            break;
        case 'statistics':
            updateStatistics();
            break;
        case 'tasks':
            updateTasks();
            break;
        case 'news':
            updateNews();
            break;
        case 'profile':
            // No dynamic updates needed for profile
            break;
    }
};

// ========== Dashboard Functions ==========

// Update dashboard content
const updateDashboard = () => {
    updateDashboardStats();
    updateMyProjects();
    updateNewsPreview();
};

// Update dashboard statistics
const updateDashboardStats = () => {
    // Calculate total investment
    const totalInvestment = state.financialRecords
        .filter(record => record.type === 'investment')
        .reduce((sum, record) => sum + record.amount, 0);
    
    // Calculate total earnings
    const totalEarnings = state.financialRecords
        .filter(record => record.type === 'earning')
        .reduce((sum, record) => sum + record.amount, 0);
    
    // Update dashboard stats
    $('dashboardInvestment').textContent = formatCurrency(totalInvestment);
    $('dashboardEarnings').textContent = formatCurrency(totalEarnings);
    $('dashboardProjects').textContent = `${state.myProjects.length}/${state.projects.length}`;
    
    // Calculate task completion
    const totalTasks = state.tasks.length;
    const completedTasks = state.tasks.filter(task => task.completed).length;
    $('dashboardTasks').textContent = `${completedTasks}/${totalTasks}`;
};

// Update my projects section
const updateMyProjects = () => {
    const container = $('myProjects');
    container.innerHTML = '';
    
    if (state.myProjects.length === 0) {
        container.innerHTML = '<p class="empty-state">No projects joined yet. Explore to add some!</p>';
        return;
    }
    
    // Sort projects: hot first, then others
    const sortedProjects = [...state.myProjects].sort((a, b) => {
        if (a.isHot && !b.isHot) return -1;
        if (!a.isHot && b.isHot) return 1;
        return 0;
    });
    
    // Filter based on current toggle
    const isHotActive = $('hotToggle').classList.contains('active');
    const projectsToShow = isHotActive 
        ? sortedProjects.filter(project => project.isHot)
        : sortedProjects;
    
    if (projectsToShow.length === 0) {
        container.innerHTML = `<p class="empty-state">${isHotActive ? 'No hot projects joined yet.' : 'No projects joined yet.'}</p>`;
        return;
    }
    
    projectsToShow.forEach(project => {
        // Calculate project task stats
        const projectTasks = state.tasks.filter(task => task.projectId === project.id);
        const completedTasks = projectTasks.filter(task => task.completed).length;
        const totalTasks = projectTasks.length;
        const taskStat = totalTasks > 0 ? `${completedTasks}/${totalTasks} tasks` : 'No tasks';
        
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <div class="project-logo">
                <img src="https://via.placeholder.com/48/8B5CF6/FFFFFF?text=${project.name.charAt(0)}" alt="${project.name}">
            </div>
            <div class="project-info">
                <h3 class="project-name">${project.name}</h3>
                <div class="project-stats">
                    <span>${taskStat}</span>
                    <span class="project-tag">Joined</span>
                </div>
            </div>
        `;
        container.appendChild(projectCard);
        
        // Add click event to open project details
        projectCard.addEventListener('click', () => {
            showProjectDetail(project);
        });
    });
};

// Toggle between hot and all projects
const initProjectToggle = () => {
    const hotToggle = $('hotToggle');
    const allToggle = $('allToggle');
    
    hotToggle.addEventListener('click', () => {
        hotToggle.classList.add('active');
        allToggle.classList.remove('active');
        updateMyProjects();
    });
    
    allToggle.addEventListener('click', () => {
        allToggle.classList.add('active');
        hotToggle.classList.remove('active');
        updateMyProjects();
    });
};

// Update news preview on dashboard
const updateNewsPreview = () => {
    const container = $('newsPreview');
    container.innerHTML = '';
    
    if (state.news.length === 0) {
        container.innerHTML = '<p class="empty-state">No news items yet.</p>';
        return;
    }
    
    // Show only the latest 3 news items
    const recentNews = [...state.news].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
    
    recentNews.forEach(news => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        newsCard.innerHTML = `
            <div class="news-image">
                <img src="${news.image}" alt="${news.title}">
            </div>
            <div class="news-content">
                <h3 class="news-title">${news.title}</h3>
                <p class="news-description">${news.description}</p>
                <div class="news-tags">
                    ${news.tags.map(tag => `<span class="news-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        container.appendChild(newsCard);
        
        // Add click event to open news detail
        newsCard.addEventListener('click', () => {
            showNewsDetail(news);
        });
    });
    
    // Add view all news listener
    $('viewAllNews').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.nav-item[data-tab="news"]').click();
    });
};

// ========== Investment & Earning Functions ==========

// Update investment and earning tab
const updateInvestmentEarning = () => {
    updateFinancialOverview();
    updateFinancialChart();
    updateFinancialHistory();
};

// Update financial overview stats
const updateFinancialOverview = () => {
    // Calculate total investment
    const totalInvestment = state.financialRecords
        .filter(record => record.type === 'investment')
        .reduce((sum, record) => sum + record.amount, 0);
    
    // Calculate total earnings
    const totalEarnings = state.financialRecords
        .filter(record => record.type === 'earning')
        .reduce((sum, record) => sum + record.amount, 0);
    
    // Calculate ROI
    const roi = totalInvestment > 0 
        ? ((totalEarnings / totalInvestment) * 100).toFixed(2) 
        : '0.00';
    
    // Calculate monthly earnings (current month)
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyEarnings = state.financialRecords
        .filter(record => 
            record.type === 'earning' && 
            new Date(record.date) >= currentMonthStart)
        .reduce((sum, record) => sum + record.amount, 0);
    
    // Update UI
    $('roiValue').textContent = `${roi}%`;
    $('monthlyEarningsValue').textContent = formatCurrency(monthlyEarnings);
};

// Update financial chart
const updateFinancialChart = () => {
    const canvas = $('financialChart');
    const ctx = canvas.getContext('2d');
    
    // Clear previous chart
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;
    
    // If no data, show empty state
    if (state.financialRecords.length === 0) {
        ctx.font = '14px sans-serif';
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
        ctx.textAlign = 'center';
        ctx.fillText('No financial data to display', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    // Group by month
    const months = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = `${d.getFullYear()}-${d.getMonth() + 1}`;
        months[monthKey] = {
            investment: 0,
            earning: 0,
            label: d.toLocaleDateString('en-US', { month: 'short' })
        };
    }
    
    // Calculate data for each month
    state.financialRecords.forEach(record => {
        const date = new Date(record.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        // Only include last 6 months
        if (months[monthKey]) {
            months[monthKey][record.type] += record.amount;
        }
    });
    
    // Convert to arrays for charting
    const labels = Object.values(months).map(m => m.label);
    const investments = Object.values(months).map(m => m.investment);
    const earnings = Object.values(months).map(m => m.earning);
    
    // Find max value for scale
    const maxValue = Math.max(
        ...investments,
        ...earnings
    );
    
    // Chart dimensions
    const padding = 40;
    const chartHeight = canvas.height - padding * 2;
    const chartWidth = canvas.width - padding * 2;
    const barWidth = chartWidth / (labels.length * 2 + 1);
    
    // Draw chart
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
    ctx.stroke();
    
    // Draw grid lines and labels
    const gridLines = 5;
    ctx.textAlign = 'right';
    ctx.font = '10px sans-serif';
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
    
    for (let i = 0; i <= gridLines; i++) {
        const y = padding + (chartHeight / gridLines) * i;
        const value = maxValue - (maxValue / gridLines) * i;
        
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
        ctx.globalAlpha = 0.2;
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        ctx.fillText(formatCurrency(value).replace('.00', ''), padding - 5, y + 3);
    }
    
    // Draw investments bars
    investments.forEach((value, i) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + (i * barWidth * 2) + barWidth/2;
        const y = canvas.height - padding - barHeight;
        
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--gradient-start');
        ctx.fillRect(x, y, barWidth, barHeight);
    });
    
    // Draw earnings bars
    earnings.forEach((value, i) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + (i * barWidth * 2) + barWidth*1.5;
        const y = canvas.height - padding - barHeight;
        
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--success-color');
        ctx.fillRect(x, y, barWidth, barHeight);
    });
    
    // Draw x-axis labels
    ctx.textAlign = 'center';
    labels.forEach((label, i) => {
        const x = padding + (i * barWidth * 2) + barWidth;
        ctx.fillText(label, x, canvas.height - padding + 15);
    });
    
    // Draw legend
    const legendY = padding / 2;
    
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--gradient-start');
    ctx.fillRect(canvas.width / 2 - 60, legendY, 10, 10);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
    ctx.textAlign = 'left';
    ctx.fillText('Investment', canvas.width / 2 - 45, legendY + 8);
    
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--success-color');
    ctx.fillRect(canvas.width / 2 + 20, legendY, 10, 10);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
    ctx.fillText('Earnings', canvas.width / 2 + 35, legendY + 8);
};

// Update financial history list
const updateFinancialHistory = () => {
    const container = $('financialHistory');
    container.innerHTML = '';
    
    if (state.financialRecords.length === 0) {
        container.innerHTML = '<p class="empty-state">No financial records yet.</p>';
        return;
    }
    
    // Sort by date (newest first)
    const sortedRecords = [...state.financialRecords].sort((a, b) => 
        new Date(b.date) - new Date(a.date));
    
    sortedRecords.forEach(record => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        historyItem.innerHTML = `
            <div class="history-details">
                <span class="history-type ${record.type}">${record.type}</span>
                <div class="history-description">${record.description}</div>
                <div class="history-time">${formatDate(record.date)}</div>
            </div>
            <div>
                <span class="history-amount ${record.type}">
                    ${record.type === 'investment' ? '-' : '+'} ${formatCurrency(record.amount)}
                </span>
                <span class="history-delete" data-id="${record.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </span>
            </div>
        `;
        
        container.appendChild(historyItem);
        
        // Add delete functionality
        historyItem.querySelector('.history-delete').addEventListener('click', (e) => {
            const recordId = e.currentTarget.getAttribute('data-id');
            deleteFinancialRecord(recordId);
        });
    });
};

// Initialize financial action buttons
const initFinancialActions = () => {
    const addInvestmentBtn = $('addInvestmentBtn');
    const addEarningBtn = $('addEarningBtn');
    const financialModal = $('financialModal');
    const cancelFinancialBtn = $('cancelFinancialBtn');
    const financialForm = $('financialForm');
    const modalTitle = $('modalTitle');
    
    // Set today's date as default
    const dateInput = $('date');
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    dateInput.value = formattedDate;
    
    let currentType = 'investment';
    
    addInvestmentBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Add Investment';
        currentType = 'investment';
        financialModal.classList.add('active');
    });
    
    addEarningBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Add Earning';
        currentType = 'earning';
        financialModal.classList.add('active');
    });
    
    cancelFinancialBtn.addEventListener('click', () => {
        financialModal.classList.remove('active');
        financialForm.reset();
    });
    
    financialForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const amount = parseFloat($('amount').value);
        const description = $('description').value;
        const date = $('date').value;
        
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }
        
        const newRecord = {
            id: generateId(),
            type: currentType,
            amount,
            description,
            date: new Date(date).toISOString()
        };
        
        state.financialRecords.push(newRecord);
        saveState();
        
        financialModal.classList.remove('active');
        financialForm.reset();
        updateInvestmentEarning();
        updateDashboardStats(); // Update dashboard stats too
    });
};

// Delete financial record
const deleteFinancialRecord = (id) => {
    const confirmDelete = confirm('Are you sure you want to delete this record?');
    if (confirmDelete) {
        state.financialRecords = state.financialRecords.filter(record => record.id !== id);
        saveState();
        updateInvestmentEarning();
        updateDashboardStats();
    }
};

// ========== Explore Functions ==========

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
            <div class="explore-bg" style="background: ${project.color || 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))'}"></div>
            <div class="explore-logo">
                <img src="https://via.placeholder.com/60/8B5CF6/FFFFFF?text=${project.name.charAt(0)}" alt="${project.name}">
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

// Initialize default projects
const initializeProjects = () => {
    // Define projects
    const defaultProjects = [
        {
            id: 'proj1',
            name: 'Celestia',
            shortDescription: 'Modular blockchain network',
            description: 'Celestia is a modular data availability network that enables anyone to easily deploy their own blockchain.',
            tge: 'Q4 2023',
            funding: '$55M',
            reward: 'Tokens',
            type: 'L1 Blockchain',
            isHot: true,
            color: 'linear-gradient(135deg, #FF6B6B, #FFE66D)',
            tags: ['testnet', 'staking'],
            socialLinks: {
                twitter: 'https://twitter.com/celestiaorg',
                website: 'https://celestia.org/',
                github: 'https://github.com/celestiaorg'
            }
        },
        {
            id: 'proj2',
            name: 'Sui',
            shortDescription: 'High-performance L1 blockchain',
            description: 'Sui is a high-performance Layer 1 blockchain designed to power the next generation of web3 applications.',
            tge: 'Q2 2023',
            funding: '$300M',
            reward: 'Tokens',
            type: 'L1 Blockchain',
            isHot: true,
            color: 'linear-gradient(135deg, #3CB371, #90EE90)',
            tags: ['mainnet', 'airdrop'],
            socialLinks: {
                twitter: 'https://twitter.com/SuiNetwork',
                website: 'https://sui.io/',
                github: 'https://github.com/MystenLabs'
            }
        },
        {
            id: 'proj3',
            name: 'Aptos',
            shortDescription: 'Layer 1 for mass adoption',
            description: 'Aptos is a Layer 1 blockchain built with Move, designed for safety and user experience.',
            tge: 'Q4 2022',
            funding: '$350M',
            reward: 'Tokens',
            type: 'L1 Blockchain',
            isHot: false,
            color: 'linear-gradient(135deg, #6A5ACD, #9370DB)',
            tags: ['mainnet', 'staking'],
            socialLinks: {
                twitter: 'https://twitter.com/AptosLabs',
                website: 'https://aptoslabs.com/',
                github: 'https://github.com/aptos-labs'
            }
        },
        {
            id: 'proj4',
            name: 'ZKSync',
            shortDescription: 'Ethereum ZK rollup scaling solution',
            description: 'ZKSync is a ZK Rollup solution for scaling Ethereum, focusing on user and developer experience.',
            tge: 'Q1 2023',
            funding: '$200M',
            reward: 'Tokens',
            type: 'L2 Solution',
            isHot: true,
            color: 'linear-gradient(135deg, #4682B4, #87CEEB)',
            tags: ['mainnet', 'airdrop'],
            socialLinks: {
                twitter: 'https://twitter.com/zksync',
                website: 'https://zksync.io/',
                github: 'https://github.com/matter-labs'
            }
        },
        {
            id: 'proj5',
            name: 'Arbitrum',
            shortDescription: 'Ethereum L2 scaling solution',
            description: 'Arbitrum is an Ethereum Layer 2 scaling solution that increases throughput and reduces costs.',
            tge: 'Q1 2023',
            funding: '$120M',
            reward: 'Tokens',
            type: 'L2 Solution',
            isHot: false,
            color: 'linear-gradient(135deg, #4B0082, #8A2BE2)',
            tags: ['mainnet', 'airdrop'],
            socialLinks: {
                twitter: 'https://twitter.com/arbitrum',
                website: 'https://arbitrum.io/',
                github: 'https://github.com/OffchainLabs'
            }
        },
        {
            id: 'proj6',
            name: 'Starknet',
            shortDescription: 'Ethereum L2 with ZK-STARKs',
            description: 'StarkNet is a permissionless decentralized ZK-Rollup operating as an L2 network over Ethereum.',
            tge: 'Q3 2023',
            funding: '$100M',
            reward: 'Tokens',
            type: 'L2 Solution',
            isHot: true,
            color: 'linear-gradient(135deg, #000080, #0000CD)',
            tags: ['mainnet', 'airdrop'],
            socialLinks: {
                twitter: 'https://twitter.com/StarkWareLtd',
                website: 'https://starkware.co/starknet/',
                github: 'https://github.com/starkware-libs'
            }
        },
        {
            id: 'proj7',
            name: 'Scroll',
            shortDescription: 'Ethereum ZK rollup',
            description: 'Scroll is a zkEVM-based zkRollup on Ethereum that enables native compatibility for existing Ethereum applications.',
            tge: 'Q4 2023',
            funding: '$50M',
            reward: 'Tokens',
            type: 'L2 Solution',
            isHot: true,
            color: 'linear-gradient(135deg, #FF8C00, #FFA500)',
            tags: ['testnet', 'airdrop'],
            socialLinks: {
                twitter: 'https://twitter.com/Scroll_ZKP',
                website: 'https://scroll.io/',
                github: 'https://github.com/scroll-tech'
            }
        },
        {
            id: 'proj8',
            name: 'Taiko',
            shortDescription: 'Ethereum-equivalent ZK-rollup',
            description: 'Taiko is a fully Ethereum-equivalent (Type 1) ZK-Rollup, leveraging Ethereum for data availability.',
            tge: 'Q1 2024',
            funding: '$22M',
            reward: 'Tokens',
            type: 'L2 Solution',
            isHot: true,
            color: 'linear-gradient(135deg, #FF1493, #FF69B4)',
            tags: ['testnet', 'airdrop'],
            socialLinks: {
                twitter: 'https://twitter.com/taikoxyz',
                website: 'https://taiko.xyz/',
                github: 'https://github.com/taikoxyz'
            }
        },
        {
            id: 'proj9',
            name: 'Linea',
            shortDescription: 'ConsenSys zkEVM rollup',
            description: 'Linea is a Type 2 zkEVM rollup developed by ConsenSys, focused on Ethereum compatibility.',
            tge: 'Q4 2023',
            funding: 'ConsenSys Backed',
            reward: 'Tokens',
            type: 'L2 Solution',
            isHot: false,
            color: 'linear-gradient(135deg, #20B2AA, #48D1CC)',
            tags: ['mainnet', 'airdrop'],
            socialLinks: {
                twitter: 'https://twitter.com/LineaBuild',
                website: 'https://linea.build/',
                github: 'https://github.com/Consensys/linea'
            }
        },
        {
            id: 'proj10',
            name: 'Monad',
            shortDescription: 'High-performance L1 blockchain',
            description: 'Monad is a Layer 1 blockchain designed for extremely high throughput and low latency.',
            tge: 'Q2 2024',
            funding: '$300M',
            reward: 'Tokens',
            type: 'L1 Blockchain',
            isHot: true,
            color: 'linear-gradient(135deg, #800000, #B22222)',
            tags: ['testnet', 'upcoming'],
            socialLinks: {
                twitter: 'https://twitter.com/monadblockchain',
                website: 'https://monad.xyz/',
                github: 'https://github.com/monad-labs'
            }
        },
        {
            id: 'proj11',
            name: 'Eigenlayer',
            shortDescription: 'Ethereum restaking protocol',
            description: 'EigenLayer is a protocol that allows ETH stakers to restake their consensus layer assets.',
            tge: 'Q3 2024',
            funding: '$100M',
            reward: 'Tokens',
            type: 'DeFi Protocol',
            isHot: true,
            color: 'linear-gradient(135deg, #483D8B, #6A5ACD)',
            tags: ['testnet', 'staking'],
            socialLinks: {
                twitter: 'https://twitter.com/eigenlayer',
                website: 'https://www.eigenlayer.xyz/',
                github: 'https://github.com/Layr-Labs'
            }
        },
        {
            id: 'proj12',
            name: 'Base',
            shortDescription: 'Coinbase L2 on Ethereum',
            description: 'Base is an Ethereum L2 incubated by Coinbase, built on the OP Stack by Optimism.',
            tge: 'Unknown',
            funding: 'Coinbase Backed',
            reward: 'Potential Tokens',
            type: 'L2 Solution',
            isHot: true,
            color: 'linear-gradient(135deg, #0000CD, #4169E1)',
            tags: ['mainnet', 'airdrop'],
            socialLinks: {
                twitter: 'https://twitter.com/Base',
                website: 'https://base.org/',
                github: 'https://github.com/base-org'
            }
        },
        {
            id: 'proj13',
            name: 'Mode',
            shortDescription: 'Ethereum L2 with shared sequencing',
            description: 'Mode is an Ethereum L2 built on the OP Stack that shares sequencing revenue with developers.',
            tge: 'Q2 2024',
            funding: '$50M',
            reward: 'Tokens',
            type: 'L2 Solution',
            isHot: true,
            color: 'linear-gradient(135deg, #9932CC, #BA55D3)',
            tags: ['mainnet', 'airdrop'],
            socialLinks: {
                twitter: 'https://twitter.com/modenetwork',
                website: 'https://www.mode.network/',
                github: 'https://github.com/mode-network'
            }
        },
        {
            id: 'proj14',
            name: 'LayerZero',
            shortDescription: 'Omnichain interoperability protocol',
            description: 'LayerZero is an omnichain interoperability protocol that connects different blockchains.',
            tge: 'Q2 2023',
            funding: '$135M',
            reward: 'Tokens',
            type: 'Infrastructure',
            isHot: false,
            color: 'linear-gradient(135deg, #2F4F4F, #708090)',
            tags: ['mainnet', 'airdrop'],
            socialLinks: {
                twitter: 'https://twitter.com/LayerZero_Labs',
                website: 'https://layerzero.network/',
                github: 'https://github.com/LayerZero-Labs'
            }
        },
        {
            id: 'proj15',
            name: 'Blast',
            shortDescription: 'L2 with native yield',
            description: 'Blast is an Ethereum L2 that offers native yield for ETH and stablecoins.',
            tge: 'Q2 2024',
            funding: '$250M',
            reward: 'Tokens',
            type: 'L2 Solution',
            isHot: true,
            color: 'linear-gradient(135deg, #FF4500, #FFA07A)',
            tags: ['mainnet', 'airdrop'],
            socialLinks: {
                twitter: 'https://twitter.com/blast_l2',
                website: 'https://blast.io/',
                github: 'https://github.com/blast-io'
            }
        },
        {
            id: 'proj16',
            name: 'Berachain',
            shortDescription: 'EVM-compatible L1',
            description: 'Berachain is a high-performance EVM-compatible L1 blockchain using Proof of Liquidity consensus.',
            tge: 'Q3 2024',
            funding: '$42M',
            reward: 'Tokens',
            type: 'L1 Blockchain',
            isHot: true,
            color: 'linear-gradient(135deg, #8B4513, #A0522D)',
            tags: ['testnet', 'upcoming'],
            socialLinks: {
                twitter: 'https://twitter.com/berachain',
                website: 'https://berachain.com/',
                github: 'https://github.com/berachain'
            }
        },
        {
            id: 'proj17',
            name: 'Aevo',
            shortDescription: 'Crypto derivatives exchange',
            description: 'Aevo is a high-performance derivatives exchange for cryptocurrencies.',
            tge: 'Q2 2023',
            funding: '$30M',
            reward: 'Tokens',
            type: 'DeFi Protocol',
            isHot: false,
            color: 'linear-gradient(135deg, #008B8B, #00CED1)',
            tags: ['mainnet', 'airdrop'],
            socialLinks: {
                twitter: 'https://twitter.com/aevoxyz',
                website: 'https://aevo.xyz/',
                github: 'https://github.com/aevoxyz'
            }
        },
        {
            id: 'proj18',
            name: 'Manta Network',
            shortDescription: 'Privacy-preserving blockchain',
            description: 'Manta Network is a privacy-preserving layer for Web3 using zero-knowledge proofs.',
            tge: 'Q1 2024',
            funding: '$85M',
            reward: 'Tokens',
            type: 'L1 Blockchain',
            isHot: false,
            color: 'linear-gradient(135deg, #191970, #000080)',
            tags: ['mainnet', 'privacy'],
            socialLinks: {
                twitter: 'https://twitter.com/mantanetwork',
                website: 'https://manta.network/',
                github: 'https://github.com/Manta-Network'
            }
        },
        {
            id: 'proj19',
            name: 'Fuel',
            shortDescription: 'Fast execution layer',
            description: 'Fuel is a high-performance execution layer, designed from the ground up for scaling.',
            tge: 'Q3 2024',
            funding: '$80M',
            reward: 'Tokens',
            type: 'L1 Blockchain',
            isHot: true,
            color: 'linear-gradient(135deg, #CD5C5C, #F08080)',
            tags: ['testnet', 'upcoming'],
            socialLinks: {
                twitter: 'https://twitter.com/fuellabs_',
                website: 'https://fuel.network/',
                github: 'https://github.com/FuelLabs'
            }
        },
        {
            id: 'proj20',
            name: 'Sei',
            shortDescription: 'Trading-optimized blockchain',
            description: 'Sei is a Layer 1 blockchain optimized for trading applications.',
            tge: 'Q3 2023',
            funding: '$50M',
            reward: 'Tokens',
            type: 'L1 Blockchain',
            isHot: false,
            color: 'linear-gradient(135deg, #00008B, #0000FF)',
            tags: ['mainnet', 'airdrop'],
            socialLinks: {
                twitter: 'https://twitter.com/SeiNetwork',
                website: 'https://www.sei.io/',
                github: 'https://github.com/sei-protocol'
            }
        },
        {
            id: 'proj21',
            name: 'Polyhedra',
            shortDescription: 'Zero-knowledge protocol',
            description: 'Polyhedra is building a zero-knowledge privacy protocol for decentralized applications.',
            tge: 'Q4 2024',
            funding: '$20M',
            reward: 'Tokens',
            type: 'Privacy Protocol',
            isHot: true,
            color: 'linear-gradient(135deg, #654321, #8B4513)',
            tags: ['testnet', 'privacy'],
            socialLinks: {
                twitter: 'https://twitter.com/polyhedra_zone',
                website: 'https://polyhedra.network/',
                github: 'https://github.com/polyhedra-network'
            }
        }
    ];
    
    state.projects = defaultProjects;
    saveState();
    updateExplore();
};

// Show project detail
const showProjectDetail = (project) => {
    const detailContent = $('projectDetailContent');
    const detailSection = $('projectDetail');
    const isJoined = state.myProjects.some(p => p.id === project.id);
    
    // Create the project detail content
    detailContent.innerHTML = `
        <div class="project-header">
            <div class="project-header-logo">
                <img src="https://via.placeholder.com/64/8B5CF6/FFFFFF?text=${project.name.charAt(0)}" alt="${project.name}">
            </div>
            <div class="project-header-info">
                <h2 class="project-header-name">${project.name}</h2>
                <p class="project-header-description">${project.shortDescription}</p>
            </div>
        </div>
        <div class="project-body">
            <div class="project-section">
                <h3 class="project-section-title">Project Information</h3>
                <div class="project-detail-list">
                    <div class="project-detail-item">
                        <div class="project-detail-label">TGE (Token Generation Event)</div>
                        <div class="project-detail-value">${project.tge}</div>
                    </div>
                    <div class="project-detail-item">
                        <div class="project-detail-label">Funding</div>
                        <div class="project-detail-value">${project.funding}</div>
                    </div>
                    <div class="project-detail-item">
                        <div class="project-detail-label">Reward</div>
                        <div class="project-detail-value">${project.reward}</div>
                    </div>
                    <div class="project-detail-item">
                        <div class="project-detail-label">Type</div>
                        <div class="project-detail-value">${project.type}</div>
                    </div>
                </div>
            </div>
            
            <div class="project-section">
                <h3 class="project-section-title">Description</h3>
                <p>${project.description}</p>
            </div>
            
            <div class="project-section">
                <h3 class="project-section-title">Social Links</h3>
                <div class="project-social-links">
                    <a href="${project.socialLinks.twitter}" target="_blank" class="social-link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                        </svg>
                    </a>
                    <a href="${project.socialLinks.website}" target="_blank" class="social-link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                    </a>
                    <a href="${project.socialLinks.github}" target="_blank" class="social-link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                    </a>
                </div>
            </div>
            
            <div class="project-actions">
                <button class="project-action-btn favorite-btn" id="favoriteBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    Favorite
                </button>
                <button class="project-action-btn join-btn" id="joinProjectBtn">
                    ${isJoined 
                        ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>Joined'
                        : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>Join Project'
                    }
                </button>
                <a href="${project.socialLinks.website}" target="_blank" class="project-action-btn external-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    Visit Site
                </a>
            </div>
        </div>
    `;
    
    // Show the project detail section
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    detailSection.classList.add('active');
    
    // Add back button functionality
    $('backToExplore').addEventListener('click', () => {
        detailSection.classList.remove('active');
        $('explore').classList.add('active');
    });
    
    // Add join/leave project functionality
    const joinBtn = $('joinProjectBtn');
    joinBtn.addEventListener('click', () => {
        if (isJoined) {
            removeFromMyProjects(project);
        } else {
            addToMyProjects(project);
        }
        
        // Refresh the project detail view
        showProjectDetail(project);
    });
};

// Add project to my projects
const addToMyProjects = (project) => {
    // Check if project already exists
    if (!state.myProjects.some(p => p.id === project.id)) {
        state.myProjects.push(project);
        saveState();
        
        // Add initial tasks for this project
        const defaultTasks = [
            { name: 'Complete KYC', completed: false },
            { name: 'Follow on Twitter', completed: false },
            { name: 'Join Discord', completed: false }
        ];
        
        defaultTasks.forEach(task => {
            addTask(project.id, task.name, task.completed);
        });
        
        // Show toast notification
        alert(`${project.name} has been added to your projects!`);
        
        // Update relevant sections
        updateDashboard();
        updateTasks();
    }
};

// Remove project from my projects
const removeFromMyProjects = (project) => {
    const confirmRemove = confirm(`Are you sure you want to remove ${project.name} from your projects? All tasks for this project will be deleted.`);
    
    if (confirmRemove) {
        state.myProjects = state.myProjects.filter(p => p.id !== project.id);
        
        // Delete all tasks for this project
        state.tasks = state.tasks.filter(task => task.projectId !== project.id);
        
        saveState();
        
        // Show toast notification
        alert(`${project.name} has been removed from your projects.`);
        
        // Update relevant sections
        updateDashboard();
        updateTasks();
    }
};

// ========== Tasks Functions ==========

// Update tasks tab content
const updateTasks = () => {
    const container = $('taskProjects');
    container.innerHTML = '';
    
    if (state.myProjects.length === 0) {
        container.innerHTML = '<p class="empty-state">No projects added yet. Add projects from Explore tab.</p>';
        return;
    }
    
    // Calculate tasks stats
    const totalTasks = state.tasks.length;
    const completedTasks = state.tasks.filter(task => task.completed).length;
    $('taskStats').textContent = `${completedTasks}/${totalTasks} Tasks Completed`;
    
    // Create task containers for each project
    state.myProjects.forEach(project => {
        const projectTasks = state.tasks.filter(task => task.projectId === project.id);
        const completedProjectTasks = projectTasks.filter(task => task.completed).length;
        const totalProjectTasks = projectTasks.length;
        const progressPercentage = totalProjectTasks > 0 
            ? (completedProjectTasks / totalProjectTasks) * 100 
            : 0;
        
        const projectContainer = document.createElement('div');
        projectContainer.className = 'task-project';
        projectContainer.innerHTML = `
            <div class="task-project-header">
                <div class="task-project-logo">
                    <img src="https://via.placeholder.com/36/8B5CF6/FFFFFF?text=${project.name.charAt(0)}" alt="${project.name}">
                </div>
                <div class="task-project-info">
                    <h3 class="task-project-name">${project.name}</h3>
                    <div class="task-progress">
                        <div class="task-progress-bar" style="width: ${progressPercentage}%"></div>
                    </div>
                    <div class="task-progress-text">${completedProjectTasks}/${totalProjectTasks} tasks</div>
                </div>
                <button class="task-add-btn" data-project-id="${project.id}">Add Task</button>
            </div>
            <div class="task-items" id="taskItems-${project.id}">
                ${projectTasks.length === 0 ? '<p class="empty-state">No tasks added yet.</p>' : ''}
            </div>
        `;
        
        container.appendChild(projectContainer);
        
        // Add tasks to the container
        if (projectTasks.length > 0) {
            const taskItemsContainer = projectContainer.querySelector(`#taskItems-${project.id}`);
            projectTasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = 'task-item';
                taskItem.innerHTML = `
                    <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-task-id="${task.id}"></div>
                    <div class="task-name">${task.name}</div>
                    <div class="task-delete" data-task-id="${task.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                        </svg>
                    </div>
                `;
                taskItemsContainer.appendChild(taskItem);
                
                // Add checkbox toggle functionality
                taskItem.querySelector('.task-checkbox').addEventListener('click', (e) => {
                    const taskId = e.target.getAttribute('data-task-id');
                    toggleTaskCompletion(taskId);
                });
                
                // Add delete functionality
                taskItem.querySelector('.task-delete').addEventListener('click', (e) => {
                    const taskId = e.target.closest('.task-delete').getAttribute('data-task-id');
                    deleteTask(taskId);
                });
            });
        }
        
        // Add "Add Task" button functionality
        projectContainer.querySelector('.task-add-btn').addEventListener('click', (e) => {
            const projectId = e.target.getAttribute('data-project-id');
            showAddTaskModal(projectId);
        });
    });
};

// Show modal to add new task
const showAddTaskModal = (projectId) => {
    const taskModal = $('taskModal');
    const projectIdField = $('projectIdForTask');
    
    projectIdField.value = projectId;
    taskModal.classList.add('active');
    
    $('cancelTaskBtn').addEventListener('click', () => {
        taskModal.classList.remove('active');
        $('taskForm').reset();
    });
};

// Initialize task form
const initTaskForm = () => {
    const taskForm = $('taskForm');
    
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const taskName = $('taskName').value.trim();
        const projectId = $('projectIdForTask').value;
        
        if (!taskName) {
            alert('Please enter a task name.');
            return;
        }
        
        addTask(projectId, taskName);
        $('taskModal').classList.remove('active');
        taskForm.reset();
    });
};

// Add new task
const addTask = (projectId, taskName, completed = false) => {
    const newTask = {
        id: generateId(),
        projectId,
        name: taskName,
        completed,
        createdAt: new Date().toISOString()
    };
    
    state.tasks.push(newTask);
    saveState();
    updateTasks();
    updateDashboardStats();
};

// Toggle task completion
const toggleTaskCompletion = (taskId) => {
    const taskIndex = state.tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        state.tasks[taskIndex].completed = !state.tasks[taskIndex].completed;
        saveState();
        updateTasks();
        updateDashboardStats();
    }
};

// Delete task
const deleteTask = (taskId) => {
    const confirmDelete = confirm('Are you sure you want to delete this task?');
    
    if (confirmDelete) {
        state.tasks = state.tasks.filter(task => task.id !== taskId);
        saveState();
        updateTasks();
        updateDashboardStats();
    }
};

// Reset tasks at midnight
const initTaskReset = () => {
    const checkMidnight = () => {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        
        const timeUntilMidnight = midnight.getTime() - now.getTime();
        
        setTimeout(() => {
            // Reset tasks
            state.tasks = state.tasks.map(task => ({
                ...task,
                completed: false
            }));
            
            saveState();
            
            // Update if tasks tab is active
            if ($('tasks').classList.contains('active')) {
                updateTasks();
            }
            
            // Update dashboard stats
            updateDashboardStats();
            
            // Set next check
            checkMidnight();
            
        }, timeUntilMidnight);
    };
    
    checkMidnight();
};

// ========== Statistics Functions ==========

// Update statistics tab content
const updateStatistics = () => {
    updateMonthlyChart();
    updateTaskCompletionChart();
    updateProjectLeaderboard();
};

// Update monthly chart
const updateMonthlyChart = () => {
    const canvas = $('monthlyChart');
    const ctx = canvas.getContext('2d');
    
    // Clear previous chart
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;
    
    // If no data, show empty state
    if (state.financialRecords.length === 0) {
        ctx.font = '14px sans-serif';
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
        ctx.textAlign = 'center';
        ctx.fillText('No financial data to display', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    // Group by month
    const months = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = `${d.getFullYear()}-${d.getMonth() + 1}`;
        months[monthKey] = {
            investment: 0,
            earning: 0,
            label: d.toLocaleDateString('en-US', { month: 'short' })
        };
    }
    
    // Calculate data for each month
    state.financialRecords.forEach(record => {
        const date = new Date(record.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        // Only include last 6 months
        if (months[monthKey]) {
            months[monthKey][record.type] += record.amount;
        }
    });
    
    // Convert to arrays for charting
    const labels = Object.values(months).map(m => m.label);
    const investments = Object.values(months).map(m => m.investment);
    const earnings = Object.values(months).map(m => m.earning);
    
    // Find max value for scale
    const maxValue = Math.max(
        ...investments,
        ...earnings,
        1 // Avoid zero max
    );
    
    // Chart dimensions
    const padding = 40;
    const chartHeight = canvas.height - padding * 2;
    const chartWidth = canvas.width - padding * 2;
    
    // Calculate line points
    const investmentPoints = [];
    const earningPoints = [];
    
    investments.forEach((value, i) => {
        const x = padding + (i / (investments.length - 1)) * chartWidth;
        const y = canvas.height - padding - (value / maxValue) * chartHeight;
        investmentPoints.push({ x, y });
    });
    
    earnings.forEach((value, i) => {
        const x = padding + (i / (earnings.length - 1)) * chartWidth;
        const y = canvas.height - padding - (value / maxValue) * chartHeight;
        earningPoints.push({ x, y });
    });
    
    // Draw chart
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
    ctx.stroke();
    
    // Draw grid lines and labels
    const gridLines = 5;
    ctx.textAlign = 'right';
    ctx.font = '10px sans-serif';
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
    
    for (let i = 0; i <= gridLines; i++) {
        const y = padding + (chartHeight / gridLines) * i;
        const value = maxValue - (maxValue / gridLines) * i;
        
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.globalAlpha = 0.2;
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        ctx.fillText(formatCurrency(value).replace('.00', ''), padding - 5, y + 3);
    }
    
    // Draw x-axis labels
    ctx.textAlign = 'center';
    labels.forEach((label, i) => {
        const x = padding + (i / (labels.length - 1)) * chartWidth;
        ctx.fillText(label, x, canvas.height - padding + 15);
    });
    
    // Draw investment line
    ctx.beginPath();
    investmentPoints.forEach((point, i) => {
        if (i === 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
        }
    });
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--gradient-start');
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw investment points
    investmentPoints.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--gradient-start');
        ctx.fill();
    });
    
    // Draw earning line
    ctx.beginPath();
    earningPoints.forEach((point, i) => {
        if (i === 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
        }
    });
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--success-color');
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw earning points
    earningPoints.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--success-color');
        ctx.fill();
    });
    
    // Draw legend
    const legendY = padding / 2;
    
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--gradient-start');
    ctx.fillRect(canvas.width / 2 - 60, legendY, 10, 10);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
    ctx.textAlign = 'left';
    ctx.fillText('Investment', canvas.width / 2 - 45, legendY + 8);
    
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--success-color');
    ctx.fillRect(canvas.width / 2 + 20, legendY, 10, 10);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
    ctx.fillText('Earnings', canvas.width / 2 + 35, legendY + 8);
};

// Update task completion chart
const updateTaskCompletionChart = () => {
    const canvas = $('taskCompletionChart');
    const ctx = canvas.getContext('2d');
    
    // Clear previous chart
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;
    
    // Group tasks by project
    const projectTaskStats = {};
    
    state.myProjects.forEach(project => {
        const projectTasks = state.tasks.filter(task => task.projectId === project.id);
        const totalTasks = projectTasks.length;
        const completedTasks = projectTasks.filter(task => task.completed).length;
        
        if (totalTasks > 0) {
            projectTaskStats[project.id] = {
                name: project.name,
                total: totalTasks,
                completed: completedTasks,
                percentage: (completedTasks / totalTasks) * 100
            };
        }
    });
    
    // If no data, show empty state
    if (Object.keys(projectTaskStats).length === 0) {
        ctx.font = '14px sans-serif';
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
        ctx.textAlign = 'center';
        ctx.fillText('No task data to display', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    // Prepare data for chart
    const projectNames = Object.values(projectTaskStats).map(stat => stat.name);
    const completionPercentages = Object.values(projectTaskStats).map(stat => stat.percentage);
    const colors = [
        '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
        '#3b82f6', '#ef4444', '#84cc16', '#14b8a6', '#f97316'
    ];
    
    // Chart dimensions
    const padding = 60;
    const chartHeight = canvas.height - padding * 2;
    const chartWidth = canvas.width - padding * 2;
    const barWidth = Math.min(30, (chartWidth / projectNames.length) * 0.8);
    const barSpacing = (chartWidth / projectNames.length) - barWidth;
    
    // Draw chart
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
    ctx.stroke();
    
    // Draw grid lines and labels
    const gridLines = 5;
    ctx.textAlign = 'right';
    ctx.font = '10px sans-serif';
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
    
    for (let i = 0; i <= gridLines; i++) {
        const y = padding + (chartHeight / gridLines) * i;
        const value = 100 - (100 / gridLines) * i;
        
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.globalAlpha = 0.2;
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        ctx.fillText(`${value}%`, padding - 5, y + 3);
    }
    
    // Draw bars
    completionPercentages.forEach((percentage, i) => {
        const barHeight = (percentage / 100) * chartHeight;
        const x = padding + (i * (barWidth + barSpacing)) + barSpacing / 2;
        const y = canvas.height - padding - barHeight;
        
        ctx.fillStyle = colors[i % colors.length];
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw percentage on bar
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        if (barHeight > 20) {
            ctx.fillText(`${percentage.toFixed(0)}%`, x + barWidth / 2, y + barHeight / 2 + 4);
        }
        
        // Draw project name
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
        ctx.save();
        ctx.translate(x + barWidth / 2, canvas.height - padding + 5);
        ctx.rotate(-Math.PI / 4);
        ctx.textAlign = 'right';
        ctx.fillText(projectNames[i].substring(0, 8), 0, 0);
        ctx.restore();
    });
};

// Update project leaderboard
const updateProjectLeaderboard = () => {
    const container = $('projectLeaderboard');
    container.innerHTML = '';
    
    // Sort projects by funding amount (extract number from funding string)
    const projectsWithFunding = [...state.projects].map(project => {
        // Extract numeric value from funding string
        let fundingValue = 0;
        const fundingMatch = project.funding.match(/[\d.]+/);
        
        if (fundingMatch) {
            fundingValue = parseFloat(fundingMatch[0]);
            
            // Adjust for millions/billions
            if (project.funding.includes('M')) {
                fundingValue *= 1000000;
            } else if (project.funding.includes('B')) {
                fundingValue *= 1000000000;
            }
        }
        
        return {
            ...project,
            fundingValue
        };
    });
    
    // Sort by funding value (descending)
    projectsWithFunding.sort((a, b) => b.fundingValue - a.fundingValue);
    
    // Display top projects
    const topProjects = projectsWithFunding.filter(p => p.fundingValue > 0).slice(0, 10);
    
    if (topProjects.length === 0) {
        container.innerHTML = '<p class="empty-state">No projects with funding data.</p>';
        return;
    }
    
    // Calculate percentage relative to top project
    const maxFunding = topProjects[0].fundingValue;
    
    topProjects.forEach((project, index) => {
        const percentage = ((project.fundingValue / maxFunding) * 100).toFixed(0);
        
        const leaderboardItem = document.createElement('div');
        leaderboardItem.className = 'leaderboard-item';
        leaderboardItem.innerHTML = `
            <div class="leaderboard-rank ${index < 3 ? 'top-' + (index + 1) : ''}">${index + 1}</div>
            <div class="leaderboard-logo">
                <img src="https://via.placeholder.com/32/8B5CF6/FFFFFF?text=${project.name.charAt(0)}" alt="${project.name}">
            </div>
            <div class="leaderboard-info">
                <div class="leaderboard-name">${project.name}</div>
                <div class="leaderboard-funding">${project.funding}</div>
            </div>
            <div class="leaderboard-percentage">${percentage}%</div>
        `;
        
        container.appendChild(leaderboardItem);
    });
};

// ========== News Functions ==========

// Update news tab content
const updateNews = () => {
    if (state.news.length === 0) {
        initializeNews(); // If no news, initialize them
        return;
    }
    
    renderNews();
};

// Initialize default news
const initializeNews = () => {
    // Define news items
    const defaultNews = [
        {
            id: 'news1',
            title: 'Celestia Launches Mainnet with Unprecedented Demand',
            description: 'Celestia, the modular blockchain network, has successfully launched its mainnet following strong community interest and technical validation.',
            content: 'Celestia, the modular blockchain network designed to scale blockchain throughput, has officially launched its mainnet after two years of development and testing. The launch comes with unprecedented demand from validators and developers looking to leverage its unique modular architecture.\n\nModular blockchains represent a significant departure from traditional monolithic designs by separating the consensus and execution layers, which could potentially solve the blockchain trilemma of decentralization, security, and scalability.\n\nCelestia has already seen over 10,000 nodes join its network during the testnet phase, indicating strong community support. The platform has also secured partnerships with several major protocols looking to build on its data availability layer.\n\nWith $55 million in funding from prominent venture capital firms, Celestia is positioned to become a key infrastructure provider in the blockchain ecosystem. Their token is expected to see significant adoption as developers begin building applications on the platform.',
            image: 'https://via.placeholder.com/800x400/6A5ACD/FFFFFF?text=Celestia+Launch',
            date: '2023-12-12T10:30:00Z',
            tags: ['airdrop', 'market']
        },
        {
            id: 'news2',
            title: 'Eigenlayer Announces Final Testnet Before Token Launch',
            description: 'Eigenlayer, the Ethereum restaking protocol, is launching its final testnet phase ahead of the highly anticipated token generation event in 2024.',
            content: 'Eigenlayer has announced the launch of its final testnet phase, codenamed "Eigen Odyssey," which represents the last testing stage before the protocol\'s mainnet launch and subsequent token generation event (TGE) expected in mid-2024.\n\nEigenlayer has established itself as a pioneering restaking protocol that allows Ethereum validators to reuse their staked ETH to secure additional network services, effectively multiplying the utility of staked assets.\n\nThe final testnet will run for approximately 8 weeks and will include comprehensive testing of the restaking mechanics, security features, and the Actively Validated Services (AVS) framework that developers can use to build on top of Eigenlayer.\n\nWith over $100 million in funding and backing from major venture capital firms, Eigenlayer has become one of the most anticipated projects in the crypto space. The protocol has already announced partnerships with several prominent Ethereum infrastructure projects.\n\nUsers who participate in the testnet activities will likely be eligible for the upcoming airdrop, though specific allocation details remain undisclosed. The team has emphasized that meaningful participation rather than mere address creation will be rewarded.',
            image: 'https://via.placeholder.com/800x400/483D8B/FFFFFF?text=Eigenlayer+Testnet',
            date: '2024-03-05T14:15:00Z',
            tags: ['testnet', 'airdrop']
        },
        {
            id: 'news3',
            title: 'Crypto Airdrops Generated Over $25 Billion in Value During 2023',
            description: 'A new report shows that crypto airdrops distributed in 2023 have created significant wealth for participants, with Layer 2 solutions leading the way.',
            content: 'According to a comprehensive report by CryptoData Research, token airdrops distributed during 2023 have generated over $25 billion in total value, representing one of the most effective methods of value distribution in the cryptocurrency ecosystem.\n\nThe report analyzed over 50 significant airdrops across different blockchain ecosystems and found that Layer 2 scaling solutions were particularly generous, with projects like Arbitrum, zkSync, and Optimism distributing tokens worth over $10 billion combined.\n\nThe most successful airdrop recipients were users who had consistently participated in protocol activities over extended periods rather than those attempting to "game" the system through last-minute interactions. This trend signals a shift toward more sophisticated airdrop mechanisms that reward genuine adoption.\n\n"Airdrops have evolved from simple marketing tools to sophisticated economic distribution mechanisms," said Jane Chen, lead researcher at CryptoData. "Projects are increasingly using targeted airdrops to build committed communities and incentivize specific behaviors."\n\nThe report also highlights a notable trend of "airdrop fatigue" among some users, with approximately 35% of airdropped tokens being immediately sold on the market. However, projects with stronger fundamentals and clearer value propositions saw significantly higher token retention rates.\n\nFor 2024, the report predicts that airdrops will become more targeted and require more meaningful participation, with an estimated $30-40 billion in value expected to be distributed through token airdrops.',
            image: 'https://via.placeholder.com/800x400/008B8B/FFFFFF?text=Airdrop+Economics',
            date: '2024-01-18T09:45:00Z',
            tags: ['airdrop', 'market']
        },
        {
            id: 'news4',
            title: 'DropDeck App Simplifies Airdrop Management for Crypto Users',
            description: 'The newly released DropDeck application provides a comprehensive solution for tracking and managing cryptocurrency airdrops and project participation.',
            content: 'DropDeck, a new web application focused on cryptocurrency airdrop management, has launched to help users organize their airdrop participation and maximize potential rewards.\n\nThe application offers a suite of tools including project tracking, task management, investment monitoring, and airdrop statistics all in a mobile-friendly interface. This comes at a time when keeping track of multiple airdrop opportunities has become increasingly complex for cryptocurrency enthusiasts.\n\n"We created DropDeck because we were personally struggling to keep track of all the different projects we were participating in," said the app\'s developer. "There are so many opportunities out there, and missing a crucial step in the process could mean missing out on significant rewards."\n\nKey features of the platform include a customizable dashboard that provides at-a-glance statistics about ongoing projects, a task management system that reminds users of required actions for each airdrop, and financial tracking tools to monitor investments and returns.\n\nThe platform currently supports tracking for over 20 high-potential projects including Celestia, Eigenlayer, Scroll, and other prominent blockchain initiatives expected to distribute tokens in the coming months.\n\nUnlike many similar tools in the market, DropDeck stores all user data locally, enhancing privacy and security by eliminating the need to share wallet addresses or personal information with third-party servers.',
            image: 'https://via.placeholder.com/800x400/654321/FFFFFF?text=DropDeck+App',
            date: '2024-04-01T11:20:00Z',
            tags: ['app', 'airdrop']
        },
        {
            id: 'news5',
            title: 'Tokenomics Trends for 2024: Changes in Vesting and Distribution',
            description: 'Analysis of recent token launches shows significant shifts in tokenomics models, with projects adopting longer vesting periods and more equitable distribution mechanisms.',
            content: 'A comprehensive analysis of token launches from the past six months reveals emerging tokenomics trends that are likely to dominate in 2024, particularly regarding token distribution and vesting schedules.\n\nAccording to data compiled from the most recent 50 token generation events (TGEs), projects are increasingly adopting longer vesting periods, with the average investor token lock-up extending from 6-12 months to 18-24 months. This shift appears to be a response to market volatility and a desire to create more sustainable price discovery mechanisms.\n\n"We\'re seeing a clear trend toward more patient capital," explains Marcus Williams, tokenomics researcher at Blockchain Economic Institute. "Projects are designing tokenomics that discourage short-term speculation and reward long-term alignment with protocol goals."\n\nAdditionally, airdrop allocations are becoming more significant, with an average of 15-20% of total token supply now reserved for community airdrops, up from 5-10% in previous years. This reflects a growing recognition of the importance of community ownership and participation in protocol governance.\n\nAnother notable trend is the reduction in team and investor allocations, with the combined allocation dropping from an average of 40% to approximately 30%. This rebalancing is often accompanied by extended vesting schedules of 3-4 years with one-year cliffs becoming standard practice.\n\n"These changes suggest a maturing of the ecosystem," Williams notes. "Projects are increasingly prioritizing sustainable value creation over quick returns, and investors are accepting these terms because they recognize the importance of long-term protocol health."',
            image: 'https://via.placeholder.com/800x400/800000/FFFFFF?text=Tokenomics+Trends',
            date: '2024-02-14T16:30:00Z',
            tags: ['tokenomics', 'market']
        },
        {
            id: 'news6',
            title: 'How to Optimize Your Testnet Participation for Maximum Airdrop Potential',
            description: 'Experts share strategies for meaningful testnet participation that may increase chances of qualifying for generous airdrops from upcoming projects.',
            content: 'As cryptocurrency projects increasingly use testnet participation as a key metric for airdrop qualification, experts are sharing optimization strategies to help users maximize their potential rewards.\n\n"The era of simple wallet creation or one-time transactions qualifying for substantial airdrops is largely over," says Elena Kowalski, founder of AirdropAnalytics. "Projects are becoming sophisticated in how they measure meaningful engagement."\n\nAccording to Kowalski, users should focus on these key strategies for optimal testnet participation:\n\n1. **Consistent Activity**: Rather than concentrated activity in a short period, spread interactions over the entire testnet period to demonstrate genuine interest.\n\n2. **Diverse Transactions**: Engage with multiple features of the protocol rather than repeating the same transaction type.\n\n3. **Cross-Protocol Interaction**: Use bridges, cross-chain functionality, and interact with partner protocols when available.\n\n4. **Community Participation**: Contribute to governance discussions, report bugs, and participate in community events.\n\n5. **Moderate Volume**: Focus on quality over quantity; suspiciously high transaction volumes can sometimes be flagged as "farming" behavior.\n\nProjects like Starknet, ZKSync, and Scroll have already utilized sophisticated metrics to reward users who demonstrated genuine engagement with their ecosystems rather than those who attempted to game airdrop systems.\n\n"The most successful airdrop recipients are typically those who approach testnets with curiosity and a desire to learn," adds Kowalski. "Projects want to reward users who might become valuable long-term community members."',
            image: 'https://via.placeholder.com/800x400/4B0082/FFFFFF?text=Testnet+Strategies',
            date: '2024-03-22T13:10:00Z',
            tags: ['airdrop', 'app']
        }
    ];
    
    state.news = defaultNews;
    saveState();
    renderNews();
};

// Render news items
const renderNews = () => {
    const container = $('newsContainer');
    container.innerHTML = '';
    
    // Get active filter
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    
    // Filter news
    let newsToShow = [...state.news];
    if (activeFilter !== 'all') {
        newsToShow = state.news.filter(news => news.tags.includes(activeFilter));
    }
    
    // Sort by date (newest first)
    newsToShow.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (newsToShow.length === 0) {
        container.innerHTML = `<p class="empty-state">No ${activeFilter !== 'all' ? activeFilter + ' ' : ''}news found.</p>`;
        return;
    }
    
    newsToShow.forEach(news => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-item';
        newsCard.innerHTML = `
            <div class="news-image">
                <img src="${news.image}" alt="${news.title}">
            </div>
            <div class="news-content">
                <h3 class="news-title">${news.title}</h3>
                <p class="news-description">${news.description}</p>
                <div class="news-tags">
                    ${news.tags.map(tag => `<span class="news-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        container.appendChild(newsCard);
        
        // Add click event to open news detail
        newsCard.addEventListener('click', () => {
            showNewsDetail(news);
        });
    });
};

// Show news detail
const showNewsDetail = (news) => {
    const detailContent = $('newsDetailContent');
    const detailSection = $('newsDetail');
    
    // Create the news detail content
    detailContent.innerHTML = `
        <div class="news-detail-image">
            <img src="${news.image}" alt="${news.title}">
        </div>
        <div class="news-detail-content">
            <h2 class="news-detail-title">${news.title}</h2>
            <div class="news-detail-meta">
                <span class="news-detail-date">${formatDate(news.date)}</span>
                <div class="news-tags">
                    ${news.tags.map(tag => `<span class="news-tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="news-detail-body">
                ${news.content.split('\n\n').map(p => `<p>${p}</p>`).join('')}
            </div>
        </div>
    `;
    
    // Show the news detail section
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    detailSection.classList.add('active');
    
    // Add back button functionality
    $('backToNews').addEventListener('click', () => {
        detailSection.classList.remove('active');
        $('news').classList.add('active');
    });
};

// Initialize news filters
const initNewsFilters = () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderNews();
        });
    });
};

// ========== Profile Functions ==========

// Initialize profile functionality
const initProfile = () => {
    const profileIcon = $('profileIcon');
    const themeToggle = $('themeToggle');
    
    // Profile icon click - open profile tab
    profileIcon.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        $('profile').classList.add('active');
    });
    
    // Theme toggle
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', themeToggle.checked);
        localStorage.setItem('darkMode', themeToggle.checked ? 'true' : 'false');
    });
    
    // Load saved theme preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    themeToggle.checked = darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
};

// ========== Initialization ==========

// Initialize app
const initApp = () => {
    // Load saved state
    loadState();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize tabs
    initProjectToggle();
    initFinancialActions();
    initTaskForm();
    initTaskReset();
    initNewsFilters();
    initProfile();
    
    // Update dashboard (initial view)
    updateDashboard();
};

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
