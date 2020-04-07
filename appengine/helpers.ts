
/**
 * helper function to turn callback based functions into promises
 */
export function async(func: (...args) => void, ...parameters): Promise<any>  {
  return new Promise((resolve, reject) => {
    func(...parameters, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
}
