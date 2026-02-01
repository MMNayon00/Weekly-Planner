import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase.config';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Auth.module.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            // Create user account
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Initialize user document in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                createdAt: new Date().toISOString(),
            });

            navigate('/');
        } catch (err) {
            console.error('Signup error:', err);

            // User-friendly error messages
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('An account with this email already exists');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak');
                    break;
                default:
                    setError('Failed to create account. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <h1 className={styles.authTitle}>Create Account</h1>
                    <p className={styles.authSubtitle}>Start your habit tracking journey</p>
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
                            autoComplete="new-password"
                            minLength={6}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword" className={styles.formLabel}>
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={styles.formInput}
                            placeholder="••••••••"
                            required
                            autoComplete="new-password"
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <div className={styles.authFooter}>
                    <p className={styles.authFooterText}>
                        Already have an account?{' '}
                        <Link to="/login" className={styles.authLink}>
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
