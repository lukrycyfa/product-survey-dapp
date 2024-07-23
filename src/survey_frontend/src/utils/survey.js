
// const baseUrl = "http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943";
const baseUrl = "http://bd3sg-teaaa-aaaaa-qaaba-cai.localhost:4943";

// canister endpoints
const endpoints = {
  getSurveys: "/get/surveys",
  getUsersSurveys: "/get/usersurveydata",
  getClassifierExamples: (owner) => `/get/classifierexamples/${owner}`,
  createAccount: "/createaccount",
  addProduct: `/add/product`,
  updateProduct: `/update/product`,
  addClassifier: `/add/classifierexample` ,
  addSurveyQuestion: `/add/surveyquestion`,
  takeSurvey: `/takesurvey`, 
  deleteProduct: (productId) => `/delete/product/${productId}`,  
  deleteSurveyQuestion: (productId, questionId) => `/delete/surveyquestion/${productId}/${questionId}`,
  deleteClassifierExample: (classIdx) => `/delete/classifierexample/${classIdx}`, 
  deleteAccount:  "/delete/account",

    };


// get all surveys from the canister
export async function getSurveys() {
  try {
    // calling the canister
    const response = await window.canister.survey.http_request({"url":`${endpoints.getSurveys}`, "method": "GET",
      "body":[], "headers":[["Content-Type", "application/json"]], "certificate_version":[]})
      const _data = new TextDecoder()
      const _decode = _data.decode(response.body) 
      const status =  response.status_code == 200 || response.status_code == 400 ? true: false  
      if (!status) {
        return {"message": `error code ${response.status_code} while retriving data`}
      }
      const data = JSON.parse(_decode)
      return data;
  } catch (error) {
    console.log(error);
  }
}

// get all surveys asscociated with the connected account
export async function getUsersSurveys() {
  try {
    // calling the canister
    const response = await window.canister.survey.http_request({"url":`${endpoints.getUsersSurveys}`, "method": "GET",
      "body":[], "headers":[["Content-Type", "application/json"]], "certificate_version":[]})
      const _data = new TextDecoder()
      const _decode = _data.decode(response.body) 
      const status =  response.status_code == 200 || response.status_code == 400 ? true: false  
      if (!status) {
        return {"message": `error code ${response.status_code} while retriving data`}
      }
      const data = JSON.parse(_decode)
      return data;
  } catch (error) {
    console.log(error);
  }
}

// get all classifiers examples associated with owner parameter
export async function getClassifierExamples(owner) {
  try {
     // calling the canister
    const response = await window.canister.survey.http_request_update({"url":`${endpoints.getClassifierExamples(owner)}`, "method": "GET",
      "body":[], "headers":[["Content-Type", "application/json"]], "certificate_version":[]})
      const _data = new TextDecoder()
      const _decode = _data.decode(response.body) 
      const status =  response.status_code == 200 || response.status_code == 400 ? true: false  
      if (!status) {
          return {"message": `error code ${response.status_code} getting classifiers`}
      }
      const data = JSON.parse(_decode)
      return data;
  } catch (error) {
    console.log(error);
  }
}

 // create a new user account
export async function createAccount() {
  try {
     // calling the canister
    const response = await window.canister.survey.http_request_update({"url":`${endpoints.createAccount}`, "method": "POST",
    "body":[], "headers":[["Content-Type", "application/json"]], "certificate_version":[]})
    const _data = new TextDecoder()
    const _decode = _data.decode(response.body) 
    const status =  response.status_code == 200 || response.status_code == 400 ? true: false  
    if (!status) {
        return {"message": `error code ${response.status_code} while creating account`}
    }
    const data = JSON.parse(_decode)
    return data;
  } catch (error) {
    console.log(error);
  }
}

// create a new product associated to the connected account
export async function addProduct(productPayload) {
  try {
     // calling the canister
    const pubKey = Buffer.from(window.auth.pubKey);
    const response = await fetch(
      `${baseUrl}${endpoints.addProduct}`,
      {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({ key : pubKey , payload : productPayload }),
      }
    );
    if (!response.ok) {
      var err = await response.json();
      return {"message": `${err} `}
    }
    const data = await response.json()
    return data;
  } catch (error) {
    console.log(error);
  }
}

// update a product associated to the connected account
export async function updateProduct(productId, productPayload) {
  try {
     // calling the canister
    const pubKey = Buffer.from(window.auth.pubKey);
    const response = await fetch(
      `${baseUrl}${endpoints.updateProduct}`,
      {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({ key : pubKey, payload : productPayload, productId :productId }),
      }
    );
    if (!response.ok) {
      var err = await response.json();
      return {"message": `${err} `}
    }
    const data = await response.json()
    return data;
  } catch (error) {
    console.log(error);
  }
}

// add a classifier example associated to the connected account
export async function addClassifier(classifierPayload) {
  try {
     // calling the canister
    const pubKey = Buffer.from(window.auth.pubKey);
    const response = await fetch(
      `${baseUrl}${endpoints.addClassifier}`,
      {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({ key : pubKey, payload : classifierPayload }),
      }
    );
    if (!response.ok) {
      var err = await response.json();
      return {"message": `${err} `}
    }
    const data = await response.json()
    return data;
  } catch (error) {
    console.log(error);
  }
}

// add a survey question to a product associated to the connected account
export async function addSurveyQuestion(productId, questionPayload) {
  try {
     // calling the canister
    const pubKey = Buffer.from(window.auth.pubKey);
    const response = await fetch(
      `${baseUrl}${endpoints.addSurveyQuestion}`,
      {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({ key : pubKey, payload : questionPayload, productId : productId }),
      }
    );
    if (!response.ok) {
      var err = await response.json();
      return {"message": `${err} `}
    }
    const data = await response.json()
    return data;
  } catch (error) {
    console.log(error);
  }
}

// take a survey
export async function takeSurvey(owner, productId, feedbackPayload) {
  try {
     // calling the canister
    const pubKey = Buffer.from(window.auth.pubKey);
    const response = await fetch(
      `${baseUrl}${endpoints.takeSurvey}`,
      {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({ key : pubKey, payload : { feedbacks: feedbackPayload }, 
                              productId : productId, owner : owner }),
      }
    );
    if (!response.ok) {
      var err = await response.json();
      return {"message": `${err} `}
    }
    const data = await response.json()
    return data;
  } catch (error) {
    console.log(error);
  }
}

// delete a product associated with the connected account
export async function deleteProduct(productId) {
  try {
     // calling the canister
  const response = await window.canister.survey.http_request_update({"url":`${endpoints.deleteProduct(productId)}`, "method": "DELETE",
    "body":[], "headers":[["Content-Type", "application/json"]], "certificate_version":[]})
    const _data = new TextDecoder()
    const _decode = _data.decode(response.body) 
    const status =  response.status_code == 200 || response.status_code == 400 ? true: false  
    if (!status) {
        return {"message": `error code ${response.status_code} while deleting product`}
    }
    const _body = JSON.parse(_decode)
    return _body;
  } catch (error) {
    console.log(error);
  }
}

// delete a survey question to a product associated to the connected account
export async function deleteSurveyQuestion(productId, questionId) {
  try {
   // calling the canister  
  const response = await window.canister.survey.http_request_update({"url":`${endpoints.deleteSurveyQuestion(productId, questionId)}`, "method": "DELETE",
    "body":[], "headers":[["Content-Type", "application/json"]], "certificate_version":[]})
    const _data = new TextDecoder()
    const _decode = _data.decode(response.body) 
    const status =  response.status_code == 200 || response.status_code == 400 ? true: false  
    if (!status) {
        return {"message": `error code ${response.status_code} while deleting survey question`}
    }
    const _body = JSON.parse(_decode)
    return _body;
  } catch (error) {
    console.log(error);
  }
}

// delete a classifier example associated with the connected account
export async function deleteClassifierExample(classIdx) {
  try {
   // calling the canister  
  const response = await window.canister.survey.http_request_update({"url":`${endpoints.deleteClassifierExample(classIdx)}`, "method": "DELETE",
    "body":[], "headers":[["Content-Type", "application/json"]], "certificate_version":[]})
    const _data = new TextDecoder()
    const _decode = _data.decode(response.body) 
    const status =  response.status_code == 200 || response.status_code == 400 ? true: false  
    if (!status) {
        return {"message": `error code ${response.status_code} while deleting classifier`}
    }
    const _body = JSON.parse(_decode)
    return _body;
  } catch (error) {
    console.log(error);
  }
}

// delete a users account 
export async function deleteAccount() {
  try {
   // calling the canister  
  const response = await window.canister.survey.http_request_update({"url":`${endpoints.deleteAccount}`, "method": "DELETE",
    "body":[], "headers":[["Content-Type", "application/json"]], "certificate_version":[]})
    const _data = new TextDecoder()
    const _decode = _data.decode(response.body) 
    const status =  response.status_code == 200 || response.status_code == 400 ? true: false  
    if (!status) {
        return {"message": `error code ${response.status_code}  while deleting account`}
    }
    const _body = JSON.parse(_decode)
    return _body;
  } catch (error) {
    console.log(error);
  }
}
