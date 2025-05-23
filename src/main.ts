import {web} from "./application/web";
import logging from "./application/logging";

const PORT = process.env.PORT;

web.listen(PORT, () => {
    logging.info('Server listening on port', {PORT});
});