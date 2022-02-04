import { RejectedFn, ResolveFn } from '../types';

interface Interceptor<T> {
  resolved: ResolveFn<T>;
  rejected?: RejectedFn;
}

export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>;

  constructor() {
    this.interceptors = [];
  }

  use(resolved: ResolveFn<T>, rejected?: RejectedFn): number {
    const interceptor: Interceptor<T> = {
      resolved,
      rejected
    };
    this.interceptors.push(interceptor);
    return this.interceptors.length - 1;
  }

  forEach(fn: (interceptor: Interceptor<T>, index?: number) => void): void {
    this.interceptors.forEach((interceptor, index) => {
      if (interceptor !== null) {
        fn(interceptor, index);
      }
    });
  }

  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null;
    }
  }
}
