// Fixed list of habits to track
export const HABITS = [
    { id: 'wake_early', label: 'Wake up at 06:00 / 07:00' },
    { id: 'gym', label: 'Gym' },
    { id: 'reading', label: 'Reading / Learning' },
    { id: 'budget', label: 'Budget Tracking' },
    { id: 'project', label: 'Project Work' },
    { id: 'japanese', label: 'Japanese Language' },
    { id: 'social_detox', label: 'Social Media Detox' },
    { id: 'cold_shower', label: 'Cold Shower' },
];

// Total number of habits
export const TOTAL_HABITS = HABITS.length;

// Get habit by ID
export const getHabitById = (id) => {
    return HABITS.find(habit => habit.id === id);
};

// Get all habit IDs
export const getHabitIds = () => {
    return HABITS.map(habit => habit.id);
};
