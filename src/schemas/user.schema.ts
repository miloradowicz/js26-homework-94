/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { nanoid } from 'nanoid';
import { compare, genSalt, hash as genHash } from 'bcrypt';
import config from '../config';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop({
    required: [true, 'username is required'],
    unique: true,
  })
  username: string;

  @Prop({
    required: [true, 'password is required'],
  })
  password: string;

  @Prop({
    required: [true, 'displayMame is required'],
  })
  displayName: string;

  @Prop({
    type: String,
    default: null,
  })
  avatarUrl: string | null;

  @Prop({
    enum: ['user', 'admin'],
    required: [true, 'role is required'],
    default: 'user',
  })
  role: string;

  @Prop({
    type: String,
    default: null,
  })
  token: string | null;

  generateToken(): void {}
  clearToken(): void {}
  checkPassword(password: string): Promise<boolean> {
    return new Promise<boolean>(() => {});
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.generateToken = function (this: UserDocument) {
  this.token = nanoid();
};

UserSchema.methods.clearToken = function (this: UserDocument) {
  this.token = null;
};

UserSchema.methods.checkPassword = function (
  this: UserDocument,
  password: string,
) {
  return compare(password, this.password);
};

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await genSalt(config.saltWorkFactor);
  const hash = await genHash(this.password, salt);

  this.password = hash;
});

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});
