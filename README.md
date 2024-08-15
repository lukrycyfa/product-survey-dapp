# **PRODUCT-SURVEYS**
- With the integration of Cohere's Classification endpoint and Cohere's `embed-english-v3.0` model, an Internet Computer Replica (ICP), it's components and other libraries and utilities, This A.I Powered project feature's a market place environment that could be applied to an actual online store, D-app or as a standalone application. Having features for users to create products aliases for survey and have other users come take surveys on these products they have consumed or made use of, through some campaigns or other means. Giving product owners the privilege to gather data, gain some insight on a products success in a market, and to improve on quality. On the other hand let user's express their opinions on products from selected options on Survey Questions.

## **Disclaimer: Use of Unaudited Code for Educational Purposes Only**
This code is provided strictly for educational purposes and has not undergone any formal security audit. 
It may contain errors, vulnerabilities, or other issues that could pose risks to the integrity of your system or data.

By using this code, you acknowledge and agree that:
- No Warranty: The code is provided "as is" without any warranty of any kind, either express or implied. The entire risk as to the quality and performance of the code is with you.
- Educational Use Only: This code is intended solely for educational and learning purposes. It is not intended for use in any mission-critical or production systems.
- No Liability: In no event shall the authors or copyright holders be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the use or performance of this code.
- Security Risks: The code may not have been tested for security vulnerabilities. It is your responsibility to conduct a thorough security review before using this code in any sensitive or production environment.
- No Support: The authors of this code may not provide any support, assistance, or updates. You are using the code at your own risk and discretion.

Before using this code, it is recommended to consult with a qualified professional and perform a comprehensive security assessment. By proceeding to use this code, you agree to assume all associated risks and responsibilities.


## **Deploying And Testing The Project**


### **Required Tech Stack**

- To deploy and test this Project you would be needing these tech stacks...
    - Internet Computer Protocol (ICP): The core platform for deploying the Survey App, providing a decentralized infrastructure.
    - JavaScript/TypeScript: Used for the development of the Survey App, leveraging modern web development practices.
    - Node.js: The runtime environment for executing the JavaScript code outside of a browser.
    - Express: Node.js web application framework that provides a robust set of features for web and mobile applications, APIs.
    - DFINITY Canister SDK: A toolkit for building and deploying applications on the Internet Computer.
    - Internet Identity: A decentralized identity management system for the Internet Computer.
    - CohereAI API: An api platform that would be used for classifying question options.

### **Setup**

- This project was developed on a windows WSL2 Ubuntu 20.04 instance and would also do well on a Ubuntu 20.04 and later O.S.

- If you don't already have an account, Sign-up with Cohere [@here](https://cohere.com)
    - On your dashboard's `API key` section create a new or copy out existing Trial key, you will be needing it in the `.env` file you will be creating on the project root directory. Create this variable at the top of the file `REACT_APP_COHERE_AI_API_KEY` and assign the key as it's value.

- Follow the instruction on downloading and installing [DFX here](https://internetcomputer.org/docs/current/developer-docs/setup/install#installing-the-ic-sdk-1) 

- verify DFX installation by issuing this command
```bash
dfx --version
```

- Install Podman

- For Ubuntu
```bash
sudo apt-get update
sudo apt-get -y install podman
```
- For WSL2 follow the instructions provided in this link [here](https://gist.github.com/nikAizuddin/1c1822bd32b3c449433d0f81f796b71d)

- Verify the podman installation by issuing this command
```bash
podman info
```

- Clone the project from the repository here...
```bash
git clone https://github.com/lukrycyfa/product-survey-dapp.git
```

- Cd into the dir and install it's dependencies
```bash 
npm i
```
- Create `.env` file on the project root and assign `REACT_APP_COHERE_AI_API_KEY` variable it's value at the top of the file

- Start the internet Computer Replica
```bash
dfx start --background --clean
```

- Deploy all canister's with the command below
```bash
dfx deploy
```

- **Note**
    - After the deployment do cross check the canister's i.d's in the URL's against the  IDENTITY_PROVIDER canisterId on the Url in `utils/auth.js`, the baseUrl canisterId in `utils/survey.js` and the caniterId in `utils/caniterFactory.js`. If there are any differences, do update them to reflect recent changes and deploy again. 

- These url's would be provided to access the canisters after deployment.
```bash
URLs:
  Frontend canister via browser
    survey_frontend:
      - http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai
      - http://be2us-64aaa-aaaaa-qaabq-cai.localhost:4943/
  Backend canister via Candid interface:
    internet_identity: http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai
    survey_backend: http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai
```

### **Individual Deployments**

- You can deploy the canisters independently:

- Deploy the backend:

```bash
dfx deploy survey_backend
```

- Deploy the frontend:

```bash
dfx deploy survey_frontend
```

- Test the frontend locally:

```bash
npm start
```
### **Testing The D-APP**
- After the project is deployed, follow the link to the front-end canister provided on the terminal. Create an account, you will then have access to the utility on the Managed Product interface, create new products, add survey questions to the products, you can then switch accounts to take surveys on the products. 
