// import dependencies
import { useState, useCallback } from "react";
import { CohereClient } from "cohere-ai";
import { defaultExamples } from "../utils/defaultExamples";
import { getClassifierExamples } from "../utils/survey";
import toast from "react-hot-toast";

//the useClassify hook 
const useClassify = () => {
  // feedBack and loading state variables
  const [feedBack, setFeedBack] = useState([]);
  const [loading, setLoading] = useState(false);

  // create a cohere client instance
  const cohere = new CohereClient({token: process.env.REACT_APP_COHERE_AI_API_KEY });
  
  // the getEvaluation func to evaluation options from questions
  const getEvaluation = useCallback(async (options) => {
    feedBack.splice(0, feedBack.length)
    setLoading(true);

    
    try {
      // get examples
      const examples = await getClassifierExamples(window.auth.principalText) 
      const defaultExe = defaultExamples()

      //a func that calls cohere to  evaluate options
      const response = async (_ans, _exe) => {
       const evaluate = await cohere.classify({
          model: "embed-english-v3.0",
          inputs: _ans,
          examples:_exe
        });
        return evaluate
      }

      // create a new array of examples ommiting examples with texts == options
      const evaLexe = []
      examples.forEach((ele) => {
        if(options.findIndex((el) => el == ele.text) < 0){
          evaLexe.push(ele)
        }
      }) 

      // get evaluation from cohere
      const evalans = await response(options, defaultExe.concat(evaLexe))

      // create feed back from evaluation
      evalans.classifications.forEach((ele) => {
        feedBack.push({  "label": ele.prediction, "text": ele.input, 
        "confidence":  ele.confidence})
      });

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
    feedBack
  };
};

export default useClassify;
