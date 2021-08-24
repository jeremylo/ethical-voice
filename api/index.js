import app from "./src/app.js";

const port = 4000;

/**
 * Lets the app start listening for requests.
 */
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
