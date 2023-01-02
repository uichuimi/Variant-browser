import { TokenStorageService } from "./token-storage.service";

describe("TokenStorageService", () => {
  let service: TokenStorageService;

  beforeEach(() => {
    service = new TokenStorageService();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
