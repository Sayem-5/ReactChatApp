// module.exports = func => {
//     return(req, res, next) => {
//         func(req, res, next).catch(next);
//     }
// }

module.exports = func => {
    return async (req, res, next) => {
      try {
        await func(req, res, next);
      } catch (error) {
        // Handle the error here or log it
        console.error(error);
  
        // You can also customize the response based on the error
        // if (error instanceof YourCustomError) {
        //   return res.status(400).json({ error: error.message });
        // } else {
        //   // Handle other types of errors
        //   return res.status(500).json({ error: 'Internal Server Error' });
        // }
      }
    };
  };