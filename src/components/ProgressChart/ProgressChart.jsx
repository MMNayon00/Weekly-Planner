import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import styles from './ProgressChart.module.css';

const ProgressChart = ({ percentage, completed, total }) => {
    // Data for pie chart
    const data = [
        { name: 'Completed', value: percentage },
        { name: 'Remaining', value: 100 - percentage },
    ];

    // Colors
    const COLORS = ['#8BA888', '#E8F0E7'];

    return (
        <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>Weekly Progress</h3>

            <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={2}
                            dataKey="value"
                            animationBegin={0}
                            animationDuration={800}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index]}
                                    stroke="none"
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div className={styles.percentageLabel}>
                    {percentage}%
                </div>
            </div>

            <div className={styles.statsContainer}>
                <div className={styles.statItem}>
                    <div className={styles.statValue}>{completed}</div>
                    <div className={styles.statLabel}>Completed</div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statValue}>{total}</div>
                    <div className={styles.statLabel}>Total</div>
                </div>
            </div>
        </div>
    );
};

export default ProgressChart;
