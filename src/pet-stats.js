// Virtual Pet Stats System
class PetStats {
    constructor() {
        this.stats = {
            hunger: 99,
            happiness: 99,
            health: 100,
            energy: 100,
            stress: 0,
            cleanliness: 100,
            intelligence: 100,
            dnaStability: 100,
            mood: 'Zen',
            moodValue: 100
        };
        
        this.timeline = [
            { time: '1d ago', text: 'SYSTEM found a coin: coins +10', type: 'system' },
            { time: '1d ago', text: 'ACTION Started sleeping', type: 'action' },
            { time: '1d ago', text: 'ACTION Played: happiness +15, energy -10', type: 'action' },
            { time: '1d ago', text: 'SYSTEM Glitch!', type: 'system' },
            { time: '1d ago', text: 'ACTION Fed kibble: hunger +20', type: 'action' },
            { time: '1d ago', text: 'ACTION Woke up', type: 'action' }
        ];
        
        this.init();
    }
    
    init() {
        this.updateDisplay();
        this.startDecay();
        this.setupKeyboardControls();
    }
    
    updateDisplay() {
        // Update stat bars
        document.querySelectorAll('.stat-bar').forEach(bar => {
            const type = bar.className.split(' ')[1];
            let value = 0;
            
            switch(type) {
                case 'hunger-bar':
                    value = this.stats.hunger;
                    break;
                case 'happiness-bar':
                    value = this.stats.happiness;
                    break;
                case 'health-bar':
                    value = this.stats.health;
                    break;
                case 'energy-bar':
                    value = this.stats.energy;
                    break;
                case 'cleanliness-bar':
                    value = this.stats.cleanliness;
                    break;
                case 'intelligence-bar':
                    value = this.stats.intelligence;
                    break;
                case 'dna-bar':
                    value = this.stats.dnaStability;
                    break;
            }
            
            bar.style.width = value + '%';
        });
        
        // Update stat values
        const statRows = document.querySelectorAll('.stat-row');
        statRows.forEach(row => {
            const label = row.querySelector('.stat-label')?.textContent.toLowerCase();
            const valueEl = row.querySelector('.stat-value');
            if (valueEl && label) {
                if (label.includes('hunger')) {
                    valueEl.textContent = Math.round(this.stats.hunger) + '/100';
                } else if (label.includes('happiness')) {
                    valueEl.textContent = Math.round(this.stats.happiness) + '/100';
                } else if (label.includes('health')) {
                    valueEl.textContent = Math.round(this.stats.health) + '/100';
                } else if (label.includes('energy')) {
                    valueEl.textContent = Math.round(this.stats.energy) + '/100';
                } else if (label.includes('stress')) {
                    valueEl.textContent = this.stats.stress;
                } else if (label.includes('cleanliness')) {
                    valueEl.textContent = Math.round(this.stats.cleanliness);
                } else if (label.includes('intelligence')) {
                    valueEl.textContent = Math.round(this.stats.intelligence);
                } else if (label.includes('dna')) {
                    valueEl.textContent = Math.round(this.stats.dnaStability);
                }
            }
        });
        
        // Update mood
        const moodBox = document.querySelector('.mood-box');
        const moodValue = document.querySelector('.mood-value');
        if (moodBox) moodBox.textContent = this.stats.mood;
        if (moodValue) moodValue.textContent = this.stats.moodValue + '/100';
    }
    
    startDecay() {
        setInterval(() => {
            // Gradual decay
            this.stats.hunger = Math.max(0, this.stats.hunger - 0.05);
            this.stats.energy = Math.max(0, this.stats.energy - 0.08);
            this.stats.cleanliness = Math.max(0, this.stats.cleanliness - 0.03);
            
            // Happiness depends on other stats
            if (this.stats.hunger < 30 || this.stats.energy < 20) {
                this.stats.happiness = Math.max(0, this.stats.happiness - 0.05);
            } else {
                this.stats.happiness = Math.min(100, this.stats.happiness + 0.02);
            }
            
            // Health depends on hunger and happiness
            if (this.stats.hunger < 20 || this.stats.happiness < 30) {
                this.stats.health = Math.max(0, this.stats.health - 0.05);
            } else {
                this.stats.health = Math.min(100, this.stats.health + 0.02);
            }
            
            // Update mood based on happiness
            if (this.stats.happiness >= 90) {
                this.stats.mood = 'Zen';
                this.stats.moodValue = 100;
            } else if (this.stats.happiness >= 70) {
                this.stats.mood = 'Happy';
                this.stats.moodValue = 80;
            } else if (this.stats.happiness >= 50) {
                this.stats.mood = 'Content';
                this.stats.moodValue = 60;
            } else if (this.stats.happiness >= 30) {
                this.stats.mood = 'Neutral';
                this.stats.moodValue = 40;
            } else {
                this.stats.mood = 'Sad';
                this.stats.moodValue = 20;
            }
            
            this.updateDisplay();
        }, 3000);
    }
    
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            
            switch(key) {
                case 'f':
                    this.feed();
                    break;
                case 'p':
                    this.play();
                    break;
                case 's':
                    this.sleep();
                    break;
                case 'h':
                    this.heal();
                    break;
                case 'c':
                    this.clean();
                    break;
            }
        });
    }
    
    feed() {
        this.stats.hunger = Math.min(100, this.stats.hunger + 20);
        this.stats.happiness = Math.min(100, this.stats.happiness + 5);
        this.addTimelineEvent('ACTION Fed kibble: hunger +20', 'action');
        this.updateDisplay();
    }
    
    play() {
        this.stats.happiness = Math.min(100, this.stats.happiness + 15);
        this.stats.energy = Math.max(0, this.stats.energy - 10);
        this.addTimelineEvent('ACTION Played: happiness +15, energy -10', 'action');
        this.updateDisplay();
    }
    
    sleep() {
        this.stats.energy = Math.min(100, this.stats.energy + 30);
        this.stats.health = Math.min(100, this.stats.health + 5);
        this.addTimelineEvent('ACTION Started sleeping', 'action');
        setTimeout(() => {
            this.addTimelineEvent('ACTION Woke up', 'action');
        }, 5000);
        this.updateDisplay();
    }
    
    heal() {
        this.stats.health = Math.min(100, this.stats.health + 20);
        this.addTimelineEvent('ACTION Healed: health +20', 'action');
        this.updateDisplay();
    }
    
    clean() {
        this.stats.cleanliness = Math.min(100, this.stats.cleanliness + 30);
        this.stats.happiness = Math.min(100, this.stats.happiness + 5);
        this.addTimelineEvent('ACTION Cleaned: cleanliness +30', 'action');
        this.updateDisplay();
    }
    
    addTimelineEvent(text, type) {
        this.timeline.unshift({
            time: 'just now',
            text: text,
            type: type
        });
        
        // Update old times
        this.timeline.forEach((item, index) => {
            if (index > 0) {
                if (item.time === 'just now') {
                    item.time = '1m ago';
                } else if (item.time === '1m ago' && index > 5) {
                    item.time = '1h ago';
                }
            }
        });
        
        this.updateTimeline();
    }
    
    updateTimeline() {
        const timelineList = document.getElementById('timelineList');
        if (!timelineList) return;
        
        timelineList.innerHTML = this.timeline.slice(0, 20).map(item => `
            <div class="timeline-item">
                <span class="timeline-time">${item.time}</span>
                <span class="timeline-text">${item.text}</span>
            </div>
        `).join('');
    }
    
}

// Initialize pet stats when page loads
let petStats;
window.addEventListener('DOMContentLoaded', () => {
    petStats = new PetStats();
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Filter timeline would go here
        });
    });
    
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
    
    // Nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
});
