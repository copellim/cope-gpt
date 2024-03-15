import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModelSettings } from '../../types/model-settings';
import { OpenAiModel } from '../../types/open-ai-model';

@Component({
  selector: 'app-thread-options-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="form-section bg-dark-subtle">
      @if (modelSettings) {
      <form [formGroup]="settingsForm" (ngSubmit)="updateModelSettings()">
        <label>GPT Model</label>
        <select formControlName="selectedModelId">
          <option *ngFor="let model of openAiModels" [value]="model.id">
            {{ model.id }}
          </option>
        </select>

        <label>Temperature</label>
        <input formControlName="temperature" type="number" />

        <label>Max Tokens</label>
        <input formControlName="maxTokens" type="number" />

        <label>Top P</label>
        <input formControlName="topP" type="number" />

        <label>Frequency Penalty</label>
        <input formControlName="frequencyPenalty" type="number" />

        <label>Presence Penalty</label>
        <input formControlName="presencePenalty" type="number" />

        <label>System Prompt</label>
        <textarea formControlName="systemPrompt"></textarea>

        <button type="submit">Update Settings</button>
      </form>
      }
    </div>
  `,
  styles: `
  .form-section {
    padding: 0 1rem;
    // background-color: #ddd;
  }

  .form-section form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }`,
})
export class ThreadOptionsPanelComponent implements OnInit {
  @Input() modelSettings?: ModelSettings;
  @Input() openAiModels: OpenAiModel[] = [];

  @Output() onUpdateModelSettings = new EventEmitter<ModelSettings>();

  private fb: FormBuilder = inject(FormBuilder);
  settingsForm: FormGroup;

  constructor() {
    this.settingsForm = this.fb.group({
      selectedModelId: [''],
      temperature: [''],
      maxTokens: [''],
      topP: [''],
      frequencyPenalty: [''],
      presencePenalty: [''],
      systemPrompt: [''],
    });
  }
  ngOnInit(): void {
    if (this.modelSettings !== undefined) {
      this.settingsForm.patchValue(this.modelSettings);
    }
  }

  updateModelSettings() {
    if (this.modelSettings) {
      const settings: ModelSettings = this.settingsForm.value;
      this.onUpdateModelSettings.emit(settings);
    }
  }
}
