// import { localStorageController } from "./localStorageController";
import coverImg from "../assets/img/sandwich.jpg";

const baseUrl = "http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943";

const endpoints = {
  getSurveys: "get/surveys",
  getUsersSurveys: "get/usersurveydata",
  getClassifierExamples: (owner) => `get/classifierexamples/${owner}`,
  createAccount: "createaccount",
  addProduct: "add/product",
  updateProduct: (productId) => `update/product/${productId}`,
  addClassifier: "add/classifierexample",
  addSurveyQuestion: (productId) => `add/surveyquestion/${productId}`,
  takeSurvey: (owner, productId) => `takesurvey/${owner}/${productId}`, 
  deleteProduct: (productId) => `delete/product/${productId}`,  
  deleteSurveyQuestion: (productId, questionId) => `delete/surveyquestion/${productId}/${questionId}`,
  deleteClassifierExample: (classIdx) => `delete/classifierexample/${classIdx}`, 
  deleteAccount:  "delete/account",
};



var _testprodduct = {
  "id": "string",
  "owner": "Principal",  
  "name": "string",
  "imageUrl": coverImg,
  "description": "string",
  "survey": {"id": "string",
    "questions": [{ "id": "string", "question": "string", "possibleoptions": ["possibleoptions", "possibleoptions"]}, 
                  { "id": "string", "question": "string", "possibleoptions": ["possibleoptions", "possibleoptions"]},
                  { "id": "string", "question": "string", "possibleoptions": ["possibleoptions", "possibleoptions"]},
                  { "id": "string", "question": "string", "possibleoptions": ["possibleoptions", "possibleoptions"]}],
    "feedbacks": [
      {"visitor": "Principal",
      "feedbacks": [{"question": "string", "feedback": "string", "evaluation": "string", "confidence": "float32"},
                    {"question": "string", "feedback": "string", "evaluation": "string", "confidence": "float32"}]},        
      {"visitor": "Principal",
      "feedbacks": [{"question": "string", "feedback": "string", "evaluation": "string", "confidence": "float32"},
                    {"question": "string", "feedback": "string", "evaluation": "string", "confidence": "float32"}]}]
  }
}

var _allproduct = [_testprodduct, _testprodduct] 

var _user =  { products: _allproduct, classifierExamples: [{label: "string", text: "string"}, 
                                                          {label: "string", text: "string"}]}




export async function getSurveys() {


  try {
    // const response = await fetch(
    //   `${baseUrl}/${endpoints.getSurveys}`,
    //   {
    //     headers: [["Content-Type", "application/json"]],
    //   }
    // );

    // if (!response.ok) {
    //   throw await response.json();
    // }

    // return await response.json();
    return _allproduct;
  } catch (error) {
    console.log(error);
  }
}


export async function getUsersSurveys() {
  try {
    // const response = await fetch(
    //   `${baseUrl}/${endpoints.getUsersSurveys}`,
    //   {
    //     headers: [["Content-Type", "application/json"]],
    //   }
    // );

    // if (!response.ok) {
    //   throw await response.json();
    // }

    // return await response.json();
    return _user
  } catch (error) {
    console.log(error);
  }
}


export async function getClassifierExamples(owner) {
  try {
    const response = await fetch(
      `${baseUrl}/${endpoints.getClassifierExamples(owner)}`,
      {
        headers: [["Content-Type", "application/json"]],
      }
    );

    if (!response.ok) {
      throw await response.json();
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

 // here
export async function createAccount() {
  try {
    const response = await fetch(`${baseUrl}/${endpoints.createAccount}`, {
      method: "PUT",
      headers: [["Content-Type", "application/json"]],
      // body: JSON.stringify({ userIdentity }),
    });

    if (!response.ok) {
      throw await response.json();
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export async function addProduct(productPayload) {
  try {
    // const userIdentity = window.auth.principalText;
    // const conversationId = localStorageController("conversation")?.id;

    const response = await fetch(
      `${baseUrl}/${endpoints.addProduct}`,
      {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({ productPayload }),
      }
    );

    if (!response.ok) {
      throw await response.json();
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export async function updateProduct(productId, productPayload) {
  try {
    const response = fetch(
      `${baseUrl}/${endpoints.updateProduct(productId)}`,
      {
        method: "PATCH",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({ productPayload }),
      }
    );

    if (!response.ok) {
      throw await response.json();
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export async function addClassifier(classifierPayload) {
  try {
    // const userIdentity = window.auth.principalText;
    // const conversationId = localStorageController("conversation")?.id;

    const response = await fetch(
      `${baseUrl}/${endpoints.addClassifier}`,
      {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({ classifierPayload }),
      }
    );

    if (!response.ok) {
      throw await response.json();
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}



export async function addSurveyQuestion(productId, questionPayload) {
  try {
    // const userIdentity = window.auth.principalText;
    // const conversationId = localStorageController("conversation")?.id;

    const response = await fetch(
      `${baseUrl}/${endpoints.addSurveyQuestion(productId)}`,
      {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({ questionPayload }),
      }
    );

    if (!response.ok) {
      throw await response.json();
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}


export async function takeSurvey(owner, productId, feedbackPayload) {
  try {
    // const userIdentity = window.auth.principalText;
    // const conversationId = localStorageController("conversation")?.id;

    const response = await fetch(
      `${baseUrl}/${endpoints.takeSurvey(owner, productId)}`,
      {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({ feedbackPayload }),
      }
    );

    if (!response.ok) {
      throw await response.json();
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}


export async function deleteProduct(productId) {
  try {
    const response = fetch(
      `${baseUrl}/${endpoints.deleteProduct(productId)}`,
      {
        method: "DELETE",
        headers: [["Content-Type", "application/json"]],
      }
    );

    if (!response.ok) {
      throw await response.json();
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}


export async function deleteSurveyQuestion(productId, questionId) {
  try {
    const response = fetch(
      `${baseUrl}/${endpoints.deleteSurveyQuestion(productId, questionId)}`,
      {
        method: "DELETE",
        headers: [["Content-Type", "application/json"]],
      }
    );

    if (!response.ok) {
      throw await response.json();
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export async function deleteClassifierExample(classIdx) {
  try {
    const response = fetch(
      `${baseUrl}/${endpoints.deleteClassifierExample(classIdx)}`,
      {
        method: "DELETE",
        headers: [["Content-Type", "application/json"]],
      }
    );

    if (!response.ok) {
      throw await response.json();
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}


export async function deleteAccount() {
  try {
    const response = fetch(
      `${baseUrl}/${endpoints.deleteAccount}`,
      {
        method: "DELETE",
        headers: [["Content-Type", "application/json"]],
      }
    );

    if (!response.ok) {
      throw await response.json();
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}
