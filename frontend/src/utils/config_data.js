import { get } from "./requests";

let BASE_URL = "http://localhost:5000";

console.log("NODE_ENV:", process.env.REACT_APP_FRONTEND_ENV);

if (process.env.REACT_APP_FRONTEND_ENV === "production") {
  console.log("Production mode");
  BASE_URL = "https://lab-deployment-414310.as.r.appspot.com/";
}

// const BASE_URL = "https://lab-deployment-414310.as.r.appspot.com/";

const AUTH_API = BASE_URL + "/auth/github/access_token";
const USER_API = BASE_URL + "/api/user";
const PROMPT_API = BASE_URL + "/api/prompt";
const LOGIN_API = BASE_URL + "/auth/github/login";

function validateDate(dateString) {
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

  if (!dateRegex.test(dateString)) {
    return "Invalid date format. Please use mm/dd/yyyy.";
  }

  const parts = dateString.split("/");
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  const isValidDate =
    !isNaN(year) &&
    !isNaN(month) &&
    !isNaN(day) &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= 31;

  if (!isValidDate) {
    return "Invalid date. Please enter a valid hosting request date.";
  }

  return null;
}

function validateURL(url) {
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  if (!urlRegex.test(url)) {
    return "Invalid URL. Please enter a valid URL.";
  }
  return null;
}

async function getPromptTree() {
  try {
    const response = await get(PROMPT_API + "/tree");
    return [response.tree, response.role];
  } catch (error) {
    console.error(error);
    return [];
  }
}

const getFormattedPrompt = (promptObj) => {
  let prompt = promptObj?.master_prompt || "";
  prompt += "\n\n";
  prompt += promptObj.prompt?.prompt_template || "";

  Object.keys(promptObj.prompt?.placeholders || {}).forEach((key) => {
    const value = promptObj.prompt.placeholders[key];
    prompt = prompt.replaceAll("{" + key + "}", value);
  });

  return prompt || "";
};

export {
  AUTH_API,
  USER_API,
  LOGIN_API,
  PROMPT_API,
  validateDate,
  validateURL,
  getPromptTree,
  getFormattedPrompt,
};
