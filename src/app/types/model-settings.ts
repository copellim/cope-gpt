const baseSystemPrompt = 'sei uno sviluppatore senior angular';
const baseModelId = 'gpt-3.5-turbo';
const baseTemperature = 1;
const baseMaxTokens = 4000;
const baseTopP = 1;
const baseFrequencyPenalty = 0;
const basePresencePenalty = 0;

export class ModelSettings {
  selectedModelId: string = baseModelId;
  temperature: number = baseTemperature;
  maxTokens: number = baseMaxTokens;
  topP: number = baseTopP;
  frequencyPenalty: number = baseFrequencyPenalty;
  presencePenalty: number = basePresencePenalty;
  systemPrompt: string = baseSystemPrompt;
}
