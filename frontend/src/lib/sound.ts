// Sound effects permanently disabled across the application
class SoundManager {
  public getMuted(): boolean {
    return true;
  }

  public toggleMute(): boolean {
    return true;
  }

  public playClick(_pitch?: number): void {
    // Zero audio output
  }

  public playHover(_freq?: number): void {
    // Zero audio output
  }

  public playFlip(): void {
    // Zero audio output
  }
}

export const sound = new SoundManager();

