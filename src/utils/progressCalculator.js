import { TOTAL_HABITS } from './habitData';

/**
 * Calculate weekly progress percentage
 * @param {Object} weekData - Object containing habit completion data for the week
 * @returns {number} Progress percentage (0-100)
 */
export const calculateWeeklyProgress = (weekData) => {
    if (!weekData || Object.keys(weekData).length === 0) {
        return 0;
    }

    let totalCompleted = 0;
    let totalPossible = 0;

    // Iterate through each day in the week
    Object.values(weekData).forEach((dayData) => {
        if (dayData && typeof dayData === 'object') {
            // Count completed habits for this day
            Object.values(dayData).forEach((isCompleted) => {
                totalPossible++;
                if (isCompleted === true) {
                    totalCompleted++;
                }
            });
        }
    });

    if (totalPossible === 0) {
        return 0;
    }

    return Math.round((totalCompleted / totalPossible) * 100);
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
 * @returns {Object} Object with completed and total counts
 */
export const getWeekCompletionCount = (weekData) => {
    if (!weekData || Object.keys(weekData).length === 0) {
        return { completed: 0, total: 0 };
    }

    let totalCompleted = 0;
    let totalPossible = 0;

    Object.values(weekData).forEach((dayData) => {
        if (dayData && typeof dayData === 'object') {
            Object.values(dayData).forEach((isCompleted) => {
                totalPossible++;
                if (isCompleted === true) {
                    totalCompleted++;
                }
            });
        }
    });

    return { completed: totalCompleted, total: totalPossible };
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
