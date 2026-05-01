import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from '../entities/quote.entity';
import { CreateQuoteDto } from './dto/create-quote.dto';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quote)
    private quotesRepository: Repository<Quote>,
  ) {}

  create(createQuoteDto: CreateQuoteDto) {
    const quote = this.quotesRepository.create(createQuoteDto);
    return this.quotesRepository.save(quote);
  }

  findAll() {
    return this.quotesRepository.find();
  }

  async findOne(id: number) {
    const quote = await this.quotesRepository.findOne({ where: { id } });
    if (!quote) throw new NotFoundException(`Quote with ID ${id} not found`);
    return quote;
  }

  async remove(id: number) {
    const quote = await this.findOne(id);
    return this.quotesRepository.remove(quote);
  }
}
