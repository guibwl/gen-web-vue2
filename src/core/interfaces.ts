export type Data = {
    [x: string]: any;
};

export type Handler = {
    id: string,
    store: Data,
    state: Data,
    updateState: CallableFunction,
    updateEvents: CallableFunction,
    componentState: Data
};