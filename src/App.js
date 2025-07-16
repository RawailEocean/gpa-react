import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [courses, setCourses] = useState([]);
  const [calculatedGpa, setCalculatedGpa] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setCourses([{ id: Date.now(), name: '', gpa: '', credits: '' }]);
  }, []);

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), name: '', gpa: '', credits: '' }]);
    setErrorMessage('');
  };

  const removeCourse = (id) => {
    setCourses(courses.filter(course => course.id !== id));
    setCalculatedGpa(null);
    setErrorMessage('');
  };

  const handleCourseChange = (id, field, value) => {
    setCourses(courses.map(course =>
      course.id === id ? { ...course, [field]: value } : course
    ));
    setCalculatedGpa(null);
    setErrorMessage('');
  };

  const calculateGpa = () => {
    let totalQualityPoints = 0;
    let totalCreditHours = 0;
    let hasError = false;

    for (const course of courses) {
      const gpa = parseFloat(course.gpa);
      const credits = parseFloat(course.credits);

      if (isNaN(gpa) || gpa < 0 || gpa > 4.0) {
        setErrorMessage('Please enter a valid GPA between 0.0 and 4.0 for all courses.');
        hasError = true;
        break;
      }

      if (isNaN(credits) || credits <= 0) {
        setErrorMessage('Please enter valid credit hours (greater than 0) for all courses.');
        hasError = true;
        break;
      }

      totalQualityPoints += gpa * credits;
      totalCreditHours += credits;
    }

    if (hasError) {
      setCalculatedGpa(null);
      return;
    }

    if (totalCreditHours === 0) {
      setErrorMessage('Total credit hours cannot be zero. Please add at least one course.');
      setCalculatedGpa(null);
      return;
    }

    const finalGpa = (totalQualityPoints / totalCreditHours).toFixed(2);
    setCalculatedGpa(finalGpa);
    setErrorMessage('');
  };

  return (
    <div className="container">
      <h1>GPA Calculator</h1>

      {courses.map(course => (
        <div key={course.id} className="course-row">
          <input
            type="text"
            placeholder="Course Name (Optional)"
            value={course.name}
            onChange={(e) => handleCourseChange(course.id, 'name', e.target.value)}
          />
          <input
            type="number"
            placeholder="GPA (0.0-4.0)"
            value={course.gpa}
            onChange={(e) => handleCourseChange(course.id, 'gpa', e.target.value)}
            min="0.0"
            max="4.0"
            step="0.01"
          />
          <input
            type="number"
            placeholder="Credits"
            value={course.credits}
            onChange={(e) => handleCourseChange(course.id, 'credits', e.target.value)}
            min="0.5"
            step="0.5"
          />
          {courses.length > 1 && (
            <button
              onClick={() => removeCourse(course.id)}
              className="remove"
            >
              X
            </button>
          )}
        </div>
      ))}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
        <button onClick={addCourse} className="add">Add Course</button>
        <button onClick={calculateGpa} className="calculate">Calculate GPA</button>
      </div>

      {errorMessage && <div className="error">{errorMessage}</div>}

      {calculatedGpa !== null && !errorMessage && (
        <div className="result">
          <p>Your Calculated GPA:</p>
          <p className="value">{calculatedGpa}</p>
        </div>
      )}

      {/* ✅ Final Footer Here */}
      <footer style={{ marginTop: '2rem', textAlign: 'center', color: '#888' }}>
        <p>Made by <strong>Rawail Ahmed</strong> | Powered by <strong>AWS</strong></p>
      </footer>
    </div>
  );
};

export default App;
