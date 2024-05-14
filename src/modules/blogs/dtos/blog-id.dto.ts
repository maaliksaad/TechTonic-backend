import { IsMongoId, IsNotEmpty } from 'class-validator'

export class BlogIdDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string
}
