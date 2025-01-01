import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn } from 'typeorm'
import { User } from './User'

@Entity({ name: 'refreshTokens' })
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    userId!: number

    @Column({ type: 'timestamp' })
    expiresAt!: Date

    @ManyToOne(() => User, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'userId' })
    user!: User

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date
}
