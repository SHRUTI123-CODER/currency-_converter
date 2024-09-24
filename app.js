const BASE_URL = "https://api.currencyapi.com/v3/latest?apikey=YOUR-APIKEY"; // Replace YOUR-APIKEY with your actual API key

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency options
for (let select of dropdowns) {
  for (let currCode in countryList) {
      let newOption = document.createElement("option");
      newOption.innerText = currCode;
      newOption.value = currCode;
      if (select.name === "from" && currCode === "USD") {
          newOption.selected = true;
      } else if (select.name === "to" && currCode === "INR") {
          newOption.selected = true;
      }
      select.append(newOption);
  }

  // Update flag when the currency is changed
  select.addEventListener("change", (evt) => {
      updateFlag(evt.target);
  });
}

// Function to fetch exchange rates and update the message
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  // Default to 1 if the input is empty or less than 1
  if (amtVal === "" || amtVal < 1) {
      amtVal = 1;
      amount.value = amtVal;
  }

  const URL = `${BASE_URL}&base_currency=${fromCurr.value}`; // Use base_currency parameter
  
  try {
      let response = await fetch(URL);
      
      if (!response.ok) throw new Error("Network response was not ok");

      let data = await response.json();
      
      // Get the conversion rate
      let rate = data.data[toCurr.value];

      // Calculate final amount
      let finalAmount = amtVal * rate;

      // Display the conversion result
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
      
  } catch (error) {
      msg.innerText = `Error fetching data: ${error.message}`;
  }
};

// Function to update flag image based on selected currency
const updateFlag = (element) => {
  let currCode = element.value;
  
  // Get the country code based on the selected currency
  let countryCode = countryList[currCode];
  
  // Update the flag image source
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  
  let img = element.parentElement.querySelector("img");
  
  img.src = newSrc || ""; // Fallback in case of an unknown currency
};

// Event listener for the convert button
btn.addEventListener("click", (evt) => {
  evt.preventDefault(); // Prevent form submission
   updateExchangeRate(); // Call function to update exchange rate
});

// Initial call to update exchange rate on page load
window.addEventListener("load", () => {
   updateExchangeRate();
});