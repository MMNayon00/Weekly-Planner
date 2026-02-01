import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useHabitData } from '../../hooks/useHabitData';
import { HABITS } from '../../utils/habitData';
import {
    getWeeksInMonth,
    formatDate,
    formatDateForId,
    isTodayDate
} from '../../utils/dateHelpers';
import {
    calculateWeeklyProgress,
    getWeekCompletionCount
} from '../../utils/progressCalculator';
import ProgressChart from '../ProgressChart/ProgressChart';
import styles from './WeekView.module.css';

const WeekView = () => {
    const { monthId, weekId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Parse monthId (format: YYYY-MM)
    const [year, month] = monthId.split('-').map(Number);
    const monthDate = new Date(year, month - 1, 1);
    const weeks = getWeeksInMonth(monthDate);

    // Find the current week
    const currentWeek = weeks.find(w => w.id === weekId);

    if (!currentWeek) {
        return <div className={styles.errorState}>Week not found</div>;
    }

    const { habitData, loading, error, toggleHabit, getHabitStatus } = useHabitData(
        user?.uid,
        currentWeek.start,
        weekId
    );

    // Calculate progress
    const progress = calculateWeeklyProgress(habitData);
    const { completed, total } = getWeekCompletionCount(habitData);

    const handleBackToMonth = () => {
        navigate(`/month/${monthId}`);
    };

    const handleBackToYear = () => {
        navigate('/');
    };

    const handleCheckboxChange = (dayDate, habitId) => {
        const dayId = formatDateForId(dayDate);
        toggleHabit(dayId, habitId);
    };

    if (loading) {
        return <div className={styles.loadingState}>Loading habit data...</div>;
    }

    if (error) {
        return <div className={styles.errorState}>Error: {error}</div>;
    }

    return (
        <div className={styles.weekContainer}>
            <div className={styles.breadcrumb}>
                <span className={styles.breadcrumbLink} onClick={handleBackToYear}>
                    {year}
                </span>
                <span className={styles.breadcrumbSeparator}>/</span>
                <span className={styles.breadcrumbLink} onClick={handleBackToMonth}>
                    {monthDate.toLocaleDateString('en-US', { month: 'long' })}
                </span>
                <span className={styles.breadcrumbSeparator}>/</span>
                <span>{currentWeek.label}</span>
            </div>

            <div className={styles.weekHeader}>
                <h1 className={styles.weekTitle}>{currentWeek.label}</h1>
                <p className={styles.weekDates}>
                    {formatDate(currentWeek.start, 'MMMM d')} - {formatDate(currentWeek.end, 'MMMM d, yyyy')}
                </p>
            </div>

            <div className={styles.contentWrapper}>
                <div className={styles.habitGridSection}>
                    <div className={styles.habitGrid}>
                        <table className={styles.gridTable}>
                            <thead>
                                <tr>
                                    <th>Habit</th>
                                    {currentWeek.days.map((day) => {
                                        const isToday = isTodayDate(day);
                                        return (
                                            <th
                                                key={day.toISOString()}
                                                className={`${styles.dayHeader} ${isToday ? styles.today : ''}`}
                                            >
                                                <span className={styles.dayName}>
                                                    {formatDate(day, 'EEE')}
                                                </span>
                                                <span className={styles.dayDate}>
                                                    {formatDate(day, 'd')}
                                                </span>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {HABITS.map((habit) => (
                                    <tr key={habit.id}>
                                        <td className={styles.habitLabel}>{habit.label}</td>
                                        {currentWeek.days.map((day) => {
                                            const dayId = formatDateForId(day);
                                            const isChecked = getHabitStatus(dayId, habit.id);

                                            return (
                                                <td key={day.toISOString()} className={styles.checkboxCell}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => handleCheckboxChange(day, habit.id)}
                                                        className={styles.checkbox}
                                                        aria-label={`${habit.label} on ${formatDate(day, 'MMMM d')}`}
                                                    />
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <ProgressChart
                    percentage={progress}
                    completed={completed}
                    total={total}
                />
            </div>
        </div>
    );
};

export default WeekView;
