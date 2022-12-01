import {
  IsIn,
  IsOptional,
  IsString,
  IsArray,
  IsInt,
  IsPositive,
  IsNumber,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  stock?: number;

  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @IsIn(['men', 'woman', 'kind'])
  gender: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];
}
