import React, { useState, useEffect } from 'react';

// Main App component
const App = () => {
  // GPA Calculator States
  const [courses, setCourses] = useState([]);
  const [calculatedGpa, setCalculatedGpa] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Visitor Counter State (using localStorage for per-user count)
  const [visitorCount, setVisitorCount] = useState(0);

  // --- Per-User Visitor Counter Logic (using localStorage) ---
  useEffect(() => {
    // Get current count from localStorage
    // If 'gpaCalculatorVisits' doesn't exist, it defaults to 0
    let currentVisits = parseInt(localStorage.getItem('gpaCalculatorVisits')) || 0;

    // Increment count for this visit (each time the component mounts/page loads)
    currentVisits += 1;

    // Save updated count back to localStorage
    localStorage.setItem('gpaCalculatorVisits', currentVisits.toString());

    // Update state to display the new count
    setVisitorCount(currentVisits);

    // Initial empty course for GPA calculator (part of the original app setup)
    setCourses([{ id: Date.now(), name: '', gpa: '', credits: '' }]);
  }, []); // The empty dependency array ensures this effect runs only once on component mount

  // --- GPA Calculator Functions ---
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
      setErrorMessage('Total credit hours cannot be zero. Please add at least one course with credit hours.');
      setCalculatedGpa(null);
      return;
    }

    const finalGpa = (totalQualityPoints / totalCreditHours).toFixed(2);
    setCalculatedGpa(finalGpa);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700">
            GPA Calculator
          </span>
        </h1>

        {/* Visitor Counter Display */}
        <div className="text-center text-gray-600 mb-6">
          <p className="text-lg font-medium">
            Your visits: <span className="text-blue-700 font-extrabold">{visitorCount}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            (This count is specific to your browser and resets if you clear browser data.)
          </p>
        </div>

        {/* Course Input Section */}
        <div className="space-y-6 mb-8">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50 p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:bg-gray-100"
            >
              {/* Course Name Input */}
              <input
                type="text"
                placeholder="Course Name (Optional)"
                value={course.name}
                onChange={(e) => handleCourseChange(course.id, 'name', e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              />
              {/* GPA Input */}
              <input
                type="number"
                placeholder="GPA (0.0-4.0)"
                value={course.gpa}
                onChange={(e) => handleCourseChange(course.id, 'gpa', e.target.value)}
                min="0.0"
                max="4.0"
                step="0.01"
                className="w-full sm:w-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              />
              {/* Credit Hours Input */}
              <input
                type="number"
                placeholder="Credits"
                value={course.credits}
                onChange={(e) => handleCourseChange(course.id, 'credits', e.target.value)}
                min="0.5"
                step="0.5"
                className="w-full sm:w-28 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              />
              {/* Remove Button */}
              {courses.length > 1 && (
                <button
                  onClick={() => removeCourse(course.id)}
                  className="bg-red-500 text-white p-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-200 w-full sm:w-auto"
                  title="Remove Course"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={addCourse}
            className="flex-1 bg-green-500 text-white p-4 rounded-md font-semibold text-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-200 transform hover:scale-105"
          >
            Add Course
          </button>
          <button
            onClick={calculateGpa}
            className="flex-1 bg-blue-600 text-white p-4 rounded-md font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 transform hover:scale-105"
          >
            Calculate GPA
          </button>
        </div>

        {/* Error Message Display */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{errorMessage}</span>
          </div>
        )}

        {/* Result Display */}
        {calculatedGpa !== null && !errorMessage && (
          <div className="bg-blue-50 p-6 rounded-lg text-center shadow-inner">
            <p className="text-2xl text-gray-700 font-medium">Your Calculated GPA:</p>
            <p className="text-5xl font-extrabold text-blue-700 mt-2 animate-pulse">
              {calculatedGpa}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
