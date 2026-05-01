import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';

@ApiTags('quotes')
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new quote request (Public)' })
  create(@Body() createQuoteDto: CreateQuoteDto) {
    return this.quotesService.create(createQuoteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all quote requests (Admin)' })
  findAll() {
    return this.quotesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quote by ID (Admin)' })
  findOne(@Param('id') id: string) {
    return this.quotesService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a quote request (Admin)' })
  remove(@Param('id') id: string) {
    return this.quotesService.remove(+id);
  }
}
