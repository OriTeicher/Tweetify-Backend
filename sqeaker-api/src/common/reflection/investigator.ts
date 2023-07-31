import { ClassConstructor } from 'class-transformer';
import { metadataKeys } from './decorators/setCreatedAt.decorator';

export class Investigator<T> {
  constructor(private readonly ctor: ClassConstructor<T>) {}

  collectMetadata(entity: T) {
    const temp = new this.ctor();

    return metadataKeys.reduce((prev, key) => {
      Object.getOwnPropertyNames(entity).forEach((propertyName) => {
        const metadataValue = Reflect.getMetadata(key, temp, propertyName);
        if (metadataValue !== undefined) {
          prev[propertyName] = metadataValue();
        }
      });
      return prev;
    }, {});
  }
}
