import { useState, useCallback } from "react";
import { CohereClient } from "cohere-ai";
import { defaultExamples } from "../utils/defaultExamples";
import { getClassifierExamples } from "../utils/survey";
import toast from "react-hot-toast";
// import { decryptData } from "../utils/encryptData";

const useClassify = () => {

  const [feedBack, setFeedBack] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  
  const COHERE_AI_API_KEY = process.env.COHERE_AI_API_KEY

  const cohere = new CohereClient({token: COHERE_AI_API_KEY});
  
  const getEvaluation = useCallback(async (answers) => {
    setLoading(true);
    
    try {
      const examples = await getClassifierExamples() 
      console.log(examples)

      const response = await cohere.classify({
        model: "embed-english-v3.0",
        inputs: answers,
        examples: examples.length > 0 ? examples.concat(defaultExamples) : defaultExamples 
      });
      console.log(`The confidence levels of the labels are ${JSON.stringify(response.classifications)}`);

      const result = await response.json();

      if (response.status !== 200) {
        const message = result.error.message;
        toast.error(message);
        throw new Error(message);
      }
      var _feedback = []
      result.forEach((ele) => {
        _feedback.push({  "label": ele.classifications.prediction, "text": ele.classifications.input, "confidence": ele.classifications.confidence})
      });
      setFeedBack(_feedback);
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
    setFeedBack,
    getEvaluation,
    feedBack
  };
};

export default useClassify;
