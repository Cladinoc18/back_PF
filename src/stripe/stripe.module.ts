import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { StripeService } from "./stripe.service";
import { StripeController } from "./stripe.controller";

@Module({
    imports: [ConfigModule],
    providers: [StripeService],
    controllers: [StripeController],
    exports: [StripeService],
})
export class StripeModule {}
