import { useState, useCallback } from "react";
import { CohereClient } from "cohere-ai";
import { defaultExamples } from "../utils/defaultExamples";
import { getClassifierExamples, addClassifier } from "../utils/survey";
import toast from "react-hot-toast";
// import { decryptData } from "../utils/encryptData";

const useApi = () => {

  const [userFeedBack, setUserFeedBack] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  
  const COHERE_AI_API_KEY = process.env.COHERE_AI_API_KEY

  const cohere = new CohereClient({token: COHERE_AI_API_KEY});
  
  const getEvaluation = useCallback(async (question, answer) => {
    setLoading(true);
    
    try {
      const examples = await getClassifierExamples() 
      console.log(examples)

      const response = async (_ans, _exe) => {
        await cohere.classify({
          model: "embed-english-v3.0",
          inputs: [_ans],
          examples: _exe });
        console.log(`The confidence levels of the labels are ${JSON.stringify(response.classifications)}`);

        const result = await response.json();

        if (response.status !== 200) {
          const message = result.error.message;
          toast.error(message);
          throw new Error(message);
          } 
          return result;
      }

      const updateFeedback = (_result) => {
        var _feedIdx = userFeedBack.findIndex((fd) => fd.question === question) 
        if (_feedIdx > 0){
          var _newarry = userFeedBack
          _newarry[_feedIdx] = { "question": question, "feedback": answer, 
                                  "evaluation": _result.prediction, 
                                  "confidence": _result.confidence }
          setUserFeedBack(_newarry)
        } else {
          setUserFeedBack((prev) => [...prev, { "question": question, "feedback": answer, 
          "evaluation": _result.prediction, 
          "confidence": _result.confidence }])
        }
      }

      var _exeIdx = examples.findIndex((ele) => ele.text == answer)
      if(_exeIdx > 0){
        updateFeedback(examples[_exeIdx]);
      } else {
        var _exeupdate = []
        examplesforEach((ele) => {
          _exeupdate.push({"label": ele.label, "text": ele.text})
        });
        _exeupdate.concat(defaultExamples)
        var getResponse = await response(answer, _exeupdate)
        updateFeedback(getResponse.classifications)
      }

      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    error,
    loading,
    setLoading,
    setUserFeedBack,
    getEvaluation,
    userFeedBack
  };
};

export default useApi;
