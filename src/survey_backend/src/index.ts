// import libraries, classes, types e.t.c 
import { StableBTreeMap, Server, Principal, float32, ic, nat8 } from "azle";
import { v4 as uuidv4 } from "uuid";
import express, { Request, Response } from "express";
import cors from "cors";


// the Product type, for creating and attributing products
type Product = {
    id: string;
    owner: Principal;  
    name: string;
    imageUrl: string;
    description: string;
    survey: Survey;
}

// the SurveyQuestion type, for creating and attributing Survey Questions
type SurveyQuestion = {
    id: string; 
    question: string;
    possibleoptions: string[];
}

// the FeedBackResult type, for creating and attributing FeedBack Results
type FeedBackResult = {
  question: string;
  feedback: string;
  evaluation: string;
  confidence: float32;
}

// the VisitorsFeedback type, for creating and attributing Visitors Feedbacks 
type VisitorsFeedback = {
    visitor: Principal;
    feedbacks: FeedBackResult[];
}

// the Survey type, for creating and attributing Surveys 
type Survey = {
    id: string;
    questions: SurveyQuestion[];
    feedbacks: VisitorsFeedback[];
};

// the ClassifierExample type, for creating and attributing Classifier Examples
type ClassifierExample = {
    label: string;
    text: string;
    confidence: float32;
};

// the AppUser type, for creating and attributing AppUsers
type AppUser = {
    user: Principal;
    products: Product[];
    classifierExamples: ClassifierExample[];
}

// the ProductPayload type, for creating Products
type ProductPayload = {
    name: string;
    imageUrl: string;
    description: string;
}

// the SurveyQuestionPayload type, for creating Survey Questions
type SurveyQuestionPayload = {
    question: string;
    possibleoptions: string[];
}

// the ClassifyExamplePayload type, for creating Classifier Examples
type ClassifyExamplePayload = {
    label: string;
    text: string;
    confidence: float32;
};

// the VisitorsFeedBackPayload type, for creating Visitors FeedBacks
type VisitorsFeedBackPayload = {
    feedbacks: FeedBackResult[];
}


// the appUserStorage for saving instances and attributes of the app users
const appUserStorage = StableBTreeMap<Principal, AppUser>(0);

// Create an instance of an Express Server
export default Server(() => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  
  // a func called to get all surveys associated to all users from appUserStorage
  app.get("/get/surveys", (req: Request, res: Response) => {
    const _all = appUserStorage.values()
    const _allsurveys: Product[] = [];
    _all.forEach((usr) => {
        usr.products.forEach((sur) => {
            _allsurveys.push(sur)
        })
    })
    // return data
    return res.status(200).json(_allsurveys);
  });

  //a func called to get all surveys associated to connected users from appUserStorage
  app.get("/get/usersurveydata", (req: Request, res: Response) => {
    // lookup appUserStorage for an instance of the connected account
    // if non exists, return a 400 error msg, otherwise return any available data
    const _user = appUserStorage.get(ic.caller());
    if ("None" in _user) {
      return res.status(400).json({ message: `No Survey Data Prior To Account ${ic.caller()}` });
    }
    const user = _user.Some
    // return data
    return res.status(200).json(user);
  });

  //a func called to get all classifier examples associated to user with the owner param from appUserStorage
  app.get("/get/classifierexamples/:owner", (req: Request, res: Response) => {
    // get the users Principle lookup appUserStorage for an instance of the user
    // if non exists, return a 400 error msg, otherwise return any available data
    const _owner = Principal.from(req.params.owner);
    const _user = appUserStorage.get(_owner);
    if ("None" in _user) {
      return res.status(400).json({ message: `No Examples Prior to Account ${_owner.toText()}` });
    }
    const user = _user.Some
    // return data
    return res.status(200).json(user.classifierExamples);
  });

  //A func for called when Create a New instance of an App User 
  app.post("/createaccount", (req: Request, res: Response) => {
    // lookup appUserStorage for an instance of the calling account 
    // if non exists, create a new instance else return a 400 error msg
    const _user = appUserStorage.get(ic.caller());
    if ("None" in _user) {
        const _newUser = { user: ic.caller(), products: [], surveys: [], classifierExamples: []}       
        appUserStorage.insert(ic.caller(), _newUser)
      return res
        .status(200)
        .json({ message: `an Account For ${ic.caller()} Created Succefully `});
    }
    return res.status(400).json({ message: `an Account for ${ic.caller()} Already Exists` });
  });

  //A func for called when Creating Products for a users instance
  app.post("/add/product", (req: Request, res: Response) => {
    // get payload and key from body, get user's principle, lookup user's instance in appUserStorage,
    // if non exists, return a 400 error msg, otherwise validate input's, create product from the payload
    // attribute it to the user and update appUserStorage.
    const productPayload = req.body.payload as ProductPayload;
    const caller = getPrincipleFromKey(req.body.key.data)
    const _user = appUserStorage.get(caller);
    if ("None" in _user) {
      return res.status(400).json({ message: `An Account With ${caller.toText()} Does Not Exists` });
    }
    
    if (!productPayload || productPayload.name.length <= 0 || productPayload.imageUrl.length <= 0 || productPayload.description.length <= 0  ) {
      return res.status(400).json({ message: "Invalid Product Payload" });
    } 

    const user = _user.Some;
    user.products.push({id:  uuidv4(), 
        owner: caller,
        name: productPayload.name,
        imageUrl: productPayload.imageUrl,
        description: productPayload.description,
        survey: {id:  uuidv4(), questions: [], feedbacks: []},
    })
    appUserStorage.insert(caller, user)
    // return msg
    return res.status(200).json({ message: `Product Added Successfully`});
  });

  //A func for called when Updating Products for a users instance.
  app.post("/update/product", (req: Request, res: Response) => {
    // get payload and key from body, get user's principle, lookup user's instance in appUserStorage,
    // if non exists, return a 400 error msg, otherwise validate input's, update product from the payload
    // attribute it to the user and update appUserStorage.
    const productPayload = req.body.payload  as ProductPayload;
    const caller = getPrincipleFromKey(req.body.key.data)
    const productId = req.body.productId
    const _user = appUserStorage.get(caller);
    if ("None" in _user) {
      return res.status(400).json({ message: `An Account With ${caller.toText()} Does Not Exists` });
    }
    if (!productPayload || productPayload.name.length <= 0 || productPayload.imageUrl.length <= 0 || productPayload.description.length <= 0 ) {
      return res.status(400).json({ message: "Invalid Product Payload" });
    }

    const user = _user.Some;
    const idx  = user.products.findIndex((pr) => pr.id === productId)
    if (idx < 0) {
      return res.status(400).json({ message: "Invalid Product for this account or does not exist" });
    }
    const _product = user.products[idx]
    const _update = {..._product, ...productPayload}
    user.products[idx] = _update
   
    appUserStorage.insert(caller, user)
    // return msg
    return res.status(200).json({ message: `Product Updated successfully`});
  });

  //A func for called when Creating Classifier Example for a users instance.
  app.post("/add/classifierexample", (req: Request, res: Response) => {
    // get payload and key from body, get user's principle, lookup user's instance in appUserStorage,
    // if non exists, return a 400 error msg, otherwise validate input's, create example from the payload
    // attribute it to the user and update appUserStorage.
    const classifyPayload = req.body.payload  as ClassifyExamplePayload;
    const caller = getPrincipleFromKey(req.body.key.data)
    const _user = appUserStorage.get(caller);
    
    if ("None" in _user) {
      return res.status(400).json({ message: `An Account With ${caller.toText()} Does Not Exists` });
    }
  
    if (!classifyPayload || classifyPayload.label.length <= 0 || classifyPayload.text.length <= 0 ) {
      return res.status(400).json({ message: "Invalid Classifier Payload" });
    }
    const user = _user.Some;
    user.classifierExamples.push(classifyPayload)

    appUserStorage.insert(caller, user)
    // return msg
    return res.status(200).json({ message: `Classifier Example Added successfully`});
  });

  //A func for called when Creating Survey Question for products in a users instance.
  app.post("/add/surveyquestion", (req: Request, res: Response) => {
    // get payload and key from body, get user's principle, lookup user's instance in appUserStorage,
    // if non exists, return a 400 error msg, otherwise validate input's, create survey question from the payload
    // attribute it to the user and update appUserStorage.
    const productId = req.body.productId;
    const caller = getPrincipleFromKey(req.body.key.data)
    const _user = appUserStorage.get(caller);
    if ("None" in _user) {
      return res.status(400).json({ message: `An Account With ${caller.toText()} Does Not Exists` });
    }

    const user = _user.Some;
    const idx  = user.products.findIndex((pr) => pr.id === productId)
    if (idx < 0) {
      return res.status(400).json({ message: `Invalid survey for account ${caller.toText()} or does not exist` });
    }
    
    const questionPayload = req.body.payload as SurveyQuestionPayload;
    if (!questionPayload || questionPayload.question.length <= 0 || questionPayload.possibleoptions.findIndex((el)=> el.length <= 0) >= 0) {
      return res.status(400).json({ message: "Invalid Question Payload" });
    }

    user.products[idx].survey.questions.push(
        {id:  uuidv4(), question: questionPayload.question,
        possibleoptions: questionPayload.possibleoptions})
    appUserStorage.insert(caller, user)
    // return msg
    return res.status(200).json({ message: `Survey Question Added successfully`});
  });

  //A func for called when Taking Surveys.
  app.post("/takesurvey", (req: Request, res: Response ) => {
    // get payload, productId, owner and visitor from body, get owner's principle, get vistitors Principle
    // lookup owner's instance in appUserStorage,
    // if non exists, return a 400 error msg, otherwise validate input's, create visitors feedBack from the payload
    // attribute it to the owner's surveys and update appUserStorage.
    const productId = req.body.productId;
    const visitor = getPrincipleFromKey(req.body.key.data)
    const owner = Principal.from(req.body.owner);
    const _user = appUserStorage.get(owner);
    if ("None" in _user) {
        return res.status(400).json({ message: `Invalid Survey For Account ${owner.toText()}` });
    }


    const feedbackPayload = req.body.payload as VisitorsFeedBackPayload;
    var valid = false
    feedbackPayload.feedbacks.forEach((el) => {
      if (el.question.length <= 0 || 
        el.evaluation.length <= 0 || 
        el.feedback.length <= 0) valid = true;
    })
    if (!feedbackPayload || valid) {
      return res.status(400).json({ message: "Invalid Feedback Payload" });
    }    
    const user = _user.Some;
    const idx  = user.products.findIndex((pr) => pr.id === productId)
    if (idx < 0) {
      return res.status(400).json({ message: `Invalid Survey For Product with ${productId} or does not exist` });
    }
    if (owner.toText() == visitor.toText()) {
      return res.status(400).json({ message: `This Survey Is Unauthorized For The Product Owner ${owner.toText()}` });
    }

    var uIdx = user.products[idx].survey.feedbacks.findIndex((vis) => vis.visitor.toText() ==  visitor.toText())
    if( uIdx >= 0 ){
      user.products[idx].survey.feedbacks[uIdx] = { visitor: visitor, feedbacks: feedbackPayload.feedbacks}
      appUserStorage.insert(owner, user)
      return res.status(200).json({ message: `Survey Updated successfully`});
    }
    user.products[idx].survey.feedbacks.push(
        { visitor: visitor,
        feedbacks: feedbackPayload.feedbacks}
        )
    appUserStorage.insert(owner, user)
    // return msg    
    return res.status(200).json({ message: `Survey Completed successfully`});
  });
  
  // A func for called when deleting Products associated to user's
  app.delete("/delete/product/:productId", (req: Request, res: Response) => {
    // get the productId from params, lookup caller's instance in appUserStorage,
    // if non exists, return a 400 error msg, otherwise validate params, delete product
    // and update users instance in appUserStorage.
    const productId = req.params.productId;
    const _user = appUserStorage.get(ic.caller());
    if ("None" in _user) {
      return res.status(400).json({ message: `An Account With ${ic.caller()} Does Not Exists` });
    }

    const user = _user.Some;
    const idx  = user.products.findIndex((pr) => pr.id === productId)
    if (idx < 0) {
      return res.status(400).json({ message: "Invalid product for this account or does not exist" });
    }

    deleteEntryProduct(user.products, idx)
    appUserStorage.insert(ic.caller(), user);
    // return msg
    return res
      .status(200)
      .json({ message:`The product associated with ${productId} has been deleted`});
  });

  // A func for called when deleting survey questions on Products associated to user's
  app.delete("/delete/surveyquestion/:productId/:questionId", (req: Request, res: Response) => {
    // get the productId and questionId from params, lookup caller's instance in appUserStorage,
    // if non exists, return a 400 error msg, otherwise validate params, delete survey question
    // and update users instance in appUserStorage.
    const productId = req.params.productId;
    const questionId = req.params.questionId;
    const _user = appUserStorage.get(ic.caller());
    if ("None" in _user) {
      return res.status(400).json({ message: `An Account With ${ic.caller()} Does Not Exists`});
    }

    const user = _user.Some;
    const idx  = user.products.findIndex((pr) => pr.id === productId)
    if (idx < 0) {
      return res.status(400).json({ message: "Invalid product for this account or does not exist" });
    }
    const qIdx = user.products[idx].survey.questions.findIndex((qt) => qt.id === questionId)
    if (qIdx < 0) {
        return res.status(400).json({ message: "Invalid question for this survey or does not exist" });
    }

    deleteEntryQuestion(user.products[idx].survey.questions, qIdx)
    appUserStorage.insert(ic.caller(), user)
    // return msg
    return res.status(200).json({ message: `Survey Question Deleted successfully`});

  });

  //A func for called when deleting classifier examples  associated to user's
  app.delete("/delete/classifierexample/:classIdx", (req: Request, res: Response) => {
    // get the classIdx from params, lookup caller's instance in appUserStorage,
    // if non exists, return a 400 error msg, otherwise validate params, delete classifier example
    // and update users instance in appUserStorage.
    const classIdx = req.params.classIdx;
    const _user = appUserStorage.get(ic.caller());
    if ("None" in _user) {
      return res.status(400).json({ message: `An Account With ${ic.caller()} Does Not Exists` });
    }

    const user = _user.Some;
    if (user.classifierExamples.length <= parseInt(classIdx) ) {
      return res.status(400).json({ message: "Invalid Classifier for this account or does not exist" });
    }
    deleteEntryClass(user.classifierExamples, parseInt(classIdx))
    appUserStorage.insert(ic.caller(), user);
    // return msg
    return res
      .status(200)
      .json({ message:`The classifier associated to ${classIdx} has been deleted`});
  });

  // A func for called when deleting a users account
  app.delete("/delete/account", (req: Request, res: Response) => {
    // lookup caller's instance in appUserStorage,
    // if non exists, return a 400 error msg, otherwise remove user from appUserStorage.
    const _user = appUserStorage.get(ic.caller());
    if ("None" in _user) {
      return res.status(400).json({ message: `An Account With ${ic.caller()} Does Not Exists` });
    }
    appUserStorage.remove(ic.caller());
    // return msg
    return res.status(200).json({ message: `Account with ${ic.caller()} have been removed` });
  });

  // return app instance
  return app.listen();
});

// a helper func to create a principle from a key
function getPrincipleFromKey(data: []) {
  var key = new Uint8Array(data) 
  return Principal.selfAuthenticating(key)
}

// a helper func for deleting Classifier Examples from arrays
function deleteEntryClass(elements: ClassifierExample[], idx: nat8) {
    for(let i = idx; i < elements.length; i++){
        if(i+1 == elements.length) break;
        elements[i] = elements[i+1]
    }
    elements.pop()
};

// a helper func for deleting Survey Questions from arrays
function deleteEntryQuestion(elements: SurveyQuestion[], idx: nat8) {
    for(let i = idx; i < elements.length; i++){
        if(i+1 == elements.length) break;
        elements[i] = elements[i+1]
    }
    elements.pop()
};

// a helper func for deleting Products from arrays
function deleteEntryProduct(elements: Product[], idx: nat8) {
    for(let i = idx; i < elements.length; i++){
        if(i+1 == elements.length) break;
        elements[i] = elements[i+1]
    }
    elements.pop()
};