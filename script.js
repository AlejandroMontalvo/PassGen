window.onload = function () {
  // Main variables
  const passwordInput = document.getElementById("password_input"),
    passwordGenerateButton = document.getElementById("password_button"),
    settingsButton = document.getElementById("settings_button");

  // Settings variables
  const passwordLength = document.getElementById("password_length"),
    includeLowercaseLetters = document.getElementById(
      "include_lowercase_letters"
    ),
    includeUppercaseLetters = document.getElementById(
      "include_uppercase_letters"
    ),
    includeNumbers = document.getElementById("include_numbers"),
    includeSymbols = document.getElementById("include_symbols"),
    excludeSimilarCharacters = document.getElementById(
      "exclude_similar_characters"
    ),
    includeSpecificCharacters = document.getElementById(
      "include_specific_characters"
    ),
    excludeSpecificCharacters = document.getElementById(
      "exclude_specific_characters"
    ),
    saveSettings = document.getElementById("save_settings");

  let settingsArray = [
    passwordLength, //0
    includeLowercaseLetters, //1
    includeUppercaseLetters, //2
    includeNumbers, //3
    includeSymbols, //4
    excludeSimilarCharacters, //5
    includeSpecificCharacters, //6
    excludeSpecificCharacters, //7
    saveSettings, //8
  ];

  passwordInput.value = generatePassword(settingsArray);

  passwordGenerateButton.addEventListener("click", function () {
    passwordInput.value = generatePassword(settingsArray);
  });

  // Add click event listener to password input
  passwordInput.addEventListener("click", function () {
    copyPasswordToClipboard();
  });

  // Function to copy password to clipboard
  let copiedPopup = document.getElementById("copied_popup");

  passwordInput.addEventListener("click", function (event) {
    if (passwordInput.value) {
      navigator.clipboard.writeText(passwordInput.value);
      // Calculate the position based on the mouse coordinates
      let mouseX = event.clientX;
      let mouseY = event.clientY;

      // Set the position of the copied popup
      copiedPopup.style.left = mouseX + 15 + "px"; // Adjust the offset as needed
      copiedPopup.style.top = mouseY + -25 + "px";

      copiedPopup.style.display = "block";
      copiedPopup.addEventListener(
        "animationend",
        function () {
          copiedPopup.style.display = "none";
        },
        { once: true }
      ); // Ensure the event listener only runs once
    }
  });

  // Settings button logic
  let settingsToggle = false;
  settingsButton.addEventListener("click", function () {
    if (settingsToggle == false) {
      settingsToggle = true;
      document.getElementById("settings_container").style.height = "20rem";
    } else {
      settingsToggle = false;
      document.getElementById("settings_container").style.height = "0rem";
    }
  });

  // If enabled, save settings to local storage before page/browser close
  window.addEventListener(
    "beforeunload",
    function () {
      if (saveSettings.checked) {
        setSettings(settingsArray);
      } else {
        localStorage.clear();
      }
    },
    false
  );

  // If local storage has data, get saved settings, else fall back to defualt settings
  if (localStorage.length > 0) {
    getSettings(settingsArray);
  } else {
    setDefaultSettings(settingsArray);
  }
};

// Determine which characters are available for generation based on user settings
function generateCharacterString(settingsArray) {
  let generatedString = "";

  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz",
    uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers = "1234567890",
    symbols = "!@#$%",
    similarCharactersArray = ["1", "i", "l", "5", "S", "8", "B", "o", "O", "0"];

  if (settingsArray[1].checked) {
    generatedString += lowercaseLetters;
  }

  if (settingsArray[2].checked) {
    generatedString += uppercaseLetters;
  }

  if (settingsArray[3].checked) {
    generatedString += numbers;
  }

  if (settingsArray[4].checked) {
    generatedString += symbols;
  }

  if (settingsArray[5].checked) {
    for (var i = 0; i < similarCharactersArray.length; i++) {
      generatedString = generatedString.replace(similarCharactersArray[i], "");
    }
  }

  if (settingsArray[6].value) {
    let includeCharactersArray = settingsArray[6].value.split(" ");
    for (var i = 0; i < includeCharactersArray.length; i++) {
      generatedString += includeCharactersArray[i];
    }
  }

  if (settingsArray[7].value) {
    let excludeCharactersArray = settingsArray[7].value.split(" ");
    for (var i = 0; i < excludeCharactersArray.length; i++) {
      generatedString = generatedString.replace(excludeCharactersArray[i], "");
    }
  }

  return generatedString;
}

function generatePassword(settingsArray) {
  let passwordCharacters = generateCharacterString(settingsArray),
    generatedPassword = "";

  for (let i = 0; i < settingsArray[0].value; ++i) {
    generatedPassword += passwordCharacters.charAt(
      Math.random() * passwordCharacters.length
    );
  }

  if (settingsArray[6].value) {
    let includeCharactersArray = settingsArray[6].value.split(" ");
    let generatedPasswordArray = generatedPassword.split("");
    let previousArrayPosition = [];

    for (let i = 0; i < includeCharactersArray.length; i++) {
      let randomArrayPosition = Math.floor(
        Math.random() * generatedPasswordArray.length
      );

      if (previousArrayPosition.includes(randomArrayPosition)) {
        for (let j = 0; j < generatedPasswordArray.length; j++) {
          if (!previousArrayPosition.includes(j)) {
            randomArrayPosition = j;
          }
        }
      }
      generatedPassword = generatedPassword.replace(
        generatedPasswordArray[randomArrayPosition],
        includeCharactersArray[i].toString()
      );
      previousArrayPosition.push(randomArrayPosition);
    }
  }

  return generatedPassword;
}

function setSettings(settingsArray) {
  localStorage.setItem("passwordLength", settingsArray[0].value);
  localStorage.setItem("includeLowercaseLetters", settingsArray[1].checked);
  localStorage.setItem("includeUppercaseLetters", settingsArray[2].checked);
  localStorage.setItem("includeNumbers", settingsArray[3].checked);
  localStorage.setItem("includeSymbols", settingsArray[4].checked);
  localStorage.setItem("excludeSimilarCharacters", settingsArray[5].checked);
  localStorage.setItem("includeSpecificCharacters", settingsArray[6].value);
  localStorage.setItem("excludeSpecificCharacters", settingsArray[7].value);
  localStorage.setItem("saveSettings", settingsArray[8].checked);
}

function getSettings(settingsArray) {
  settingsArray[0].value = localStorage.getItem("passwordLength");
  settingsArray[1].checked =
    localStorage.getItem("includeLowercaseLetters") === "true";
  settingsArray[2].checked =
    localStorage.getItem("includeUppercaseLetters") === "true";
  settingsArray[3].checked = localStorage.getItem("includeNumbers") === "true";
  settingsArray[4].checked = localStorage.getItem("includeSymbols") === "true";
  settingsArray[5].checked =
    localStorage.getItem("excludeSimilarCharacters") === "true";
  settingsArray[6].value = localStorage.getItem("includeSpecificCharacters");
  settingsArray[7].value = localStorage.getItem("excludeSpecificCharacters");
  settingsArray[8].checked = localStorage.getItem("saveSettings") === "true";
}

function setDefaultSettings(settingsArray) {
  settingsArray[0].value = 16;
  settingsArray[1].checked = true;
  settingsArray[2].checked = true;
  settingsArray[3].checked = true;
  settingsArray[4].checked = true;
  settingsArray[5].checked = false;
  settingsArray[6].value = "";
  settingsArray[7].value = "";
  settingsArray[8].checked = false;
}
