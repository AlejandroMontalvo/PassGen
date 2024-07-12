document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const passwordInput = document.getElementById("password_input");
  const passwordGenerateButton = document.getElementById("password_button");
  const settings = {
    length: document.getElementById("password_length"),
    includeLowercase: document.getElementById("include_lowercase_letters"),
    includeUppercase: document.getElementById("include_uppercase_letters"),
    includeNumbers: document.getElementById("include_numbers"),
    includeSymbols: document.getElementById("include_symbols"),
    excludeSimilar: document.getElementById("exclude_similar_characters"),
    includeSpecific: document.getElementById("include_specific_characters"),
    excludeSpecific: document.getElementById("exclude_specific_characters"),
    saveSettings: document.getElementById("save_settings"),
  };

  // Initialize settings
  const defaultSettings = {
    length: 16,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: true,
    includeSpecific: "",
    excludeSpecific: "",
    saveSettings: false,
  };

  loadSettings();

  // Generate password on load and button click
  generateAndDisplayPassword();
  passwordGenerateButton.addEventListener("click", generateAndDisplayPassword);

  // Validate password length on blur and Enter key press
  settings.length.addEventListener("blur", validatePasswordLength);
  settings.length.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      validatePasswordLength();
    }
  });

  function validatePasswordLength() {
    let length = parseInt(settings.length.value);
    if (isNaN(length) || length < 1) {
      length = 1;
    } else if (length > 2048) {
      length = 2048;
    }
    settings.length.value = length;
  }

  function generateAndDisplayPassword() {
    passwordInput.value = generatePassword();
  }

  function generatePassword() {
    let characterSet = "";

    // Include characters based on settings
    if (settings.includeLowercase.checked) {
      characterSet += "abcdefghijklmnopqrstuvwxyz";
    }
    if (settings.includeUppercase.checked) {
      characterSet += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    if (settings.includeNumbers.checked) {
      characterSet += "1234567890";
    }
    if (settings.includeSymbols.checked) {
      characterSet += "!@#$%";
    }

    // Exclude similar characters if enabled
    if (settings.excludeSimilar.checked) {
      const similarCharacters = [
        "1",
        "i",
        "l",
        "5",
        "S",
        "8",
        "B",
        "o",
        "O",
        "0",
      ];
      similarCharacters.forEach((char) => {
        characterSet = characterSet.replace(new RegExp(char, "g"), "");
      });
    }

    // Include specific characters
    if (settings.includeSpecific.value) {
      characterSet += settings.includeSpecific.value.replace(/\s/g, "");
    }

    // Exclude specific characters
    if (settings.excludeSpecific.value) {
      settings.excludeSpecific.value.split(/\s+/).forEach((char) => {
        characterSet = characterSet.replace(new RegExp(char, "g"), "");
      });
    }

    // Generate password
    let generatedPassword = "";
    for (let i = 0; i < parseInt(settings.length.value); ++i) {
      generatedPassword += characterSet.charAt(
        Math.floor(Math.random() * characterSet.length)
      );
    }

    return generatedPassword;
  }

  // Copy password to clipboard on click
  passwordInput.addEventListener("click", function (mouseEvent) {
    if (passwordInput.value) {
      navigator.clipboard.writeText(passwordInput.value);
      showCopiedPopup(mouseEvent);
    }
  });

  function showCopiedPopup(mouseEvent) {
    const copiedPopup = document.getElementById("copied_popup");
    // Calculate the position based on the mouse coordinates
    let mouseX = mouseEvent.pageX;
    let mouseY = mouseEvent.pageY;

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

  // Save settings to localStorage before unload if enabled
  window.addEventListener("beforeunload", function () {
    if (settings.saveSettings.checked) {
      saveSettings();
    } else {
      localStorage.clear();
    }
  });

  function saveSettings() {
    Object.keys(settings).forEach((key) => {
      if (key === "length") {
        localStorage.setItem(key, settings[key].value);
      } else if (key === "includeSpecific" || key === "excludeSpecific") {
        localStorage.setItem(key, settings[key].value);
      } else {
        localStorage.setItem(key, settings[key].checked);
      }
    });
  }

  function loadSettings() {
    if (localStorage.length > 0) {
      console.log("localStorage exists:", localStorage); // Check current localStorage contents
      Object.keys(settings).forEach((key) => {
        const value = localStorage.getItem(key);
        console.log(`Loaded ${key} from localStorage:`, value); // Log each loaded setting
        if (value !== null) {
          if (
            key === "length" ||
            key === "includeSpecific" ||
            key === "excludeSpecific"
          ) {
            settings[key].value = value;
          } else {
            settings[key].checked = value === "true"; // Convert "true"/"false" string to boolean
          }
        }
      });
    } else {
      console.log("localStorage is empty or not available.");
      setDefaultSettings();
    }
    validatePasswordLength();
  }

  function setDefaultSettings() {
    Object.keys(defaultSettings).forEach((key) => {
      settings[key][key === "length" ? "value" : "checked"] =
        defaultSettings[key];
    });
  }
});
