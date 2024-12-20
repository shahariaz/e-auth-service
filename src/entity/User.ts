import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { UserRole } from '../types/interface'

@Entity()
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
}
