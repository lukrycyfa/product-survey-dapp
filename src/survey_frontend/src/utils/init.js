import { getSurveyCanister } from "./canisterFactory";
import { getAuthClient } from "./auth";

export async function initializeContract() {
  const authClient = await getAuthClient();
  window.auth = {};
  window.canister = {};
  window.auth.client = authClient;
  window.auth.isAuthenticated = await authClient.isAuthenticated();
  window.auth.identity = authClient.getIdentity();
  window.auth.principal = authClient.getIdentity()?.getPrincipal();
  window.auth.pubKey = window.auth.isAuthenticated ? authClient.getIdentity()?._delegation.publicKey : "";
  window.auth.principalText = authClient.getIdentity()?.getPrincipal().toText();
  window.canister.survey = await getSurveyCanister();
}
