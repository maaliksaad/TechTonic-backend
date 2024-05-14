import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator'

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.trim())
  email: string

  @IsNotEmpty()
  @Length(8, 16)
  password: string

  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(5, 10)
  name: string

  @IsOptional()
  image: string
}
