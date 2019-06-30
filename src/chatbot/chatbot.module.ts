import { HttpModule, Module } from '@nestjs/common';
import { FacebookChatbotController } from './facebook-chatbot/facebook-chatbot.controller';
import { FacebookChatbotService } from './facebook-chatbot/facebook-chatbot.service';

@Module({
  imports: [HttpModule],
  controllers: [FacebookChatbotController],
  providers: [FacebookChatbotService],
})
export class ChatbotModule {}
