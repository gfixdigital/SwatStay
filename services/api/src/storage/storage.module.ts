import { Global, Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { SupabaseStorageService } from "./supabase-storage.service";
import { StorageController } from "./storage.controller";

@Global()
@Module({ imports: [AuthModule], controllers: [StorageController], providers: [SupabaseStorageService], exports: [SupabaseStorageService] })
export class StorageModule {}
