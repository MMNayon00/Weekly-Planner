import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase.config';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Auth.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);

            // User-friendly error messages
            switch (err.code) {
                case 'auth/invalid-email':
                    setError('Invalid email address');
                    break;
                case 'auth/user-not-found':
                    setError('No account found with this email');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password');
                    break;
                case 'auth/invalid-credential':
                    setError('Invalid email or password');
                    break;
                default:
                    setError('Failed to log in. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <h1 className={styles.authTitle}>Welcome Back</h1>
                    <p className={styles.authSubtitle}>Track your habits, achieve your goals</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.formLabel}>
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.formInput}
                            placeholder="you@example.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.formLabel}>
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.formInput}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <div className={styles.authFooter}>
                    <p className={styles.authFooterText}>
                        Don't have an account?{' '}
                        <Link to="/signup" className={styles.authLink}>
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
