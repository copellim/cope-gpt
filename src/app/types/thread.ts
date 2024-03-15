import { Message } from './message';

const baseTitle = 'New thread';

export class Thread {
  id: string;
  title: string = baseTitle;
  messages: Message[] = [];
  selectedModelId?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  systemPrompt?: string;

  constructor() {
    this.id = Math.random().toString(36).substring(3);
  }
}
