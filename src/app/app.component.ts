import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Component,
  OnInit,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ThreadOptionsPanelComponent } from './components/thread-options-panel/thread-options-panel.component';
import { ThreadPanelComponent } from './components/thread-panel/thread-panel.component';
import { CoreService } from './core.service';
import { Role } from './types/message';
import { ModelSettings } from './types/model-settings';
import { OpenAiModel } from './types/open-ai-model';
import { OpenAiRequest } from './types/open-ai-request';
import { Thread } from './types/thread';
import { ThreadSummary } from './types/thread-summary';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    SidebarComponent,
    ThreadPanelComponent,
    ThreadOptionsPanelComponent,
  ],
  template: `
    <app-loading-spinner />
    <div class="container-fluid d-flex vh-100">
      <app-sidebar
        class="col-md-2"
        [threadList]="threadsSummaries()"
        (onSelectThread)="selectThread($event)"
      />
      <app-thread-panel
        class="col-md-8"
        [selectedThread]="selectedThread()"
        (onClearThread)="clearThread()"
        (onSendMessage)="sendMessage($event)"
      />
      <app-thread-options-panel
        class="col-md-2"
        [modelSettings]="modelSettings()"
        [openAiModels]="openAiModels"
        (onUpdateModelSettings)="updateModelSettings($event)"
      />
    </div>
  `,
  styles: ``,
})
export class AppComponent implements OnInit {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private openaiApiKey = '...';

  private httpClient: HttpClient = inject(HttpClient);
  private coreService: CoreService = inject(CoreService);

  private selectedThreadId: WritableSignal<string | undefined> =
    signal(undefined);
  private threads: WritableSignal<Thread[]> = signal([]);

  threadsSummaries: Signal<ThreadSummary[]> = computed(() =>
    this.threads().map((t) => ({ id: t.id, title: t.title }))
  );
  selectedThread: Signal<Thread | undefined> = computed(() =>
    this.threads().find((t) => t.id === this.selectedThreadId())
  );
  modelSettings: WritableSignal<ModelSettings | undefined> = signal(
    new ModelSettings()
  );

  openAiModels: OpenAiModel[] = [];

  constructor() {
    this.readThreadsFromLocalStorage();

    effect(() => {
      const threadsJson = JSON.stringify(this.threads());
      localStorage.setItem('threads', threadsJson);
    });
  }

  ngOnInit(): void {
    this.fetchOpenAiModels();
  }

  selectThread(threadId: string) {
    this.selectedThreadId.set(threadId);
  }

  clearThread() {
    this.threads.update((threads) => {
      return threads.filter((t) => t.id !== this.selectedThreadId());
    });
    this.makeSureThereIsAtLeastOneEmptyThread();
  }

  sendMessage(userMessage: string) {
    this.coreService.isLoading.set(true);
    const thread = this.buildThread();
    this.addMessage(thread, userMessage, 'user');
    this.setThreadTitle(thread, userMessage);
    const headers = this.buildHeaders();
    const requestBody: OpenAiRequest = this.buildBody(thread, userMessage);
    this.sendThread(requestBody, headers, thread);
  }

  fetchOpenAiModels() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.openaiApiKey}`,
    });

    this.httpClient
      .get('https://api.openai.com/v1/models', { headers })
      .subscribe(
        (response: any) => {
          this.openAiModels = response.data;
        },
        (error) => {
          console.error(
            'Errore durante il recupero dei modelli da OpenAI',
            error
          );
        }
      );
  }

  updateModelSettings(settings: ModelSettings) {
    this.modelSettings.set(settings);
  }

  private setThreadTitle(thread: Thread, userMessage: string) {
    this.threads.update((threads) => {
      threads = threads.map((t) => {
        if (t.id === thread.id) {
          t.title = t.messages[0]?.content ?? userMessage;
        }
        return t;
      });
      return threads;
    });
  }

  private addMessage(thread: Thread, userMessage: string, role: Role) {
    this.threads.update((threads) => {
      threads = threads.map((t) => {
        if (t.id === thread.id) {
          t.messages.push({ role: role, content: userMessage });
        }
        return t;
      });
      return threads;
    });
  }

  private buildBody(thread: Thread, userMessage: string): OpenAiRequest {
    return {
      model: thread.selectedModelId ?? '',
      messages: [
        { role: 'system', content: thread.systemPrompt ?? '' },
        ...thread.messages,
        { role: 'user', content: userMessage },
      ],
      temperature: thread.temperature ?? 1,
      max_tokens: thread.maxTokens ?? 4000,
      top_p: thread.topP ?? 1,
      frequency_penalty: thread.frequencyPenalty ?? 0,
      presence_penalty: thread.presencePenalty ?? 0,
    };
  }

  private buildHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.openaiApiKey}`,
    });
  }

  private readThreadsFromLocalStorage() {
    const threadsJson = localStorage.getItem('threads');
    if (threadsJson !== null && threadsJson !== 'undefined') {
      const threads: Thread[] = JSON.parse(threadsJson);
      if (threads.length > 0) {
        this.threads.set(threads);
      }
    }
    this.makeSureThereIsAtLeastOneEmptyThread();
  }

  private makeSureThereIsAtLeastOneEmptyThread() {
    const emptyThread = this.threads().filter((t) => t.messages.length === 0);
    if (emptyThread === undefined || emptyThread.length === 0) {
      this.threads.update((threads) => {
        threads.push(new Thread());
        return threads;
      });
    }
  }

  private buildThread() {
    return {
      ...this.selectedThread(),
      selectedModelId: this.modelSettings()?.selectedModelId,
      frequencyPenalty: this.modelSettings()?.frequencyPenalty,
      maxTokens: this.modelSettings()?.maxTokens,
      presencePenalty: this.modelSettings()?.presencePenalty,
      temperature: this.modelSettings()?.temperature,
      topP: this.modelSettings()?.topP,
      systemPrompt: this.modelSettings()?.systemPrompt,
    } as Thread;
  }

  private sendThread(
    requestBody: OpenAiRequest,
    headers: HttpHeaders,
    thread: Thread
  ) {
    this.httpClient.post(this.apiUrl, requestBody, { headers }).subscribe(
      (response: any) => {
        const assistantMessage: string = response.choices[0].message.content;
        this.addMessage(thread, assistantMessage, 'assistant');
        this.makeSureThereIsAtLeastOneEmptyThread();
        this.coreService.isLoading.set(false);
      },
      (error) => {
        console.error("Errore durante l'invio del messaggio a OpenAI", error);
        this.coreService.isLoading.set(false);
      }
    );
  }
}
