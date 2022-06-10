window.onload = function () {
  let passwordInput = document.getElementById("password_input"),
    passwordGenerateButton = document.getElementById("password_button"),
    passwordCopyButton = document.getElementById("password_copy"),
    settingsButton = document.getElementById("settings_button");

  let passwordLength = document.getElementById("password_length"),
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
    autoSelectPassword = document.getElementById("select_password"),
    saveSettings = document.getElementById("save_settings");

  passwordGenerateButton.addEventListener("click", function () {
    passwordInput.value = generatePassword(
      passwordLength,
      includeLowercaseLetters,
      includeUppercaseLetters,
      includeNumbers,
      includeSymbols,
      excludeSimilarCharacters,
      includeSpecificCharacters,
      excludeSpecificCharacters
    );

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

  window.addEventListener(
    "beforeunload",
    function () {
      if (saveSettings.checked) {
        setSettings(
          passwordLength,
          includeLowercaseLetters,
          includeUppercaseLetters,
          includeNumbers,
          includeSymbols,
          excludeSimilarCharacters,
          includeSpecificCharacters,
          excludeSpecificCharacters,
          autoSelectPassword,
          saveSettings
        );
      } else {
        localStorage.clear();
      }
    },
    false
  );

  if (localStorage.length > 0) {
    getSettings(
      passwordLength,
      includeLowercaseLetters,
      includeUppercaseLetters,
      includeNumbers,
      includeSymbols,
      excludeSimilarCharacters,
      includeSpecificCharacters,
      excludeSpecificCharacters,
      autoSelectPassword,
      saveSettings
    );
  } else {
    setDefaultSettings(
      passwordLength,
      includeLowercaseLetters,
      includeUppercaseLetters,
      includeNumbers,
      includeSymbols,
      excludeSimilarCharacters,
      includeSpecificCharacters,
      excludeSpecificCharacters,
      autoSelectPassword,
      saveSettings
    );
  }
};

function availablePasswordCharacters(
  includeLowercaseLetters,
  includeUppercaseLetters,
  includeNumbers,
  includeSymbols,
  excludeSimilarCharacters,
  includeSpecificCharacters,
  excludeSpecificCharacters
) {
  let selectedPasswordCharacters = "";

  let lowercaseLetters = "abcdefghijklmnopqrstuvwxyz",
    uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers = "1234567890",
    symbols = "!@#$%",
    similarCharactersArray = ["1", "i", "l", "5", "S", "8", "B", "o", "O", "0"];

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

function generatePassword(
  passwordLength,
  includeLowercaseLetters,
  includeUppercaseLetters,
  includeNumbers,
  includeSymbols,
  excludeSimilarCharacters,
  includeSpecificCharacters,
  excludeSpecificCharacters
) {
  let passwordCharacters = availablePasswordCharacters(
      includeLowercaseLetters,
      includeUppercaseLetters,
      includeNumbers,
      includeSymbols,
      excludeSimilarCharacters,
      includeSpecificCharacters,
      excludeSpecificCharacters
    ),
    generatedPassword = "";

  for (var i = 0; i < passwordLength.value; ++i) {
    generatedPassword += passwordCharacters.charAt(
      Math.random() * passwordCharacters.length
    );
  }

  return generatedPassword;
}

function setSettings(
  passwordLength,
  includeLowercaseLetters,
  includeUppercaseLetters,
  includeNumbers,
  includeSymbols,
  excludeSimilarCharacters,
  includeSpecificCharacters,
  excludeSpecificCharacters,
  autoSelectPassword,
  saveSettings
) {
  localStorage.setItem("passwordLength", passwordLength.value);

  localStorage.setItem(
    "includeLowercaseLetters",
    includeLowercaseLetters.checked
  );

  localStorage.setItem(
    "includeUppercaseLetters",
    includeUppercaseLetters.checked
  );

  localStorage.setItem("includeNumbers", includeNumbers.checked);

  localStorage.setItem("includeSymbols", includeSymbols.checked);

  localStorage.setItem(
    "excludeSimilarCharacters",
    excludeSimilarCharacters.checked
  );

  localStorage.setItem(
    "includeSpecificCharacters",
    includeSpecificCharacters.value
  );

  localStorage.setItem(
    "excludeSpecificCharacters",
    excludeSpecificCharacters.value
  );

  localStorage.setItem("autoSelectPassword", autoSelectPassword.checked);

  localStorage.setItem("saveSettings", saveSettings.checked);
}

function getSettings(
  passwordLength,
  includeLowercaseLetters,
  includeUppercaseLetters,
  includeNumbers,
  includeSymbols,
  excludeSimilarCharacters,
  includeSpecificCharacters,
  excludeSpecificCharacters,
  autoSelectPassword,
  saveSettings
) {
  passwordLength.value = localStorage.getItem("passwordLength");

  includeLowercaseLetters.checked =
    localStorage.getItem("includeLowercaseLetters") === "true";

  includeUppercaseLetters.checked =
    localStorage.getItem("includeUppercaseLetters") === "true";

  includeNumbers.checked = localStorage.getItem("includeNumbers") === "true";

  includeSymbols.checked = localStorage.getItem("includeSymbols") === "true";

  excludeSimilarCharacters.checked =
    localStorage.getItem("excludeSimilarCharacters") === "true";

  includeSpecificCharacters.value = localStorage.getItem(
    "includeSpecificCharacters"
  );

  excludeSpecificCharacters.value = localStorage.getItem(
    "excludeSpecificCharacters"
  );

  autoSelectPassword.checked =
    localStorage.getItem("autoSelectPassword") === "true";
  saveSettings.checked = localStorage.getItem("saveSettings") === "true";
}

function setDefaultSettings(
  passwordLength,
  includeLowercaseLetters,
  includeUppercaseLetters,
  includeNumbers,
  includeSymbols,
  excludeSimilarCharacters,
  includeSpecificCharacters,
  excludeSpecificCharacters,
  autoSelectPassword,
  saveSettings
) {
  passwordLength.value = 16;
  includeLowercaseLetters.checked = true;
  includeUppercaseLetters.checked = true;
  includeNumbers.checked = true;
  includeSymbols.checked = true;
  excludeSimilarCharacters.checked = false;
  includeSpecificCharacters.value = "";
  excludeSpecificCharacters.value = "";
  autoSelectPassword.checked = true;
  saveSettings.checked = false;
}
