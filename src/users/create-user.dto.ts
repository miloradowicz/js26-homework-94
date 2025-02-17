import { IsNotEmpty, IsString, Length } from 'class-validator';
import { DocumentExists } from 'src/document-exists/document-exists';
import { User } from 'src/schemas/user.schema';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 30)
  @DocumentExists(User, 'username', true)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(5)
  password: string;

  @IsNotEmpty()
  @IsString()
  displayName: string;
}
