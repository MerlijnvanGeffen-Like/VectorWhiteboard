# NPQP (React)

This is a web-based whiteboard application built with React. It allows interactive drawing, sticky notes, quizzes, polls, and more, with a modern UI and multiple themes.

---

## ✨ Features

- Infinite, interactive whiteboard canvas
- Sticky notes (fully drawable, resizable)
- Quizzes, polls, true/false questions
- Multiple themes (including summer, dark, space, etc.)
- Export, screenshot, and email summary
- Modern, responsive user interface

---

## 🖥️ Frontend Setup & Development

1. **Install dependencies:**
   ```sh
   cd vector-whiteboard
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm start
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

### Build for Production

1. **Build the app:**
   ```sh
   npm run build
   ```
   This creates a `build/` folder with the production build.

2. **Serve the production build locally:**
   ```sh
   npx serve -s build
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

---

## 🐍 Backend Setup (Python)

1. **Install Python 3.7+** (if not already installed)
2. **Install backend dependencies:**
   ```sh
   cd backend
   # pip install -r requirements.txt
   ```
3. **Run the backend server:**
   ```sh
   python student_frontend.py
   ```
   The backend will run on the port specified in your code (default: 5000 or as configured).

---

## 📦 Requirements

### Frontend
- Node.js (v16+ recommended)
- npm

### Backend
- Python 3.7+
- Flask
- (Add any other Python dependencies you use, e.g. OpenCV, Pillow, NumPy, scikit-image)

---

## 📚 Notes
- The backend is separate and not required for the whiteboard UI to function, but is needed for advanced features (e.g. saving, quizzes, etc).
- For deployment, upload the contents of the `build/` folder to your static hosting provider (Netlify, Vercel, GitHub Pages, etc).


For any issues or questions, please open an issue on the repository. 