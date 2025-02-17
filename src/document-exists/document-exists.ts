import { ValidationOptions, registerDecorator } from 'class-validator';
import { DocumentExistsRule } from './document-exists.rule';
import { Type } from '@nestjs/common';

export const DocumentExists =
  <TModel extends object>(
    Model: Type<TModel>,
    fieldName?: string,
    inverse: boolean = false,
    options?: ValidationOptions,
  ) =>
  (object: object, propertyName: string) =>
    registerDecorator({
      name: `DocumentExists`,
      target: object.constructor,
      propertyName,
      options,
      constraints: [Model, fieldName, inverse],
      validator: DocumentExistsRule,
    });
