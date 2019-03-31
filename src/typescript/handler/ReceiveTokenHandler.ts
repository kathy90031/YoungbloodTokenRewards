import {Child} from "../domain/Child";
import {ChildType} from "../type/ChildType";
import {TokenInfo} from "../../domain/TokenInfo";

export class ReceiveTokenHandler {

    execute(childName: string, tokenCount: number){

        let child = null;
        switch (childName) {
            case ChildType.GABRIEL:
                child = this.createChildWithTokens(ChildType.GABRIEL,tokenCount)
                break;
            case ChildType.JACKSON:
                break;
            default:
                //return error message that no child exists with that name
                break;
        }

    }

    private createChildWithTokens(childName,tokenCount): Child{
        let child = new Child();

        child.name = childName;
        child.numberOfTokens = tokenCount;

        return child;
    }
}
