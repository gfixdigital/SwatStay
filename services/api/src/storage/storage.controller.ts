import { BadRequestException, Body, Controller, Delete, Get, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { UserRole } from "../common/enums";
import { success } from "../common/api-response";
import { StorageFile, SupabaseStorageService } from "./supabase-storage.service";

@Controller("admin/media")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.OPERATIONS)
export class StorageController {
  constructor(private readonly storage: SupabaseStorageService) {}

  @Get()
  async list() { return success(await this.storage.listMedia(), "Media fetched successfully"); }

  @Post()
  @UseInterceptors(FileInterceptor("file", { limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: (_req, file, callback) => callback(null, file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") }))
  async upload(@UploadedFile() file?: StorageFile) { if (!file) throw new BadRequestException("A media file is required"); return success({ path: await this.storage.upload("media", file) }, "Media uploaded successfully"); }

  @Delete()
  async remove(@Body() input: { path?: string }) { if (!input.path) throw new BadRequestException("Media path is required"); return success(await this.storage.delete(input.path), "Media deleted successfully"); }
}
