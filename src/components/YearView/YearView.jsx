import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase.config';
import { getMonthsInYear, isCurrentMonth } from '../../utils/dateHelpers';
import styles from './YearView.module.css';

const YearView = () => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();
    const months = getMonthsInYear(currentYear);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const handleMonthClick = (monthId) => {
        navigate(`/month/${monthId}`);
    };

    return (
        <div className={styles.yearContainer}>
            <div className={styles.headerButtons}>
                <button onClick={() => navigate('/settings/habits')} className={styles.settingsButton}>
                    ⚙️ Manage Habits
                </button>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    Logout
                </button>
            </div>

            <div className={styles.yearHeader}>
                <h1 className={styles.yearTitle}>{currentYear}</h1>
                <p className={styles.yearSubtitle}>Your Yearly Habit Planner</p>
            </div>

            <div className={styles.monthsGrid}>
                {months.map((month) => {
                    const isCurrent = isCurrentMonth(month.date);

                    return (
                        <div
                            key={month.id}
                            className={`${styles.monthCard} ${isCurrent ? styles.current : ''}`}
                            onClick={() => handleMonthClick(month.id)}
                        >
                            <h2 className={styles.monthName}>{month.label}</h2>

                            <div className={styles.monthStats}>
                                <span className={styles.statLabel}>Click to view weeks</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default YearView;
