import { TestBed } from '@angular/core/testing';

import { ChatbotEnseignant } from './chatbot';

describe('ChatbotEnseignant', () => {
  let service: ChatbotEnseignant;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatbotEnseignant);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
