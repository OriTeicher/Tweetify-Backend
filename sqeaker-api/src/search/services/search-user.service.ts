import { Injectable } from '@nestjs/common';
import SearchServiceBase from './search-base.service';
import ISearchService from '../interfaces/search-service.interface';
import { UserEntity } from 'src/users/entities/user.entity';
import { FIELDS_TO_MATCH_USER, USER_INDEX } from '../constants';
import SearchQuery from '../interfaces/search-query.interface';

interface ISearchUserEntity {
  usrId: string;
  username: string;
  displayName: string;
}

@Injectable()
export default class SearchUserService implements ISearchService<UserEntity> {
  constructor(
    private readonly searchService: SearchServiceBase<ISearchUserEntity>,
  ) {
    searchService.setIndex(USER_INDEX);
  }

  async indexEntity(id: string, entity: UserEntity) {
    return await this.searchService.indexEntity(id, {
      usrId: entity.id,
      username: entity.username,
      displayName: entity.displayName,
    });
  }

  async updateEntity(newEntity: UserEntity) {
    return await this.searchService.updateEntity(newEntity.id.toString(), {
      usrId: newEntity.id,
      username: newEntity.username,
      displayName: newEntity.displayName,
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
