// Progress calculation utilities for habit tracking

/**
 * Calculate weekly progress percentage
 * @param {Object} weekData - Object containing habit completion data for the week
 * @param {number} habitCount - Number of habits the user has
 * @param {Array} validHabitIds - Array of current valid habit IDs (optional, for filtering deleted habits)
 * @returns {number} Progress percentage (0-100)
 */
export const calculateWeeklyProgress = (weekData, habitCount = 0, validHabitIds = null) => {
    // Total possible checkmarks for a week: habitCount × 7 days
    const TOTAL_POSSIBLE = habitCount * 7;

    if (!weekData || Object.keys(weekData).length === 0 || TOTAL_POSSIBLE === 0) {
        return 0;
    }

    let totalCompleted = 0;

    // Iterate through each day in the week
    Object.values(weekData).forEach((dayData) => {
        if (dayData && typeof dayData === 'object') {
            // Count completed habits for this day
            Object.entries(dayData).forEach(([habitId, isCompleted]) => {
                // Only count if habit is completed AND (no filter OR habit exists in valid list)
                if (isCompleted === true && (!validHabitIds || validHabitIds.includes(habitId))) {
                    totalCompleted++;
                }
            });
        }
    });

    return Math.round((totalCompleted / TOTAL_POSSIBLE) * 100);
};

/**
 * Calculate daily progress percentage
 * @param {Object} dayData - Object containing habit completion data for a single day
 * @returns {number} Progress percentage (0-100)
 */
export const calculateDailyProgress = (dayData) => {
    if (!dayData || typeof dayData !== 'object') {
        return 0;
    }

    const completed = Object.values(dayData).filter((val) => val === true).length;
    return Math.round((completed / TOTAL_HABITS) * 100);
};

/**
 * Get completion count for a week
 * @param {Object} weekData - Object containing habit completion data for the week
 * @param {number} habitCount - Number of habits the user has
 * @param {Array} validHabitIds - Array of current valid habit IDs (optional, for filtering deleted habits)
 * @returns {Object} Object with completed and total counts
 */
export const getWeekCompletionCount = (weekData, habitCount = 0, validHabitIds = null) => {
    // Total possible checkmarks for a week: habitCount × 7 days
    const TOTAL_POSSIBLE = habitCount * 7;

    if (!weekData || Object.keys(weekData).length === 0) {
        return { completed: 0, total: TOTAL_POSSIBLE };
    }

    let totalCompleted = 0;

    Object.values(weekData).forEach((dayData) => {
        if (dayData && typeof dayData === 'object') {
            Object.entries(dayData).forEach(([habitId, isCompleted]) => {
                // Only count if habit is completed AND (no filter OR habit exists in valid list)
                if (isCompleted === true && (!validHabitIds || validHabitIds.includes(habitId))) {
                    totalCompleted++;
                }
            });
        }
    });

    return { completed: totalCompleted, total: TOTAL_POSSIBLE };
};

/**
 * Calculate monthly progress percentage
 * @param {Object} monthData - Object containing all weeks data for the month
 * @returns {number} Progress percentage (0-100)
 */
export const calculateMonthlyProgress = (monthData) => {
    if (!monthData || Object.keys(monthData).length === 0) {
        return 0;
    }

    let totalCompleted = 0;
    let totalPossible = 0;

    // Iterate through each week
    Object.values(monthData).forEach((weekData) => {
        if (weekData && typeof weekData === 'object') {
            // Iterate through each day in the week
            Object.values(weekData).forEach((dayData) => {
                if (dayData && typeof dayData === 'object') {
                    // Count completed habits
                    Object.values(dayData).forEach((isCompleted) => {
                        totalPossible++;
                        if (isCompleted === true) {
                            totalCompleted++;
                        }
                    });
                }
            });
        }
    });

    if (totalPossible === 0) {
        return 0;
    }

    return Math.round((totalCompleted / totalPossible) * 100);
};
