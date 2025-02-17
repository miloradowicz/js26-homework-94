import { ValidationOptions, registerDecorator } from 'class-validator';
import { DocumentExistsRule } from './document-exists.rule';

export const DocumentExists =
  (modelName: string, options?: ValidationOptions) =>
  (object: object, propertyName: string) =>
    registerDecorator({
      name: `DocumentExists`,
      target: object.constructor,
      propertyName,
      options,
      constraints: [modelName],
      validator: DocumentExistsRule,
    });
