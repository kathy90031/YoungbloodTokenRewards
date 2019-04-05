import {ChildType} from "../type/ChildType";

export class ChildValidationUtil {

    static isChildValid(childName: string): boolean {
        let isValid = false;
        switch (childName) {
            case ChildType.GABRIEL:
                isValid = true;
                break;
            case ChildType.JACKSON:
                isValid = true;
                break;
            default:
                isValid = false;
                break;
        }
        return isValid;
    }

    
}
