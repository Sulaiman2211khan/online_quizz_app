/* Author: Muhammad Sulaiman */
// Importing necessary dependencies and styles
import "./style.css";
import React, { useEffect, useState } from "react";

// Quizz component
const Quizz = () => {
  // State variables
  const [showTimeRemaining, setShowTimeRemaining] = useState(false); // To show the time remaining
  const [buttonText, setButtonText] = useState("Start Quiz"); // Text for the start/reset button
  const [timeRemaining, setTimeRemaining] = useState(60); // Time remaining in seconds
  const [intervalId, setIntervalId] = useState(null); // Interval ID for the timer
  const [num1, setNum1] = useState(); // First random number
  const [num2, setNum2] = useState(); // Second random number
  const [sign, setSign] = useState(); // Mathematical sign (+)
  const [options, setOptions] = useState([]); // Answer options
  const [buttonValues, setButtonValues] = useState(["", "", "", ""]); // Values for the answer buttons
  const [marks, setMarks] = useState(); // Number of correct answers
  const [selectedOption, setSelectedOption] = useState(""); // Selected answer option
  const [msg, setMsg] = useState(""); // Message for correct/wrong answer
  const [msgVisibility, setMsgVisibility] = useState(false); // Visibility of the message
  const [quizOver, setQuizOver] = useState(false); // Flag to indicate if the quiz is over
  const [count, setCount] = useState(null); // Total number of questions

  // Function to handle the start/reset button click
  const handleStartQuizClick = () => {
    if (showTimeRemaining) {
      // If the quiz is already running, reset it
      clearInterval(intervalId); // Clear the timer interval
      setMarks(null); // Reset the marks
      resetQuiz(); // Reset the quiz
    } else if (quizOver) {
      // If the quiz is over, reset it
      setQuizOver(false); // Reset the quiz over flag
      setMarks(null); // Reset the marks
    } else {
      // Otherwise, start the quiz
      startQuiz();
    }
  };

  // Function to start the quiz
  const startQuiz = () => {
    setShowTimeRemaining(true); // Show the time remaining
    setButtonText("Reset"); // Change the button text to "Reset"
    generateRandomNumbers(); // Generate random numbers
    startTimer(); // Start the timer
  };

  // Function to reset the quiz
  const resetQuiz = () => {
    setShowTimeRemaining(false); // Hide the time remaining
    setButtonText("Start Quiz"); // Change the button text to "Start Quiz"
    setNum1(""); // Reset the first number
    setNum2(""); // Reset the second number
    setSign(""); // Reset the sign
    setButtonValues(["", "", "", ""]); // Reset the answer button values
    setTimeRemaining(60); // Reset the time remaining
    setQuizOver(false); // Reset the quiz over flag
    setMsgVisibility(false); // Hide the message
  };

  // Function to start the timer
  const startTimer = () => {
    const id = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime === 0) {
          // If time is up
          clearInterval(id); // Clear the interval
          setShowTimeRemaining(false); // Hide the time remaining
          setButtonText("Start Quiz"); // Change the button text to "Start Quiz"
          resetQuiz(); // Reset the quiz
          setQuizOver(true); // Set the quiz over flag
          return 60; // Reset the time remaining to 60 seconds
        } else {
          return prevTime - 1; // Decrement the time remaining by 1 second
        }
      });
    }, 1000);
    setIntervalId(id); // Store the interval ID
  };

  // Function to generate random numbers
  const generateRandomNumbers = () => {
    const randomNum1 = Math.floor(Math.random() * 10) + 1; // Generate a random number between 1 and 10
    const randomNum2 = Math.floor(Math.random() * 10) + 1; // Generate a random number between 1 and 10
    setNum1(randomNum1); // Set the first number
    setNum2(randomNum2); // Set the second number
    setSign("+"); // Set the mathematical sign to "+"
    const sumOfTwoNumbers = randomNum1 + randomNum2; // Calculate the correct answer
    const wrongOptions = generateWrongOptions(sumOfTwoNumbers); // Generate wrong options
    const correctAnswer = sumOfTwoNumbers.toString(); // Convert the correct answer to a string
    const answerOptions = [correctAnswer, ...wrongOptions]; // Combine the correct answer and wrong options
    shuffleOptions(answerOptions); // Shuffle the answer options randomly
    setButtonValues(answerOptions); // Set the answer button values
  };

  // Function to generate wrong options
  const generateWrongOptions = (correctAnswer) => {
    const wrongOptions = [];
    while (wrongOptions.length < 3) {
      const randomWrongOption = Math.floor(Math.random() * 60) + 1; // Generate a random number between 1 and 60
      if (
        wrongOptions.indexOf(randomWrongOption) === -1 && // Check if the wrong option is not already in the array
        randomWrongOption !== correctAnswer // Check if the wrong option is not the correct answer
      ) {
        wrongOptions.push(randomWrongOption); // Add the wrong option to the array
      }
    }
    return wrongOptions;
  };

  // Function to shuffle answer options randomly
  const shuffleOptions = (optionsArray) => {
    const shuffledOptions = optionsArray.sort(() => Math.random() - 0.5); // Shuffle the options array randomly
    setOptions(shuffledOptions); // Set the shuffled options
  };

  // Function to handle option button clicks
  const handleOptionClick = (option) => {
    if (showTimeRemaining) {
      setSelectedOption(option); // Store the selected option
      if (option == num1 + num2) {
        // If the selected option is correct
        setMarks((prevMarks) => (prevMarks || 0) + 1); // Increment the marks by 1
        setMsg("Correct Answer"); // Set the message to "Correct Answer"
        setCount(count + 1); // Increment the count by 1
      } else {
        // If the selected option is wrong
        setCount(count + 1); // Increment the count by 1
        setMsg("Wrong! Try again"); // Set the message to "Wrong! Try again"
      }
      setMsgVisibility(true); // Show the message
      generateRandomNumbers(); // Generate new numbers after every choice click
      setTimeout(() => {
        setMsgVisibility(false); // Hide the message after 1 second
      }, 1000);
    }
  };

  // Cleanup function to clear the interval when the component unmounts
  useEffect(() => {
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]);

  // JSX code for the Quizz component
  return (
    <>
      <div id="main">
        <div>
          <button id="marks">Marks: {marks}</button>
          <div
            id="msg"
            style={{
              display: msgVisibility ? "block" : "none",
              color: "black",
              background: msg === "Correct Answer" ? "lightgreen" : "darkred",
            }}
          >
            {msg}
          </div>
          <div id="question">
            {num1 !== undefined && num2 !== undefined && `${num1} ${sign} ${num2}`}
          </div>
          <div id="text">Click the correct answer from the choices below</div>
          <div id="buttonchoices">
            {buttonValues.map((value, index) => (
              <button key={index} onClick={() => handleOptionClick(value)}>
                {value}
              </button>
            ))}
          </div>
          <div id="reset_time">
            <button onClick={handleStartQuizClick}>{buttonText}</button>
            {showTimeRemaining && (
              <div id="time_remaining">Time Remaining: {timeRemaining} Sec</div>
            )}
          </div>
        </div>
        {quizOver && (
          <div id="popup">
            QUIZ OVER <br />
            YOUR MARKS: {marks} / {count}
          </div>
        )}
      </div>
    </>
  );
};

export default Quizz;
