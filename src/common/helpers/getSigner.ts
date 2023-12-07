var sigUtil = require('eth-sig-util');

import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SignerRecoverySelector } from '../constants';
import { getCheckedSumAddress } from './getCheckedSumAddress';

enum getSignerEnum {
  INVALID_SIGNATURE = 'Invalid signature length',
}

export function getSigner(
  signature: string,
  message,
  selector: Number
): string {
  let primaryTypeObj;
  let primaryType;

  if (selector == SignerRecoverySelector.SERVICE) {
    primaryType = 'addService';
    primaryTypeObj = [
      { name: 'nonce', type: 'uint256' },
      { name: 'infoHash', type: 'string' },
      { name: 'serviceAddress', type: 'address' },
    ];
  } else if (selector == SignerRecoverySelector.FEEDBACK) {
    primaryType = 'feedbackToService';
    primaryTypeObj = [
      { name: 'nonce', type: 'uint256' },
      { name: 'score', type: 'uint256' },
      { name: 'infoHash', type: 'string' },
      { name: 'serviceAddress', type: 'address' },
    ];
  } else if (selector == SignerRecoverySelector.FEEDBACK_ON_FEEDBACK) {
    primaryType = 'feedbackToFeedback';
    primaryTypeObj = [
      { name: 'nonce', type: 'uint256' },
      { name: 'score', type: 'uint256' },
      { name: 'infoHash', type: 'string' },
      { name: 'prevSubmitter', type: 'address' },
      { name: 'serviceAddress', type: 'address' },
    ];
  }

  const msgParams = JSON.stringify({
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
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
    message,
  });

  let recovered;

  try {
    recovered = sigUtil.recoverTypedSignature({
      data: JSON.parse(msgParams),
      sig: signature,
    });
  } catch (error) {
    if (error.message === getSignerEnum.INVALID_SIGNATURE) {
      throw new BadRequestException(getSignerEnum.INVALID_SIGNATURE);
    }

    console.log('getSigner func : ', error);

    throw new InternalServerErrorException(error.message);
  }

  return getCheckedSumAddress(recovered);
}
