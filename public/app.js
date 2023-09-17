function shorten() {
    const urlInput = document.querySelector(".urlInput");
    const result = document.querySelector(".result");
    const results = document.querySelector(".results");
    const copy = document.querySelector(".copy");
    const submit = document.querySelector(".submit");
    const clear = document.querySelector(".clear");
    const initial = "Paste your link here...";
  
    const originalURL = urlInput.value;
  
    if (!originalURL) {
      urlInput.placeholder = "You need to enter a link to shorten...";
    } else {
      urlInput.placeholder = initial;
      // Make a POST request to the API endpoint
      fetch("https://linkbud.onrender.com/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalURL }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            urlInput.value = "";
            urlInput.placeholder = data.error;
            setTimeout(() => {
              urlInput.placeholder = initial;
            }, 4000);
          } else {
            urlInput.value = data.shortURL;
            results.classList.remove("hidden");
            submit.classList.add("hidden");
            clear.classList.remove("hidden");
            urlInput.select();
            console.log(data.shortURL);
          }
        })
        .catch((err) => console.error("Fetch Error", err));
    }
  }
  
  function reset() {
    const urlInput = document.querySelector(".urlInput");
    urlInput.value = "";
    const results = document.querySelector(".results");
    const submit = document.querySelector(".submit");
    const clear = document.querySelector(".clear");
    results.classList.add("hidden");
    submit.classList.remove("hidden");
    clear.classList.add("hidden");
  }
  
  function copyToClipboard() {
    const urlInput = document.querySelector(".urlInput");
    urlInput.select();
    document.execCommand("copy");
  }
  
  // Attach event listeners
  const submitButton = document.querySelector(".submit");
  const copyButton = document.querySelector(".copy");
  const clearButton = document.querySelector(".clear");
  
  submitButton.addEventListener("click", shorten);
  copyButton.addEventListener("click", copyToClipboard);
  clearButton.addEventListener("click", reset);
  