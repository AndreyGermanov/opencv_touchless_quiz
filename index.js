let score = 0;
let currentQuestion = 0;

document.addEventListener("DOMContentLoaded", async() => {
    let fingers = null;
    renderQuestion(currentQuestion);
    const img = document.querySelector("img");
    // Request current video frame from web camera and number of fingers
    // on it from backend
    while (true) {
        const response = await fetch("/frame");
        const json = await response.json();
        // Set returned Data URL of current frame as a source of image
        img.src = json.frame;
        // Get number of fingers
        let value = parseInt(json.fingers);
        if (isNaN(value) || value - 1 == fingers) {
            continue;
        }
        // Convert number of fingers to the answer number
        value = value - 1;
        fingers = value;
        // If user showed 0 fingers
        if (value ==  -1) {
            // Submit current question
            document.querySelector("button").click();
            continue
        }
        // Otherwise, check answer option that matches
        // number of showed fingers
        const elem = document.getElementById("option"+value);
        if (elem) {
            elem.checked = true;
        }
    }
})

// Function renders HTML of a quiz question
// with specified number
function renderQuestion(num) {
    const q = quiz[num];
    const form = document.querySelector("form");
    form.innerHTML = "";
    const fieldset = document.createElement("fieldset");
    form.appendChild(fieldset)
    document.querySelector("h2").innerText = "Question "+(num+1)+" of "+quiz.length
    document.querySelector(".question").innerText = q.question
    q.answers.forEach((answer,key) => renderAnswer(fieldset,answer,key));
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.innerText = "Submit";
    button.onclick = submit;
    form.appendChild(button);
}

// Function renders answer option and appends
// it to the form
function renderAnswer(fieldset,answer,key) {
    const input = document.createElement("input");
    input.setAttribute("type","radio");
    input.setAttribute("id","option"+key);
    input.setAttribute("name","option");
    input.setAttribute('value',key);
    const label = document.createElement("label");
    label.setAttribute("for","option"+key);
    label.innerText = answer;
    const div = document.createElement("div");
    fieldset.appendChild(div);
    div.appendChild(input);
    div.appendChild(label);
}

// "Submit" button handler
// Checks if answer is correct and moves
// to the next question or shows final score
function submit() {
    const elem = document.querySelector("input:checked");
    if (!elem) {
        return
    }
    const value = parseInt(elem.value);
    if (isNaN(value) || value < 0) {
        return
    }
    if (value == quiz[currentQuestion].correct) {
        score += 1;
    }
    if (currentQuestion >= quiz.length-1) {
        renderScore();
        return
    }
    renderQuestion(++currentQuestion);
}

// Renders HTML for final score
function renderScore() {
    const form = document.querySelector("form");
    form.innerHTML = "";
    document.querySelector(".question").innerText = "";
    document.querySelector("h2").innerText = "Your score: "+score+" from "+quiz.length;
}

// Async version of the setTimeout function
function timeout(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
}

// Quiz questions and answers definition
// Original: https://www.proprofs.com/quiz-school/story.php?title=mtg4nzgynw9dln
const quiz = [
    {
        question: "What does the import cv2 statement do?",
        answers: [
            "Imports the SciPy library for numerical processing.",
            "Imports the NumPy library for numerical processing.",
            "Imports our OpenCV Python bindings.",
            "Displays an image to our screen."
        ],
        correct: 2
    },
    {
        question: "Given the following NumPy array shape, how would we interpret the width, height, and number of channels in the image: (400, 600, 3)?",
        answers: [
            "Width=600, height=400, channels=3",
            "Width=600, height=3, channels=400",
            "Width=400, height=600, channels=3",
            "width=3, width=600, channels=400"
        ],
        correct: 0
    },
    {
        question: "Suppose our image has a width of 700 pixels, a height of 550 pixels, and 3 channels, one for each Red, Green, and Blue component. How would we express this image as a NumPy array shape?",
        answers: [
            "(550, 700, 3)",
            "(3, 550, 700)",
            "(700, 550, 3)",
            "(3, 700, 550)"
        ],
        correct: 0
    },
    {
        question: "We have an image that is 393 pixels wide and 312 tall. How many total pixels are in the image?",
        answers: [
            "367848",
            "122616",
            "280800",
            "93600"
        ],
        correct: 1
    },
    {
        question: "OpenCV stores RGB pixels in what order?",
        answers: [
            "GBR",
            "RGB",
            "BRG",
            "BGR"
        ],
        correct: 3
    },
    {
        question: "The RGB tuple (255, 0, 0) codes for red. But OpenCV would actually interpret this color as:",
        answers: [
            "Orange",
            "Blue",
            "Green",
            "Yellow"
        ],
        correct: 1
    },
    {
        question: "What is the correct line of code that defines a translation matrix that shifts an image 10 pixels up and 20 pixels to the right?",
        answers: [
            "M = np.float32([[1, 0, -20], [0, 1, 10]])",
            "M = np.float32([[1, 0, 20], [0, 1, -10]])",
            "M = np.float32([[1, 0, -10], [0, 1, 20]])",
            "M = np.float32([[1, 0, 10], [0, 1, -20]])"
        ],
        correct: 1
    },
    {
        question: "What is the correct line of code that defines a translation matrix that shifts an image 30 pixels down and 180 pixels to the left?",
        answers: [
            "M = np.float32([[1, 0, -180], [0, 1, -30]])",
            "M = np.float32([[1, 0, -180], [0, 1, 30]])",
            "M = np.float32([[1, 0, 30], [0, 1, 180]])",
            "M = np.float32([[1, 0, -30], [0, 1, -180]])"
        ],
        correct: 1
    },
    {
        question: "I want to extract a rectangular region from my image starting at x=9, y=47 and ending at x=97, y=96. What is the correct line of code to perform this cropping?",
        answers: [
            "Crop = image[9:97, 47:96]",
            "Crop = image[47:96, 9:97]",
            "Crop = image[9:47, 97:96]",
            "Crop = image[97:96, 9:47]"
        ],
        correct: 1
    },
    {
        question: "Now, suppose I want to extract a second rectangular region from my image starting at x=1, y=48 and ending at x=80, y=69. What is the correct line of code to perform this cropping?",
        answers: [
            "Crop = image[80:69, 1:48]",
            "Crop = image[1:48, 80:69]",
            "Crop = image[48:80, 48:69]",
            "Crop = image[48:69, 1:80]"
        ],
        correct: 3
    }
]
