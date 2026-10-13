// 🛡️ Prevent [runtime not ready]: TypeError: Cannot read property 'EventEmitter' of undefined
if (typeof globalThis !== 'undefined') {
  if (!(globalThis as any).expo) {
    (globalThis as any).expo = {};
  }
  if (!(globalThis as any).expo.EventEmitter) {
    class FallbackEventEmitter {
      private _listeners: Record<string, Function[]> = {};
      addListener(eventName: string, listener: Function) {
        if (!this._listeners[eventName]) this._listeners[eventName] = [];
        this._listeners[eventName].push(listener);
        return {
          remove: () => {
            this.removeListener(eventName, listener);
          },
        };
      }
      removeListener(eventName: string, listener: Function) {
        if (!this._listeners[eventName]) return;
        this._listeners[eventName] = this._listeners[eventName].filter((l) => l !== listener);
      }
      removeAllListeners(eventName?: string) {
        if (eventName) delete this._listeners[eventName];
        else this._listeners = {};
      }
      emit(eventName: string, ...args: any[]) {
        const listeners = this._listeners[eventName] || [];
        listeners.forEach((l) => {
          try {
            l(...args);
          } catch {}
        });
      }
    }
    (globalThis as any).expo.EventEmitter = FallbackEventEmitter;
  }
}

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
