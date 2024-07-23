// import dependencies
import { useState, useCallback } from "react";
import { CohereClient } from "cohere-ai";
import { defaultExamples } from "../utils/defaultExamples";
import { getClassifierExamples } from "../utils/survey";
import toast from "react-hot-toast";

//the useApi hook taking a product owner as a paremeter
const useApi = (owner) => {
  // userFeedBack and loading state variables
  const [userFeedBack, setUserFeedBack] = useState([]);
  const [loading, setLoading] = useState(false);

  // create a cohere client instance
  const cohere = new CohereClient({token: process.env.REACT_APP_COHERE_AI_API_KEY });
  
  // the getEvaluation func to evaluation options from questions
  const getEvaluation = useCallback(async (question, answer) => {
    setLoading(true);
    
    try {
      // get examples
      const examples = await getClassifierExamples(owner)
      const defaultExe = defaultExamples() 

      //a func that calls cohere to  evaluate options
      const response = async (_ans, _exe) => {
        const evaluate = await cohere.classify({
           model: "embed-english-v3.0",
           inputs: [_ans],
           examples:_exe
         });
         return evaluate;
      }

      //a func to update feedback after evaluation
      const updateFeedback = (_result) => {
        var _feedIdx = userFeedBack.findIndex((fd) => fd.question == question) 
        if (_feedIdx >= 0){
          userFeedBack[_feedIdx] = { "question": question, "feedback": answer, 
                                  "evaluation": _result.prediction != undefined ? _result.prediction: _result.label, 
                                  "confidence": _result.confidence }                    
           return    
        } 
        userFeedBack.push({ "question": question, "feedback": answer, 
          "evaluation": _result.prediction != undefined ? _result.prediction: _result.label, 
          "confidence": _result.confidence })
      }

      // update options with user's examples if there is a match else 
      // get call cohere to get an update
      var _exeIdx = examples.findIndex((ele) => ele.text == answer)
      if(_exeIdx >= 0){
        updateFeedback(examples[_exeIdx]);
        return;
      }
      var _exeupdate = []
      examples.forEach((ele) => {
        _exeupdate.push({"label": ele.label, "text": ele.text})
      });
      var getResponse = await response(answer, defaultExe.concat(_exeupdate))
      updateFeedback(getResponse.classifications[0])

      // throw an error if anything goes wrong
    } catch (error) {
      console.log(error.message)
      toast.error(error.body != undefined ? error.body.message : error.message, {duration:10000});
    } finally {
      setLoading(false);
    }
  }, []);
    
  return {
    loading,
    setLoading,
    getEvaluation,
    userFeedBack
  };
};

export default useApi;
