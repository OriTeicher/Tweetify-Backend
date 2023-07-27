export interface IRepository<T> {
  create(entity: T);
  findAll();
  findOne(id: string);
  update(id: string, entity: T);
  delete(id: string);
}
