import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: '😓  name must be a string 😓' })
  @IsNotEmpty({ message: '😓  name should not be empty 😓' })
  @Matches(/^[A-Za-z. ]+$/, {
    message: '😓  name must contain letters and spaces only 😓',
  })
  name: string;

  @IsEmail({})
  @IsNotEmpty({ message: '😓 Email should not be empty 😓' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '😓 Password should not be empty 😓' })
  @MinLength(8)
  @MaxLength(30)
  password: string;

  @IsOptional()
  profilePicture?: string;
}

export class LoginUserDto {
  email: string;
  password: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  profilePicture?: string;
}
