import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    unique: true,
  })
  title: string;

  /* @Column('numeric', { default: 0 })
  price: number; */

  @Column({
    type: 'float',
    default: 0,
    nullable: true,
  })
  price: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'text',
    unique: true,
  })
  slug: string;

  @Column({
    type: 'int',
    default: 0,
    nullable: true,
  })
  stock: number;

  @Column({
    type: 'text',
    array: true,
  })
  sizes: string[];

  @Column({
    type: 'text',
  })
  gender: string;

  // tags

  @Column({
    type: 'text',
    array: true,
    default: [],
  })
  tags: string[];
  // images

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title
        .replaceAll(' ', '_')
        .replaceAll("'", '')
        .toUpperCase();
    }

    this.slug = this.slug
      .replaceAll(' ', '_')
      .replaceAll("'", '')
      .toUpperCase();
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.checkSlugInsert();
  }
}
