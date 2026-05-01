import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new contact message (Public)' })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contact messages (Admin)' })
  findAll() {
    return this.contactsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact message by ID (Admin)' })
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact message (Admin)' })
  remove(@Param('id') id: string) {
    return this.contactsService.remove(+id);
  }
}
