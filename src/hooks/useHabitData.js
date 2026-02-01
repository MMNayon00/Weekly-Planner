import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { formatDateForId, formatMonthForId } from '../utils/dateHelpers';

/**
 * Custom hook for managing habit data in Firestore
 * @param {string} userId - Current user ID
 * @param {Date} date - Date for the habit data
 * @param {string} weekId - Week identifier
 * @returns {Object} Habit data and methods
 */
export const useHabitData = (userId, date, weekId) => {
    const [habitData, setHabitData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const year = date?.getFullYear();
    const monthId = date ? formatMonthForId(date) : null;
    const dayId = date ? formatDateForId(date) : null;

    useEffect(() => {
        if (!userId || !date || !weekId) {
            setLoading(false);
            return;
        }

        const fetchHabitData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Firestore path: users/{userId}/habits/{year}/months/{monthId}/weeks/{weekId}
                const weekDocRef = doc(
                    db,
                    'users',
                    userId,
                    'habits',
                    year.toString(),
                    'months',
                    monthId,
                    'weeks',
                    weekId
                );

                const weekDoc = await getDoc(weekDocRef);

                if (weekDoc.exists()) {
                    setHabitData(weekDoc.data() || {});
                } else {
                    setHabitData({});
                }
            } catch (err) {
                console.error('Error fetching habit data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHabitData();
    }, [userId, year, monthId, weekId]);

    /**
     * Toggle a habit for a specific day
     * @param {string} dayId - Day identifier (YYYY-MM-DD)
     * @param {string} habitId - Habit identifier
     */
    const toggleHabit = async (dayId, habitId) => {
        if (!userId || !year || !monthId || !weekId) return;

        try {
            const weekDocRef = doc(
                db,
                'users',
                userId,
                'habits',
                year.toString(),
                'months',
                monthId,
                'weeks',
                weekId
            );

            // Get current value
            const currentValue = habitData?.[dayId]?.[habitId] || false;
            const newValue = !currentValue;

            // Optimistic update
            setHabitData((prev) => ({
                ...prev,
                [dayId]: {
                    ...(prev[dayId] || {}),
                    [habitId]: newValue,
                },
            }));

            // Update Firestore
            const weekDoc = await getDoc(weekDocRef);

            if (weekDoc.exists()) {
                // Update existing document
                await updateDoc(weekDocRef, {
                    [`${dayId}.${habitId}`]: newValue,
                });
            } else {
                // Create new document
                await setDoc(weekDocRef, {
                    [dayId]: {
                        [habitId]: newValue,
                    },
                });
            }
        } catch (err) {
            console.error('Error toggling habit:', err);
            setError(err.message);

            // Revert optimistic update on error
            setHabitData((prev) => ({
                ...prev,
                [dayId]: {
                    ...(prev[dayId] || {}),
                    [habitId]: !habitData?.[dayId]?.[habitId],
                },
            }));
        }
    };

    /**
     * Get habit status for a specific day
     * @param {string} dayId - Day identifier
     * @param {string} habitId - Habit identifier
     * @returns {boolean} Whether the habit is completed
     */
    const getHabitStatus = (dayId, habitId) => {
        return habitData?.[dayId]?.[habitId] || false;
    };

    return {
        habitData,
        loading,
        error,
        toggleHabit,
        getHabitStatus,
    };
};

/**
 * Custom hook for fetching week data
 * @param {string} userId - Current user ID
 * @param {number} year - Year
 * @param {string} monthId - Month identifier
 * @param {string} weekId - Week identifier
 * @returns {Object} Week data and loading state
 */
export const useWeekData = (userId, year, monthId, weekId) => {
    const [weekData, setWeekData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId || !year || !monthId || !weekId) {
            setLoading(false);
            return;
        }

        const fetchWeekData = async () => {
            try {
                setLoading(true);

                const weekDocRef = doc(
                    db,
                    'users',
                    userId,
                    'habits',
                    year.toString(),
                    'months',
                    monthId,
                    'weeks',
                    weekId
                );

                const weekDoc = await getDoc(weekDocRef);
                setWeekData(weekDoc.exists() ? weekDoc.data() : {});
            } catch (err) {
                console.error('Error fetching week data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeekData();
    }, [userId, year, monthId, weekId]);

    return { weekData, loading };
};
