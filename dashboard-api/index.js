import app from "./app.js";

const port = 4001;

/**
 * Lets the app start listening for requests.
 */
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
