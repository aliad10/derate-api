import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ethers, Wallet } from "ethers";
import { resultHandler } from "src/common/helpers";
const {
  signTypedData,
  SignTypedDataVersion,
} = require("@metamask/eth-sig-util");
const Web3 = require("web3");
const DerateContract = require("./../../abi/DeRate.json");

const AccessRestrictionContract = require("./../../abi/AccessRestriction.json");

@Injectable()
export class Web3Service {
  private web3Instance;

  private readonly signer;
  private readonly provider;

  constructor(private configService: ConfigService) {
    this.web3Instance = new Web3(
      configService.get<string>("NODE_ENV") === "test"
        ? configService.get<string>("WEB3_PROVIDER_TEST")
        : configService.get<string>("WEB3_PROVIDER")
    );

    this.web3Instance.eth.net
      .isListening()
      .then(() => console.log("web3Instance : is connected"))
      .catch((e) =>
        console.error("web3Instance : Something went wrong : " + e)
      );

    const web3Provider =
      this.configService.get<string>("NODE_ENV") == "production"
        ? this.configService.get<string>("WEB3_PROVIDER")
        : this.configService.get<string>("WEB3_PROVIDER_TEST");

    this.provider = new ethers.providers.JsonRpcProvider(web3Provider);

    const privateKey =
      this.configService.get<string>("NODE_ENV") == "production"
        ? this.configService.get<string>("SCRIPT_PK")
        : this.configService.get<string>("SCRIPT_PK_TEST");

    this.signer = new Wallet(privateKey, this.provider);
  }

  async grantUserRole(to: string) {
    console.log("thos.signer", this.signer);

    try {
      const contractAddress = this.configService.get<string>(
        "ACCESS_RESTRICTION_CONTRACT_ADDRESS"
      );
      console.log("contractttt", contractAddress);

      const contractABI = AccessRestrictionContract.abi;

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        this.signer
      );

      console.log("contract", contract);

      let transaction = await contract.giveUserRole(to, {
        gasLimit: 2e6,
      });

      console.log("transaaaaa", transaction);

      let transactionResponse = await transaction.wait();

      const transactionHash = transactionResponse.transactionHash;

      return resultHandler(200, "withdraw distributed", transactionHash);
    } catch (error) {
      console.log("error", error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getServiceData(serviceAddress: string) {
    try {
      const contractAddress = this.configService.get<string>(
        "DERATE_CONTRACT_ADDRESS"
      );

      const contractABI = DerateContract.abi;

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        this.signer
      );

      const service = await contract.services(serviceAddress);
      return service;
    } catch (error) {
      console.log("getService func : ", error);

      throw new InternalServerErrorException(error.message);
    }
  }

  async getFeedbackData(submitter: string, serviceAddress: string) {
    try {
      const contractAddress = this.configService.get<string>(
        "DERATE_CONTRACT_ADDRESS"
      );

      const contractABI = DerateContract.abi;

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        this.signer
      );

      const feedback = await contract.serviceFeedbacks(
        submitter,
        serviceAddress
      );

      return feedback;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async getFeedbackOnFeedbackData(
    submitter: string,
    prevSubmitter: string,
    serviceAddress: string
  ) {
    try {
      const contractAddress = this.configService.get<string>(
        "DERATE_CONTRACT_ADDRESS"
      );

      const contractABI = DerateContract.abi;

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        this.signer
      );

      const feedback = await contract.feedbackFeedbacks(
        submitter,
        prevSubmitter,
        serviceAddress
      );

      return feedback;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async executeAddService(
    nonce: number,
    submitter: string,
    service: string,
    infoHash: string,
    v: number,
    r: string,
    s: string
  ) {
    try {
      const contractAddress = this.configService.get<string>(
        "DERATE_CONTRACT_ADDRESS"
      );

      const contractABI = DerateContract.abi;

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        this.signer
      );

      let transaction = await contract.addService(
        nonce,
        submitter,
        service,
        infoHash,
        v,
        r,
        s,
        {
          gasLimit: 2e7,
        }
      );

      let transactionResponse = await transaction.wait();

      const transactionHash = transactionResponse.transactionHash;

      return resultHandler(200, "service added", transactionHash);
    } catch (error) {
      console.log("add service func : ", error);

      throw new InternalServerErrorException(error.message);
    }
  }

  async executeAddServiceBatch(inputs) {
    try {
      const contractAddress = this.configService.get<string>(
        "DERATE_CONTRACT_ADDRESS"
      );

      const contractABI = DerateContract.abi;

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        this.signer
      );

      let transaction = await contract.addServiceBatch(inputs, {
        gasLimit: 2e7,
      });

      let transactionResponse = await transaction.wait();

      const transactionHash = transactionResponse.transactionHash;

      return resultHandler(200, "service added", transactionHash);
    } catch (error) {
      console.log("add service func : ", error);

      throw new InternalServerErrorException(error.message);
    }
  }
  async executeAddFeedback(
    nonce: number,
    score: number,
    submitter: string,
    service: string,
    infoHash: string,
    v: number,
    r: string,
    s: string
  ) {
    try {
      const contractAddress = this.configService.get<string>(
        "DERATE_CONTRACT_ADDRESS"
      );

      const contractABI = DerateContract.abi;

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        this.signer
      );

      let transaction = await contract.submitFeedbackToService(
        nonce,
        score,
        submitter,
        service,
        infoHash,
        v,
        r,
        s,
        {
          gasLimit: 2e6,
        }
      );

      let transactionResponse = await transaction.wait();

      const transactionHash = transactionResponse.transactionHash;

      return resultHandler(200, "feedback to service added", transactionHash);
    } catch (error) {
      console.log("add service func : ", error);

      throw new InternalServerErrorException(error.message);
    }
  }
  async executeAddFeedbackOnFeedback(
    nonce: number,
    score: number,
    prevSubmitter: string,
    submitter: string,
    service: string,
    infoHash: string,
    v: number,
    r: string,
    s: string
  ) {
    try {
      const contractAddress = this.configService.get<string>(
        "DERATE_CONTRACT_ADDRESS"
      );

      const contractABI = DerateContract.abi;

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        this.signer
      );

      let transaction = await contract.submitFeedbackToFeedback(
        nonce,
        score,
        prevSubmitter,
        submitter,
        service,
        infoHash,
        v,
        r,
        s,
        {
          gasLimit: 2e6,
        }
      );

      let transactionResponse = await transaction.wait();

      const transactionHash = transactionResponse.transactionHash;

      return resultHandler(200, "feedback on feedback added", transactionHash);
    } catch (error) {
      console.log("add service func : ", error);

      throw new InternalServerErrorException(error.message);
    }
  }

  async signServiceTx(
    nonce: number,
    infoHash: string,
    serviceAddress: string
  ): Promise<string> {
    const privateKey = process.env.SCRIPT_PK; // your private key

    let primaryTypeObj;
    let primaryType;
    let messageParams = {};

    primaryType = "addService";
    primaryTypeObj = [
      { name: "nonce", type: "uint256" },
      { name: "infoHash", type: "string" },
      { name: "serviceAddress", type: "address" },
    ];
    messageParams = {
      nonce,
      infoHash,
      serviceAddress,
    };

    const signature = signTypedData({
      privateKey,
      data: {
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          [primaryType]: primaryTypeObj,
        },
        primaryType,
        domain: {
          name: process.env.EIP712_DOMAIN_NAME,
          version: process.env.EIP712_VERSION,
          chainId: Number(process.env.CHAIN_ID),
          verifyingContract: process.env.VERIFYING_CONTRACT,
        },
        message: messageParams,
      },
      version: SignTypedDataVersion.V4,
    });

    return signature;
  }
  async signFeedbackTx(
    nonce: number,
    infoHash: string,
    serviceAddress: string,
    score: number
  ): Promise<string> {
    const privateKey = process.env.SCRIPT_PK; // your private key

    let primaryTypeObj;
    let primaryType;
    let messageParams = {};

    primaryType = "feedbackToService";
    primaryTypeObj = [
      { name: "nonce", type: "uint256" },
      { name: "score", type: "uint256" },
      { name: "infoHash", type: "string" },
      { name: "serviceAddress", type: "address" },
    ];
    messageParams = {
      nonce,
      score,
      infoHash,
      serviceAddress,
    };

    const signature = signTypedData({
      privateKey,
      data: {
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          [primaryType]: primaryTypeObj,
        },
        primaryType,
        domain: {
          name: process.env.EIP712_DOMAIN_NAME,
          version: process.env.EIP712_VERSION,
          chainId: Number(process.env.CHAIN_ID),
          verifyingContract: process.env.VERIFYING_CONTRACT,
        },
        message: messageParams,
      },
      version: SignTypedDataVersion.V4,
    });
    return signature;
  }
  async signFeedbackOnFeedbackTx(
    nonce: number,
    infoHash: string,
    serviceAddress: string,
    score: number,
    prevSubmitter: string
  ): Promise<string> {
    const privateKey = process.env.SCRIPT_PK; // your private key

    let primaryTypeObj;
    let primaryType;
    let messageParams = {};

    primaryType = "feedbackToFeedback";
    primaryTypeObj = [
      { name: "nonce", type: "uint256" },
      { name: "score", type: "uint256" },
      { name: "infoHash", type: "string" },
      { name: "prevSubmitter", type: "address" },
      { name: "serviceAddress", type: "address" },
    ];
    messageParams = {
      nonce,
      score,
      infoHash,
      prevSubmitter,
      serviceAddress,
    };

    const signature = signTypedData({
      privateKey,
      data: {
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          [primaryType]: primaryTypeObj,
        },
        primaryType,
        domain: {
          name: process.env.EIP712_DOMAIN_NAME,
          version: process.env.EIP712_VERSION,
          chainId: Number(process.env.CHAIN_ID),
          verifyingContract: process.env.VERIFYING_CONTRACT,
        },
        message: messageParams,
      },
      version: SignTypedDataVersion.V4,
    });

    return signature;
  }
  getWeb3Instance() {
    return this.web3Instance;
  }
}
