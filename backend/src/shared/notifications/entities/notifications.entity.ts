import { Exclude, Expose } from 'class-transformer';

export class NotificationsEntity {
  @Exclude()
  notification_id: string;

  @Expose()
  public_id: string;

  @Exclude()
  user_id: string;

  @Expose()
  title: string;

  @Expose()
  message: string;

  @Expose()
  is_read: boolean;

  @Expose()
  created_at: string;
}
