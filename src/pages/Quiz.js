import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, ListGroup, ProgressBar, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

const styles = {
    body: {
        margin: 0,
        padding: 0,
        height: '100vh',
        background: 'linear-gradient(to right, #007bff, #6c757d)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    },
    container: {
        color: '#333',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        border: 'none',
        borderRadius: '12px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        width: '100%',
        padding: '2rem'
    },
    cardHeader: {
        fontSize: '2rem',
        color: '#333',
        backgroundColor: '#f8f9fa',
        borderBottom: 'none'
    },
    cardBody: {
        padding: '2rem'
    },
    listGroupItem: {
        borderRadius: '8px',
        marginBottom: '0.5rem'
    },
    listGroupItemCorrect: {
        backgroundColor: 'green',
        color: 'white'
    },
    listGroupItemWrong: {
        backgroundColor: 'red',
        color: 'white'
    },
    progressBar: {
        marginTop: '1rem'
    },
    buttonPrimary: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        borderRadius: '8px',
        transition: 'background-color 0.3s, border-color 0.3s',
        marginRight: '0.5rem'
    },
    buttonSecondary: {
        borderRadius: '8px',
        transition: 'background-color 0.3s, border-color 0.3s'
    }
};

function Quiz(props) {
    const navigate = useNavigate();
    const triviaData = props.data || [];
    const [showResult, setShowResult] = useState(false);
    const [allPossibleAnswers, setAllPossibleAnswers] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answerCorrect, setAnswerCorrect] = useState(false);
    const [result, setResult] = useState({ correctAnswer: 0, wrongAnswer: 0, totalAnswer: 0 });
    const [timer, setTimer] = useState("01:00");
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const Ref = useRef(null);
    const [deadline, setDeadline] = useState(new Date(new Date().getTime() + 60000));

    useEffect(() => {
        if (triviaData.length > 0) {
            combineAllAnswers();
            if (!showResult) {
                if (Ref.current) clearInterval(Ref.current);
                setDeadline(new Date(new Date().getTime() + 60000));
                Ref.current = setInterval(() => startTimer(), 1000);
            }
        } else {
            navigate("/");
        }
        return () => {
            if (Ref.current) clearInterval(Ref.current);
        };
    }, [triviaData, showResult]);

    function combineAllAnswers() {
        let allAnswers = [];
        let correctAnswer = triviaData[currentQuestion]?.correct_answer;
        triviaData[currentQuestion]?.incorrect_answers.forEach((answer) => { allAnswers.push(answer) });
        allAnswers.push(correctAnswer);
        allAnswers.sort(() => Math.random() - 0.5);
        setAllPossibleAnswers(allAnswers);
    }

    function removeCharacters(question) {
        if (!question) return "";
        return question.replace(/(&quot\;)/g, "\"")
            .replace(/(&rsquo\;)/g, "\"")
            .replace(/(&#039\;)/g, "\'")
            .replace(/(&amp\;)/g, "&");
    }

    function clickAnswer(answer) {
        const correctAnswer = triviaData[currentQuestion]?.correct_answer;
        const isCorrect = answer === correctAnswer;
        setSelectedAnswer(answer);
        setAnswerCorrect(isCorrect);
        setResult(prevResult => ({
            correctAnswer: isCorrect ? prevResult.correctAnswer + 1 : prevResult.correctAnswer,
            wrongAnswer: !isCorrect ? prevResult.wrongAnswer + 1 : prevResult.wrongAnswer,
            totalAnswer: prevResult.totalAnswer + 1
        }));
        setTimeout(() => {
            if (currentQuestion < triviaData.length - 1) {
                setCurrentQuestion(prev => prev + 1);
                combineAllAnswers();
                setSelectedAnswer(null);
            } else {
                setShowResult(true);
            }
        }, 1000); // Delay for user to see result before moving to next question
    }

    const getTimeRemaining = () => {
        const total = deadline - new Date();
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return { total, minutes, seconds };
    }

    const startTimer = () => {
        const { total, minutes, seconds } = getTimeRemaining();
        if (total >= 0) {
            setTimer((minutes > 9 ? minutes : '0' + minutes) + ':' + (seconds > 9 ? seconds : '0' + seconds));
        } else {
            setShowResult(true);
            clearInterval(Ref.current);
        }
    }

    const getProgressBarNow = () => {
        const { total } = getTimeRemaining();
        return (total / 60000) * 100;
    }

    const handleRetry = () => {
        // Reset all states and restart quiz
        setCurrentQuestion(0);
        setResult({ correctAnswer: 0, wrongAnswer: 0, totalAnswer: 0 });
        setSelectedAnswer(null); // Ensure selectedAnswer is cleared
        setShowResult(false);
        combineAllAnswers();
        setDeadline(new Date(new Date().getTime() + 60000)); // Reset deadline
        if (Ref.current) clearInterval(Ref.current);
        Ref.current = setInterval(() => startTimer(), 1000);
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#007bff',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, log out!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                // Perform the logout action here
                navigate("/");
            }
        });
    };
    

    return (
        <div style={styles.body}>
            <Container style={styles.container}>
                {!showResult ? (
                    <>
                        <Card style={styles.card} className="text-center">
                            <Card.Header style={styles.cardHeader}>
                                <h1>Quiz App</h1>
                            </Card.Header>
                            <Card.Body style={styles.cardBody}>
                                <Card.Title>Question {currentQuestion + 1} / {triviaData.length}</Card.Title>
                                <Card.Text>
                                    {removeCharacters(triviaData[currentQuestion]?.question)}
                                </Card.Text>
                                <ListGroup>
                                    {allPossibleAnswers.map((answer, index) => (
                                        <ListGroup.Item
                                            key={index}
                                            action
                                            onClick={() => clickAnswer(answer)}
                                            style={{
                                                ...styles.listGroupItem,
                                                ...(selectedAnswer === answer && (answer === triviaData[currentQuestion]?.correct_answer ? styles.listGroupItemCorrect : styles.listGroupItemWrong))
                                            }}
                                        >
                                            {answer}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                                <ProgressBar now={getProgressBarNow()} style={styles.progressBar} className="mt-3" />
                                <div>Time remaining: {timer}</div>
                            </Card.Body>
                        </Card>
                    </>
                ) : (
                    <Card style={styles.card} className="text-center">
                        <Card.Header style={styles.cardHeader}>
                            <h1>Results</h1>
                        </Card.Header>
                        <Card.Body style={styles.cardBody}>
                            <Card.Text>
                                Total Answers: {result.totalAnswer}
                            </Card.Text>
                            <Card.Text>
                                Correct Answers: {result.correctAnswer}
                            </Card.Text>
                            <Card.Text>
                                Wrong Answers: {result.wrongAnswer}
                            </Card.Text>
                            <Button variant="primary" onClick={handleRetry} style={styles.buttonPrimary}>Retry Quiz</Button>
                            <Button variant="secondary" onClick={handleLogout} style={styles.buttonSecondary}>Logout</Button>
                        </Card.Body>
                    </Card>
                )}
            </Container>
        </div>
    );
}

export default Quiz;
