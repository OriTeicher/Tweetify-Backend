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
          prev[propertyName] = this.getMetadataValue(metadataValue);
        }
      });
      return prev;
    }, {});
  }

  getClassName() {
    return this.ctor.name;
  }

  private getMetadataValue(metadata: any) {
    if (typeof metadata === 'function') return metadata();
    return metadata;
  }
}
