import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers, Wallet } from 'ethers';
import { resultHandler } from 'src/common/helpers';

const Web3 = require('web3');
const DerateContract = require('./../../abi/DeRate.json');

const AccessRestrictionContract = require('./../../abi/AccessRestriction.json');

@Injectable()
export class Web3Service {
  private web3Instance;

  private readonly signer;
  private readonly provider;

  constructor(private configService: ConfigService) {
    this.web3Instance = new Web3(
      configService.get<string>('NODE_ENV') === 'test'
        ? configService.get<string>('WEB3_PROVIDER_TEST')
        : configService.get<string>('WEB3_PROVIDER')
    );

    this.web3Instance.eth.net
      .isListening()
      .then(() => console.log('web3Instance : is connected'))
      .catch((e) =>
        console.error('web3Instance : Something went wrong : ' + e)
      );

    const web3Provider =
      this.configService.get<string>('NODE_ENV') == 'production'
        ? this.configService.get<string>('WEB3_PROVIDER')
        : this.configService.get<string>('WEB3_PROVIDER_TEST');

    this.provider = new ethers.providers.JsonRpcProvider(web3Provider);

    const privateKey =
      this.configService.get<string>('NODE_ENV') == 'production'
        ? this.configService.get<string>('SCRIPT_PK')
        : this.configService.get<string>('SCRIPT_PK_TEST');

    this.signer = new Wallet(privateKey, this.provider);
  }

  async grantUserRole(to: string) {
    try {
      const contractAddress = this.configService.get<string>(
        'ACCESS_RESTRICTION_CONTRACT_ADDRESS'
      );

      const contractABI = AccessRestrictionContract.abi;

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        this.signer
      );

      let gasPrice = await this.provider.getGasPrice();

      let transaction = await contract.giveUserRole(to, {
        gasLimit: 2e6,
      });

      let transactionResponse = await transaction.wait();

      const transactionHash = transactionResponse.transactionHash;

      return resultHandler(200, 'withdraw distributed', transactionHash);
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getServiceData(serviceAddress: string) {
    try {
      const contractAddress = this.configService.get<string>(
        'ACCESS_RESTRICTION_CONTRACT_ADDRESS'
      );

      const contractABI = DerateContract.abi;

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        this.signer
      );

      const service = await contract.services(serviceAddress).call();
      return service;
    } catch (error) {
      console.log('getService func : ', error);

      throw new InternalServerErrorException(error.message);
    }
  }

  async getFeedbackData(submitter: string, serviceAddress: string) {
    try {
      const contractAddress = this.configService.get<string>(
        'ACCESS_RESTRICTION_CONTRACT_ADDRESS'
      );

      const contractABI = DerateContract.abi;

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        this.signer
      );

      const feedback = await contract
        .serviceFeedbacks(submitter, serviceAddress)
        .call();
      return feedback;
    } catch (error) {
      console.log('getFeedbackData func : ', error);

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
        'ACCESS_RESTRICTION_CONTRACT_ADDRESS'
      );

      const contractABI = DerateContract.abi;

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        this.signer
      );

      const feedback = await contract
        .feedbackFeedbacks(submitter, prevSubmitter, serviceAddress)
        .call();
      return feedback;
    } catch (error) {
      console.log('getPlanterData func : ', error);

      throw new InternalServerErrorException(error.message);
    }
  }

  getWeb3Instance() {
    return this.web3Instance;
  }
}
