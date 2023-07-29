import { v4 as uuidv4 } from 'uuid';

export const SET_CREATED_AT = Symbol('SetCreatedAt');
export const SET_UUID = Symbol('SetID');
export const metadataKeys = [SET_CREATED_AT, SET_UUID];

export const SetCreatedAt = (date: number) => {
  return Reflect.metadata(SET_CREATED_AT, date);
};

export const SetID = (prefix: string) => {
  return Reflect.metadata(SET_UUID, prefix + uuidv4());
};
