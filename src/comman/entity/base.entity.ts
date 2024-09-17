import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsUUID,
  Length,
  MaxLength,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({ type: 'boolean', default: true })
  @IsBoolean()
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  isArchived: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @IsDate()
  createDateTime: Date;

  @Column({ type: 'varchar', length: 300 })
  @Length(1, 300)
  createdBy: string;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @IsDate()
  lastChangedDateTime: Date;

  @Column({ type: 'varchar', length: 300 })
  @Length(1, 300)
  lastChangedBy: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  @IsOptional()
  @MaxLength(300)
  internalComment?: string;
}
