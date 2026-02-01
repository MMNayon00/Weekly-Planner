# Yearly Habit & Productivity Planner

A high-performance, minimalist yearly habit tracker built with React and Firebase.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd "Weekly Planner"
   ```

2. **Install dependencies** (already done)
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Enable **Authentication** (Email/Password provider)
   - Enable **Firestore Database**
   - Get your Firebase config from Project Settings > General > Your apps
   - Update the `.env` file with your credentials:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Create an account and start tracking!

## 📋 Features

- ✅ **8 Fixed Habits**: Wake early, Gym, Reading, Budget, Project, Japanese, Social Detox, Cold Shower
- 📅 **Year → Month → Week Navigation**: Hierarchical view of your entire year
- ✔️ **Daily Habit Tracking**: Check off habits for each day of the week
- 📊 **Real-time Progress**: Animated pie charts showing weekly completion
- 🔐 **User Authentication**: Secure login with Firebase Auth
- 💾 **Cloud Sync**: All data stored in Firestore
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎨 **Minimalist UI**: Clean, distraction-free interface

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Auth/              # Login & Signup
│   ├── YearView/          # 12-month overview
│   ├── MonthView/         # Weekly breakdown
│   ├── WeekView/          # Daily habit grid
│   ├── ProgressChart/     # Pie chart visualization
│   └── ProtectedRoute.jsx # Route protection
├── hooks/
│   ├── useAuth.js         # Authentication state
│   └── useHabitData.js    # Firestore data management
├── utils/
│   ├── habitData.js       # Habit definitions
│   ├── dateHelpers.js     # Date utilities
│   └── progressCalculator.js # Progress logic
├── config/
│   └── firebase.config.js # Firebase initialization
├── App.jsx                # Main app & routing
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## 🗄️ Firestore Data Structure

```
users/{userId}/
  └── habits/
      └── {year}/
          └── months/
              └── {monthId}/
                  └── weeks/
                      └── {weekId}/
                          └── {dayId}/
                              └── {habitId}: boolean
```

## 🎨 Design System

- **Colors**: Off-white background, charcoal text, muted sage green accents
- **Typography**: Inter font family
- **Spacing**: 8px grid system
- **Animations**: Smooth transitions (250ms)

## 🛠️ Technologies

- **React 18** - UI framework
- **Firebase** - Authentication & Firestore database
- **Recharts** - Pie chart visualization
- **React Router** - Navigation
- **date-fns** - Date manipulation
- **Vite** - Build tool

## 📝 Usage

1. **Sign up** with email and password
2. **Navigate** through Year → Month → Week
3. **Check habits** daily by clicking checkboxes
4. **View progress** with real-time pie charts
5. **Track consistently** throughout the year

## 🔒 Security

- Firebase Authentication for secure login
- User-scoped data (each user only sees their own habits)
- Environment variables for sensitive config

## 📄 License

This project is built as a premium productivity tool.

---

**Built with ❤️ using React and Firebase**
