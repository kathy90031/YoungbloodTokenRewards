
export class ResponseHandler {

    getInvalidChildResponse() {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                error: 'INVALID CHILD NAME',
                message: 'You have entered an invalid child name. Please try again'
            }),
        };

        return response;
    }

    getValidChildResponse(childName: string, tokenCount: number) {
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                childName: childName,
                tokenCount: tokenCount
            }),
        };

        return response;
    }
}
