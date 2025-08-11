// NEET Study Planner & Habit Tracker App
class NEETTracker {
    constructor() {
        this.data = {
            profile: null,
            dailyPlans: {},
            mockTests: [],
            habits: {
                daily: [],
                challenges21: [],
                challenges100: []
            },
            subjects: {
                physics: { progress: 0, chapters: {} },
                chemistry: { progress: 0, chapters: {} },
                biology: { progress: 0, chapters: {} }
            },
            studyHours: {},
            habitProgress: {}
        };

        this.sampleData = {
            neet_exam_info: {
                neet_2026_date: "2026-05-03",
                exam_pattern: {
                    total_questions: 180,
                    total_marks: 720,
                    duration_minutes: 180,
                    subjects: {
                        physics: { questions: 45, marks: 180 },
                        chemistry: { questions: 45, marks: 180 },
                        biology: { questions: 90, marks: 360 }
                    }
                }
            },
            sample_chapters: {
                physics: {
                    easy: ["Units and Measurements", "Motion in Straight Line", "Gravitation"],
                    medium: ["Laws of Motion", "Work, Energy and Power", "Rotational Motion", "Oscillations", "Waves"],
                    hard: ["Electrostatics", "Current Electricity", "Magnetism", "Electromagnetic Induction", "Alternating Current", "Dual Nature of Radiation"]
                },
                chemistry: {
                    easy: ["Some Basic Concepts", "States of Matter", "Chemical Bonding", "Redox Reactions"],
                    medium: ["Atomic Structure", "Periodic Table", "Equilibrium", "Thermodynamics", "Solutions"],
                    hard: ["Chemical Kinetics", "Electrochemistry", "Coordination Compounds", "Organic Chemistry"]
                },
                biology: {
                    easy: ["The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom"],
                    medium: ["Morphology of Plants", "Anatomy of Plants", "Structural Organisation in Animals", "Biomolecules", "Cell Cycle", "Photosynthesis"],
                    hard: ["Genetics and Evolution", "Biology and Human Welfare", "Biotechnology", "Ecology and Environment"]
                }
            },
            important_topics: {
                physics: ["Mechanics", "Electrodynamics", "Optics", "Modern Physics", "Thermodynamics"],
                chemistry: ["Organic Chemistry", "Physical Chemistry", "Inorganic Chemistry", "Coordination Chemistry"],
                biology: ["Genetics", "Ecology", "Human Physiology", "Plant Physiology", "Cell Biology", "Molecular Biology"]
            },
            sample_habits: [
                "Study for 8+ hours daily",
                "Solve 50 MCQs daily",
                "Read NCERT for 2 hours",
                "Take one mock test weekly",
                "Revise previous day topics",
                "Exercise for 30 minutes",
                "Sleep 7+ hours",
                "Meditate for 15 minutes"
            ]
        };

        this.charts = {};
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.initializeApp();
        this.updateCountdown();
        this.updateDashboard();

        // Update countdown every minute
        setInterval(() => this.updateCountdown(), 60000);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('[data-section]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Profile form
        document.getElementById('profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });

        // Daily planner
        document.getElementById('plannerDate').addEventListener('change', () => {
            this.loadDailyPlan();
        });
        document.getElementById('addTimeSlot').addEventListener('click', () => {
            this.addTimeSlot();
        });

        // Subject tabs
        document.querySelectorAll('[data-subject]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const subject = e.target.getAttribute('data-subject');
                this.showSubject(subject);
            });
        });

        // Mock test
        document.getElementById('addMockTest').addEventListener('click', () => {
            this.showMockTestModal();
        });
        document.getElementById('mockTestForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMockTest();
        });
        document.getElementById('cancelMockTest').addEventListener('click', () => {
            this.hideMockTestModal();
        });

        // Habits
        document.querySelectorAll('[data-habit-type]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.getAttribute('data-habit-type');
                this.showHabitType(type);
            });
        });
        document.getElementById('addHabit').addEventListener('click', () => {
            this.showHabitModal();
        });
        document.getElementById('habitForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveHabit();
        });
        document.getElementById('cancelHabit').addEventListener('click', () => {
            this.hideHabitModal();
        });

        // Close modals on background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });
    }

    initializeApp() {
        // Set today's date in planner
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('plannerDate').value = today;

        // Show profile modal if no profile exists
        if (!this.data.profile) {
            document.getElementById('profileModal').classList.remove('hidden');
        }

        // Initialize subjects
        this.initializeSubjects();
        
        // Load daily plan for today
        this.loadDailyPlan();
        
        // Load habits
        this.loadHabits();
        
        // Load mock tests
        this.loadMockTests();
        
        // Initialize charts
        setTimeout(() => this.initializeCharts(), 100);
    }

    // Data Management
    loadData() {
        try {
            const saved = localStorage.getItem('neetTrackerData');
            if (saved) {
                this.data = { ...this.data, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    saveData() {
        try {
            localStorage.setItem('neetTrackerData', JSON.stringify(this.data));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    // Navigation
    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        document.getElementById(sectionId).classList.add('active');
        
        // Update navigation
        document.querySelectorAll('.nav__item').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        // Load section-specific data
        if (sectionId === 'analytics') {
            setTimeout(() => this.updateAnalytics(), 100);
        }
    }

    // Theme Management
    toggleTheme() {
        const currentScheme = document.documentElement.getAttribute('data-color-scheme');
        const newScheme = currentScheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-color-scheme', newScheme);
        localStorage.setItem('theme', newScheme);
    }

    // Profile Management
    saveProfile() {
        const formData = new FormData(document.getElementById('profileForm'));
        
        this.data.profile = {
            name: formData.get('studentName') || document.getElementById('studentName').value,
            age: formData.get('studentAge') || document.getElementById('studentAge').value,
            location: formData.get('studentLocation') || document.getElementById('studentLocation').value,
            dateOfBirth: formData.get('dateOfBirth') || document.getElementById('dateOfBirth').value,
            targetScore: parseInt(formData.get('targetScore') || document.getElementById('targetScore').value),
            biologyTarget: parseInt(formData.get('biologyTarget') || document.getElementById('biologyTarget').value),
            chemistryTarget: parseInt(formData.get('chemistryTarget') || document.getElementById('chemistryTarget').value),
            physicsTarget: parseInt(formData.get('physicsTarget') || document.getElementById('physicsTarget').value),
            attemptNumber: formData.get('attemptNumber') || document.getElementById('attemptNumber').value,
            dreamCollege: formData.get('dreamCollege') || document.getElementById('dreamCollege').value,
            lifeGoal: formData.get('lifeGoal') || document.getElementById('lifeGoal').value,
            hobbies: formData.get('hobbies') || document.getElementById('hobbies').value
        };

        this.saveData();
        document.getElementById('profileModal').classList.add('hidden');
        this.updateDashboard();
    }

    // Countdown Timer
    updateCountdown() {
        const examDate = new Date('2026-05-03');
        const now = new Date();
        const diff = examDate - now;

        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            document.getElementById('days').textContent = days;
            document.getElementById('hours').textContent = hours;
            document.getElementById('minutes').textContent = minutes;
        }
    }

    // Dashboard Updates
    updateDashboard() {
        if (this.data.profile) {
            document.getElementById('welcomeName').textContent = this.data.profile.name;
        }

        // Calculate stats
        const totalHours = Object.values(this.data.studyHours).reduce((sum, hours) => sum + hours, 0);
        const streak = this.calculateStreak();
        const mockAvg = this.calculateMockTestAverage();
        const progress = this.calculateOverallProgress();

        document.getElementById('totalStudyHours').textContent = totalHours;
        document.getElementById('currentStreak').textContent = streak;
        document.getElementById('mockTestAvg').textContent = mockAvg;
        document.getElementById('targetProgress').textContent = progress + '%';

        this.updateTodaySchedule();
    }

    calculateStreak() {
        const dates = Object.keys(this.data.studyHours).sort().reverse();
        let streak = 0;
        const today = new Date().toISOString().split('T')[0];
        
        for (let i = 0; i < dates.length; i++) {
            const date = dates[i];
            if (this.data.studyHours[date] > 0) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    calculateMockTestAverage() {
        if (this.data.mockTests.length === 0) return 0;
        const sum = this.data.mockTests.reduce((total, test) => total + test.actualScore, 0);
        return Math.round(sum / this.data.mockTests.length);
    }

    calculateOverallProgress() {
        if (!this.data.profile) return 0;
        const targetScore = this.data.profile.targetScore;
        const currentAvg = this.calculateMockTestAverage();
        return Math.min(Math.round((currentAvg / targetScore) * 100), 100);
    }

    updateTodaySchedule() {
        const today = new Date().toISOString().split('T')[0];
        const schedule = this.data.dailyPlans[today];
        const container = document.getElementById('todaySchedule');

        if (schedule && schedule.timeSlots.length > 0) {
            const html = schedule.timeSlots.map(slot => {
                const status = slot.completed ? '✅' : '⏳';
                return `<div class="schedule-item">${status} ${slot.time}: ${slot.goal}</div>`;
            }).join('');
            container.innerHTML = html;
        } else {
            container.innerHTML = '<p class="empty-state">No schedule for today. <a href="#" data-section="daily-planner">Create one now!</a></p>';
        }
    }

    // Daily Planner
    loadDailyPlan() {
        const date = document.getElementById('plannerDate').value;
        const plan = this.data.dailyPlans[date] || {
            sleepTime: '',
            wakeTime: '',
            focusSubject: '',
            targetHours: 8,
            timeSlots: []
        };

        document.getElementById('sleepTime').value = plan.sleepTime;
        document.getElementById('wakeTime').value = plan.wakeTime;
        document.getElementById('focusSubject').value = plan.focusSubject;
        document.getElementById('targetHours').value = plan.targetHours;

        this.renderTimeSlots(plan.timeSlots);
        this.updateStudySummary();
    }

    saveDailyPlan() {
        const date = document.getElementById('plannerDate').value;
        const timeSlots = this.getTimeSlots();
        
        this.data.dailyPlans[date] = {
            sleepTime: document.getElementById('sleepTime').value,
            wakeTime: document.getElementById('wakeTime').value,
            focusSubject: document.getElementById('focusSubject').value,
            targetHours: parseFloat(document.getElementById('targetHours').value),
            timeSlots: timeSlots
        };

        // Calculate total study hours for the day
        const completedSlots = timeSlots.filter(slot => slot.completed);
        const studyHours = completedSlots.length * 0.5; // Assuming 30-minute slots
        this.data.studyHours[date] = studyHours;

        this.saveData();
        this.updateStudySummary();
        this.updateDashboard();
    }

    addTimeSlot() {
        const container = document.getElementById('timeSlots');
        const slotId = Date.now();
        
        const slotHTML = `
            <div class="time-slot" data-slot-id="${slotId}">
                <input type="time" class="form-control" required>
                <input type="text" class="form-control" placeholder="Study goal or topic" required>
                <input type="checkbox" onchange="app.saveDailyPlan()">
                <button type="button" class="btn btn--sm" onclick="this.parentElement.remove(); app.saveDailyPlan();">Remove</button>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', slotHTML);
    }

    renderTimeSlots(slots) {
        const container = document.getElementById('timeSlots');
        container.innerHTML = '';

        slots.forEach((slot, index) => {
            const slotHTML = `
                <div class="time-slot ${slot.completed ? 'completed' : ''}" data-slot-id="${index}">
                    <input type="time" class="form-control" value="${slot.time}" onchange="app.saveDailyPlan()">
                    <input type="text" class="form-control" value="${slot.goal}" onchange="app.saveDailyPlan()" placeholder="Study goal or topic">
                    <input type="checkbox" ${slot.completed ? 'checked' : ''} onchange="app.saveDailyPlan()">
                    <button type="button" class="btn btn--sm" onclick="this.parentElement.remove(); app.saveDailyPlan();">Remove</button>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', slotHTML);
        });

        if (slots.length === 0) {
            container.innerHTML = '<p class="empty-state">No time slots added. Click "Add Time Slot" to get started.</p>';
        }
    }

    getTimeSlots() {
        const slots = [];
        document.querySelectorAll('.time-slot').forEach(slot => {
            const time = slot.querySelector('input[type="time"]').value;
            const goal = slot.querySelector('input[type="text"]').value;
            const completed = slot.querySelector('input[type="checkbox"]').checked;
            
            if (time && goal) {
                slots.push({ time, goal, completed });
            }
        });
        return slots;
    }

    updateStudySummary() {
        const date = document.getElementById('plannerDate').value;
        const plan = this.data.dailyPlans[date];
        
        if (plan) {
            const totalPlanned = plan.timeSlots.length * 0.5;
            const completed = plan.timeSlots.filter(slot => slot.completed).length * 0.5;
            
            document.getElementById('totalPlannedHours').textContent = totalPlanned;
            document.getElementById('completedHours').textContent = completed;
        } else {
            document.getElementById('totalPlannedHours').textContent = 0;
            document.getElementById('completedHours').textContent = 0;
        }
    }

    // Subject Management
    initializeSubjects() {
        Object.keys(this.sampleData.sample_chapters).forEach(subject => {
            this.renderSubjectContent(subject);
        });
        
        // Set target displays
        if (this.data.profile) {
            document.getElementById('physicsTargetDisplay').textContent = this.data.profile.physicsTarget;
            document.getElementById('chemistryTargetDisplay').textContent = this.data.profile.chemistryTarget;
            document.getElementById('biologyTargetDisplay').textContent = this.data.profile.biologyTarget;
        }
    }

    renderSubjectContent(subject) {
        const chapters = this.sampleData.sample_chapters[subject];
        const topics = this.sampleData.important_topics[subject];

        // Render chapters by difficulty
        Object.keys(chapters).forEach(difficulty => {
            const container = document.getElementById(`${subject}${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`);
            if (container) {
                container.innerHTML = chapters[difficulty].map(chapter => {
                    const isCompleted = this.data.subjects[subject].chapters[chapter] || false;
                    return `<li class="${isCompleted ? 'completed' : ''}" onclick="app.toggleChapter('${subject}', '${chapter}')">${chapter}</li>`;
                }).join('');
            }
        });

        // Render important topics
        const topicsContainer = document.getElementById(`${subject}Topics`);
        if (topicsContainer) {
            topicsContainer.innerHTML = topics.map(topic => `<li>${topic}</li>`).join('');
        }
    }

    showSubject(subject) {
        document.querySelectorAll('.subject-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${subject}-panel`).classList.add('active');

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-subject="${subject}"]`).classList.add('active');
    }

    toggleChapter(subject, chapter) {
        this.data.subjects[subject].chapters[chapter] = !this.data.subjects[subject].chapters[chapter];
        this.updateSubjectProgress(subject);
        this.renderSubjectContent(subject);
        this.saveData();
    }

    updateSubjectProgress(subject) {
        const chapters = this.sampleData.sample_chapters[subject];
        const totalChapters = Object.values(chapters).flat().length;
        const completedChapters = Object.values(this.data.subjects[subject].chapters).filter(Boolean).length;
        
        const progress = Math.round((completedChapters / totalChapters) * 100);
        this.data.subjects[subject].progress = progress;
        
        document.getElementById(`${subject}Progress`).textContent = progress;
    }

    // Mock Test Management
    showMockTestModal() {
        document.getElementById('testDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('mockTestModal').classList.remove('hidden');
    }

    hideMockTestModal() {
        document.getElementById('mockTestModal').classList.add('hidden');
        document.getElementById('mockTestForm').reset();
    }

    saveMockTest() {
        const mockTest = {
            id: Date.now(),
            date: document.getElementById('testDate').value,
            targetScore: parseInt(document.getElementById('testTargetScore').value),
            actualScore: parseInt(document.getElementById('testActualScore').value),
            biologyScore: parseInt(document.getElementById('testBiologyScore').value),
            chemistryScore: parseInt(document.getElementById('testChemistryScore').value),
            physicsScore: parseInt(document.getElementById('testPhysicsScore').value),
            timeTaken: parseInt(document.getElementById('testTimeTaken').value),
            negativeMarks: parseInt(document.getElementById('testNegativeMarks').value),
            guessMarks: parseInt(document.getElementById('testGuessMarks').value),
            sillyMistakes: parseInt(document.getElementById('testSillyMistakes').value)
        };

        this.data.mockTests.push(mockTest);
        this.data.mockTests.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        this.saveData();
        this.hideMockTestModal();
        this.loadMockTests();
        this.updateDashboard();
        
        if (this.charts.mockTestChart) {
            this.updateMockTestChart();
        }
    }

    loadMockTests() {
        const container = document.getElementById('mockTestsList');
        
        if (this.data.mockTests.length === 0) {
            container.innerHTML = '<p class="empty-state">No mock tests recorded yet.</p>';
            return;
        }

        const html = this.data.mockTests.slice(0, 5).map(test => {
            const accuracy = Math.round((test.actualScore / test.targetScore) * 100);
            return `
                <div class="mock-test-item">
                    <h4>${new Date(test.date).toLocaleDateString()}</h4>
                    <div class="mock-test-scores">
                        <div class="score-item">
                            <span>${test.actualScore}</span>
                            <small>Score</small>
                        </div>
                        <div class="score-item">
                            <span>${test.biologyScore}</span>
                            <small>Biology</small>
                        </div>
                        <div class="score-item">
                            <span>${test.chemistryScore}</span>
                            <small>Chemistry</small>
                        </div>
                        <div class="score-item">
                            <span>${test.physicsScore}</span>
                            <small>Physics</small>
                        </div>
                        <div class="score-item">
                            <span>${accuracy}%</span>
                            <small>Accuracy</small>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    // Habit Management
    loadHabits() {
        this.loadDailyHabits();
        this.load21DayHabits();
        this.load100DayHabits();
    }

    showHabitType(type) {
        document.querySelectorAll('.habit-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        const panelMap = {
            'daily': 'daily-habits',
            '21day': '21day-habits',
            '100day': '100day-habits'
        };
        
        document.getElementById(panelMap[type]).classList.add('active');

        document.querySelectorAll('[data-habit-type]').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-habit-type="${type}"]`).classList.add('active');
    }

    showHabitModal() {
        document.getElementById('habitModal').classList.remove('hidden');
    }

    hideHabitModal() {
        document.getElementById('habitModal').classList.add('hidden');
        document.getElementById('habitForm').reset();
    }

    saveHabit() {
        const name = document.getElementById('habitName').value;
        const type = document.getElementById('habitType').value;
        
        const habit = {
            id: Date.now(),
            name: name,
            type: type,
            createdAt: new Date().toISOString(),
            progress: type === 'daily' ? {} : { current: 0, target: type === '21day' ? 21 : 100 }
        };

        this.data.habits[type === 'daily' ? 'daily' : type === '21day' ? 'challenges21' : 'challenges100'].push(habit);
        
        this.saveData();
        this.hideHabitModal();
        this.loadHabits();
    }

    loadDailyHabits() {
        const container = document.getElementById('dailyHabitsList');
        const today = new Date().toISOString().split('T')[0];

        if (this.data.habits.daily.length === 0) {
            // Add sample habits
            this.sampleData.sample_habits.slice(0, 4).forEach(habitName => {
                this.data.habits.daily.push({
                    id: Date.now() + Math.random(),
                    name: habitName,
                    type: 'daily',
                    progress: {}
                });
            });
        }

        const html = this.data.habits.daily.map(habit => {
            const isCompleted = habit.progress[today] || false;
            const streak = this.calculateHabitStreak(habit);
            
            return `
                <div class="habit-item ${isCompleted ? 'completed' : ''}">
                    <div class="habit-info">
                        <h4>${habit.name}</h4>
                        <p>Current streak: ${streak} days</p>
                    </div>
                    <div class="habit-actions">
                        <input type="checkbox" class="habit-checkbox" ${isCompleted ? 'checked' : ''} 
                               onchange="app.toggleHabit('${habit.id}', 'daily', '${today}')">
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    load21DayHabits() {
        const container = document.getElementById('challenge21List');
        
        if (this.data.habits.challenges21.length === 0) {
            container.innerHTML = '<p class="empty-state">No 21-day challenges started yet.</p>';
            return;
        }

        const html = this.data.habits.challenges21.map(habit => {
            const progress = (habit.progress.current / 21) * 100;
            
            return `
                <div class="habit-item">
                    <div class="habit-info">
                        <h4>${habit.name}</h4>
                        <p>Day ${habit.progress.current} of 21</p>
                        <div class="habit-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="habit-actions">
                        <button class="btn btn--sm" onclick="app.updateChallengeProgress('${habit.id}', '21day')">
                            Mark Today
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    load100DayHabits() {
        const container = document.getElementById('challenge100List');
        
        if (this.data.habits.challenges100.length === 0) {
            container.innerHTML = '<p class="empty-state">No 100-day challenges started yet.</p>';
            return;
        }

        const html = this.data.habits.challenges100.map(habit => {
            const progress = (habit.progress.current / 100) * 100;
            
            return `
                <div class="habit-item">
                    <div class="habit-info">
                        <h4>${habit.name}</h4>
                        <p>Day ${habit.progress.current} of 100</p>
                        <div class="habit-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="habit-actions">
                        <button class="btn btn--sm" onclick="app.updateChallengeProgress('${habit.id}', '100day')">
                            Mark Today
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    toggleHabit(habitId, type, date) {
        const habit = this.data.habits.daily.find(h => h.id == habitId);
        if (habit) {
            habit.progress[date] = !habit.progress[date];
            this.saveData();
            this.loadDailyHabits();
        }
    }

    updateChallengeProgress(habitId, type) {
        const habitArray = type === '21day' ? this.data.habits.challenges21 : this.data.habits.challenges100;
        const habit = habitArray.find(h => h.id == habitId);
        
        if (habit && habit.progress.current < habit.progress.target) {
            habit.progress.current++;
            this.saveData();
            this.loadHabits();
        }
    }

    calculateHabitStreak(habit) {
        const dates = Object.keys(habit.progress).sort().reverse();
        let streak = 0;
        
        for (const date of dates) {
            if (habit.progress[date]) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    // Analytics and Charts
    initializeCharts() {
        this.initStudyHoursChart();
        this.initSubjectChart();
        this.initHabitChart();
        this.initMockTestChart();
    }

    initStudyHoursChart() {
        const ctx = document.getElementById('studyHoursChart');
        if (!ctx) return;

        const last7Days = this.getLast7Days();
        const data = last7Days.map(date => this.data.studyHours[date] || 0);

        this.charts.studyHoursChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days.map(date => new Date(date).toLocaleDateString()),
                datasets: [{
                    label: 'Study Hours',
                    data: data,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 12
                    }
                }
            }
        });
    }

    initSubjectChart() {
        const ctx = document.getElementById('subjectChart');
        if (!ctx) return;

        const data = [
            this.data.subjects.physics.progress,
            this.data.subjects.chemistry.progress,
            this.data.subjects.biology.progress
        ];

        this.charts.subjectChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Physics', 'Chemistry', 'Biology'],
                datasets: [{
                    data: data,
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    initHabitChart() {
        const ctx = document.getElementById('habitChart');
        if (!ctx) return;

        const today = new Date().toISOString().split('T')[0];
        const completionRates = this.data.habits.daily.map(habit => {
            const totalDays = Object.keys(habit.progress).length;
            const completedDays = Object.values(habit.progress).filter(Boolean).length;
            return totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
        });

        this.charts.habitChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.data.habits.daily.map(habit => habit.name.substring(0, 15) + '...'),
                datasets: [{
                    label: 'Completion Rate (%)',
                    data: completionRates,
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    initMockTestChart() {
        const ctx = document.getElementById('mockTestChart');
        if (!ctx) return;

        if (this.data.mockTests.length === 0) {
            ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
            return;
        }

        const last10Tests = this.data.mockTests.slice(-10);
        
        this.charts.mockTestChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last10Tests.map((test, index) => `Test ${index + 1}`),
                datasets: [{
                    label: 'Actual Score',
                    data: last10Tests.map(test => test.actualScore),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: false
                }, {
                    label: 'Target Score',
                    data: last10Tests.map(test => test.targetScore),
                    borderColor: '#B4413C',
                    backgroundColor: 'rgba(180, 65, 60, 0.1)',
                    fill: false,
                    borderDash: [5, 5]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 720
                    }
                }
            }
        });
    }

    updateMockTestChart() {
        if (!this.charts.mockTestChart) return;

        const last10Tests = this.data.mockTests.slice(-10);
        
        this.charts.mockTestChart.data.labels = last10Tests.map((test, index) => `Test ${index + 1}`);
        this.charts.mockTestChart.data.datasets[0].data = last10Tests.map(test => test.actualScore);
        this.charts.mockTestChart.data.datasets[1].data = last10Tests.map(test => test.targetScore);
        
        this.charts.mockTestChart.update();
    }

    updateAnalytics() {
        // Update monthly summary
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        let monthlyStudyHours = 0;
        let monthlyMockTests = 0;
        let monthlyHabitsTotal = 0;
        let monthlyHabitsCompleted = 0;

        // Calculate monthly study hours
        Object.entries(this.data.studyHours).forEach(([date, hours]) => {
            const testDate = new Date(date);
            if (testDate.getMonth() === currentMonth && testDate.getFullYear() === currentYear) {
                monthlyStudyHours += hours;
            }
        });

        // Calculate monthly mock tests
        monthlyMockTests = this.data.mockTests.filter(test => {
            const testDate = new Date(test.date);
            return testDate.getMonth() === currentMonth && testDate.getFullYear() === currentYear;
        }).length;

        // Calculate monthly habit completion
        this.data.habits.daily.forEach(habit => {
            Object.entries(habit.progress).forEach(([date, completed]) => {
                const habitDate = new Date(date);
                if (habitDate.getMonth() === currentMonth && habitDate.getFullYear() === currentYear) {
                    monthlyHabitsTotal++;
                    if (completed) monthlyHabitsCompleted++;
                }
            });
        });

        const habitCompletionRate = monthlyHabitsTotal > 0 ? Math.round((monthlyHabitsCompleted / monthlyHabitsTotal) * 100) : 0;

        document.getElementById('monthlyStudyHours').textContent = Math.round(monthlyStudyHours);
        document.getElementById('monthlyMockTests').textContent = monthlyMockTests;
        document.getElementById('monthlyHabits').textContent = habitCompletionRate;

        // Update charts if they exist
        if (this.charts.studyHoursChart) {
            this.updateStudyHoursChart();
        }
    }

    updateStudyHoursChart() {
        const last7Days = this.getLast7Days();
        const data = last7Days.map(date => this.data.studyHours[date] || 0);

        this.charts.studyHoursChart.data.labels = last7Days.map(date => new Date(date).toLocaleDateString());
        this.charts.studyHoursChart.data.datasets[0].data = data;
        this.charts.studyHoursChart.update();
    }

    // Utility functions
    getLast7Days() {
        const days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }
        
        return days;
    }
}

// Initialize app when page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new NEETTracker();
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}