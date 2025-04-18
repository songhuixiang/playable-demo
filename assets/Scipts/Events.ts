export class Disposable {
    private _disposed: boolean;
    private _disposalAction: () => void;

    constructor(disposalAction: () => void) {
        this._disposed = false;
        this._disposalAction = disposalAction;
    }

    get disposed() {
        return this._disposed;
    }

    dispose() {
        if (!this.disposed) {
            this._disposed = true;
            this._disposalAction();
        }
    }
}

export class CompositeDisposable {
    private _disposed: boolean;
    private _disposables: Set<Disposable>;

    constructor(...disposables: Disposable[]) {
        this._disposed = false;
        this._disposables = new Set();
        for (let disposable of disposables) {
            this.add(disposable);
        }
    }

    get disposed() {
        return this._disposed;
    }

    add(disposable: Disposable) {
        if (!this._disposed) {
            this._disposables.add(disposable);
        }
    }

    remove(disposable: Disposable) {
        if (!this._disposed) {
            this._disposables.delete(disposable);
        }
    }

    clear() {
        if (!this._disposed) {
            this._disposables.clear();
        }
    }

    dispose() {
        if (!this._disposed) {
            this._disposed = true;
            this._disposables.forEach((disposable) => disposable.dispose());
            this._disposables.clear();
        }
    }
}

export class Event<T extends (...args: any[]) => any> {
    private emitter: Emitter;
    private name: string | symbol;

    constructor(emitter: Emitter, name: string | symbol) {
        this.emitter = emitter;
        this.name = name;
    }

    getName() {
        return this.name;
    }

    toString() {
        return `[Event ${this.name.toString()}]`;
    }

    on(handler: T, unshift: boolean = false) {
        return this.emitter.on(this.name, handler, unshift);
    }

    once(handler: T, unshift: boolean = false) {
        return this.emitter.once(this.name, handler, unshift);
    }

    hasHandler(handler: T) {
        return this.emitter.hasHandler(this.name, handler);
    }

    handlerCount() {
        return this.emitter.handlerCountForEventName(this.name);
    }

    readonly emit = ((...argsparam: any[]): Promise<ReturnType<T>>[] => {
        argsparam.unshift(this.name);
        return this.emitter.emit.apply(this.emitter, argsparam as any);
    }) as (...a: Parameters<T>) => Promise<ReturnType<T>>[];
}

export class Emitter {
    private _disposed: boolean;
    private _handlersByEventName: Map<string | symbol, Array<(...args: any[]) => any>>;

    constructor() {
        this._disposed = false;
        this._handlersByEventName = new Map();
    }

    get disposed() {
        return this._disposed;
    }

    clear() {
        if (!this._disposed) {
            this._handlersByEventName.clear();
        }
    }

    dispose() {
        if (!this._disposed) {
            this._disposed = true;
            this._handlersByEventName.clear();
        }
    }

    createEvent<T extends (...args: any[]) => void>(eventName?: string | symbol) {
        if (!eventName) {
            return new Event<T>(this, Symbol("Event"));
        }
        return new Event<T>(this, eventName);
    }

    on(eventName: string | symbol, handler: (...args: any[]) => any, unshift: boolean = false) {
        if (this._disposed) throw new Error("Emitter has been diposed");

        let currentHandler = this._handlersByEventName.get(eventName);
        if (currentHandler) {
            if (unshift) {
                currentHandler.unshift(handler);
            } else {
                currentHandler.push(handler);
            }
        } else {
            this._handlersByEventName.set(eventName, [handler]);
        }
        return new Disposable(this.off.bind(this, eventName, handler));
    }

    once(eventName: string | symbol, handler: (...args: any[]) => any, unshift: boolean = false) {
        let wrapped = (...args: any[]) => {
            disposable.dispose();
            return handler(...args);
        };
        let disposable = this.on(eventName, wrapped, unshift);
        return disposable;
    }

    hasHandler(eventName: string | symbol, handler: (...args: any[]) => any) {
        if (this._disposed) throw new Error("Emitter has been diposed");

        let currentHandler = this._handlersByEventName.get(eventName);
        if (currentHandler) {
            return !!currentHandler.find(handler);
        } else {
            return false;
        }
    }

    private off = (eventName: string | symbol, handlerToRemove: (...args: any[]) => any) => {
        if (this._disposed) throw new Error("Emitter has been diposed");

        let oldHandlers = this._handlersByEventName.get(eventName);
        if (oldHandlers) {
            let newHandlers = [];
            for (let handler of oldHandlers) {
                if (handler != handlerToRemove) {
                    newHandlers.push(handler);
                }
            }
            if (newHandlers.length) {
                this._handlersByEventName.set(eventName, newHandlers);
            } else {
                this._handlersByEventName.delete(eventName);
            }
        }
    };

    emit(eventName: string | symbol, ...args: any[]) {
        if (this._disposed) throw new Error("Emitter has been diposed");

        let handlers = this._handlersByEventName.get(eventName);
        if (!handlers) handlers = [];
        let result: Promise<any>[] = [];
        for (let handler of handlers) {
            try {
                let ret = handler(...args);
                if (ret === undefined) {
                    result.push(Promise.resolve());
                } else if (ret instanceof Promise) {
                    result.push(ret);
                } else {
                    result.push(Promise.resolve(ret));
                }
            } catch (e: any) {
                console.error(e, e.stack);
            }
        }
        return result;
    }

    getEventNames() {
        let ret: string[] = [];
        for (let k of this._handlersByEventName.keys()) {
            if (typeof k === "string") {
                ret.push(k);
            }
        }
        return ret;
    }

    getEventSymbols() {
        let ret: symbol[] = [];
        for (let k of this._handlersByEventName.keys()) {
            if (typeof k === "symbol") {
                ret.push(k);
            }
        }
        return ret;
    }

    handlerCountForEventName(eventName: string | symbol) {
        let name = this._handlersByEventName.get(eventName);
        if (name) return name.length;
        return 0;
    }

    getTotalListenerCount() {
        let result = 0;
        for (let eventName of this._handlersByEventName.keys()) {
            let name = this._handlersByEventName.get(eventName);
            let tmp = 0;
            if (name) tmp = name.length;
            result += tmp;
        }
        return result;
    }
}

/** Example
const emitter = new Emitter();

// Create FirstEvent
const firstEvent = emitter.createEvent<(data: string) => void>();
// Create SecondEvent
const secondEvent = emitter.createEvent<(data: string) => void>();

// Create CompositeDisposable
const disposable = new CompositeDisposable();

// Subscribe FirstEvent
disposable.add(
    firstEvent.on((data) => {
        console.log(data);
    })
);
// Subscribe SecondEvent
disposable.add(
    secondEvent.on((data) => {
        console.log(data);
    })
);

// Raising FirstEvent
firstEvent.emit("This is my first event emitter example.");
// Raising SecondEvent
secondEvent.emit("This is my second event emitter example.");

// Remove firstEvent and secondEvent listener
disposable.dispose();
 */
