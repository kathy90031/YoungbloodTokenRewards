export class TokenInfo {
    private _childName: string;
    private _tokenCount: number;
    private _id: string;


    get childName(): string {
        return this._childName;
    }

    set childName(value: string) {
        this._childName = value;
    }

    get tokenCount(): number {
        return this._tokenCount;
    }

    set tokenCount(value: number) {
        this._tokenCount = value;
    }
}