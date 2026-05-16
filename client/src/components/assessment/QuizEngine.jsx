import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Trophy, ArrowRight, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const QuizEngine = ({ lessonId, onComplete }) => {
    const { refreshUser } = useAuth();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [results, setResults] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/quizzes/${lessonId}`);
                if (res.data.success) {
                    setQuiz(res.data.data);
                    // Initialize empty answers array
                    const initialAnswers = {};
                    res.data.data.questions.forEach((_, idx) => {
                        initialAnswers[idx] = null;
                    });
                    setSelectedAnswers(initialAnswers);
                }
            } catch (err) {
                console.error('Failed to load quiz:', err);
                setError(err.response?.data?.message || 'Quiz not found for this lesson.');
            } finally {
                setLoading(false);
            }
        };

        if (lessonId) fetchQuiz();
    }, [lessonId]);

    const handleOptionSelect = (idx) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestionIdx]: idx
        }));
    };

    const handleNext = () => {
        if (currentQuestionIdx < quiz.questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIdx > 0) {
            setCurrentQuestionIdx(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        // Ensure all questions are answered
        const answersArray = Object.values(selectedAnswers);
        if (answersArray.some(val => val === null)) {
            toast.error('Please answer all questions before submitting.');
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await api.post(`/quizzes/${lessonId}/submit`, { answers: answersArray });
            
            if (res.data.success) {
                const quizResults = res.data.data;
                setResults(quizResults);
                
                if (quizResults.passed) {
                    toast.success(`Quiz Passed! +${quizResults.xpAwarded} XP`);
                    refreshUser(); // Update global XP
                    if (onComplete) onComplete(); // Tell CoursePlayer to unlock next
                } else {
                    toast.error(`You scored ${quizResults.score.toFixed(0)}%. Passing is ${quiz.passingScore}%. Try again!`);
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit quiz.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetQuiz = () => {
        const initialAnswers = {};
        quiz.questions.forEach((_, idx) => {
            initialAnswers[idx] = null;
        });
        setSelectedAnswers(initialAnswers);
        setCurrentQuestionIdx(0);
        setResults(null);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p>Loading assessment...</p>
            </div>
        );
    }

    if (error || !quiz) {
        return (
            <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-2xl">
                <XCircle className="mx-auto text-red-500 mb-4" size={32} />
                <p className="text-red-400">{error || 'Unable to load quiz.'}</p>
            </div>
        );
    }

    // ─── Results View ────────────────────────────────────────────────────────
    if (results) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
            >
                <div className="text-center mb-8">
                    {results.passed ? (
                        <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy size={40} />
                        </div>
                    ) : (
                        <div className="w-20 h-20 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <XCircle size={40} />
                        </div>
                    )}
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {results.passed ? 'Quiz Passed!' : 'Quiz Failed'}
                    </h2>
                    <p className="text-gray-400">
                        You scored <span className={`font-bold ${results.passed ? 'text-green-400' : 'text-red-400'}`}>{results.score.toFixed(0)}%</span> 
                        {' '}({results.correctCount} / {results.totalQuestions} correct)
                    </p>
                    {results.passed && results.xpAwarded > 0 && (
                        <p className="text-teal-400 mt-2 flex items-center justify-center gap-2 font-bold">
                            <Sparkles size={16} /> +{results.xpAwarded} XP Earned
                        </p>
                    )}
                </div>

                <div className="space-y-4 mb-8">
                    {results.results.map((res, i) => (
                        <div key={res.questionId} className={`p-4 rounded-xl border ${res.isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                            <p className="text-white font-medium mb-2">
                                {i + 1}. {quiz.questions[i].questionText}
                            </p>
                            <div className="flex items-start gap-2">
                                {res.isCorrect ? <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={16}/> : <XCircle className="text-red-500 shrink-0 mt-0.5" size={16}/>}
                                <span className={res.isCorrect ? 'text-green-200 text-sm' : 'text-red-200 text-sm'}>
                                    Your Answer: {quiz.questions[i].options[selectedAnswers[i]]}
                                </span>
                            </div>
                            {!res.isCorrect && res.explanation && (
                                <div className="mt-3 text-sm text-gray-400 bg-black/20 p-3 rounded-lg">
                                    <span className="font-bold text-gray-300">Explanation: </span> {res.explanation}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-center">
                    {!results.passed && (
                        <button 
                            onClick={resetQuiz}
                            className="px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition-all"
                        >
                            Retry Quiz
                        </button>
                    )}
                </div>
            </motion.div>
        );
    }

    // ─── Quiz View ───────────────────────────────────────────────────────────
    const currentQ = quiz.questions[currentQuestionIdx];
    const hasAnsweredCurrent = selectedAnswers[currentQuestionIdx] !== null;
    const isLastQuestion = currentQuestionIdx === quiz.questions.length - 1;

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
            {/* Header */}
            <div className="bg-zinc-950 p-6 border-b border-zinc-800 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-white">{quiz.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">Passing Score: {quiz.passingScore}%</p>
                </div>
                <div className="text-right">
                    <div className="text-teal-400 font-bold flex items-center gap-1 justify-end">
                        <Sparkles size={16} /> {quiz.xpReward} XP
                    </div>
                    <p className="text-gray-500 text-sm">Question {currentQuestionIdx + 1} of {quiz.questions.length}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-zinc-800 w-full">
                <motion.div 
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIdx + (hasAnsweredCurrent ? 1 : 0)) / quiz.questions.length) * 100}%` }}
                />
            </div>

            {/* Question Box */}
            <div className="p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestionIdx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h4 className="text-2xl text-white font-medium mb-8 leading-relaxed">
                            {currentQ.questionText}
                        </h4>

                        <div className="space-y-3">
                            {currentQ.options.map((option, idx) => {
                                const isSelected = selectedAnswers[currentQuestionIdx] === idx;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(idx)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                                            isSelected 
                                                ? 'bg-violet-500/20 border-violet-500 text-white ring-1 ring-violet-500/50' 
                                                : 'bg-zinc-800/50 border-zinc-700 text-gray-300 hover:bg-zinc-800 hover:border-gray-500'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-violet-400' : 'border-gray-500'}`}>
                                                {isSelected && <div className="w-2.5 h-2.5 bg-violet-400 rounded-full" />}
                                            </div>
                                            <span className="text-base">{option}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Footer Controls */}
                <div className="mt-10 pt-6 border-t border-zinc-800 flex justify-between items-center">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestionIdx === 0}
                        className="px-6 py-2.5 rounded-xl border border-zinc-700 text-gray-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold"
                    >
                        Previous
                    </button>

                    {isLastQuestion ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!hasAnsweredCurrent || isSubmitting}
                            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Submit Quiz'}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={!hasAnsweredCurrent}
                            className="px-8 py-2.5 rounded-xl bg-white text-black hover:bg-gray-200 font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                        >
                            Next <ArrowRight size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizEngine;
