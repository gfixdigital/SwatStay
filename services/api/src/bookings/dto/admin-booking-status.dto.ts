import { IsEnum } from "class-validator";
import { BookingStatus, PaymentStatus } from "../../common/enums";

export class AdminBookingStatusDto {
  @IsEnum(BookingStatus)
  status!: BookingStatus;
}

export class AdminBookingPaymentStatusDto {
  @IsEnum(PaymentStatus)
  paymentStatus!: PaymentStatus;
}
