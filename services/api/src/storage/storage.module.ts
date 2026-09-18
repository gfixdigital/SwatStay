import { Global, Module } from "@nestjs/common";
import { SupabaseStorageService } from "./supabase-storage.service";

@Global()
@Module({ providers: [SupabaseStorageService], exports: [SupabaseStorageService] })
export class StorageModule {}
