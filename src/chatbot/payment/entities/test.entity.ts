import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'test'})
export class TestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'facebook_id', nullable: false })
  facebookId: string;
}
