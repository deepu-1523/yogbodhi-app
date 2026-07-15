import axios from 'axios';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import api from '../../services/endpoints';
import useStudentStore from '../../Store/studentstore';

const StudentTestPanel = () => {
  const { student } = useStudentStore();

  // Main state
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);
  const [studentClass, setStudentClass] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Test taking state
  const [selectedTest, setSelectedTest] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [scoreDetails, setScoreDetails] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [existingAttemptId, setExistingAttemptId] = useState(null);

  // Exit blocking after 10 minutes (server time based)
  const [testStartTime, setTestStartTime] = useState(null);
  const [isExitBlocked, setIsExitBlocked] = useState(false);

  // Result modal
  const [showResultModal, setShowResultModal] = useState(false);
  const [viewingResult, setViewingResult] = useState(null);
  
  // Sync interval reference
  const syncIntervalRef = useRef(null);
  // Timer reference for exit blocking after 10 minutes
  const exitBlockTimerRef = useRef(null);

  // Helper: extract numeric class from string like "12th" -> 12
  const extractClassNumber = (className) => {
    if (!className) return null;
    const match = String(className).match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  };

  // ----- 1. Get student ID and class from store / localStorage -----
  useEffect(() => {
    let id = null;
    let cls = null;
    if (student) {
      id = student._id || student.id;
      cls = student.currentClass || student.className || student.class;
    } else {
      try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (token && userStr) {
          const user = JSON.parse(userStr);
          id = user._id || user.id || user.userId || user.studentId;
          cls = user.currentClass || user.className || user.class;
        }
      } catch (error) {
        // ignore
      }
    }
    setStudentId(id);
    setStudentClass(cls);
    setIsLoggedIn(!!id);
  }, [student]);

  const fetchFullProfile = async () => {
    if (isLoggedIn && studentId && !studentClass) {
      try {
        const res = await axios.post(api.student.getStudent, {
          studentId: studentId,
        });
        if (res.data?.success) {
          const profile = res.data.user || res.data.data;
          if (profile) {
            const cls = profile.currentClass || profile.className || profile.class;
            if (cls) {
              setStudentClass(cls);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching full profile:', error);
      }
    }
  };
  useEffect(() => {
    fetchFullProfile();
  }, [isLoggedIn, studentId, studentClass]);

  const fetchCompletedTests = async () => {
    if (!studentId) return [];
    try {
      const res = await axios.post(api.result.getStudentResults, { studentId });
      if (res.data?.success && res.data.data) {
        return res.data.data.filter(result => result.isCompleted).map(result => ({
          testId: result.testId?._id || result.testId,
          testTitle: result.testId?.title || 'Unknown Test',
          score: result.obtainedMarks,
          totalMarks: result.totalMarks,
          percentage: result.percentage,
          completedAt: result.createdAt,
          isEligible: result.isEligible,
          obtainedMarks: result.obtainedMarks,
        }));
      }
    } catch (error) {
      console.error('Error fetching completed tests:', error);
    }
    return [];
  };

  const checkAttemptStatus = async (testId) => {
    if (!studentId) return false;
    try {
      const res = await axios.post(api.result.attemptTest, { studentId, testId });
      if (res.data?.success) {
        return res.data.data?.attempted === true || res.data.data?.alreadyAttempted === true;
      }
      return false;
    } catch (error) {
      if (error.response?.data?.message?.includes('already')) return true;
      return false;
    }
  };

  // ----- 5. Main function: fetch tests for this student (only his class) -----
  const getTestsForStudent = async () => {
    if (!isLoggedIn || !studentId) {
      setTests([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        api.student.getTestforStudent,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        let rawTests = res.data.tests || res.data.data || [];

        if (studentClass) {
          const studentNum = extractClassNumber(studentClass);
          rawTests = rawTests.filter(test => {
            const testNum = extractClassNumber(test.className);
            return studentNum && testNum && studentNum === testNum;
          });
        }

        const completedTests = await fetchCompletedTests();
        const completedIds = new Set(completedTests.map(t => t.testId));

        const formattedTests = await Promise.all(
          rawTests.map(async (test) => {
            const questionCount = test.questions?.length || test.questionCount || test.totalQuestions || 0;
            const totalMarks = test.totalMarks ?? (questionCount * 1);

            let isCompleted = completedIds.has(test._id);
            let completedResult = completedTests.find(t => t.testId === test._id);

            return {
              id: test._id,
              title: test.title || 'Untitled Test',
              duration: test.duration || 30,
              totalQuestions: questionCount,
              totalMarks: totalMarks,
              description: test.description || `Test your knowledge`,
              difficulty: test.difficulty || 'Medium',
              category: test.category || 'General',
              isCompleted,
              completedResult,
              originalData: test,
            };
          })
        );

        setTests(formattedTests);
      } else {
        setTests([]);
      }
    } catch (error) {
      console.error('Error fetching student tests:', error);
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && studentId) {
      getTestsForStudent();
    } else {
      setTests([]);
      setLoading(false);
    }
  }, [studentId, studentClass, isLoggedIn]);

  // ----- 6. Fetch questions for a test -----
  const fetchTestQuestions = async (testId) => {
    try {
      const res = await axios.post(api.test.getQuestion, { testId });
      if (res.data?.success && res.data.data) {
        let questionsData = [];
        if (Array.isArray(res.data.data)) {
          questionsData = res.data.data;
        } else if (res.data.data.questions && Array.isArray(res.data.data.questions)) {
          questionsData = res.data.data.questions;
        } else if (res.data.data.question) {
          questionsData = [res.data.data];
        }
        return questionsData.map((q) => ({
          _id: q._id,
          id: q._id,
          text: q.question || q.questionText || q.text || 'Question not available',
          options: q.options || ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          marks: q.marks || 1,
          correctAnswer: q.correctAnswer !== undefined ? parseInt(q.correctAnswer) : 0,
        }));
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
    return [];
  };

  // ----- 7. Start test API call (creates or retrieves an attempt) -----
  const callStartTestAPI = async (testId) => {
    try {
      const response = await axios.post(api.result.startTest, {
        studentId,
        testId,
      });
      if (response.data?.success) {
        return { 
          ...response.data.data, 
          isExitBlocked: response.data.isExitBlocked 
        };
      }
      throw new Error(response.data?.message || 'Failed to start test');
    } catch (error) {
      console.error('Start test API error:', error);
      throw error;
    }
  };

  // ----- Function to sync exit blocked status from server (called periodically) -----
  const syncExitBlockedStatus = useCallback(async () => {
    if (!selectedTest || !studentId || !testStarted || testCompleted) return;
    try {
      const response = await axios.post(api.result.startTest, {
        studentId,
        testId: selectedTest.id,
      });
      if (response.data?.success) {
        setIsExitBlocked(response.data.isExitBlocked);
        // Also update testStartTime if needed (in case of server mismatch)
        if (response.data.data?.testStartTime) {
          const serverStartTime = new Date(response.data.data.testStartTime);
          if (testStartTime && serverStartTime.getTime() !== testStartTime.getTime()) {
            setTestStartTime(serverStartTime);
          }
        }
      }
    } catch (error) {
      console.error('Error syncing exit blocked status:', error);
    }
  }, [selectedTest, studentId, testStarted, testCompleted, testStartTime]);

  // ----- 8. Submit test API call -----
  const submitTestAPI = async (testId, answersObj) => {
    if (!studentId) return { success: false, error: 'Student not found' };
    try {
      setSubmitting(true);
      const requestData = { studentId, testId, answers: answersObj };
      const res = await axios.post(api.result.submitTest, requestData);
      if (res.data?.success) {
        return { success: true, data: res.data.data };
      }
      return { success: false, error: res.data?.message || 'Submission failed' };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    } finally {
      setSubmitting(false);
    }
  };

  // ----- 9. Start test handler (with resume support & capture server start time) -----
  const handleStartTest = async (test) => {
    if (test.isCompleted) {
      alert('⚠️ You have already taken this test!');
      return;
    }

    setSelectedTest(test);
    setLoading(true);

    try {
      const attempt = await callStartTestAPI(test.id);
      setExistingAttemptId(attempt._id);
      // Store the exact test start time from backend (server time)
      const serverStartTime = new Date(attempt.testStartTime);
      setTestStartTime(serverStartTime);
      setIsExitBlocked(attempt.isExitBlocked || false);

      const testQuestions = await fetchTestQuestions(test.id);
      setQuestions(testQuestions);

      if (attempt.answers && Array.isArray(attempt.answers) && attempt.answers.length > 0) {
        const savedAnswers = {};
        attempt.answers.forEach((ans) => {
          if (ans.selectedAnswer !== null && ans.selectedAnswer !== undefined) {
            savedAnswers[ans.questionId] = ans.selectedAnswer;
          }
        });
        setAnswers(savedAnswers);
      } else {
        const localSaved = localStorage.getItem(`test_answers_${studentId}_${test.id}`);
        if (localSaved) {
          try {
            setAnswers(JSON.parse(localSaved));
          } catch (e) {
            setAnswers({});
          }
        } else {
          setAnswers({});
        }
      }

      if (test.duration) {
        setTimeRemaining(test.duration * 60);
        setTimerActive(true);
      }

      setTestStarted(true);
      setCurrentQuestion(0);
      setTestCompleted(false);
      setScoreDetails(null);
    } catch (error) {
      console.error('Error starting test:', error);
      alert(error.message || 'Failed to start test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ----- 10. Local timer to block exit exactly after 10 minutes (without waiting for sync) -----
  useEffect(() => {
    if (testStarted && !testCompleted && testStartTime) {
      // Clear any existing timer
      if (exitBlockTimerRef.current) {
        clearTimeout(exitBlockTimerRef.current);
      }

      const now = new Date();
      const start = new Date(testStartTime);
      const elapsedMs = now - start;
      const tenMinutesMs = 10 * 60 * 1000;

      if (elapsedMs >= tenMinutesMs) {
        // Already past 10 minutes -> block immediately
        setIsExitBlocked(true);
      } else {
        // Schedule blocking at the exact 10-minute mark
        const remainingMs = tenMinutesMs - elapsedMs;
        exitBlockTimerRef.current = setTimeout(() => {
          setIsExitBlocked(true);
        }, remainingMs);
      }

      // Cleanup when test ends or component unmounts
      return () => {
        if (exitBlockTimerRef.current) {
          clearTimeout(exitBlockTimerRef.current);
          exitBlockTimerRef.current = null;
        }
      };
    }
  }, [testStarted, testCompleted, testStartTime]);

  // ----- 11. Periodic sync with server to update exit blocked status (every 30 seconds) -----
  useEffect(() => {
    if (testStarted && !testCompleted && selectedTest) {
      syncExitBlockedStatus(); // initial sync
      syncIntervalRef.current = setInterval(syncExitBlockedStatus, 30000); // every 30 sec
    } else {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    }
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [testStarted, testCompleted, selectedTest, syncExitBlockedStatus]);

  // ----- 12. Browser Exit Restrictions (based on server isExitBlocked flag) -----
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isExitBlocked && !testCompleted) {
        e.preventDefault();
        e.returnValue = 'You cannot leave the test after 10 minutes. Please submit it.';
      }
    };

    const handlePopState = (e) => {
      if (isExitBlocked && !testCompleted) {
        window.history.pushState(null, '', window.location.href);
        alert("You cannot exit the test after 10 minutes of starting the test.");
      }
    };

    if (testStarted && !testCompleted && isExitBlocked) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [testStarted, isExitBlocked, testCompleted]);

  // ----- 13. Timer countdown (does NOT auto‑submit) -----
  useEffect(() => {
    let interval;
    if (timerActive && timeRemaining > 0 && !testCompleted && !submitting) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimerActive(false);
            alert("⏰ Time is up! Please click 'Submit Test' now to save your results.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining, testCompleted, submitting]);

  const handleSubmitManually = async () => {
    if (submitting || testCompleted) return;
    const formattedAnswers = {};
    questions.forEach((q) => {
      const ans = answers[q.id];
      if (ans !== undefined && ans !== null) {
        formattedAnswers[q.id] = Number(ans);
      }
    });
    if (Object.keys(formattedAnswers).length === 0) {
      alert('Please answer at least one question before submitting.');
      return;
    }
    const result = await submitTestAPI(selectedTest.id, formattedAnswers);
    if (result.success) {
      setTestCompleted(true);
      setTimerActive(false);
      setScoreDetails(result.data);
      localStorage.removeItem(`test_answers_${studentId}_${selectedTest.id}`);
      await getTestsForStudent();
    } else {
      alert(result.error || 'Failed to submit test');
    }
  };

  // ----- 14. Exit handler with block check -----
  const handleBackToTests = () => {
    if (testStarted && !testCompleted) {
      if (isExitBlocked) {
        alert("You cannot exit the test after 10 minutes of starting the test.");
        return;
      }
      if (!window.confirm('Are you sure you want to exit? Your progress will be saved and you can resume later.')) {
        return;
      }
    }
    // Cleanup
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }
    if (exitBlockTimerRef.current) {
      clearTimeout(exitBlockTimerRef.current);
      exitBlockTimerRef.current = null;
    }
    setTestStarted(false);
    setSelectedTest(null);
    setTestCompleted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setScoreDetails(null);
    setQuestions([]);
    setTimerActive(false);
    setTimeRemaining(null);
    setExistingAttemptId(null);
    setTestStartTime(null);
    setIsExitBlocked(false);
  };

  // Handle answer selection – NO AUTO-SUBMIT
  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev, [questionId]: answerIndex };
      if (selectedTest && studentId) {
        localStorage.setItem(`test_answers_${studentId}_${selectedTest.id}`, JSON.stringify(newAnswers));
      }
      return newAnswers;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitManually();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  // ----- 15. View result modal -----
  const handleViewResult = (test) => {
    setViewingResult(test.completedResult);
    setShowResultModal(true);
  };

  // ----- 16. Helper functions for UI -----
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    if (!difficulty) return 'bg-gray-100 text-gray-600';
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'hard':
        return 'bg-yellow-50 text-[#ba9d25] border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getProgressPercentage = () => {
    const answeredCount = Object.keys(answers).length;
    return questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  };

  // ----- 17. RENDER -----
  if (loading && !testStarted) {
    return (
      <div className="min-h-screen bg-dot-grid flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-200 border-t-[#0078FF] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading your tests...</p>
        </div>
      </div>
    );
  }

  // ----- TEST LIST VIEW (default) -----
  if (!testStarted && !testCompleted) {
    const totalDuration = tests.reduce((sum, t) => sum + (t.duration || 0), 0);
    const totalQuestions = tests.reduce((sum, t) => sum + (t.totalQuestions || 0), 0);
    const completedCount = tests.filter((t) => t.isCompleted).length;

    return (
      <div className="bg-white min-h-screen">
        {/* Hero section */}
        <div className="relative bg-white border-b border-gray-100 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0078FF]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#ba9d25]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0078FF]"></span>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Assessment Hub</p>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
                  Available <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ba9d25] via-[#0078FF] to-[#28A745]">Tests</span>
                </h1>
                {studentClass && (
                  <p className="text-sm text-gray-500 mt-2">
                    Showing tests for <strong>{studentClass}</strong> class
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                {!isLoggedIn ? (
                  <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-2">
                    <p className="text-yellow-700 text-xs font-semibold uppercase tracking-wider">Login to attempt</p>
                  </div>
                ) : !studentClass ? (
                  <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-4 py-2">
                    <p className="text-orange-700 text-xs font-semibold uppercase tracking-wider">Complete your profile (Class missing)</p>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-2">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                    <p className="text-green-700 text-xs font-semibold uppercase tracking-wider">Ready to Test</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="bg-white border-b border-gray-100 shadow-sm relative z-20">
          <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 divide-x-0 md:divide-x divide-gray-100">
            {[
              { label: 'Total Tests', value: tests.length, color: '#ba9d25' },
              { label: 'Total Questions', value: totalQuestions, color: '#0078FF' },
              { label: 'Total Duration', value: `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`, color: '#28A745' },
              { label: 'Completed', value: completedCount, color: '#F1C40F' },
            ].map((s, i) => (
              <div key={i} className="text-center py-2 px-4 transition-transform hover:scale-105">
                <div className="text-2xl md:text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Grid */}
        <div className="bg-line-grid py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {tests.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">
                  {isLoggedIn && !studentClass
                    ? 'Please complete your profile (set your class) to see available tests.'
                    : isLoggedIn && studentClass
                    ? `No tests available for class ${studentClass} at the moment.`
                    : 'No tests available at the moment. Check back later.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {tests.map((test, i) => {
                  const isWide = i % 5 === 0;
                  const accentRed = i % 2 === 0;
                  return (
                    <div
                      key={test.id}
                      className={`rounded-2xl overflow-hidden border transition-all duration-200 flex flex-col ${
                        isWide ? 'md:col-span-7' : 'md:col-span-5'
                      } bg-white border-gray-100 hover:border-gray-200 hover:shadow-md ${
                        test.isCompleted ? 'opacity-80' : ''
                      }`}
                    >
                      <div className={`h-1.5 w-full ${accentRed ? 'bg-[#ba9d25]' : 'bg-[#0078FF]'}`}></div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${getDifficultyColor(test.difficulty)}`}>
                              {test.difficulty}
                            </span>
                            <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500">
                              {test.category}
                            </span>
                          </div>
                          {test.isCompleted && (
                            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-200 flex-shrink-0">
                              ✓ Completed
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold mb-2 leading-snug text-gray-900">{test.title}</h3>
                        <p className="text-sm mb-5 line-clamp-2 leading-relaxed flex-1 text-gray-500">{test.description}</p>
                        <div className="grid grid-cols-2 gap-2 mb-5 text-xs text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {test.duration} min
                          </div>
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                            </svg>
                            {test.totalQuestions} Qs
                          </div>
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            {test.totalMarks} Marks
                          </div>
                          {test.isCompleted && test.completedResult && (
                            <div className="flex items-center gap-1.5 text-green-600 font-semibold col-span-2">
                              Score: {test.completedResult.percentage || 0}%
                            </div>
                          )}
                        </div>
                        {test.isCompleted ? (
                          <button
                            onClick={() => handleViewResult(test)}
                            className="w-full py-2.5 rounded-xl font-semibold text-sm border-2 border-green-500 text-green-600 hover:bg-green-50 transition"
                          >
                            View Result →
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartTest(test)}
                            disabled={!isLoggedIn || !studentClass}
                            className={`w-full py-2.5 rounded-xl font-semibold text-sm transition ${
                              !isLoggedIn || !studentClass
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : accentRed
                                ? 'bg-[#ba9d25] text-white hover:opacity-90'
                                : 'bg-[#0078FF] text-white hover:opacity-90'
                            }`}
                          >
                            {!isLoggedIn ? 'Login to Start' : !studentClass ? 'Set your class first' : 'Start Test →'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Result Modal */}
        {showResultModal && viewingResult && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowResultModal(false)}>
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="bg-white p-6 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-[#0078FF] uppercase tracking-widest mb-1">Result</p>
                    <h2 className="text-xl font-bold text-gray-900">Test Completed</h2>
                    <p className="text-gray-500 text-sm mt-0.5">{viewingResult.testTitle}</p>
                  </div>
                  <button onClick={() => setShowResultModal(false)} className="text-gray-400 hover:text-gray-700 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 text-center">
                <div className="text-5xl font-bold text-[#ba9d25] mb-1">{viewingResult.percentage || viewingResult.score || 0}%</div>
                <p className="text-sm text-gray-500 mb-6">
                  {(viewingResult.percentage || 0) >= 70 ? 'Great job! You passed.' : 'Keep practicing to improve.'}
                </p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-5 text-sm text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Obtained Marks</span>
                    <span className="font-semibold text-gray-800">{viewingResult.obtainedMarks || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Marks</span>
                    <span className="font-semibold text-gray-800">{viewingResult.totalMarks || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Completed On</span>
                    <span className="font-semibold text-gray-800">
                      {viewingResult.completedAt ? new Date(viewingResult.completedAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  {viewingResult.isEligible && (
                    <div className="pt-2 border-t border-gray-200">
                      <span className="text-green-600 text-xs font-semibold">✓ Eligible for certification</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowResultModal(false)}
                  className="w-full py-2.5 bg-[#0078FF] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----- TEST TAKING VIEW -----
  if (testStarted && !testCompleted) {
    if (loading) {
      return (
        <div className="min-h-screen bg-dot-grid flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-3 border-gray-200 border-t-[#0078FF] animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-gray-500">Loading test questions...</p>
          </div>
        </div>
      );
    }

    const currentQ = questions[currentQuestion];
    const isLastQuestion = currentQuestion === questions.length - 1;
    const hasAnswered = answers[currentQ?.id] !== undefined;
    const progress = getProgressPercentage();

    if (!currentQ || questions.length === 0) {
      return (
        <div className="min-h-screen bg-dot-grid flex items-center justify-center p-4">
          <div className="text-center max-w-sm bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#ba9d25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-700 font-semibold mb-1">No Questions Found</p>
            <p className="text-sm text-gray-400 mb-5">This test has no questions available.</p>
            <button onClick={handleBackToTests} className="px-5 py-2 bg-[#0078FF] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition">
              Back to Tests
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="font-bold text-gray-900 text-sm">{selectedTest.title}</p>
                <p className="text-xs text-gray-400">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {timeRemaining !== null && (
                  <div
                    className={`px-3 py-1.5 rounded-lg font-mono font-bold text-sm tabular-nums ${
                      timeRemaining < 300
                        ? 'bg-yellow-50 text-[#ba9d25] border border-yellow-200'
                        : 'bg-blue-50 text-[#0078FF] border border-blue-100'
                    }`}
                  >
                    {formatTime(timeRemaining)}
                  </div>
                )}
                <button
                  onClick={handleBackToTests}
                  disabled={isExitBlocked}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                    isExitBlocked
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70'
                      : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  title={isExitBlocked ? "You cannot exit the test after 10 minutes" : "Exit Test"}
                >
                  ✕ Exit
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Navigation</span>
                  <span>
                    {currentQuestion + 1}/{questions.length}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0078FF] rounded-full transition-all"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Answered</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#08B100] rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <span className="text-xs font-bold text-[#0078FF] bg-blue-50 border border-blue-100 px-3 py-1 rounded-lg">
                    Q{currentQuestion + 1}
                  </span>
                  <span className="text-xs text-gray-400">
                    {currentQ.marks} mark{currentQ.marks > 1 ? 's' : ''}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-6 leading-relaxed">
                  {currentQ.text}
                </h3>
                <div className="space-y-2.5">
                  {currentQ.options.map((option, idx) => (
                    <label
                      key={idx}
                      className={`flex items-start p-3.5 border-2 rounded-xl cursor-pointer transition-all ${
                        answers[currentQ.id] === idx
                          ? 'border-[#0078FF] bg-blue-50'
                          : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQ.id}`}
                        value={idx}
                        checked={answers[currentQ.id] === idx}
                        onChange={() => handleAnswerSelect(currentQ.id, idx)}
                        className="w-4 h-4 text-[#0078FF] focus:ring-[#0078FF] mt-0.5 accent-[#0078FF]"
                      />
                      <span className="ml-3 text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-between gap-3 mt-7">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition ${
                      currentQuestion === 0
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={!hasAnswered || submitting}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition ${
                      !hasAnswered || submitting
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        : 'bg-[#ba9d25] text-white hover:opacity-90'
                    }`}
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : isLastQuestion ? (
                      '✓ Submit Test'
                    ) : (
                      'Next →'
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sticky top-28">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Question Palette</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {questions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestion(idx)}
                      className={`w-9 h-9 rounded-lg font-semibold text-xs transition ${
                        currentQuestion === idx
                          ? 'bg-[#0078FF] text-white shadow-sm'
                          : answers[q.id] !== undefined
                          ? 'bg-[#08B100] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <div className="space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-[#08B100]"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-[#0078FF]"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gray-200"></div>
                    <span>Not Answered</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                  {Object.keys(answers).length} of {questions.length} answered
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----- RESULTS VIEW (after completion) -----
  if (testCompleted) {
    const percentage = Math.round(scoreDetails?.percentage || 0);
    const obtainedMarks = scoreDetails?.obtainedMarks || 0;
    const totalPossibleMarks = scoreDetails?.totalMarks || questions.reduce((sum, q) => sum + q.marks, 0);
    const eligibilityStatus = scoreDetails?.isEligible;
    let resultLabel = '',
      resultAccent = '';
    if (percentage >= 80) {
      resultLabel = 'Excellent!';
      resultAccent = 'text-[#08B100]';
    } else if (percentage >= 60) {
      resultLabel = 'Good Job!';
      resultAccent = 'text-[#0078FF]';
    } else if (percentage >= 40) {
      resultLabel = 'Keep Practicing!';
      resultAccent = 'text-yellow-500';
    } else {
      resultLabel = 'Need Improvement';
      resultAccent = 'text-[#ba9d25]';
    }

    return (
      <div className="min-h-screen bg-dot-grid flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-white px-8 py-7 text-center border-b border-gray-100">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#0078FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs font-bold text-[#0078FF] uppercase tracking-widest mb-1">Test Complete</p>
            <h2 className="text-xl font-bold text-gray-900">{selectedTest.title}</h2>
          </div>
          <div className="p-8 text-center">
            <div className={`text-6xl font-bold mb-1 ${resultAccent}`}>{percentage}%</div>
            <p className={`text-base font-semibold mb-6 ${resultAccent}`}>{resultLabel}</p>
            {eligibilityStatus !== undefined && (
              <div
                className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${
                  eligibilityStatus
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                }`}
              >
                {eligibilityStatus
                  ? '✓ You are eligible for certification.'
                  : 'Score 70%+ to become eligible for certification.'}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 mb-7">
              {[
                { label: 'Total Questions', value: questions.length, color: 'text-[#0078FF]' },
                { label: 'Attempted', value: Object.keys(answers).length, color: 'text-[#ba9d25]' },
                { label: 'Score Obtained', value: obtainedMarks, color: 'text-[#08B100]' },
                { label: 'Total Marks', value: totalPossibleMarks, color: 'text-gray-700' },
              ].map((s, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
            <button
              onClick={handleBackToTests}
              className="w-full py-3 bg-[#0078FF] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition"
            >
              Take Another Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StudentTestPanel;   