import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, Length } from 'class-validator'

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.trim())
  email: string

  @IsNotEmpty()
  @Length(8, 16)
  password: string
}
