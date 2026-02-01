import { useState, useEffect } from 'react';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase.config';

/**
 * Custom hook for managing user's habits
 * @param {string} userId - The authenticated user's ID
 * @returns {Object} Habits data and CRUD operations
 */
export const useCustomHabits = (userId) => {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        // Reference to user's habits collection
        const habitsRef = collection(db, 'users', userId, 'customHabits');
        const q = query(habitsRef, orderBy('order', 'asc'));

        // Real-time listener
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const habitsData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setHabits(habitsData);
                setLoading(false);
            },
            (err) => {
                console.error('Error fetching habits:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId]);

    /**
     * Add a new habit
     * @param {string} label - The habit label/name
     */
    const addHabit = async (label) => {
        if (!userId || !label.trim()) return;

        try {
            const habitsRef = collection(db, 'users', userId, 'customHabits');
            const order = habits.length; // Add to end

            await addDoc(habitsRef, {
                label: label.trim(),
                order,
                createdAt: serverTimestamp(),
            });
        } catch (err) {
            console.error('Error adding habit:', err);
            throw err;
        }
    };

    /**
     * Update a habit's label
     * @param {string} habitId - The habit document ID
     * @param {string} newLabel - The new label
     */
    const updateHabit = async (habitId, newLabel) => {
        if (!userId || !habitId || !newLabel.trim()) return;

        try {
            const habitRef = doc(db, 'users', userId, 'customHabits', habitId);
            await updateDoc(habitRef, {
                label: newLabel.trim(),
            });
        } catch (err) {
            console.error('Error updating habit:', err);
            throw err;
        }
    };

    /**
     * Delete a habit
     * @param {string} habitId - The habit document ID
     */
    const deleteHabit = async (habitId) => {
        if (!userId || !habitId) return;

        try {
            const habitRef = doc(db, 'users', userId, 'customHabits', habitId);
            await deleteDoc(habitRef);
        } catch (err) {
            console.error('Error deleting habit:', err);
            throw err;
        }
    };

    /**
     * Reorder habits
     * @param {Array} reorderedHabits - Array of habits with new order
     */
    const reorderHabits = async (reorderedHabits) => {
        if (!userId || !reorderedHabits.length) return;

        try {
            const updates = reorderedHabits.map((habit, index) => {
                const habitRef = doc(db, 'users', userId, 'customHabits', habit.id);
                return updateDoc(habitRef, { order: index });
            });

            await Promise.all(updates);
        } catch (err) {
            console.error('Error reordering habits:', err);
            throw err;
        }
    };

    return {
        habits,
        loading,
        error,
        addHabit,
        updateHabit,
        deleteHabit,
        reorderHabits,
    };
};
