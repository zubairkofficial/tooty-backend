import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OptionService } from './option.service';

@Controller('option')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  
}
