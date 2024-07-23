import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory as surveyIDL } from "../../../declarations/survey_backend/survey_backend.did.js";

// const SURVEY_CANISTER_ID = "bkyz2-fmaaa-aaaaa-qaaaq-cai";
const SURVEY_CANISTER_ID = "bd3sg-teaaa-aaaaa-qaaba-cai";

export async function getSurveyCanister() {
  return await getCanister(SURVEY_CANISTER_ID, surveyIDL);
}

async function getCanister(canisterId, idl) {
  const authClient = window.auth.client;
  const agent = new HttpAgent({
    identity: authClient.getIdentity(),
  });
  
  await agent.fetchRootKey();
  return Actor.createActor(idl, {
    agent,
    canisterId,
  });
}