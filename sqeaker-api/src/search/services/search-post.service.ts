import { PostEntity } from 'src/posts/entities/post.entity';
import { SearchServiceBase } from './search-base.service';
import { Injectable } from '@nestjs/common';
import { FILEDS_TO_MATCH_POST, POST_INDEX } from '../constants';
import { SearchQuery } from '../interfaces/search-query.interface';
import ISearchService from '../interfaces/search-service.interface';
import { OnEvent } from '@nestjs/event-emitter';
import { POSTS_COLLECTION } from 'src/database/constants';
import {
  EVENT_CREATE_POSTFIX,
  EVENT_REMOVE_POSTFIX,
  EVENT_UPDATE_POSTFIX,
} from 'src/common/constants';

interface ISearchPostEntity {
  usrId: number;
  postId: number;
  title: string;
  content: string;
}

@Injectable()
export class SearchPostService implements ISearchService<PostEntity> {
  constructor(
    private readonly searchService: SearchServiceBase<ISearchPostEntity>,
  ) {
    searchService.setIndex(POST_INDEX);
  }

  @OnEvent(POSTS_COLLECTION + EVENT_CREATE_POSTFIX)
  async indexEntity(id: string, entity: PostEntity) {
    return await this.searchService.indexEntity(id, {});
  }

  @OnEvent(POSTS_COLLECTION + EVENT_UPDATE_POSTFIX)
  async updateEntity(newEntity: PostEntity) {
    return await this.searchService.updateEntity(newEntity.id.toString(), {});
  }

  @OnEvent(POSTS_COLLECTION + EVENT_REMOVE_POSTFIX)
  async deleteDocument(id: string) {
    return await this.searchService.deleteDocument(id);
  }

  async searchDocument(text: string) {
    const searchQuery: SearchQuery = {
      body: {
        query: {
          multi_match: {
            query: text,
            fields: FILEDS_TO_MATCH_POST,
          },
        },
      },
    };

    return await this.searchService.searchDocument(searchQuery);
  }
}
