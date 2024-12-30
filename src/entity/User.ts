import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm'
import { UserRole } from '../types/interface'

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id!: number
    @Column()
    firstName: string
    @Column()
    lastName: string
    @Column({
        unique: true
    })
    email: string
    @Column()
    password: string
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER
    })
    role: UserRole
    @UpdateDateColumn()
    updatedAt: number
    @CreateDateColumn()
    createdAt: number
}
