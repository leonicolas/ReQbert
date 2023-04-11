export enum KeyState {
  Release = 0,
  Pressed = 1,
}

export const Keys = {
  Space: "Space",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
};

export type KeyboardListenerCallback = (keyState: KeyState, keyboard: Keyboard) => void;

export default class Keyboard {
  private keyStates = new Map<string, KeyState>();
  private keyListeners = new Map<string, KeyboardListenerCallback>();

  addKeyListener(keyCode: string, callback: KeyboardListenerCallback) {
    this.keyListeners.set(keyCode, callback);
  }

  startListeningTo(eventEmitter: Window) {
    // Attach to the key down and up events.
    ["keydown", "keyup"].forEach((eventName) => {
      eventEmitter.addEventListener(eventName, (event: Event) => this.handleEvent(event as KeyboardEvent));
    });
  }

  resetListeners() {
    this.keyListeners.clear();
    this.keyStates.clear();
  }

  getKeyState(keyCode: string): KeyState | undefined {
    return this.keyStates.get(keyCode);
  }

  private handleEvent(event: KeyboardEvent) {
    const keyCode = event.code;

    // Checks if there is a listener for the pressed key
    if (!this.keyListeners.has(keyCode)) return;

    // Prevent the default browser behavior
    event.preventDefault();

    // Checks if the key was already in the state
    const keyState = event.type === "keydown" ? KeyState.Pressed : KeyState.Release;
    if (this.keyStates.get(keyCode) === keyState) return;

    // Save the current key state and trigger the listener callback
    this.keyStates.set(keyCode, keyState);
    const keyListener = this.keyListeners.get(keyCode);
    if (keyListener)
      keyListener(keyState, this);
  }
}
