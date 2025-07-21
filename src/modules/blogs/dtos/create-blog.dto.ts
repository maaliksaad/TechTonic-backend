import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @Transform(({ value }) => value.trim())
  title: string

  @IsNotEmpty()
  @IsString()
  @Length(10, 1000)
  @Transform(({ value }) => value.trim())
  content: string

  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  @Transform(({ value }) => value.trim())
  category: string

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @Transform(({ value }) => value.trim())
  slug: string

  @IsOptional()
  image: string
}
