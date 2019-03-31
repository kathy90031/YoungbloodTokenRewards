export class Child {
    private _numberOfTokens: string;
    private _name: string;

    get numberOfTokens(): string {
        return this._numberOfTokens;
    }

    set numberOfTokens(value: string) {
        this._numberOfTokens = value;
    }


    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }
}
