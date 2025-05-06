document.addEventListener("DOMContentLoaded", function () {
    // elements from DOM
    const temporaryone = document.getElementById("temporaryone");
    const temporarytwo = document.querySelector(".temporarytwo");
    const temporarythree = document.querySelectorAll(".temporarythree");

    // add an event listener to a button
    if (temporaryone) {
        temporaryone.addEventListener("click", function () {
            alert("Button clicked!");
        });
    }

    // change text
    if (temporarytwo) {
        temporarytwo.textContent = "This text was updated by JavaScript!";
    }

    // loop through elements & apply style
    temporarythree.forEach(function (element) {
        element.style.color = "blue";
    });

    // example function
    function temporaryFunction() {
        console.log("This is a temporary function.");
    }

    // call function
    temporaryFunction();
});