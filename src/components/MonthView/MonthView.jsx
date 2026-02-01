import { useParams, useNavigate } from 'react-router-dom';
import { getWeeksInMonth, formatDate, isCurrentWeek } from '../../utils/dateHelpers';
import styles from './MonthView.module.css';

const MonthView = () => {
    const { monthId } = useParams();
    const navigate = useNavigate();

    // Parse monthId (format: YYYY-MM)
    const [year, month] = monthId.split('-').map(Number);
    const monthDate = new Date(year, month - 1, 1);
    const weeks = getWeeksInMonth(monthDate);

    const monthName = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const handleWeekClick = (weekId) => {
        navigate(`/week/${monthId}/${weekId}`);
    };

    const handleBackToYear = () => {
        navigate('/');
    };

    return (
        <div className={styles.monthContainer}>
            <div className={styles.breadcrumb}>
                <span className={styles.breadcrumbLink} onClick={handleBackToYear}>
                    {year}
                </span>
                <span className={styles.breadcrumbSeparator}>/</span>
                <span>{monthDate.toLocaleDateString('en-US', { month: 'long' })}</span>
            </div>

            <div className={styles.monthHeader}>
                <h1 className={styles.monthTitle}>{monthName}</h1>
                <p className={styles.monthSubtitle}>Select a week to track your habits</p>
            </div>

            <div className={styles.weeksGrid}>
                {weeks.map((week) => {
                    const isCurrent = isCurrentWeek(week.start);
                    const startDate = formatDate(week.start, 'MMM d');
                    const endDate = formatDate(week.end, 'MMM d');

                    return (
                        <div
                            key={week.id}
                            className={`${styles.weekCard} ${isCurrent ? styles.current : ''}`}
                            onClick={() => handleWeekClick(week.id)}
                        >
                            <div className={styles.weekHeader}>
                                <h2 className={styles.weekLabel}>{week.label}</h2>
                                <p className={styles.weekDates}>
                                    {startDate} - {endDate}
                                </p>
                            </div>

                            <div className={styles.weekProgress}>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: '0%' }}
                                    />
                                </div>
                                <p className={styles.progressText}>Click to start tracking</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MonthView;
