import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

export const invokeTokenRewards: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'To Do',
      input: event,
    }),
  };

  cb(null, response);
}
