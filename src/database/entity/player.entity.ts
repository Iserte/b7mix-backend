import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Player {
  @PrimaryColumn()
  steamid!: string;

  @Column({ nullable: true })
  avatar?: string

  @Column({ nullable: true })
  avatarfull?: string
  
  @Column({ nullable: true })
  avatarhash?: string
  
  @Column({ nullable: true })
  avatarmedium?: string
  
  @Column({ nullable: true })
  commentpermission?: string
  
  @Column({ nullable: true })
  communityvisibilitystate?: string
  
  @Column({ nullable: true })
  lastlogoff?: string
  
  @Column({ nullable: true })
  loccityid?: string
  
  @Column({ nullable: true })
  loccountrycode?: string
  
  @Column({ nullable: true })
  locstatecode?: string
  
  @Column({ nullable: true })
  personaname?: string
  
  @Column({ nullable: true })
  personastate?: string
  
  @Column({ nullable: true })
  personastateflags?: string
  
  @Column({ nullable: true })
  primaryclanid?: string
  
  @Column({ nullable: true })
  profilestate?: string
  
  @Column({ nullable: true })
  profileurl?: string
  
  @Column({ nullable: true })
  timecreated?: string
}
