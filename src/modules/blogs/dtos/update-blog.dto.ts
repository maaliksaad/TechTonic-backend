import { Transform } from 'class-transformer'
import { IsOptional, IsString, Length } from 'class-validator'

export class UpdateBlogDto {
  @IsOptional()
  @IsString()
  @Length(5, 10)
  @Transform(({ value }) => value.trim())
  title?: string

  @IsOptional()
  @IsString()
  @Length(10, 1000)
  @Transform(({ value }) => value.trim())
  content?: string

  @IsOptional()
  @IsString()
  @Length(5, 10)
  @Transform(({ value }) => value.trim())
  category?: string

  @IsOptional()
  @IsString()
  @Length(5, 10)
  @Transform(({ value }) => value.trim())
  slug?: string

  @IsOptional()
  @IsString()
  image?: string
}
