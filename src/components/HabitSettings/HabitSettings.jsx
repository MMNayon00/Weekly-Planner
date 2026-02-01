import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCustomHabits } from '../../hooks/useCustomHabits';
import styles from './HabitSettings.module.css';

const HabitSettings = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { habits, loading, addHabit, updateHabit, deleteHabit } = useCustomHabits(user?.uid);

    const [newHabitLabel, setNewHabitLabel] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editLabel, setEditLabel] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddHabit = async (e) => {
        e.preventDefault();
        if (!newHabitLabel.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await addHabit(newHabitLabel);
            setNewHabitLabel('');
        } catch (error) {
            alert('Failed to add habit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStartEdit = (habit) => {
        setEditingId(habit.id);
        setEditLabel(habit.label);
    };

    const handleSaveEdit = async (habitId) => {
        if (!editLabel.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await updateHabit(habitId, editLabel);
            setEditingId(null);
            setEditLabel('');
        } catch (error) {
            alert('Failed to update habit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditLabel('');
    };

    const handleDeleteClick = (habit) => {
        setDeleteConfirm(habit);
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirm || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await deleteHabit(deleteConfirm.id);
            setDeleteConfirm(null);
        } catch (error) {
            alert('Failed to delete habit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirm(null);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading your habits...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={() => navigate('/')}>
                ← Back to Planner
            </button>

            <div className={styles.header}>
                <h1>Manage Habits</h1>
                <p>Add, edit, or remove your daily habits</p>
            </div>

            {/* Add Habit Form */}
            <form onSubmit={handleAddHabit} className={styles.addForm}>
                <input
                    type="text"
                    className={styles.addInput}
                    placeholder="Enter new habit..."
                    value={newHabitLabel}
                    onChange={(e) => setNewHabitLabel(e.target.value)}
                    maxLength={50}
                    disabled={isSubmitting}
                />
                <button
                    type="submit"
                    className={styles.addButton}
                    disabled={!newHabitLabel.trim() || isSubmitting}
                >
                    {isSubmitting ? 'Adding...' : 'Add Habit'}
                </button>
            </form>

            {/* Habits List */}
            {habits.length === 0 ? (
                <div className={styles.emptyState}>
                    <h3>No habits yet</h3>
                    <p>Add your first habit above to start tracking!</p>
                </div>
            ) : (
                <div className={styles.habitsList}>
                    {habits.map((habit) => (
                        <div key={habit.id} className={styles.habitItem}>
                            {editingId === habit.id ? (
                                <>
                                    <input
                                        type="text"
                                        className={styles.habitInput}
                                        value={editLabel}
                                        onChange={(e) => setEditLabel(e.target.value)}
                                        maxLength={50}
                                        autoFocus
                                        disabled={isSubmitting}
                                    />
                                    <div className={styles.habitActions}>
                                        <button
                                            className={`${styles.iconButton} ${styles.saveButton}`}
                                            onClick={() => handleSaveEdit(habit.id)}
                                            disabled={!editLabel.trim() || isSubmitting}
                                            title="Save"
                                        >
                                            ✓
                                        </button>
                                        <button
                                            className={`${styles.iconButton} ${styles.cancelButton}`}
                                            onClick={handleCancelEdit}
                                            disabled={isSubmitting}
                                            title="Cancel"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className={styles.habitLabel}>{habit.label}</span>
                                    <div className={styles.habitActions}>
                                        <button
                                            className={`${styles.iconButton} ${styles.editButton}`}
                                            onClick={() => handleStartEdit(habit)}
                                            disabled={isSubmitting}
                                            title="Edit"
                                        >
                                            ✎
                                        </button>
                                        <button
                                            className={`${styles.iconButton} ${styles.deleteButton}`}
                                            onClick={() => handleDeleteClick(habit)}
                                            disabled={isSubmitting}
                                            title="Delete"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className={styles.modal} onClick={handleCancelDelete}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3>Delete Habit?</h3>
                        <p>
                            Are you sure you want to delete "<strong>{deleteConfirm.label}</strong>"?
                            This will remove all tracking data for this habit.
                        </p>
                        <div className={styles.modalActions}>
                            <button
                                className={`${styles.modalButton} ${styles.modalCancel}`}
                                onClick={handleCancelDelete}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                className={`${styles.modalButton} ${styles.modalDelete}`}
                                onClick={handleConfirmDelete}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HabitSettings;
