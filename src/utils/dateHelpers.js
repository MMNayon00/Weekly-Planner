import {
    format,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    startOfMonth,
    endOfMonth,
    eachWeekOfInterval,
    getWeek,
    getYear,
    getMonth,
    isToday,
    isSameWeek,
    isSameMonth,
} from 'date-fns';

/**
 * Get all weeks in a given month
 * @param {Date} date - Any date within the target month
 * @returns {Array} Array of week objects with start/end dates
 */
export const getWeeksInMonth = (date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    const weeks = eachWeekOfInterval(
        { start: monthStart, end: monthEnd },
        { weekStartsOn: 0 } // Sunday
    );

    return weeks.map((weekStart, index) => {
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
        const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

        return {
            id: `week-${index + 1}`,
            weekNumber: getWeek(weekStart),
            start: weekStart,
            end: weekEnd,
            days,
            label: `Week ${index + 1}`,
        };
    });
};

/**
 * Get all days in a week
 * @param {Date} date - Any date within the target week
 * @returns {Array} Array of Date objects for each day
 */
export const getDaysInWeek = (date) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
};

/**
 * Get current week information
 * @returns {Object} Current week details
 */
export const getCurrentWeek = () => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 0 });

    return {
        start: weekStart,
        end: weekEnd,
        weekNumber: getWeek(now),
        year: getYear(now),
        month: getMonth(now),
    };
};

/**
 * Get current month and year
 * @returns {Object} Current month/year details
 */
export const getCurrentMonth = () => {
    const now = new Date();
    return {
        month: getMonth(now),
        year: getYear(now),
        date: now,
    };
};

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @param {string} formatStr - Format string (default: 'MMM d, yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
    return format(date, formatStr);
};

/**
 * Format date for Firestore document ID
 * @param {Date} date - Date to format
 * @returns {string} Date in YYYY-MM-DD format
 */
export const formatDateForId = (date) => {
    return format(date, 'yyyy-MM-dd');
};

/**
 * Format month for Firestore document ID
 * @param {Date} date - Date to format
 * @returns {string} Month in YYYY-MM format
 */
export const formatMonthForId = (date) => {
    return format(date, 'yyyy-MM');
};

/**
 * Check if a date is in the current week
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is in current week
 */
export const isCurrentWeek = (date) => {
    return isSameWeek(date, new Date(), { weekStartsOn: 0 });
};

/**
 * Check if a date is in the current month
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is in current month
 */
export const isCurrentMonth = (date) => {
    return isSameMonth(date, new Date());
};

/**
 * Check if a date is today
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isTodayDate = (date) => {
    return isToday(date);
};

/**
 * Get all months in a year
 * @param {number} year - Year (default: current year)
 * @returns {Array} Array of month objects
 */
export const getMonthsInYear = (year = new Date().getFullYear()) => {
    return Array.from({ length: 12 }, (_, i) => {
        const date = new Date(year, i, 1);
        return {
            id: formatMonthForId(date),
            month: i,
            year,
            date,
            label: format(date, 'MMMM'),
            shortLabel: format(date, 'MMM'),
        };
    });
};
