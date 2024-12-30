import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, ManyToOne } from 'typeorm'
import { UserRole } from '../types/interface'
import { Tenant } from './Tenant'

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
    @ManyToOne(() => Tenant)
    tenant: Tenant
    @UpdateDateColumn()
    updatedAt: number
    @CreateDateColumn()
    createdAt: number
}
