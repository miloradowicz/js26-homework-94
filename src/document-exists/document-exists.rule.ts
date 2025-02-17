import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Connection, Error } from 'mongoose';

@ValidatorConstraint({ name: 'DocumentExists', async: true })
@Injectable()
export class DocumentExistsRule implements ValidatorConstraintInterface {
  private e: unknown;

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async validate(value: string, args: ValidationArguments) {
    try {
      return !!(await this.connection.models[
        args.constraints[0] as string
      ].findById(value));
    } catch (e) {
      this.e = e;
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    if (this.e instanceof Error.CastError) {
      return 'invalid id';
    } else {
      return `${args.property} not found`;
    }
  }
}
