import axios from 'axios';

import { PopulationsService } from './populations.service';

describe('PopulationsService', () => {
  let service: PopulationsService;
  let httpHandler = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 2000,
    //headers: { Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1aWNodWltaSIsImV4cCI6MTY0Nzg0MjQzOCwiaWF0IjoxNjQ3ODA2NDM4fQ.86Eyn3eR6H2fnub7xgHylivzcCMvT4B1gion254TtbTySKmHcnqYt6iC1BR3ILN5rQYO1wR3pGh6aoo3ImivlA' }
  });
  
  beforeEach(() => {
    service = new PopulationsService(httpHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
