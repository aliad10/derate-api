import { Body, Controller, Get, Post } from "@nestjs/common";
import { Web3Service } from "./web3.service";
import {
  SignFeedbackOnFeedbackTxDto,
  SignFeedbackTxDto,
  SignServiceTxDto,
} from "./dto";

@Controller("web3")
export class Web3Controller {
  constructor(private readonly web3Service: Web3Service) {}

  @Post("/sign-service")
  async signServiceTx(@Body() dto: SignServiceTxDto): Promise<string> {
    return await this.web3Service.signServiceTx(
      dto.nonce,
      dto.infoHash,
      dto.serviceAddress
    );
  }
  @Post("/sign-feedback")
  async signFeedbackTx(@Body() dto: SignFeedbackTxDto): Promise<string> {
    return await this.web3Service.signFeedbackTx(
      dto.nonce,
      dto.infoHash,
      dto.serviceAddress,
      dto.score
    );
  }
  @Post("/sign-feedback-on-feedback")
  async signFeedbackOnFeedbackTx(
    @Body() dto: SignFeedbackOnFeedbackTxDto
  ): Promise<string> {
    return await this.web3Service.signFeedbackOnFeedbackTx(
      dto.nonce,
      dto.infoHash,
      dto.serviceAddress,
      dto.score,
      dto.prevSubmitter
    );
  }
}
