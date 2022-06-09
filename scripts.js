window.onload = function () {
  let passwordInput = document.getElementById("password_input"),
    passwordGenerateButton = document.getElementById("password_button"),
    passwordCopyButton = document.getElementById("password_copy"),
    autoSelectPassword = document.getElementById("select_password"),
    settingsButton = document.getElementById("settings_button");

  passwordGenerateButton.addEventListener("click", function () {
    passwordInput.value = generatePassword();
    if (autoSelectPassword.checked) {
      passwordInput.select();
    }
  });

  passwordCopyButton.addEventListener("click", function () {
    navigator.clipboard.writeText(passwordInput.value);
    if (passwordInput.value) {
      alert("Password Copied!");
    } else {
      alert("Generate a password first!");
    }
  });

  let settingsToggle = false;
  settingsButton.addEventListener("click", function () {
    if (settingsToggle == false) {
      settingsToggle = true;
      document.getElementById("settings_container").style.height = "20.5rem";
    } else {
      settingsToggle = false;
      document.getElementById("settings_container").style.height = "0rem";
    }
  });
};

function availablePasswordCharacters() {
  let selectedPasswordCharacters = "";

  let lowercaseLetters = "abcdefghijklmnopqrstuvwxyz",
    uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers = "1234567890",
    symbols = "!@#$%",
    similarCharactersArray = ["1", "i", "l", "5", "S", "8", "B", "o", "O", "0"];

  let includeLowercaseLetters = document.getElementById(
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
    );

  if (includeLowercaseLetters.checked) {
    selectedPasswordCharacters += lowercaseLetters;
  }

  if (includeUppercaseLetters.checked) {
    selectedPasswordCharacters += uppercaseLetters;
  }

  if (includeNumbers.checked) {
    selectedPasswordCharacters += numbers;
  }

  if (includeSymbols.checked) {
    selectedPasswordCharacters += symbols;
  }

  if (excludeSimilarCharacters.checked) {
    for (var i = 0; i < similarCharactersArray.length; i++) {
      selectedPasswordCharacters = selectedPasswordCharacters.replace(
        similarCharactersArray[i],
        ""
      );
    }
  }

  if (includeSpecificCharacters.value) {
    let includeCharactersArray = includeSpecificCharacters.value.split(" ");
    for (var i = 0; i < includeCharactersArray.length; i++) {
      selectedPasswordCharacters += includeCharactersArray[i];
    }
  }

  if (excludeSpecificCharacters.value) {
    let excludeCharactersArray = excludeSpecificCharacters.value.split(" ");
    for (var i = 0; i < excludeCharactersArray.length; i++) {
      selectedPasswordCharacters = selectedPasswordCharacters.replace(
        excludeCharactersArray[i],
        ""
      );
    }
  }

  return selectedPasswordCharacters;
}

function generatePassword() {
  let passwordLength = document.getElementById("password_length").value,
    passwordCharacters = availablePasswordCharacters(),
    generatedPassword = "";

  for (var i = 0; i < passwordLength; ++i) {
    generatedPassword += passwordCharacters.charAt(
      Math.random() * passwordCharacters.length
    );
  }

  return generatedPassword;
}
