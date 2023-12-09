import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { getServiceDataQuery, getUserDataQuery } from 'src/common/graphQuery';
@Injectable()
export class GraphService {
  constructor(private config: ConfigService) {}

  async getUserData(userId: string) {
    const theGraphUrl = this.config.get<string>('THE_GRAPH_URL');

    if (!theGraphUrl) {
      throw new InternalServerErrorException('invalid theGraph url');
    }

    try {
      const postBody = {
        query: getUserDataQuery.replace(/USER_ID/g, userId),
        variables: null,
      };

      const res = await axios.post(theGraphUrl, postBody);

      if (res.status == 200 && res.data.data) {
        if (res.data.data.userReputation == null) {
          return {
            id: userId,
            plantDate: '0',
            planter: '0x0',
            treeStatus: '0',
          };
        } else {
          let data = res.data.data.userReputation;

          return data;
        }
      } else {
        throw new InternalServerErrorException();
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getServiceData(serviceAddress: string) {
    const theGraphUrl = this.config.get<string>('THE_GRAPH_URL');

    if (!theGraphUrl) {
      throw new InternalServerErrorException('invalid theGraph url');
    }

    try {
      const postBody = {
        query: getServiceDataQuery.replace(/SERVICE_ADDRESS/g, serviceAddress),
        variables: null,
      };

      const res = await axios.post(theGraphUrl, postBody);

      if (res.status == 200 && res.data.data) {
        if (res.data.data.serviceReputation == null) {
          return {
            id: serviceAddress,
            plantDate: '0',
            planter: '0x0',
            treeStatus: '0',
          };
        } else {
          let data = res.data.data.serviceReputation;

          return data;
        }
      } else {
        throw new InternalServerErrorException();
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
