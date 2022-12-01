import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { validate as isUuid } from 'uuid';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    try {
      const product = await this.productRepository.find({
        take: limit,
        skip: offset,
      });
      return product;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(term: string) {
    let product: Product;

    if (isUuid(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      // product = await this.productRepository.findOneBy({ slug: term });

      const querybuilder = this.productRepository.createQueryBuilder();
      product = await querybuilder
        .where('UPPER(title)=:tittle or slug=:slug', {
          tittle: term.toUpperCase(),
          slug: term.toUpperCase(),
        })
        .getOne();
    }

    /* select * from product where slug=xx or tittle=xx  */

    if (!product)
      throw new NotFoundException(`product with id:${term} no found`);

    return product;

    // this.handleError(error);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });

    if (!product) throw new NotFoundException(`product with id ${id} no found`);

    try {
      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return product;
  }

  private handleError(error: any) {
    // console.log(error);
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'unexpected error, check server logs',
    );
  }
}
