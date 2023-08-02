export default interface ISearchService<T> {
  indexEntity(id: string, entity: T);
  updateEntity(newEntity: T);
  searchDocument(query: string);
  deleteDocument(id: string);
}
