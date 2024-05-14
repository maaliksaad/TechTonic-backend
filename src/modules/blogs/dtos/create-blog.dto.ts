import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 10)
  @Transform(({ value }) => value.trim())
  title: string

  @IsNotEmpty()
  @IsString()
  @Length(10, 1000)
  @Transform(({ value }) => value.trim())
  content: string

  @IsNotEmpty()
  @IsString()
  @Length(5, 10)
  @Transform(({ value }) => value.trim())
  category: string

  @IsNotEmpty()
  @IsString()
  @Length(5, 10)
  @Transform(({ value }) => value.trim())
  slug: string

  @IsNotEmpty()
  @IsString()
  image: string
}
