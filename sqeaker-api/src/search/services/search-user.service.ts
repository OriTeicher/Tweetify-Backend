import { Injectable } from '@nestjs/common';
import SearchServiceBase from './search-base.service';
import ISearchService from '../interfaces/search-service.interface';
import User from 'src/user/entities/user.entity';
import { FIELDS_TO_MATCH_USER, USER_INDEX } from '../constants';
import SearchQuery from '../interfaces/search-query.interface';

interface ISearchUserEntity {
  usrId: number;
  firstName: string;
  lastName: string;
}

@Injectable()
export default class SearchUserService implements ISearchService<User> {
  constructor(
    private readonly searchService: SearchServiceBase<ISearchUserEntity>,
  ) {
    searchService.setIndex(USER_INDEX);
  }

  async indexEntity(id: string, entity: User) {
    return await this.searchService.indexEntity(id, {
      usrId: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
    });
  }

  async updateEntity(newEntity: User) {
    return await this.searchService.updateEntity(newEntity.id.toString(), {
      usrId: newEntity.id,
      firstName: newEntity.firstName,
      lastName: newEntity.lastName,
    });
  }

  async deleteDocument(id: string) {
    return await this.searchService.deleteDocument(id);
  }

  async searchDocument(text: string) {
    const searchQuery: SearchQuery = {
      body: {
        query: {
          multi_match: {
            query: text,
            fields: FIELDS_TO_MATCH_USER,
          },
        },
      },
    };

    return await this.searchService.searchDocument(searchQuery);
  }
}
