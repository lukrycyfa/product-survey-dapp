// import { StableBTreeMap, Server, Principal, float32, ic, nat8 } from "azle";
// import { v4 as uuidv4 } from "uuid";
// import express, { Request, Response } from "express";
// import cors from "cors";


// type Product = {
//     id: string;
//     owner: Principal;  
//     name: string;
//     imageUrl: string;
//     description: string;
//     survey: Survey;
// }

// type SurveyQuestion = {
//     id: string; 
//     question: string;
//     possibleanswers: string[];
// }

// type VisitorsFeedback = {
//     visitor: Principal;
//     feedback: string;
//     confidence: float32;
// }

// type Survey = {
//     id: string;
//     questions: SurveyQuestion[];
//     feedbacks: VisitorsFeedback[];
// };

// type ClassifyExample = {
//     label: string;
//     text: string;
// };

// type AppUser = {
//     products: Product[];
//     classifyExamples: ClassifyExample[];
// }

// type ProductPayload = {
//     name: string;
//     imageUrl: string;
//     description: string;
// }

// type SurveyQuestionPayload = {
//     question: string;
//     possibleanswers: string[];
// }

// type ClassifyExamplePayload = {
//     label: string;
//     text: string;
// };

// type VisitorsFeedBackPayload = {
//     feedback: string;
//     confidence: float32;
// }


// const appUserStorage = StableBTreeMap<Principal, AppUser>(0);

// export default Server(() => {
//   const app = express();
//   app.use(express.json());
//   app.use(cors());


//   app.get("/surveys", (req: Request, res: Response) => {
//     const _all = appUserStorage.values()
//     const _allsurveys: Product[] = [];
//     _all.forEach((usr) => {
//         usr.products.forEach((sur) => {
//             _allsurveys.push(sur)
//         })
//     })

//     return res.status(200).json(_allsurveys);
//   });

//   app.get("/usersurveydata", (req: Request, res: Response) => {
//     const _user = appUserStorage.get(ic.caller());
//     if ("None" in _user) {
//       return res.status(400).json({ message: `Invalid Users Account ${ic.caller()}` });
//     }
//     const user = _user.Some

//     return res.status(200).json(user);
//   });

//   app.put("/createaccount", (req: Request, res: Response) => {
//     const _user = appUserStorage.get(ic.caller());
//     if ("None" in _user) {
//         const _newUser = { products: [], surveys: [], classifyExamples: []}       
//         appUserStorage.insert(ic.caller(), _newUser)
//       return res
//         .status(200)
//         .json({ message: `Account Created Succefully For ${ic.caller()}`});
//     }
//     return res.status(400).json({ message: `Account Already Exists For ${ic.caller()}` });
//   });

//   app.post("/add/product", (req: Request, res: Response) => {
//     const productPayload = req.body as ProductPayload;
//     const _user = appUserStorage.get(ic.caller());
//     if ("None" in _user) {
//       return res.status(400).json({ message: `Invalid Users Account ${ic.caller()}` });
//     }
//     if (!productPayload) {
//       return res.status(400).json({ message: "Invalid product payload" });
//     }

//     const user = _user.Some;
//     user.products.push({id:  uuidv4(), 
//         owner: ic.caller(),
//         name: productPayload.name,
//         imageUrl: productPayload.imageUrl,
//         description: productPayload.description,
//         survey: {id:  uuidv4(), questions: [], feedbacks: []},
//     })

//     appUserStorage.insert(ic.caller(), user)

//     return res.status(200).json({ message: `Product Added successfully ${ic.caller()}`});
//   });

//   app.post("/add/classifyexample", (req: Request, res: Response) => {
//     const classifyPayload = req.body as ClassifyExamplePayload;
//     const _user = appUserStorage.get(ic.caller());
//     if ("None" in _user) {
//       return res.status(400).json({ message: `Invalid Users Account ${ic.caller()}` });
//     }
//     if (!classifyPayload) {
//       return res.status(400).json({ message: "Invalid classify payload" });
//     }
//     const user = _user.Some;

//     user.classifyExamples.push({ label: classifyPayload.label, text: classifyPayload.text})

//     appUserStorage.insert(ic.caller(), user)

//     return res.status(200).json({ message: `Classifier Example Added successfully ${ic.caller()}`});
//   });

//   app.post("/add/surveyquestion/:productId", (req: Request, res: Response) => {
//     const productId = req.params.productId;
//     const _user = appUserStorage.get(ic.caller());
//     if ("None" in _user) {
//       return res.status(400).json({ message: `Invalid Users Account ${ic.caller()}` });
//     }

//     const questionPayload = req.body as  SurveyQuestionPayload;
//     if (!questionPayload) {
//       return res.status(400).json({ message: "Invalid question payload" });
//     }

//     const user = _user.Some;
//     const idx  = user.products.findIndex((pr) => pr.id === productId)
//     if (idx < 0) {
//       return res.status(400).json({ message: "Invalid survey for this account or does not exist" });
//     }

//     user.products[idx].survey.questions.push(
//         {id:  uuidv4(), question: questionPayload.question,
//         possibleanswers: questionPayload.possibleanswers})
//     appUserStorage.insert(ic.caller(), user)

//     return res.status(200).json({ message: `Survey Question Added successfully ${ic.caller()}`});

//   });


//   app.post("/takesurvey/:owner/:productId", (req: Request, res: Response ) => {
//     const productId = req.params.productId;
//     const owner = Principal.fromText(req.params.owner);
//     const _user = appUserStorage.get(owner);
//     if ("None" in _user) {
//         return res.status(400).json({ message: `Invalid Survey Owner ${ic.caller()}` });
//     }

//     const feedbackPayload = req.body as VisitorsFeedBackPayload;
//     if (!feedbackPayload) {
//       return res.status(400).json({ message: "Invalid feedback Payload" });
//     }    
//     const user = _user.Some;
//     const idx  = user.products.findIndex((pr) => pr.id === productId)
//     if (idx < 0) {
//       return res.status(400).json({ message: "Invalid survey  does not exist" });
//     }
//     user.products[idx].survey.feedbacks.push(
//         { visitor: ic.caller(),
//         feedback: feedbackPayload.feedback,
//         confidence: feedbackPayload.confidence}
//         )
//     appUserStorage.insert(owner, user)

//     return res.status(200).json({ message: `Survey Taken successfully ${ic.caller()}`});
//   });
  

//   app.delete("/delete/product/:productId", (req: Request, res: Response) => {
//     const productId = req.params.productId;

//     const _user = appUserStorage.get(ic.caller());
//     if ("None" in _user) {
//       return res.status(400).json({ message: `Invalid Users Account ${ic.caller()}` });
//     }

//     const user = _user.Some;
//     const idx  = user.products.findIndex((pr) => pr.id === productId)
//     if (idx < 0) {
//       return res.status(400).json({ message: "Invalid product for this account or does not exist" });
//     }

//     deleteEntryProduct(user.products, idx)
//     appUserStorage.insert(ic.caller(), user);

//     return res
//       .status(201)
//       .send(`The product associated to ${productId} has been deleted`);
//   });

//   app.post("/delete/surveyquestion/:productId/:questionId", (req: Request, res: Response) => {
//     const productId = req.params.productId;
//     const questionId = req.params.questionId;
//     const _user = appUserStorage.get(ic.caller());
//     if ("None" in _user) {
//       return res.status(400).json({ message: `Invalid Users Account ${ic.caller()}` });
//     }

//     const user = _user.Some;
//     const idx  = user.products.findIndex((pr) => pr.id === productId)
//     if (idx < 0) {
//       return res.status(400).json({ message: "Invalid product for this account or does not exist" });
//     }
//     const qIdx = user.products[idx].survey.questions.findIndex((qt) => qt.id === questionId)
//     if (qIdx < 0) {
//         return res.status(400).json({ message: "Invalid question for this survey or does not exist" });
//     }

//     deleteEntryQuestion(user.products[idx].survey.questions, qIdx)
//     appUserStorage.insert(ic.caller(), user)

//     return res.status(200).json({ message: `Survey Question Deleted successfully ${ic.caller()}`});

//   });

//   app.delete("/delete/classifier/:classIdx", (req: Request, res: Response) => {
//     const classIdx = req.params.classIdx;

//     const _user = appUserStorage.get(ic.caller());
//     if ("None" in _user) {
//       return res.status(400).json({ message: `Invalid Users Account ${ic.caller()}` });
//     }

//     const user = _user.Some;
//     if (user.classifyExamples.length <= parseInt(classIdx) ) {
//       return res.status(400).json({ message: "Invalid classyfier for this account or does not exist" });
//     }
//     deleteEntryClass(user.classifyExamples, parseInt(classIdx))
//     appUserStorage.insert(ic.caller(), user);

//     return res
//       .status(201)
//       .send(`The classifier associated to ${classIdx} has been deleted`);
//   });

//   app.delete("/delete/account", (req: Request, res: Response) => {
//     const _user = appUserStorage.get(ic.caller());
//     if ("None" in _user) {
//       return res.status(400).json({ message: `Invalid Users Account ${ic.caller()}` });
//     }
//     appUserStorage.remove(ic.caller());

//     return res.status(400).json({ message: `Account with ${ic.caller()} have been removed` });
//   });

//   return app.listen();
// });

// function deleteEntryClass(elements: ClassifyExample[], idx: nat8) {
//     for(let i = idx; i < elements.length; i++){
//         if(i+1 == elements.length) break;
//         elements[i] = elements[i+1]
//     }
//     elements.pop()
// };

// function deleteEntryQuestion(elements: SurveyQuestion[], idx: nat8) {
//     for(let i = idx; i < elements.length; i++){
//         if(i+1 == elements.length) break;
//         elements[i] = elements[i+1]
//     }
//     elements.pop()
// };

// function deleteEntryProduct(elements: Product[], idx: nat8) {
//     for(let i = idx; i < elements.length; i++){
//         if(i+1 == elements.length) break;
//         elements[i] = elements[i+1]
//     }
//     elements.pop()
// };