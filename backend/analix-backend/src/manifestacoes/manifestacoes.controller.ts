import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  Query,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { ManifestacoesService } from './manifestacoes.service';
import { CreateManifestacoeDto } from './dto/create-manifestacoe.dto';
import { UpdateManifestacoeDto } from './dto/update-manifestacoe.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { RoutePolicenGuard } from 'src/auth/guards/route-policy.guard';
import { SetRoutePolicy } from 'src/auth/decorators/set-route-police.decorator';
import { RoutePolices } from 'src/auth/enum/route-policies.enum';

@UseGuards(AuthTokenGuard, RoutePolicenGuard)
@Controller('manifestacoes')
@UsePipes(ParseIntIdPipe)
export class ManifestacoesController {
  constructor(private readonly manifestacoesService: ManifestacoesService) {}

  @Post()
  create(@Body() createManifestacoeDto: CreateManifestacoeDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.manifestacoesService.create(
      createManifestacoeDto,
      tokenPayload,
    );
  }

  @Get()
  //@SetRoutePolicy(RoutePolices.admin)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.manifestacoesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.manifestacoesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body()
    updateManifestacoeDto: UpdateManifestacoeDto,
  ) {
    return this.manifestacoesService.update(id, updateManifestacoeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.manifestacoesService.remove(id);
  }

  @Patch(':id/label')
  updateLabel(
    @Param('id')
    id: number,
    @Body('labelId')
    labelId: number,
  ) {
    return this.manifestacoesService.updateLabel(id, labelId);
  }
  @Post('upload-manifest')
  @UseInterceptors(FileInterceptor('file'))
  async uploadManifest(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'application/pdf' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.manifestacoesService.uploadManifest(file);
  }
  @Patch(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async updateUpload(
    @Param('id') id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'application/pdf' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.manifestacoesService.updateUpload(id, file);
  }
}
